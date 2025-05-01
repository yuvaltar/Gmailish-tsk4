#include "SessionHandler.h"
#include <unistd.h>      
#include <sys/socket.h>  
#include <stdexcept>     
#include <iostream>      
#include <cstring>

SessionHandler::SessionHandler(int socket, CommandManager& manager)
    : clientSocket(socket), commandManager(manager) {}
// a function to handle the client's output strings
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