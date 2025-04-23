#ifndef DOUBLEHASHFUNCTION_H
#define DOUBLEHASHFUNCTION_H

#include "IHashFunctions.h"
#include <functional>
#include <string>

class DoubleHashFunction : public IHashFunction {
public:
    size_t hash(const std::string& input) const override {
        size_t firstHash = std::hash<std::string>{}(input);
        size_t secondHash = std::hash<std::string>{}(std::to_string(firstHash));
        return firstHash ^ (secondHash << 1);
    }
};

#endif // DOUBLEHASHFUNCTION_H
