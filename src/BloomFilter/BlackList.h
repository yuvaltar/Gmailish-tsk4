// BlackList.h
#ifndef BLACKLIST_H              // Include guard start: prevents multiple inclusions
#define BLACKLIST_H

#include <list>                  // For std::list to store blacklisted URLs
#include <string>                // For std::string (used in file path)
#include "url.h"                 // Include the URL class

// Class that manages a list of blacklisted URLs
class BlackList {
public:
    // Add a URL to the blacklist
    void addUrl(const URL& url);

    // Check if the blacklist contains the specified URL
    bool contains(const URL& url) const;

    // Save the blacklist to a file (one URL per line)
    void save(const std::string& path) const;

    // Load URLs from a file into the blacklist
    void load(const std::string& path);

private:
    std::list<URL> blacklist;     // Container holding the blacklisted URLs
};

#endif // BLACKLIST_H            // End of include guard
