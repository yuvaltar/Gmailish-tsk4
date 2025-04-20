// BloomFilter.cpp
#include "BloomFilter.h"
#include <fstream>

BloomFilter::BloomFilter(size_t size, const std::vector<std::shared_ptr<IHashFunction>>& hashFunctions)
    : m_size(size), bitArray(size, false), hashFunctions(hashFunctions) {}

void BloomFilter::add(const URL& item) {
    for (const auto& hf : hashFunctions) {
        size_t hashValue = hf->hash(item.getURL());
        size_t index = hashValue % m_size;
        bitArray[index] = true;
    }
}

bool BloomFilter::possiblyContains(const URL& item) const {
    for (const auto& hf : hashFunctions) {
        size_t hashValue = hf->hash(item.getURL());
        size_t index = hashValue % m_size;
        if (!bitArray[index]) return false;
    }
    return true;
}

const std::vector<bool>& BloomFilter::getBitArray() const {
    return bitArray;
}

void BloomFilter::setBitArray(const std::vector<bool>& bits) {
    if (bits.size() == m_size) {
        bitArray = bits;
    }
}

void BloomFilter::saveToFile(const std::string& path) const {
    std::ofstream out(path, std::ios::binary);
    for (bool bit : bitArray) {
        out.write(reinterpret_cast<const char*>(&bit), sizeof(bool));
    }
}

void BloomFilter::loadFromFile(const std::string& path) {
    std::ifstream in(path, std::ios::binary);
    std::vector<bool> loadedBits;
    bool bit;
    while (in.read(reinterpret_cast<char*>(&bit), sizeof(bool))) {
        loadedBits.push_back(bit);
    }
    setBitArray(loadedBits);
}
