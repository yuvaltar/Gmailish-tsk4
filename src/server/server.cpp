#include "server.h"
#include "SessionHandler.h"
#include <iostream>
#include <sys/socket.h>
#include <netinet/in.h>
#include <unistd.h>
#include <string.h>

// Constructor: initializes the server socket and starts listening on the given port
Server::Server(int port, BloomFilter& filter)
    : serverSocket(-1), bloomFilter(filter), running(true) {
    initSocket(port);
}

// Destructor: ensures server is properly shut down
Server::~Server() {
    shutdown();
}

// Gracefully shuts down the server socket
void Server::shutdown() {
    running = false;
    if (serverSocket != -1) {
        close(serverSocket);
        serverSocket = -1;
    }
}

// Initializes the server socket and prepares it to accept connections
void Server::initSocket(int port) {
    // Create a TCP socket
    serverSocket = socket(AF_INET, SOCK_STREAM, 0);
    if (serverSocket < 0) {
        perror("socket");
        exit(1);
    }

    // Set up address structure for binding
    sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = INADDR_ANY;
    sin.sin_port = htons(port);

    // Bind the socket to the given port
    if (bind(serverSocket, (struct sockaddr*)&sin, sizeof(sin)) < 0) {
        exit(1);
    }

    // Start listening for incoming connections
    if (listen(serverSocket, 5) < 0) {
        perror("error listening on socket"); /// temporery
        exit(1);
    }
}

// Main server loop: accepts and handles clients while running is true
void Server::run() {
    while (running) {
        sockaddr_in clientAddr;
        socklen_t clientLen = sizeof(clientAddr);

        // Accept a new client connection
        int clientSocket = accept(serverSocket, (sockaddr*)&clientAddr, &clientLen);
        if (clientSocket < 0) {
            if (!running) break;  // Exit gracefully if server is shutting down
            exit(1);
        }

        // Handle communication with the connected client
        handleClient(clientSocket);
    }
}

// Handles an individual client session using the SessionHandler class
void Server::handleClient(int clientSocket) {
    SessionHandler session(clientSocket, bloomFilter);
    session.handle();
}
