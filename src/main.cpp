#include <iostream>
#include <sstream>
#include <string>
#include <vector>
#include <memory>
#include <filesystem>
#include <regex>
#include "BloomFilter.h"
#include "url.h"
#include "IHashFunctions.h"
#include "StdHashFunction.h"
#include "DoubleHashFunction.h"
#include "BlackList.h"

int main() {
    std::string configLine;
    if (!std::getline(std::cin, configLine)) return 1;  

    std::istringstream configStream(configLine);
    int filterSize;
    configStream >> filterSize;

    std::vector<std::shared_ptr<IHashFunction>> hashFunctions;
    int iterCount;
    while (configStream >> iterCount) {
        hashFunctions.push_back(std::make_shared<StdHashFunction>(iterCount));
    }

    if (hashFunctions.empty()) {
        hashFunctions.push_back(std::make_shared<StdHashFunction>(1));
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

        static const std::regex urlRegex(R"(^(?:(?:file:///(?:[A-Za-z]:)?(?:/[^\s])?)|(?:(?:[A-Za-z][A-Za-z0-9+\.\-]*)://)?(?:localhost|(?:[A-Za-z0-9\-]+\.)+[A-Za-z0-9\-]+|(?:\d{1,3}\.){3}\d{1,3})(?::\d+)?(?:/[^\s]*)?)$)");
        if (!std::regex_match(url, urlRegex)) {
            continue;
        }

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
