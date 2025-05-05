#include "server.h"
#include <iostream>
#include <cstdlib>
#include <sstream>
#include "StdHashFunction.h"
#include "BloomFilter.h"

int main(int argc, char* argv[]) {
    if (argc < 4) {
        std::cerr << "Usage: ./main <port> <filter_size> <hash1> <hash2> ..." << std::endl;
        return 1;
    }

    int port;
    try {
        port = std::stoi(argv[1]);
    } catch (...) {
        std::cerr << "Invalid port." << std::endl;
        return 1;
    }

    if (port <= 1024 || port > 65535) {
        std::cerr << "Invalid port. Use a port between 1025 and 65535." << std::endl;
        return 1;
    }

    int filterSize;
    try {
        filterSize = std::stoi(argv[2]);
    } catch (...) {
        std::cerr << "Invalid filter size." << std::endl;
        return 1;
    }

    if (filterSize <= 0) {
        std::cerr << "Filter size must be positive." << std::endl;
        return 1;
    }

    std::vector<std::shared_ptr<IHashFunction>> hashFns;
    for (int i = 3; i < argc; ++i) {
        int iterCount;
        try {
            iterCount = std::stoi(argv[i]);
        } catch (...) {
            std::cerr << "Invalid hash function iteration count: " << argv[i] << std::endl;
            return 1;
        }

        if (iterCount <= 0) {
            std::cerr << "Iteration count must be positive." << std::endl;
            return 1;
        }

        hashFns.push_back(std::make_shared<StdHashFunction>(iterCount));
    }

    if (hashFns.empty()) {
        std::cerr << "At least one hash function must be provided." << std::endl;
        return 1;
    }

    BloomFilter bloom(filterSize, hashFns);

    Server server(port, bloom);  // New constructor you mentioned
    server.run();

    return 0;
}
