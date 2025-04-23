// BlackList.cpp
#include "BlackList.h"
#include <fstream>
#include <algorithm>

void BlackList::addUrl(const URL& url) {
    blacklist.push_back(url);
}

bool BlackList::contains(const URL& url) const {
    return std::find(blacklist.begin(), blacklist.end(), url) != blacklist.end();
}

void BlackList::save(const std::string& path) const {
    std::ofstream out(path);
    for (const auto& url : blacklist) {
        out << url.getURL() << "\n";
    }
}

void BlackList::load(const std::string& path) {
    std::ifstream in(path);
    std::string line;
    while (std::getline(in, line)) {
        if (!line.empty()) {
            blacklist.emplace_back(line);
        }
    }
}
