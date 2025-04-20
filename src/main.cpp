// main.cpp
#include <iostream>
#include <sstream>
#include <string>
#include <vector>
#include <memory>
#include <filesystem>
#include "BloomFilter.h"
#include "url.h"
#include "IHashFunctions.h"
#include "StdHashFunction.h"
#include "DoubleHashFunction.h"
#include "BlackList.h"

int main() {
    std::string configLine;
    //std::cout << "Waiting for input..." << std::endl;
    if (!std::getline(std::cin, configLine)) {
        return 1;
    }
    //std::cout << "Config line: " << configLine << std::endl;
    std::istringstream configStream(configLine);
    int filterSize;
    configStream >> filterSize;

    std::vector<std::shared_ptr<IHashFunction>> hashFunctions;
    int hashType;
    while (configStream >> hashType) {
        if (hashType == 1) {
            hashFunctions.push_back(std::make_shared<StdHashFunction>());
        } else if (hashType == 2) {
            hashFunctions.push_back(std::make_shared<DoubleHashFunction>());
        } else {
            hashFunctions.push_back(std::make_shared<StdHashFunction>());
        }
    }
    if (hashFunctions.empty()) {
        hashFunctions.push_back(std::make_shared<StdHashFunction>());
    }

    std::filesystem::create_directory("data");

    BloomFilter bloom(filterSize, hashFunctions);
    BlackList realList;

    bloom.loadFromFile("data/bloomfilter.bin");
    realList.load("data/blacklist.txt");

    std::string line;
    while (std::getline(std::cin, line)) {
        if (line.empty()) continue;

        std::istringstream iss(line);
        int command;
        std::string url;
        iss >> command >> url;
        if (url.empty()) continue;

        URL u(url);
        if (command == 1) {
            bloom.add(u);
            realList.addUrl(u);
            bloom.saveToFile("data/bloomfilter.bin");
            realList.save("data/blacklist.txt");
        } else if (command == 2) {
            bool result = bloom.possiblyContains(u);
            std::cout << (result ? "true" : "false") << " ";
            if (result) {
                std::cout << (realList.contains(u) ? "true" : "false");
            }
            std::cout << std::endl;
        }
    }

    return 0;
}