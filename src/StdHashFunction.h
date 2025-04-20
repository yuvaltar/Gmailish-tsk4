#include <iostream>
#include <functional>
#include <string>

class StdHashFunction : public IHashFunction {
    inline static int id_counter = 0;
    int id;

public:
    StdHashFunction() : id(id_counter++) {}

    size_t hash(const std::string& input) const override {
        std::cout << "[StdHash #" << id << "] hello" << std::endl;
        return std::hash<std::string>{}(input);
    }
};
