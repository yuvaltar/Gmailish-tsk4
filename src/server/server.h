#pragma once

#include "BloomFilter.h"
#include "BlackList.h"
#include "CommandManager.h"

// The Server class owns the listening socket and shared state (BloomFilter & BlackList).
// It handles initialization, accepting clients, and delegating each connection to a handler.
class Server {
public:
    // Constructor: initializes server with port, bloom filter size, and hash functions.
    Server(int port, size_t bloomSize, const std::vector<std::shared_ptr<IHashFunction>>& hashFns);

    // Starts the server: binds the socket and begins accepting client connections.
    void run();

private:
    int serverSocket;                 // Listening socket
    BloomFilter bloom;               // Shared Bloom filter
    BlackList blacklist;             // Shared blacklist (exact match)
    CommandManager commandManager;   // Logic dispatcher for all commands

    // Initializes the server socket: bind, listen, etc.
    void initSocket(int port);

    // Handles communication with a single connected client
    void handleClient(int clientSocket);

    // Wraps commandManager: receives a command line and returns the server response
    std::string handleMessage(const std::string& message);
};
