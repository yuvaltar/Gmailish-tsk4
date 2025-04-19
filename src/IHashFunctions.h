// IHash function interface
#ifndef IHASHFUNCTION_H
#define IHASHFUNCTION_H

#include <string>

class IHashFunction {
public:
    virtual ~IHashFunction() {}
    virtual size_t hash(const std::string &input) const = 0;
};

#endif // IHASHFUNCTION_H
