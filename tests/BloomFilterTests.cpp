// BloomFilterTests.cpp
#include <iostream>
#include <sstream>
#include <string>
#include <vector>
#include <memory>
#include <list>
#include <algorithm>
#include <fstream>

#include "BloomFilter.h"
#include "url.h"
#include "IHashFunctions.h"
#include "StdHashFunction.h"
#include "DoubleHashFunction.h"

#include <gtest/gtest.h>

int g_bit_size   = 8;
int g_hash_func1 = 1;
int g_hash_func2 = 2;

std::unique_ptr<BloomFilter> bf;

// ---------- Isolated Test Cases ------------

// valid input
TEST(ValidationTest, InvalidInputValues) {
    EXPECT_TRUE(g_bit_size % 8 == 0) << "Bit size must be multiple of 8"; 
    EXPECT_GT(g_bit_size, 0)         << "Bit size must be positive";
    EXPECT_GE(g_hash_func1, 0)       << "Hash function count must be >= 0";
    EXPECT_GE(g_hash_func2, 0)       << "Hash function count must be >= 0";
}

// adding a url to the blacklist and the bit array expect for true in both
TEST(URLTest, AddURLToBlacklist) {
    bf->setBitArray(std::vector<bool>(g_bit_size, false));           // Reset bit array to all 0s
    bf->blackList.initialize("data/blacklist.txt");                  // Clear the blacklist

    URL url("http://example.com");
    bf->add(url);
    EXPECT_TRUE(bf->bitArrayResult(url));
    EXPECT_TRUE(bf->blackList.contains(url)) << "URL should be in the bit array";
}

// adding a different url to the blacklist and the bit array expect for false in both
TEST(URLTest, RemoveURLFromBlacklist) {
    bf->setBitArray(std::vector<bool>(g_bit_size, false));           // Reset bit array to all 0s
    bf->blackList.initialize("data/blacklist.txt");                  // Clear the blacklist

    URL url("http://example.com"); 
    bf->add(url);
    URL url2("http://example2.com");
    EXPECT_FALSE(bf->bitArrayResult(url2))      << "URL 2 should not be in the bit array";
    EXPECT_FALSE(bf->blackList.contains(url2))  << "URL 2 should not be in the blacklist";
}

// ---------- Integration Tests ------------

// adding multiple urls to the bloomfilter and checking if different url isn't detected in the blacklist
TEST(BloomFilterIntegration, MultipleURLsInListShouldFindTarget) {
    bf->setBitArray(std::vector<bool>(g_bit_size, false));           // Reset bit array to all 0s
    bf->blackList.initialize("data/blacklist.txt");                  // Clear the blacklist

    std::vector<std::string> urls = {
        "http://a.com", "http://b.com", "http://c.com", "http://d.com",
        "http://e.com", "http://f.com", "http://g.com", "http://example.com"
    };

    for (const auto& u : urls) {
        URL temp(u);
        bf->add(temp);
    }

    URL target("htdstp://example.com1233");
    ASSERT_FALSE(bf->blackList.contains(target)) << "BloomFilter should find the target URL in the blacklist";
}

// set the bit array to be all 1s and check if the url is detected in the blacklist
TEST(BloomFilterIntegration, MultipleURLsInListShouldNotMatchInvalid) {
    bf->setBitArray(std::vector<bool>(g_bit_size, false));           // Reset bit array to all 0s
    bf->blackList.initialize("data/blacklist.txt");                  // Clear the blacklist

    bf->setBitArray(std::vector<bool>(g_bit_size, true));            // Set all bits to 1
    URL target("http://example.com");

    ASSERT_TRUE(bf->bitArrayResult(target))      << "BloomFilter should find the target URL in the bit array";
    ASSERT_FALSE(bf->blackList.contains(target)) << "BloomFilter should find the target URL in the blacklist";
}

// set the bit array to be all 0s and check if the url is not detected in the blacklist
TEST(BloomFilterIntegration, MultipleURLsInListShouldNotMatchInvalid2) {
    bf->setBitArray(std::vector<bool>(g_bit_size, false));           // Reset bit array to all 0s
    bf->blackList.initialize("data/blacklist.txt");                  // Clear the blacklist

    bf->setBitArray(std::vector<bool>(g_bit_size, false));           // Set all bits to 0
    URL target("http://example.com");

    ASSERT_FALSE(bf->bitArrayResult(target))      << "BloomFilter should find the target URL in the bit array";
    ASSERT_FALSE(bf->blackList.contains(target))  << "BloomFilter should find the target URL in the blacklist";
}

// ---------- Main Function ----------
int main(int argc, char* argv[]) {
    std::vector<std::shared_ptr<IHashFunction>> hashFuncs;
    hashFuncs.push_back(std::make_shared<StdHashFunction>());
    hashFuncs.push_back(std::make_shared<DoubleHashFunction>());

    int bloomFilterSize = 8;
    bf = std::make_unique<BloomFilter>(bloomFilterSize, hashFuncs);

    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
