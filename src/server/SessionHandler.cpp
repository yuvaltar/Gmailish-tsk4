#include "SessionHandler.h"
#include <unistd.h>      
#include <sys/socket.h>  
#include <stdexcept>     
#include <iostream>      
#include <cstring>
#include <sstream>       // For parsing config line
#include <filesystem>    // For persistence directory
#include "StdHashFunction.h" // For StdHashFunction
#include "BloomFilter.h"     // For per-client Bloom
#include "BlackList.h"       // For per-client Blacklist
#include "CommandManager.h"  // For per-client CommandManager

SessionHandler::SessionHandler(int socket)
    : clientSocket(socket) {} 

std::string SessionHandler::receiveLine() {
    std::string line;
    char ch;

    while (true) {
        ssize_t bytesRead = recv(clientSocket, &ch, 1, 0);  // read 1 byte

        if (bytesRead == 1) {
            std::cout << "[DEBUG] Char received: '"
                      << (ch == '\n' ? "\\n" : std::string(1, ch)) << "'\n";

            line += ch;
            if (ch == '\n') break;
        } 
        else if (bytesRead == 0) {
            std::cout << "[DEBUG] Client closed connection.\n";
            return "";
        } 
        else {
            perror("recv failed");
            return "";
        }
    }

    // Remove trailing \r and \n (normalize line endings)
    while (!line.empty() && (line.back() == '\n' || line.back() == '\r')) {
        line.pop_back();
    }

    return line;
}

void SessionHandler::sendResponse(const std::string& response) {
    size_t totalSent = 0;
    size_t toSend = response.size();
    const char* buffer = response.c_str();

    while (totalSent < toSend) {
        ssize_t sent = send(clientSocket, buffer + totalSent, toSend - totalSent, 0);
        if (sent == -1) {
            perror("send failed");
            break;
        }
        totalSent += sent;
    }
}

void SessionHandler::handle() {
    std::cerr << "[DEBUG] Waiting for config line...\n";
    std::string configLine = receiveLine();
    std::cout << "[DEBUG] Received config: " << configLine << std::endl;

    std::istringstream configStream(configLine);
    int filterSize;
    std::vector<std::shared_ptr<IHashFunction>> hashFunctions;

    if (!(configStream >> filterSize) || filterSize <= 0) {
        std::cerr << "[DEBUG] Invalid filter size.\n";
        sendResponse("400 Bad Request\n");
        return;
    }

    int iterCount;
    while (configStream >> iterCount) {
        if (iterCount <= 0) {
            std::cerr << "[DEBUG] Invalid hash iteration count: " << iterCount << "\n";
            sendResponse("400 Bad Request\n");
            return;
        }
        hashFunctions.push_back(std::make_shared<StdHashFunction>(iterCount));
    }

    if (hashFunctions.empty()) {
        std::cerr << "[DEBUG] No hash functions provided.\n";
        sendResponse("400 Bad Request\n");
        return;
    }

    std::cerr << "[DEBUG] BloomFilter and hash functions parsed.\n";
    BloomFilter bloom(filterSize, hashFunctions);
    BlackList blacklist;
    std::filesystem::create_directory("data");
    std::string BloomFile = "data/bloom_" + std::to_string(clientSocket) + ".bin";
    std::string BlackListFile = "data/BlackList" + std::to_string(clientSocket) + ".txt";

    std::cerr << "[DEBUG] Loading from persistence files...\n";
    bloom.loadFromFile(BloomFile);
    blacklist.load(BlackListFile);

    CommandManager commandManager(bloom, blacklist);

    std::cerr << "[DEBUG] Entering command loop.\n";
    while (true) {
        std::cerr << "[DEBUG] Waiting for command...\n";
        std::string command = receiveLine();
        std::cerr << "[DEBUG] receiveLine returned.\n";

        if (command.empty()) {
            std::cerr << "[DEBUG] Client disconnected or sent empty command.\n";
            break;
        }

        std::cout << "[DEBUG] Received command: " << command << std::endl;
        //

        std::string response = commandManager.execute(command);
        std::cout << "[DEBUG] Response: " << response;

        sendResponse(response);

        bloom.saveToFile(BloomFile);
        blacklist.save(BlackListFile);
    }

    close(clientSocket);
}
