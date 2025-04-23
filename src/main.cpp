#include <iostream>                      // std::cin, std::cout
#include <sstream>                       // std::istringstream for parsing lines
#include <string>                        // std::string
#include <vector>                        // std::vector
#include <memory>                        // std::shared_ptr
#include <filesystem>                    // std::filesystem::create_directory
#include "BloomFilter.h"                 // BloomFilter class
#include "url.h"                         // URL wrapper
#include "IHashFunctions.h"              // Hash function interface
#include "StdHashFunction.h"             // Standard hash function
#include "DoubleHashFunction.h"          // Double hash function
#include "BlackList.h"                   // Blacklist storage
#include <iostream>
#include <sstream>
#include <string>
#include <vector>
#include <memory>
#include "BloomFilter.h"
#include "url.h"
#include "IHashFunctions.h"
#include "StdHashFunction.h"
#include "DoubleHashFunction.h"

int main() {
    // === Step 1: Read configuration line ===
    std::string line;
    std::getline(std::cin, line);
    std::istringstream iss(line);

    std::string arg1, arg2, arg3;
    iss >> arg1 >> arg2 >> arg3;

    if (arg1.empty() || arg2.empty()) {
        std::cerr << "Invalid input. Expected at least 2 arguments.\n";
        return 1;
    }

    int bloomFilterSize = std::stoi(arg1);
    int kindOfHash1 = std::stoi(arg2);
    int kindOfHash2 = arg3.empty() ? -1 : std::stoi(arg3);

    // === Step 2: Create vector of hash functions ===
    std::vector<std::shared_ptr<IHashFunction>> hashFunctions;

    if (kindOfHash1 == 1) {
        hashFunctions.push_back(std::make_shared<StdHashFunction>());
    } else if (kindOfHash1 == 2) {
        hashFunctions.push_back(std::make_shared<DoubleHashFunction>());
    } else {
        std::cerr << "Unknown hash type: " << kindOfHash1 << "\n";
        return 1;
    }

    if (kindOfHash2 != -1) {
        if (kindOfHash2 == 1) {
            hashFunctions.push_back(std::make_shared<StdHashFunction>());
        } else if (kindOfHash2 == 2) {
            hashFunctions.push_back(std::make_shared<DoubleHashFunction>());
        } else {
            std::cerr << "Unknown second hash type: " << kindOfHash2 << "\n";
            return 1;
        }
    }

    // === Step 3: Create Bloom Filter ===
    BloomFilter bloomFilter(bloomFilterSize, hashFunctions);

    // === Step 4: Infinite command loop ===
    std::string commandLine;
    while (true) {
        std::getline(std::cin, commandLine);
        if (commandLine.empty()) continue;

        std::istringstream cmdStream(commandLine);
        int command;
        std::string urlStr;

        cmdStream >> command >> urlStr;

        if (urlStr.empty()) {
            std::cerr << "Invalid command: URL is missing.\n";
            continue;
        }

        URL url(urlStr);

        if (command == 1) {
            // Add to Bloom filter
            bloomFilter.add(url);
            std::cout << "URL added: " << urlStr << "\n";
        } else if (command == 2) {
            bool bitArrayResult = bloomFilter.bitArrayResult(url);
            bool blackListResult = bloomFilter.blackList.contains(url);
            
            std::cout << (bitArrayResult ? "true" : "false") << "\n";
            
            if (blackListResult) {
                std::cout << "true" << "\n";
            }

        } else {
            std::cerr << "Unknown command. Use 1 <url> to add or 2 <url> to check.\n";
        }
    }

    return 0;
}
