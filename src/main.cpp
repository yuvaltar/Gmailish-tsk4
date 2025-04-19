//main.cpp file
#include <iostream>
#include <sstream>
#include <string>
#include <vector>
#include <memory>
#include "BloomFilter.h" // Assumes BloomFilter and URL classes are declared here
#include "url.h"
#include "IHashFunctions.h"
#include "StdHashFunction.h"
#include "DoubleHashFunction.h"


// --- Sample Hash Function Implementations ---



int main() {
    std::string configLine; // define line 
    // read a line from keyboard
    if (!std::getline(std::cin, configLine)) {
        return 1; // Exit if no line provided //// 8 1 2
    }
    
    std::istringstream configStream(configLine); // Create a stream from the string configLine so we can read from it like it's input.

    int filterSize; 

    configStream >> filterSize; // putting the first argument into filter size 
    
    // The following integers indicate which hash functions to use:
    // 1 for StdHashFunction, 2 for DoubleHashFunction, etc.
    std::vector<std::shared_ptr<IHashFunction>> hashFunctions; //pointer array to hash func objects
    
    int hashType; 
    // while there is still numbers from user aka (1,2...) like hash funcs // puts the hash func into the vector
    while (configStream >> hashType) {
        if (hashType == 1) {
            hashFunctions.push_back(std::make_shared<StdHashFunction>());       // for 1 push std into hash vector
        } else if (hashType == 2) {
            hashFunctions.push_back(std::make_shared<DoubleHashFunction>());    // for 2 push Dstd into hash vector
        } else {
            // For any unsupported type, default to StdHashFunction.
            hashFunctions.push_back(std::make_shared<StdHashFunction>());       // for unknown number use std
        }
    }
    
    // If no hash function is specified, default to one StdHashFunction.
    if (hashFunctions.empty()) {
        hashFunctions.push_back(std::make_shared<StdHashFunction>());
    }
    
    // Create the Bloom Filter using the specified bit array size and hash functions.
    BloomFilter bloom(filterSize, hashFunctions);
    
    // Process commands in an infinite loop // 1- add or 2-check
    std::string line;
    while (std::getline(std::cin, line)) {
        if (line.empty()) {
            continue; // Skip empty lines.
        }
        
        std::istringstream iss(line);
        int command;
        iss >> command;
        
        std::string url;
        iss >> url; // Expect the URL to be the second token.
        if (url.empty()) {
            continue; // If the URL is missing, ignore this line.
        }
        
        if (command == 1) {
            // Command "1 [URL]" means add the URL to the Bloom filter.
            URL newURL(url); 
            bloom.add(newURL); // call the add func of bm filter 
        } else if (command == 2) {
            // Command "2 [URL]" means check if the URL is blacklisted.
            // Since we don't have the blacklist manager yet, we simply output the Bloom filter's result.
            URL queryURL(url);
            bool result = bloom.possiblyContains(queryURL); // call the possiblycontains func of bm filter
            std::cout << (result ? "true" : "false") << std::endl;
        } 
        // If the command does not match the expected format, the line is ignored.
    }
    
    return 0;
}
// Uses the built-in std::hash.
// class StdHashFunction : public IHashFunction {
// public:
//     size_t hash(const std::string &s) const override {
//         return std::hash<std::string>{}(s);
//     }
// };

// // A simple "double hash" function demonstration.
// // It applies std::hash once to the input and then rehashes the result.
// class DoubleHashFunction : public IHashFunction {
// public:
//     size_t hash(const std::string &s) const override {
//         size_t h1 = std::hash<std::string>{}(s);
//         size_t h2 = std::hash<std::string>{}(std::to_string(h1));
//         // Combine the two values; here we XOR and shift as an example.
//         return h1 ^ (h2 << 1);
//     }
// };