#include "server.h"
#include <iostream>
#include <vector>
#include <memory>
#include <cmath>
#include "StdHashFunction.h"
#include "BloomFilter.h"

// Utility function to check if a number is a power of 2
bool isPowerOfTwo(int n) {
    return n > 0 && (n & (n - 1)) == 0;
}

int main() {
    // Docker-safe defaults
    const int port = 4000;
    const int filterSize = 1024;
    const std::vector<int> defaultHashIterations = {3, 5};  // You can change this

    // Validate filter size
    if (filterSize <= 0 || !isPowerOfTwo(filterSize)) {
        std::cerr << "Invalid Bloom filter size (must be power of 2).\n";
        return 1;
    }

    // Create hash function vector
    std::vector<std::shared_ptr<IHashFunction>> hashFns;
    for (int iter : defaultHashIterations) {
        if (iter > 0)
            hashFns.push_back(std::make_shared<StdHashFunction>(iter));
    }

    if (hashFns.empty()) {
        std::cerr << "No valid hash functions configured.\n";
        return 1;
    }

    // Build Bloom filter and server
    BloomFilter bloom(filterSize, hashFns);
    std::cout << "Starting server on port " << port << std::endl;
    Server server(port, bloom);
    server.run();

    return 0;
}
