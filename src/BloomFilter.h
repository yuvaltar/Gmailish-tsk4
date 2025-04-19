//header file
#ifndef BLOOMFILTER_H
#define BLOOMFILTER_H

#include <vector>
#include <memory>
#include <string>
#include "IHashFunctions.h"
#include "url.h"

class BloomFilter {
public:
    BloomFilter(size_t size, const std::vector<std::shared_ptr<IHashFunction>>& hashFunctions); // constructor
    
    void add(const URL& item);
    bool possiblyContains(const URL& item) const;

    // For persistence: get and set the internal bit array.
    const std::vector<bool>& getBitArray() const;
    
private:

    size_t m_size;                  // the size of the bit array
    std::vector<bool> bitArray;     // the bit array itself
    std::vector<std::shared_ptr<IHashFunction>> hashFunctions; // the specific has functions we use

    void setBitArray(const std::vector<bool>& bits);
};

#endif // BLOOMFILTER_H
// Adds an item (e.g., a URL) to the filter.
    // void add(const std::string& item);
    
    // // Returns true if, according to the bloom filter, the item might be present.
    // // If any bit is not set, then returns false.
    // bool possiblyContains(const std::string& item) const;