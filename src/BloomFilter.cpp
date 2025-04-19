// bloomfilter.cpp file
#include "BloomFilter.h"
#include "url.h"
#include <iostream>

// class members

    //size_t x = std::hash<std::string>{}("ihvb");

// constructor 
BloomFilter::BloomFilter(size_t size, const std::vector<std::shared_ptr<IHashFunction>>& hashFunctions)
    : m_size(size), bitArray(size, false), hashFunctions(hashFunctions) {} 

// too add the bit to the filter
void BloomFilter::add(const URL& item) {            // 1 to add the url bit to the black list
    for (const auto& hf : hashFunctions) {          // getting an hash func and goes over them in for loop
        size_t hashValue = hf->hash(item.getURL()); // run the hash function on the url and get the hash value
        size_t index = hashValue % m_size;          // devide the hash value by the size of the array
        bitArray[index] = true;                     // mark the singhed bit as true
        std::cout << "Hello, World!2" << std::endl << std::flush;
    }
}
// to check if the url is in the black list
bool BloomFilter::possiblyContains(const URL& item) const { // 2 
    for (const auto& hf : hashFunctions) {          // getting an hash func and goes over them in for loop
        size_t hashValue = hf->hash(item.getURL()); // run the hash function on the url and get the hash value
        size_t index = hashValue % m_size;          // devide the hash value by the size of the array
        std::cout << "Hello, World!2" << std::endl << std::flush;
        if (!bitArray[index])                       // mark the singhed bit as true
            return false;                           // if the marked bits * doesnt * match return false
    }
    return true;                                    // else true
}
// returns the bit array
const std::vector<bool>& BloomFilter::getBitArray() const {
    return bitArray;
}
// set the bit array
void BloomFilter::setBitArray(const std::vector<bool>& bits) {
    if(bits.size() == m_size) {
        bitArray = bits;
    }
}

