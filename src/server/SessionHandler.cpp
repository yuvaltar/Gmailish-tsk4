#include "SessionHandler.h"
#include <unistd.h>
#include <sys/socket.h>
#include <iostream>
#include <cstring>
#include <sstream>
#include <filesystem>
#include "BlackList.h"
#include "CommandManager.h"

// Constructor: stores the client socket and a reference to the shared Bloom filter
SessionHandler::SessionHandler(int socket, BloomFilter& sharedFilter)
    : clientSocket(socket), bloom(sharedFilter) {}  // Copy the shared BloomFilter config

// Reads a single line (terminated by '\n') from the client socket
std::string SessionHandler::receiveLine() {
    std::string line;
    char ch;

    while (true) {
        // Receive one byte at a time
        ssize_t bytesRead = recv(clientSocket, &ch, 1, 0);
        if (bytesRead == 1) {
            line += ch;
            if (ch == '\n') break;  // End of line
        } else if (bytesRead == 0) {
            return "";  // Connection closed by client
        } else {
            return "";  // Error occurred
        }
    }

    // Remove trailing newline or carriage return characters
    while (!line.empty() && (line.back() == '\n' || line.back() == '\r')) {
        line.pop_back();
    }

    return line;
}

// Sends the full response string to the client
void SessionHandler::sendResponse(const std::string& response) {
    size_t totalSent = 0;
    size_t toSend = response.size();
    const char* buffer = response.c_str();

    while (totalSent < toSend) {
        // Send remaining portion of the response
        ssize_t sent = send(clientSocket, buffer + totalSent, toSend - totalSent, 0);
        if (sent == -1) {
            break;  // Send failed
        }
        totalSent += sent;
    }
}

// Handles a full client session from connection to disconnection
void SessionHandler::handle() {
    // Create data directory if not already present
    std::filesystem::create_directory("data");

    // Define persistent filenames for shared Bloom filter and blacklist
    std::string BloomFile = "data/bloom_shared.bin";
    std::string BlackListFile = "data/blacklist_shared.txt";

    // Load previously saved Bloom filter and blacklist
    BlackList blacklist;
    bloom.loadFromFile(BloomFile);
    blacklist.load(BlackListFile);

    // Instantiate command manager with references to bloom and blacklist
    CommandManager commandManager(bloom, blacklist);

    // Main interaction loop: receive, execute, and respond to commands
    while (true) {
        std::string command = receiveLine();

        if (command.empty()) {
            break;  // Exit on empty input (client closed connection)
        }

        std::string response = commandManager.execute(command);

        std::cout << response << std::endl;
        sendResponse(response);


        // Persist updated state after handling each command
        bloom.saveToFile(BloomFile);
        blacklist.save(BlackListFile);
    }

    // Close the socket after session ends
    close(clientSocket);
}
