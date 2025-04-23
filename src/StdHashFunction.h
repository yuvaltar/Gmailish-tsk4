// ===== StdHashFunction.h =====
#ifndef STDHASHFUNCTION_H
#define STDHASHFUNCTION_H

#include "IHashFunctions.h"
#include <functional>
#include <string>

class StdHashFunction : public IHashFunction {
public:
    explicit StdHashFunction(int iterations) : iterations_(iterations) {}

    size_t hash(const std::string& input) const override {
        std::hash<std::string> hasher;
        std::string current = input;
        size_t hashValue = 0;

        for (int i = 0; i < iterations_; ++i) {
            hashValue = hasher(current);
            current = std::to_string(hashValue);
        }

        return hashValue;
    }

private:
    int iterations_;
};

#endif // STDHASHFUNCTION_H
