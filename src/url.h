#ifndef URL_H
#define URL_H

#include <string>
#include <vector>
#include <functional>

class URL {
private:
    std::string url;

public:
    URL(const std::string& url);
    std::string getURL() const;
    std::vector<size_t> hash(const std::vector<std::hash<std::string>>& hash_functions) const;
    bool operator==(const URL& other) const;
};

#endif // URL_H