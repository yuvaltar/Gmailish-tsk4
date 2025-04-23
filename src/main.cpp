// main.cpp
#include <iostream>                     // For std::cin, std::cout
#include <sstream>                      // For std::istringstream
#include <string>                       // For std::string
#include <vector>                       // For std::vector
#include <memory>                       // For std::shared_ptr
#include <filesystem>                   // For std::filesystem::create_directory
#include <regex>                        // For regex validation
#include "BloomFilter.h"                // BloomFilter class declaration
#include "url.h"                        // URL class declaration
#include "IHashFunctions.h"            // Interface for hash functions
#include "StdHashFunction.h"           // Standard hash function class
#include "DoubleHashFunction.h"        // Double hash function class
#include "BlackList.h"                 // Blacklist class declaration

int main() {
    std::string configLine;                                     // Line to read configuration input
    if (!std::getline(std::cin, configLine)) {                  // Read a line from input; exit if fail
        return 1;
    }
    std::istringstream configStream(configLine);                // Stream to parse input line
    int filterSize;                                             // Bloom filter size
    configStream >> filterSize;                                 // Read the size from input

    std::vector<std::shared_ptr<IHashFunction>> hashFunctions;  // Store selected hash functions
    int stdCount = 0, doubleCount = 0;                          // Number of std and double hash functions
    configStream >> stdCount >> doubleCount;                    // Read those numbers from input

    for (int i = 0; i < stdCount; ++i) {                         // Add std hash functions
        hashFunctions.push_back(std::make_shared<StdHashFunction>());
    }
    for (int i = 0; i < doubleCount; ++i) {                      // Add double hash functions
        hashFunctions.push_back(std::make_shared<DoubleHashFunction>());
    }

    if (hashFunctions.empty()) {                                // Ensure at least one hash function
        hashFunctions.push_back(std::make_shared<StdHashFunction>());
    }

    std::filesystem::create_directory("data");                 // Create directory for saved data if not exists

    BloomFilter bloom(filterSize, hashFunctions);               // Initialize Bloom filter with given size and hash functions
    BlackList realList;                                         // Initialize actual blacklist

    bloom.loadFromFile("data/bloomfilter.bin");                // Load Bloom filter bit array from file
    realList.load("data/blacklist.txt");                       // Load blacklist entries from file

    std::string line;                                           // Buffer to read input commands
    while (std::getline(std::cin, line)) {                      // Loop over each input line
        if (line.empty()) continue;                             // Skip empty lines

        std::istringstream iss(line);                           // Parse command line
        int command;                                            // Command type (1 = add, 2 = check)
        std::string url;                                        // URL to operate on
        iss >> command >> url;                                  // Extract command and URL from input
        if (url.empty()) continue;                              // Skip if URL is missing

        // Validate URL using regex
        // file:///C:/path/to/file //http://example.com //192.168.1.1:8080/path
        static const std::regex urlRegex(R"(^(?:(?:file:///(?:[A-Za-z]:)?(?:/[^\s])?)|(?:(?:[A-Za-z][A-Za-z0-9+.\-])://)?(?:localhost|(?:[A-Za-z0-9\-]+\.)+[A-Za-z0-9\-]+|(?:\d{1,3}\.){3}\d{1,3})(?::\d+)?(?:/[^\s]*)?)$)");
        if (!std::regex_match(url, urlRegex)) {
            continue;
        }

        URL u(url);                                             // Wrap the URL in a URL object
        if (command == 1) {                                     // Command 1: Add URL
            bloom.add(u);                                       // Add to Bloom filter
            realList.addUrl(u);                                 // Add to actual blacklist
            bloom.saveToFile("data/bloomfilter.bin");           // Save updated Bloom filter
            realList.save("data/blacklist.txt");                // Save updated blacklist
        } else if (command == 2) {                              // Command 2: Check URL
            bool result = bloom.possiblyContains(u);            // Check Bloom filter for possible presence
            std::cout << (result ? "true" : "false") << " ";    // Print result from Bloom filter
            if (result) {                                       // If possibly present in Bloom filter
                std::cout << (realList.contains(u) ? "true" : "false"); // Check actual blacklist
            }
            std::cout << std::endl;                             // End line of output
        }
    }

    return 0;                                                   // Exit program normally
}
