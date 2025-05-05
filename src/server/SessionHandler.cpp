#include "SessionHandler.h"
#include <unistd.h>
#include <sys/socket.h>
#include <iostream>
#include <cstring>
#include <sstream>
#include <filesystem>
#include "BlackList.h"
#include "CommandManager.h"

SessionHandler::SessionHandler(int socket, const BloomFilter& sharedFilter)
    : clientSocket(socket), bloom(sharedFilter) {}  // Copy the shared BloomFilter config

std::string SessionHandler::receiveLine() {
    std::string line;
    char ch;

    while (true) {
        ssize_t bytesRead = recv(clientSocket, &ch, 1, 0);
        if (bytesRead == 1) {
            line += ch;
            if (ch == '\n') break;
        } else if (bytesRead == 0) {
            std::cout << "[DEBUG] Client closed connection.\n";
            return "";
        } else {
            perror("recv failed");
            return "";
        }
    }

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
    // Create data directory if not present
    std::filesystem::create_directory("data");

    // Use fixed persistence file names (shared across clients)
    std::string BloomFile = "data/bloom_shared.bin";
    std::string BlackListFile = "data/blacklist_shared.txt";

    // Load previous filter state
    std::cerr << "[DEBUG] Loading from persistence files...\n";
    BlackList blacklist;
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

        // Save updated state after every command
        bloom.saveToFile(BloomFile);
        blacklist.save(BlackListFile);
    }

    close(clientSocket);
}
