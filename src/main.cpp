#include "server.h"
#include <iostream>
#include <cstdlib>
#include <sstream>
#include "StdHashFunction.h"
#include "BloomFilter.h"

int main(int argc, char* argv[]) {
    // Check if enough arguments are provided
    if (argc < 4) {
        std::cerr << "Usage: ./main <port> <filter_size> <hash1> <hash2> ..." << std::endl;
        return 1;
    }

    int port;
    try {
        port = std::stoi(argv[1]); // Convert port string to integer
    } catch (...) {
        return 1; // Exit on conversion failure
    }

    // Check if port is in valid range (non-privileged port)
    if (port <= 1024 || port > 65535) {
        return 1;
    }

    int filterSize;
    try {
        filterSize = std::stoi(argv[2]); // Convert filter size string to integer
    } catch (...) {
        return 1;
    }

    if (filterSize <= 0) {
        return 1; // Filter size must be positive
    }

    // Placeholder comment: could add a check to ensure filterSize is power of 2

    std::vector<std::shared_ptr<IHashFunction>> hashFns;

    // Parse hash function parameters from arguments
    for (int i = 3; i < argc; ++i) {
        int iterCount;
        try {
            iterCount = std::stoi(argv[i]); // Convert iteration count
        } catch (...) {
            return 1;
        }

        if (iterCount <= 0) {
            return 1; // Iteration count must be positive
        }

        // Create a hash function instance with the given iteration count
        hashFns.push_back(std::make_shared<StdHashFunction>(iterCount));
    }

    if (hashFns.empty()) {
        return 1; // At least one hash function is required
    }

    // Create BloomFilter instance with configured size and hash functions
    BloomFilter bloom(filterSize, hashFns);

    // Launch the server with the specified port and bloom filter
    Server server(port, bloom);  
    server.run();

    return 0;
}
