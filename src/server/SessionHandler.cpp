#include "SessionHandler.h"
<<<<<<< HEAD
#include <unistd.h>
#include <sys/socket.h>
#include <iostream>
#include <cstring>
#include <sstream>
#include <filesystem>
#include "BlackList.h"
#include "CommandManager.h"

SessionHandler::SessionHandler(int socket, BloomFilter& sharedFilter)
    : clientSocket(socket), bloom(sharedFilter) {}  // Copy the shared BloomFilter config
=======
#include <unistd.h>      
#include <sys/socket.h>  
#include <stdexcept>     
#include <iostream>      
#include <cstring>

SessionHandler::SessionHandler(int socket, CommandManager& manager)
    : clientSocket(socket), commandManager(manager) {}
>>>>>>> acc7475c714ac1572ce779d12c42b155c58c699d

std::string SessionHandler::receiveLine() {
    std::string line;
    char ch;

<<<<<<< HEAD
    while (true) {
        ssize_t bytesRead = recv(clientSocket, &ch, 1, 0);
        if (bytesRead == 1) {
            line += ch;
            if (ch == '\n') break;
        } else if (bytesRead == 0) {
            return "";
        } else {
=======
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
>>>>>>> acc7475c714ac1572ce779d12c42b155c58c699d
            return "";
        }
    }

<<<<<<< HEAD
    while (!line.empty() && (line.back() == '\n' || line.back() == '\r')) {
        line.pop_back();
    }

=======
>>>>>>> acc7475c714ac1572ce779d12c42b155c58c699d
    return line;
}

void SessionHandler::sendResponse(const std::string& response) {
<<<<<<< HEAD
    size_t totalSent = 0;
    size_t toSend = response.size();
    const char* buffer = response.c_str();

    while (totalSent < toSend) {
        ssize_t sent = send(clientSocket, buffer + totalSent, toSend - totalSent, 0);
        if (sent == -1) {
            break;
        }
        totalSent += sent;
=======
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
>>>>>>> acc7475c714ac1572ce779d12c42b155c58c699d
    }
}

void SessionHandler::handle() {
<<<<<<< HEAD
    // Create data directory if not present
    std::filesystem::create_directory("data");

    // Use fixed persistence file names (shared across clients)
    std::string BloomFile = "data/bloom_shared.bin";
    std::string BlackListFile = "data/blacklist_shared.txt";

    // Load previous filter state
    
    BlackList blacklist;
    bloom.loadFromFile(BloomFile);
    blacklist.load(BlackListFile);

    CommandManager commandManager(bloom, blacklist);

    while (true) {
        std::string command = receiveLine();

        if (command.empty()) {
            break;
        }

        std::string response = commandManager.execute(command);

        sendResponse(response);
        // Save updated state after every command
        bloom.saveToFile(BloomFile);
        blacklist.save(BlackListFile);
    }

    close(clientSocket);
}
=======
    while (true) {                                                                      // Run an infinite loop to be able ot handle multiple commands from one client
        std::string command = receiveLine();                                            // call ReceiveLine function - waits for a "full line" to be written by the client 

        if (command.empty()) {                                                          // Client disconnected or read error
            break;
        }

        std::string response = commandManager.execute(command);                         // Passes "raw" string of command to the CommandManager
        sendResponse(response);                                                         // Sends the response provided by the CommandManager back to the client
    }
    close(clientSocket);                                                                // Closes the client socket
}
>>>>>>> acc7475c714ac1572ce779d12c42b155c58c699d
