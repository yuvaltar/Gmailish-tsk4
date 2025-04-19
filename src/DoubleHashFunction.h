//the double hash Function
#ifndef DOUBLEHASHFUNCTION_H
#define DOUBLEHASHFUNCTION_H

#include "IHashFunctions.h"
#include <functional>
#include <string>

class DoubleHashFunction : public IHashFunction {
public:
    virtual size_t hash(const std::string &input) const override {
        size_t firstHash = std::hash<std::string>{}(input);
        // A simple second hash: hash the string representation of the first hash.
        size_t secondHash = std::hash<std::string>{}(std::to_string(firstHash));
        // Combine the two hashes. (You can design a more robust method if needed.)
        return firstHash ^ (secondHash << 1);
    }
};

#endif // DOUBLEHASHFUNCTION_H