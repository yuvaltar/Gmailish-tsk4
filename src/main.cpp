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
        return 1;
    }

    if (port <= 1024 || port > 65535) {
        return 1;
    }

    int filterSize;
    try {
        filterSize = std::stoi(argv[2]);
    } catch (...) {
        return 1;
    }
    if (filterSize <= 0) {
        return 1;
    }
    // add check for filter size to be power of 2

    std::vector<std::shared_ptr<IHashFunction>> hashFns;
    for (int i = 3; i < argc; ++i) {
        int iterCount;
        try {
            iterCount = std::stoi(argv[i]);
        } catch (...) {
            return 1;
        }

        if (iterCount <= 0) {
            return 1;
        }
        hashFns.push_back(std::make_shared<StdHashFunction>(iterCount));
    }

    if (hashFns.empty()) {
        return 1;
    }

    BloomFilter bloom(filterSize, hashFns);

    Server server(port, bloom);  
    server.run();

    return 0;
}
