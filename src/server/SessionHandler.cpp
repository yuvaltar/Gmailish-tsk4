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

    while (true) {                                                                      // Infinite loop to read one charachter at a time
        ssize_t bytesRead = recv(clientSocket, &ch, 1, 0);                              // Read 1 byte at a time from the socket

        if (bytesRead == 1) {                                                           // Normal case: read a single character
            line += ch;                                                                 // Add charchter to the line
            if (ch == '\n') {
                break;                                                                  // No more charachters to add to line
            }
        } else if (bytesRead == 0) {                                                    // Client closed connection on purpose
            return "";
        } else {                                                                        // Error occurred
            perror("recv failed");
            return "";
        }
    }

    return line;
}

void SessionHandler::sendResponse(const std::string& response) {
    size_t totalSent = 0;                                                               // Use to track how many bytes are sent to client
    size_t toSend = response.size();                                                    // The size of the response neede to be sent
    const char* buffer = response.c_str();                                              // Convert the response to const char* to be able to use it is send()

    while (totalSent < toSend) {                                                        // Loop until all bytes are sent (send() may not send all the bytes at one)
        ssize_t sent = send(clientSocket, buffer + totalSent, toSend - totalSent, 0);   // Send the remaining bytes back to the client

        if (sent == -1) {                                                               // Error occured while sending
            perror("send failed");
            break;
        }

        totalSent += sent;                                                              // x number of bytes were sent successfully and totalSent is updated according to x  
    }
}

void SessionHandler::handle() {
    // Receive initial config line
    std::string configLine = receiveLine();
    std::istringstream configStream(configLine);
    int filterSize;
    std::vector<std::shared_ptr<IHashFunction>> hashFunctions;

    if (!(configStream >> filterSize) || filterSize <= 0) {
        sendResponse("400 Bad Request\n");
        return;
    }

    int iterCount;
    while (configStream >> iterCount) {
        if (iterCount <= 0) {
            sendResponse("400 Bad Request\n");
            return;
        }
        hashFunctions.push_back(std::make_shared<StdHashFunction>(iterCount));
    }

    if (hashFunctions.empty()) {
        sendResponse("400 Bad Request\n");
        return;
    }

    BloomFilter bloom(filterSize, hashFunctions);
    BlackList blacklist;
    // Try loading previous state (optional, not per-client persistent ID)
    bloom.loadFromFile("data/bloomfilter.bin");
    blacklist.load("data/blacklist.txt");

    CommandManager commandManager(bloom, blacklist);

    // Now enter command loop
    while (true) {
        std::string command = receiveLine();
        if (command.empty()) break;
// needed to be in the command manager? for modular code
        std::string response = commandManager.execute(command);
        sendResponse(response);
        bloom.saveToFile("data/bloomfilter.bin");
        blacklist.save("data/blacklist.txt");
    }

    close(clientSocket);
}