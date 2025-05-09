#include "CommandManager.h"
#include "url.h"
#include <sstream>
#include <regex>
#include <iostream>

// Static regex to validate simple URLs
static const std::regex urlRegex(
    R"(^(?:(?:file:///(?:[A-Za-z]:)?(?:/[^\s]*)?)|(?:(?:[A-Za-z][A-Za-z0-9+.-]*)://)?(?:localhost|(?:[A-Za-z0-9-]+\.)+[A-Za-z0-9-]+|(?:\d{1,3}\.){3}\d{1,3})(?::\d+)?(?:/[^\s]*)?)$)");



CommandManager::CommandManager(BloomFilter& bloom, BlackList& blacklist)
    : bloom(bloom), blacklist(blacklist) {}

    std::string CommandManager::execute(const std::string& commandLine) {
       
    
        std::istringstream iss(commandLine);
        std::string command, urlStr;
    
        if (!(iss >> command >> urlStr)) {
          
            return "400 Bad Request";
        }
    
        std::string extra;
        if (iss >> extra) {
           
            return "400 Bad Request";
        }
    
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
