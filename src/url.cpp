#include "url.h"

URL::URL(const std::string& url) : url(url) {}

std::string URL::getURL() const {
    return url;
}

bool URL::operator==(const URL& other) const {
    return url == other.url;
}