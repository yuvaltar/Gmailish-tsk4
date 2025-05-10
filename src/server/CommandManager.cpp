#include "CommandManager.h"
#include "url.h"
#include <sstream>
#include <regex>
#include <iostream>

// Static regex to validate simple URLs
static const std::regex urlRegex(
    R"(^(?:(?:file:///(?:[A-Za-z]:)?(?:/[^\s]*)?)|(?:(?:[A-Za-z][A-Za-z0-9+.-]*)://)?(?:localhost|(?:[A-Za-z0-9-]+\.)+[A-Za-z0-9-]+|(?:\d{1,3}\.){3}\d{1,3})(?::\d+)?(?:/[^\s]*)?)$)");

// Constructor: stores references to shared Bloom filter and blacklist
CommandManager::CommandManager(BloomFilter& bloom, BlackList& blacklist)
    : bloom(bloom), blacklist(blacklist) {}

std::string CommandManager::execute(const std::string& commandLine) {
    // Parse the command and URL from the input line
    std::istringstream iss(commandLine);
    std::string command, urlStr;

    // Ensure both command and URL are provided
    if (!(iss >> command >> urlStr)) {
        return "400 Bad Request";
    }

    // Check for extra unexpected input
    std::string extra;
    if (iss >> extra) {
        return "400 Bad Request";
    }

    // Validate URL format using regex
    if (!std::regex_match(urlStr, urlRegex)) {
        return "400 Bad Request";
    }

    // Construct a URL object for further processing
    URL url(urlStr);

    // Handle POST command: add to blacklist and Bloom filter if not already present
    if (command == "POST") {
        if (!blacklist.contains(url)) {
            blacklist.addUrl(url);
            bloom.add(url);
        }
        return "201 Created";
    }

    // Handle DELETE command: remove from blacklist if it exists
    else if (command == "DELETE") {
        if (blacklist.contains(url)) {
            blacklist.removeUrl(url);  
            return "204 No Content";
        } else {
            return "404 Not Found";
        }
    }

    // Handle GET command: report presence in Bloom filter and blacklist
    else if (command == "GET") {
        std::string response = "200 Ok\n\n";

        bool inBloom = bloom.possiblyContains(url);
        response += (inBloom ? "true " : "false ");

        if (inBloom) {
            response += (blacklist.contains(url) ? "true" : "false");
        }

        return response;
    }

    // If command is unrecognized, return an error
    return "400 Bad Request";
}
