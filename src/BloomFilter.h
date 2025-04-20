// BloomFilter.h
#ifndef BLOOMFILTER_H
#define BLOOMFILTER_H

#include <vector>
#include <memory>
#include <string>
#include "IHashFunctions.h"
#include "url.h"

class BloomFilter {
public:
    BloomFilter(size_t size, const std::vector<std::shared_ptr<IHashFunction>>& hashFunctions);

    void add(const URL& item);
    bool possiblyContains(const URL& item) const;

    const std::vector<bool>& getBitArray() const;
    void setBitArray(const std::vector<bool>& bits);

    void saveToFile(const std::string& path) const;
    void loadFromFile(const std::string& path);

private:
    size_t m_size;
    std::vector<bool> bitArray;
    std::vector<std::shared_ptr<IHashFunction>> hashFunctions;
};

#endif // BLOOMFILTER_H
