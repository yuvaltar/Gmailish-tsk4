// BlackList.h
#ifndef BLACKLIST_H
#define BLACKLIST_H

#include <list>
#include <string>
#include "url.h"

class BlackList {
public:
    void addUrl(const URL& url);
    bool contains(const URL& url) const;

    void save(const std::string& path) const;
    void load(const std::string& path);

private:
    std::list<URL> blacklist;
};

#endif // BLACKLIST_H