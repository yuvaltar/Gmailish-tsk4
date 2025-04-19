// the standard hash function we will implement
#ifndef STDHASHFUNCTION_H
#define STDHASHFUNCTION_H

#include "IHashFunctions.h"
#include <functional>

class StdHashFunction : public IHashFunction {
public:
    virtual size_t hash(const std::string &input) const override {
        return std::hash<std::string>{}(input);
    }
};

#endif // STDHASHFUNCTION_H