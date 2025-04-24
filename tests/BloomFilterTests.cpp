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
#include <list>
#include <algorithm>
#include <fstream>

int g_bit_size = 8;  // Example bit array size
int g_hash_func1 = 1;  // Placeholder for StdHashFunction count
int g_hash_func2 = 2;  // Placeholder for DoubleHashFunction count


std::unique_ptr<BloomFilter> bf;  // Global BloomFilter object
BlackList blackList;  // Real BlackList class

// ---------- Valid Input Check ------------

// valid input
TEST(ValidationTest, InvalidInputValues) {
    EXPECT_TRUE(g_bit_size % 8 == 0) << "Bit size must be multiple of 8"; 
    EXPECT_GT(g_bit_size, 0)         << "Bit size must be positive";
    EXPECT_GE(g_hash_func1, 0)       << "Hash function count must be >= 0";
    EXPECT_GE(g_hash_func2, 0)       << "Hash function count must be >= 0";
}

// test url is regex 
TEST(URLTest, URLRegexValidation) {
    std::string url = "http://example.com";
    std::regex urlRegex(R"(^(?:(?:file:///(?:[A-Za-z]:)?(?:/[^\s])?)|(?:(?:[A-Za-z][A-Za-z0-9+\.\-]*)://)?(?:localhost|(?:[A-Za-z0-9\-]+\.)+[A-Za-z0-9\-]+|(?:\d{1,3}\.){3}\d{1,3})(?::\d+)?(?:/[^\s]*)?)$)");
    ASSERT_TRUE(std::regex_match(url, urlRegex)); // Check if URL matches regex
}



// ---------- INSERTING URLS TO ARRAY AND BLACK LIST TESTS  ------------

// insert and check a URL in BloomFilter and BlackList 
TEST(URLTest, AddURLToBloomFilter) {
    URL url("http://example.com");
    bf->add(url); // Add URL
    blackList.addUrl(url); // Add to blacklist
    ASSERT_TRUE(bf->possiblyContains(url)); // Check BloomFilter
    ASSERT_TRUE(blackList.contains(url)); // Check it exists in blacklist
}


// insert a different url to the blacklist and the bit array expect for false in both
TEST(BloomFilterIntegration, URLInListShouldMatch) {
    URL url("http://example.com");
    URL url2("http://example2.com");
    bf->add(url);
    blackList.addUrl(url);
    if (bf->possiblyContains(url2)) ASSERT_FALSE(blackList.contains(url2));
}



// Add multiple URLs to the BloomFilter and check if they  found in the list
TEST(BloomFilterIntegration, MultipleURLsInListShouldFindTarget) {
    bf->setBitArray(std::vector<bool>(g_bit_size, false));           // Reset bit array to all 0s
    bf->blackList.initialize("data/blacklist.txt");                  // Clear the blacklist

    std::vector<std::string> urls = {
        "http://a.com", "http://b.com", "http://c.com", "http://d.com",
        "http://e.com", "http://f.com", "http://g.com", "http://example.com"
    };

    for (const auto& u : urls) {
        bf->add(URL(u));
        blackList.addUrl(URL(u));
    }
    // Check if URL is in both BloomFilter and BlackList
    ASSERT_TRUE(bf->possiblyContains(URL("http://example.com")));
    ASSERT_TRUE(blackList.contains(URL("http://example.com"))); 

// create a new URL not in the list and check if it is not in the bloom filter and not in the blacklist
    URL notInList("http://not-in-list.com");
    if (bf->possiblyContains(notInList)) {
        ASSERT_FALSE(blackList.contains(notInList)); // Check if URL is not in blacklist
    } else {
        ASSERT_FALSE(blackList.contains(notInList)); // Check if URL is not in blacklist
    }
}



// ---------- Saving and loading to file tests ------------


// Add URL to Black list file and to bloom filter file and check if it is in both
TEST(PersistenceTest, BlackListURLPersistence) {
    // Step 1: Create and save                                   
    BlackList bl;
    URL url("http://blacklisted.com");
    bl.addUrl(url);
    bl.save("test_blacklist.txt");

    EXPECT_TRUE(bl.contains(url)) << "URL should persist in loaded blacklist";
}













// ---------- Bit Array Edge Tests ----------

TEST(BloomFilterEdgeCase, AllZerosBitArrayShouldReturnFalse) {
    bf->setBitArray(std::vector<bool>(g_bit_size, false));  // Set all bits to 0

    URL url("http://neveradded.com");
    EXPECT_FALSE(bf->possiblyContains(url)) << "All bits are 0, should return false";
}

TEST(BloomFilterEdgeCase, AllOnesBitArrayShouldReturnTrue) {
    bf->setBitArray(std::vector<bool>(g_bit_size, true));  // Set all bits to 1

    URL url("http://neveradded.com");
    EXPECT_TRUE(bf->possiblyContains(url)) << "All bits are 1, should return true";
}

// ---------- Integration test ----------






















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
