#pragma once

<<<<<<< HEAD
#include <string>
#include "BloomFilter.h"
#include "IHashFunctions.h"
#include "StdHashFunction.h"
#include "CommandManager.h"

// Handles interaction with a single client
class SessionHandler {
public:
    SessionHandler(int socket, BloomFilter& sharedFilter);  // Now accepts BloomFilter

    void handle();

private:
    int clientSocket;                      // Client socket
    BloomFilter bloom;                    // Copy of server's BloomFilter (per session)

    std::string receiveLine();            // Read command from client
    void sendResponse(const std::string& response);  // Send response
    void closeConnection();               // Optional cleanup helper
=======
#include <cstring>
#include "CommandManager.h"

// SessionHandler is responsible for interacting with a single client.
// It reads full commands from the socket, calls CommandManager, and sends back results.
class SessionHandler {
public:
    // Constructor: requires the connected client socket and reference to the CommandManager.
    SessionHandler(int socket, CommandManager& manager);

    // Runs the full client session: read-process-respond loop.
    void handle();

private:
    int clientSocket;                    // Socket descriptor for this client
    CommandManager& commandManager;      // Shared logic dispatcher

    // Receives a line (command) from the client, blocking until newline is encountered.
    std::string receiveLine();

    // Sends a full response (ending with newline) back to the client.
    void sendResponse(const std::string& response);
>>>>>>> acc7475c714ac1572ce779d12c42b155c58c699d
};
