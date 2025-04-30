// BlackList.cpp
#include "BlackList.h"         // Include header for BlackList class and dependencies
#include <fstream>             // For file I/O (ifstream/ofstream)
#include <algorithm>           // For std::find

// Add a URL to the blacklist
void BlackList::addUrl(const URL& url) {
    blacklist.push_back(url);  // Append the URL object to the list
}

// Check if the blacklist contains the given URL
bool BlackList::contains(const URL& url) const {
    return std::find(blacklist.begin(), blacklist.end(), url) != blacklist.end(); // Return true if found
}

// Save all URLs in the blacklist to a file, one per line
void BlackList::save(const std::string& path) const {
    std::ofstream out(path);   // Open file for writing
    for (const auto& url : blacklist) {    // Iterate over each URL in the blacklist
        out << url.getURL() << "\n";       // Write URL string to file
    }
}

// Load URLs from a file and add them to the blacklist
void BlackList::load(const std::string& path) {
    std::ifstream in(path);    // Open file for reading
    std::string line;          // Temporary string for reading each line
    while (std::getline(in, line)) {       // Read file line by line
        if (!line.empty()) {               // Skip empty lines
            blacklist.emplace_back(line);  // Construct URL from string and add to list
        }
    }
}
