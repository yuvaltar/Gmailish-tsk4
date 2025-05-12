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

        // Parse the Bloom filter size
        filterSize = std::stoi(argv[2]);

    } catch (...) {
       
        return 1;
    }


    // Validate that filter size is positive and a power of 2
    if (filterSize <= 0 || !isPowerOfTwo(filterSize)) {
        return 1;
    }


    // Collect hash function iteration counts
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

    // Ensure at least one hash function was provided
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
