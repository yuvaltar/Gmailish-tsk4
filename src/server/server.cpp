#include "server.h"
#include "SessionHandler.h"
#include <iostream>
#include <sys/socket.h>
#include <netinet/in.h>
#include <unistd.h>
#include <string.h>

Server::Server(int port, BloomFilter& filter)
    : serverSocket(-1), bloomFilter(filter), running(true) {
    initSocket(port);
}


Server::~Server() {
    shutdown();
}

void Server::shutdown() {
    running = false;
    if (serverSocket != -1) {
        close(serverSocket);
        serverSocket = -1;
    }
}

void Server::initSocket(int port) {
    serverSocket = socket(AF_INET, SOCK_STREAM, 0);
    if (serverSocket < 0) {
        perror("socket");
        exit(1);
    }l

    sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = INADDR_ANY;
    sin.sin_port = htons(port);


    if (bind(serverSocket, (struct sockaddr*)&sin, sizeof(sin)) < 0) {
        exit(1);
    }

    if (listen(serverSocket, 5) < 0) {
        perror("error listening on socket"); /// temporery
        exit(1);
    }
}

void Server::run() {

    while (running) {
        sockaddr_in clientAddr;
        socklen_t clientLen = sizeof(clientAddr);


        int clientSocket = accept(serverSocket, (sockaddr*)&clientAddr, &clientLen);
        if (clientSocket < 0) {
            if (!running) break;  // accept failed due to shutdown
            exit(1);
        }

        handleClient(clientSocket);
    }
}

void Server::handleClient(int clientSocket) {
    SessionHandler session(clientSocket, bloomFilter);
    session.handle();
}