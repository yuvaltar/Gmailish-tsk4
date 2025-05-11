#include "server.h"
#include <iostream>
#include <cstdlib>
#include <sstream>
#include <cmath> // For log2 and floor
#include "StdHashFunction.h"
#include "BloomFilter.h"

// Utility function to check if a number is a power of 2
bool isPowerOfTwo(int n) {
    return n > 0 && (n & (n - 1)) == 0;
}

int main(int argc, char* argv[]) {
    // Ensure the user provides enough arguments
    if (argc < 4) {
        std::cerr << "Usage: ./main <port> <filter_size> <hash1> <hash2> ..." << std::endl;
        return 1;
    }

    int port;
    try {
        // Parse the port number
        port = std::stoi(argv[1]);
    } catch (...) {
        std::cerr << "Invalid port number." << std::endl;
        return 1;
    }

    // Validate port range (must be non-privileged and valid)
    if (port <= 1024 || port > 65535) {
        std::cerr << "Port must be between 1025 and 65535." << std::endl;
        return 1;
    }

    int filterSize;
    try {
        // Parse the Bloom filter size
        filterSize = std::stoi(argv[2]);
    } catch (...) {
        std::cerr << "Invalid filter size." << std::endl;
        return 1;
    }

    // Validate that filter size is positive and a power of 2
    if (filterSize <= 0 || !isPowerOfTwo(filterSize)) {
        std::cerr << "Filter size must be a positive power of 2." << std::endl;
        return 1;
    }

    // Collect hash function iteration counts
    std::vector<std::shared_ptr<IHashFunction>> hashFns;
    for (int i = 3; i < argc; ++i) {
        int iterCount;
        try {
            iterCount = std::stoi(argv[i]);
        } catch (...) {
            std::cerr << "Invalid hash function iteration count." << std::endl;
            return 1;
        }

        if (iterCount <= 0) {
            std::cerr << "Hash function iteration count must be positive." << std::endl;
            return 1;
        }

        hashFns.push_back(std::make_shared<StdHashFunction>(iterCount));
    }

    // Ensure at least one hash function was provided
    if (hashFns.empty()) {
        std::cerr << "At least one hash function must be specified." << std::endl;
        return 1;
    }

    // Initialize the Bloom filter with specified size and hash functions
    BloomFilter bloom(filterSize, hashFns);

    // Launch the server with given port and Bloom filter
    Server server(port, bloom);
    server.run();

    return 0;
}
