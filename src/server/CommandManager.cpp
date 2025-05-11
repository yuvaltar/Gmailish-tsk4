#include "CommandManager.h"
#include "url.h"
#include <sstream>  // For parsing input
#include <regex>    // For validating URL format
#include <iostream> // For debugging (not actively used)

// A regex pattern to validate URL formats
static const std::regex urlRegex(
    R"(^(?:(?:file:///(?:[A-Za-z]:)?(?:/[^\s]*)?)|(?:(?:[A-Za-z][A-Za-z0-9+.-]*)://)?(?:localhost|(?:[A-Za-z0-9-]+\.)+[A-Za-z0-9-]+|(?:\d{1,3}\.){3}\d{1,3})(?::\d+)?(?:/[^\s]*)?)$)");

// Constructor: initializes references to the shared BloomFilter and BlackList
CommandManager::CommandManager(BloomFilter& bloom, BlackList& blacklist)
    : bloom(bloom), blacklist(blacklist) {}

// Executes a single command line: expects format "COMMAND URL"
std::string CommandManager::execute(const std::string& commandLine) {
    std::istringstream iss(commandLine);
    std::string command, urlStr;

    // Extract command and URL; reject malformed input
    if (!(iss >> command >> urlStr)) {
        return "400 Bad Request";
    }

    // Ensure there are no extra tokens after the URL
    std::string extra;
    if (iss >> extra) {
        return "400 Bad Request";
    }

    // Validate URL format using regex
    if (!std::regex_match(urlStr, urlRegex)) {
        return "400 Bad Request";
    }

    // Wrap the string URL in a URL class (assumed to handle normalization/comparison)
    URL url(urlStr);

    // === POST ===
    // Adds a URL to the blacklist and Bloom filter if not already there
    if (command == "POST") {
        if (!blacklist.contains(url)) {
            blacklist.addUrl(url);   // Add to exact list
            bloom.add(url);          // Add to probabilistic filter
        }
        return "201 Created";        // Success response
    }

    // === DELETE ===
    // Removes a URL from the blacklist if it's present
    else if (command == "DELETE") {
        if (blacklist.contains(url)) {
            blacklist.removeUrl(url);  // Remove from blacklist
            return "204 No Content";   // Success, no content
        } else {
            return "404 Not Found";    // Cannot remove nonexistent entry
        }
    }

    // === GET ===
    // Checks whether a URL is *possibly* in the Bloom filter and if it's in the blacklist
    else if (command == "GET") {
        std::string response = "200 Ok\n\n";  // Standard OK header
        bool inBloom = bloom.possiblyContains(url);  // Probabilistic check
        response += (inBloom ? "true " : "false ");  // Bloom filter result

        if (inBloom) {
            // Only check blacklist if Bloom thinks it's present
            response += (blacklist.contains(url) ? "true" : "false");
        }

        return response;
    }

    // If command is unrecognized
    return "400 Bad Request";
}
