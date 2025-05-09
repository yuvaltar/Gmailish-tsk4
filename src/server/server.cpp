#include <iostream>
#include <sys/socket.h>  // For socket functions
#include <stdio.h>       // For perror
#include <netinet/in.h>  // For sockaddr_in
#include <arpa/inet.h>   // For htons and inet_addr
#include <unistd.h>      // For close()
#include <string.h>      // For memset
#include "server.h"
#include "SessionHandler.h"


Server::Server(int port, BloomFilter& filter)
    : bloomFilter(filter)
{
    serverSocket = -1;
    initSocket(port);
}

// create socket
void Server::initSocket(int port) {
    serverSocket = socket(AF_INET, SOCK_STREAM, 0);
    if (serverSocket < 0) {
        exit(1);
    }
   
    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = INADDR_ANY;
    sin.sin_port = htons(port);

    if (bind(serverSocket, (struct sockaddr*)&sin, sizeof(sin)) < 0) {
        exit(1);
    }

    if (listen(serverSocket, 1) < 0) {
        exit(1);
    }
}

void Server::run() {
    while (true) {
        sockaddr_in clientAddr;
        socklen_t clientLen = sizeof(clientAddr);

        int clientSocket = accept(serverSocket, (sockaddr*)&clientAddr, &clientLen);
        if (clientSocket < 0) {
            exit(1);  
        }

        handleClient(clientSocket);
        
    }
}
void Server::handleClient(int clientSocket) {
    SessionHandler session(clientSocket, bloomFilter);
    session.handle();  // Handles read/process/respond
}

