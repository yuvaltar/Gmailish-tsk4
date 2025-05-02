#include <iostream>
#include <sys/socket.h>  // For socket functions
#include <stdio.h>       // For perror
#include <netinet/in.h>  // For sockaddr_in
#include <arpa/inet.h>   // For htons and inet_addr
#include <unistd.h>      // For close()
#include <string.h>      // For memset
#include "server.h"
#include "SessionHandler.h"

Server::Server(int port)
{
    serverSocket = -1;
    initSocket(port);
}

// create socket
void Server::initSocket(int port) {
    serverSocket = socket(AF_INET, SOCK_STREAM, 0);
    if (serverSocket < 0) {
        perror("error creating socket");
        exit(1);
    }
    // c
    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = INADDR_ANY;
    sin.sin_port = htons(port);

    if (bind(serverSocket, (struct sockaddr*)&sin, sizeof(sin)) < 0) {
        perror("error binding socket");
        exit(1);
    }

    if (listen(serverSocket, 5) < 0) {
        perror("error listening on socket"); /// temporery
        exit(1);
    }

    std::cout << "Server listening on port " << port << std::endl;
}

void Server::run() {
    while (true) {
        sockaddr_in clientAddr;
        socklen_t clientLen = sizeof(clientAddr);

        int clientSocket = accept(serverSocket, (sockaddr*)&clientAddr, &clientLen);
        if (clientSocket < 0) {
            perror("error accepting client");
            continue;  // or exit(1) depending on your strategy
        }

        handleClient(clientSocket);
        
    }
}
void Server::handleClient(int clientSocket) {
    SessionHandler session(clientSocket);
    session.handle();  // Handles read/process/respond
}
