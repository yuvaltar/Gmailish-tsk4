#ifndef STDHASHFUNCTION_H
#define STDHASHFUNCTION_H

#include "IHashFunctions.h"
#include <functional>
#include <string>

class StdHashFunction : public IHashFunction {
public:
    size_t hash(const std::string& input) const override {
        
        return std::hash<std::string>{}(input);
        
    }
};

#endif // STDHASHFUNCTION_H
