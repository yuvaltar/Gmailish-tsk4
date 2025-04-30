#include "CommandManager.h"
#include "url.h"
#include <sstream>
#include <regex>

// Static regex to validate simple URLs
static const std::regex urlRegex(
    R"(^(https?|file)://[^\\s/$.?#].[^\\s]*$)"
);

CommandManager::CommandManager(BloomFilter& bloom, BlackList& blacklist)
    : bloom(bloom), blacklist(blacklist) {}

std::string CommandManager::execute(const std::string& commandLine) {
    std::istringstream iss(commandLine);
    std::string command, urlStr;

    if (!(iss >> command >> urlStr)) {
        return "400 Bad Request";
    }

    // Reject extra tokens (only 2 allowed)
    std::string extra;
    if (iss >> extra) {
        return "400 Bad Request";
    }

    // URL format check
    if (!std::regex_match(urlStr, urlRegex)) {
        return "400 Bad Request";
    }

    URL url(urlStr);

    if (command == "POST") {
        if (!blacklist.contains(url)) {
            blacklist.addUrl(url);
            bloom.add(url);
        }
        return "201 Created";
    }

    else if (command == "DELETE") {
        if (blacklist.contains(url)) {
            blacklist.removeUrl(url);  
            return "204 No Content";
        } else {
            return "404 Not Found";
        }
    }

    else if (command == "GET") {
        std::string response = "200 Ok\n\n";
    
        bool inBloom = bloom.possiblyContains(url);
        response += (inBloom ? "true " : "false ");
    
        if (inBloom) {
            response += (blacklist.contains(url) ? "true" : "false");
        }
    
        return response;
    }
    
    return "400 Bad Request";
}
