#include <iostream>                         // For standard input/output streams
#include <sstream>                          // For stringstream (parsing input line)
#include <string>                           // For std::string usage
#include <vector>                           // For std::vector container
#include <memory>                           // For smart pointers (shared_ptr)
#include <filesystem>                       // For file/directory operations
#include <regex>                            // For regular expression (URL validation)
#include "BloomFilter.h"                    // BloomFilter class declaration
#include "url.h"                            // URL wrapper class
#include "IHashFunctions.h"                 // Abstract hash function interface
#include "StdHashFunction.h"                // Standard hash function implementation
#include "BlackList.h"                      // BlackList class for exact matching

int main() {
    std::string configLine;                 // Line to hold initial configuration input
    if (!std::getline(std::cin, configLine)) return 1;  // Exit if no input was given

    std::istringstream configStream(configLine);        // Stream to parse config line
    int filterSize;                                     // Bloom filter bit array size
    configStream >> filterSize;                         // Read filter size from input

    std::vector<std::shared_ptr<IHashFunction>> hashFunctions; // Vector of hash functions
    int iterCount;                                      // Iteration count per hash function
    while (configStream >> iterCount) {                 // Read remaining ints (hash configs)
        hashFunctions.push_back(std::make_shared<StdHashFunction>(iterCount)); // Create and store hash function
    }

    if (hashFunctions.empty()) {                        // Fallback if no hash function specified
        hashFunctions.push_back(std::make_shared<StdHashFunction>(1)); // Use 1 iteration as default
    }

    std::filesystem::create_directory("data");          // Ensure data directory exists

    BloomFilter bloom(filterSize, hashFunctions);       // Construct Bloom filter with config
    BlackList realList;                                 // Exact matching blacklist

    bloom.loadFromFile("data/bloomfilter.bin");         // Load Bloom filter from file (if exists)
    realList.load("data/blacklist.txt");                // Load exact list from file

    std::string line;                                   // Input line holder
    while (std::getline(std::cin, line)) {              // Read user input line by line
        if (line.empty()) continue;                     // Ignore empty lines

        std::istringstream iss(line);                   // Parse command line
        int command;                                    // Command type: 1 = add, 2 = check
        std::string url;                                // URL string
        iss >> command >> url;                          // Extract command and URL
        if (url.empty()) continue;                      // Skip if URL missing

        static const std::regex urlRegex(               // Compile URL regex once (static)
            R"(^(?:(?:file:///(?:[A-Za-z]:)?(?:/[^\s])?)|(?:(?:[A-Za-z][A-Za-z0-9+\.\-]*)://)?(?:localhost|(?:[A-Za-z0-9\-]+\.)+[A-Za-z0-9\-]+|(?:\d{1,3}\.){3}\d{1,3})(?::\d+)?(?:/[^\s]*)?)$)"
        );
        if (!std::regex_match(url, urlRegex)) {         // Validate input format
            continue;                                   // Skip if not a valid URL
        }

        URL u(url);                                     // Wrap URL in URL class
        if (command == 1) {                             // Add command
            bloom.add(u);                               // Add to Bloom filter
            realList.addUrl(u);                         // Add to real blacklist
            bloom.saveToFile("data/bloomfilter.bin");   // Save Bloom filter
            realList.save("data/blacklist.txt");        // Save exact blacklist
        } else if (command == 2) {                      // Check command
            bool result = bloom.possiblyContains(u);    // Check Bloom filter
            std::cout << (result ? "true" : "false") << " "; // Print Bloom result
            if (result) {                               // If Bloom filter may contain it
                std::cout << (realList.contains(u) ? "true" : "false"); // Check exact list
            }
            std::cout << std::endl;                     // Newline after result
        }
    }

    return 0;                                           // Successful termination
}
