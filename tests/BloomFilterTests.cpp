// BloomFilterTests.cpp
#include <iostream>
#include <sstream>
#include <string>
#include <vector>
#include <memory>
#include "BloomFilter.h"
#include "url.h"
#include "IHashFunctions.h"
#include "StdHashFunction.h"
#include "DoubleHashFunction.h"
#include "BlackList.h"
#include <gtest/gtest.h>
#include <list>
#include <algorithm>
#include <fstream>

int g_bit_size = 8;  // Example bit array size
int g_hash_func1 = 1;  // Placeholder for StdHashFunction count
int g_hash_func2 = 2;  // Placeholder for DoubleHashFunction count

std::list<URL> blacklist;  // Manual list for old-style testing
std::unique_ptr<BloomFilter> bf;  // Global BloomFilter object
BlackList realList;  // Real BlackList class

// ---------- Isolated Test Cases ------------

// Validate correct parameter ranges
TEST(ValidationTest, InvalidInputValues) {
    EXPECT_TRUE(g_bit_size % 8 == 0); // Must be divisible by 8
    EXPECT_GT(g_bit_size, 0); // Must be positive
    EXPECT_GE(g_hash_func1, 0); // No negative hash counts
    EXPECT_GE(g_hash_func2, 0);
}

// Add and check a URL in BloomFilter
TEST(URLTest, AddURLToBloomFilter) {
    URL url("http://example.com");
    bf->add(url); // Add URL
    ASSERT_TRUE(bf->possiblyContains(url)); // Check it exists
}

// Remove a URL from std::list blacklist (not BloomFilter)
TEST(URLTest, RemoveURLFromList) {
    URL url("http://example.com");
    blacklist.push_back(url); // Add
    blacklist.remove(url); // Remove
    auto it = std::find(blacklist.begin(), blacklist.end(), url);
    EXPECT_EQ(it, blacklist.end()); // Confirm it's removed
}

// ---------- Integration Tests ------------

// Check URL after adding to BloomFilter
TEST(BloomFilterIntegration, URLInListShouldMatch) {
    URL url("http://example.com");
    bf->add(url);
    ASSERT_TRUE(bf->possiblyContains(url));
}

// Confirm clean URL not detected
TEST(BloomFilterIntegration, URLNotInListShouldNotMatch) {
    URL url("http://example2.com");
    ASSERT_FALSE(bf->possiblyContains(url));
}

// Add many URLs, check one
TEST(BloomFilterIntegration, MultipleURLsInListShouldFindTarget) {
    std::vector<std::string> urls = {
        "http://a.com", "http://b.com", "http://c.com",
        "http://d.com", "http://e.com", "http://f.com",
        "http://g.com", "http://example.com"
    };
    for (const auto& u : urls) {
        bf->add(URL(u));
    }
    ASSERT_TRUE(bf->possiblyContains(URL("http://example.com")));
}

// Add many, confirm a non-added one isn't matched
TEST(BloomFilterIntegration, MultipleURLsShouldNotMatchInvalid) {
    std::vector<std::string> urls = {
        "http://a.com", "http://b.com", "http://c.com",
        "http://d.com", "http://e.com", "http://f.com",
        "http://g.com", "http://example.com"
    };
    for (const auto& u : urls) {
        bf->add(URL(u));
    }
    ASSERT_FALSE(bf->possiblyContains(URL("http://not-in-list.com")));
}

// ---------- New Tests ------------

// Test saving and loading BloomFilter
TEST(PersistenceTest, SaveAndLoadBloomFilter) {
    URL testUrl("http://persist.com");
    bf->add(testUrl);
    bf->saveToFile("test_bloom.bin"); // Save to file

    // Create new instance and load
    std::vector<std::shared_ptr<IHashFunction>> funcs = {
        std::make_shared<StdHashFunction>(), std::make_shared<DoubleHashFunction>()
    };
    BloomFilter loaded(1024, funcs);
    loaded.loadFromFile("test_bloom.bin");

    ASSERT_TRUE(loaded.possiblyContains(testUrl)); // Ensure data persisted
    std::remove("test_bloom.bin"); // Cleanup
}

// Test adding and checking real BlackList
TEST(BlackListTest, AddAndContainsCheck) {
    URL url("http://black.com");
    realList.addUrl(url);
    ASSERT_TRUE(realList.contains(url)); // Should contain URL
}

// Test false positive detection: Bloom says true, blacklist says false
TEST(BlackListTest, FalsePositiveDetection) {
    URL fakeUrl("http://falsepositive.com");
    bf->add(fakeUrl);

    ASSERT_TRUE(bf->possiblyContains(fakeUrl)); // Might be true
    ASSERT_FALSE(realList.contains(fakeUrl)); // Definitely not in list
}

// ---------- Main Function ----------

int main(int argc, char* argv[]) {
    // Init hash functions
    std::vector<std::shared_ptr<IHashFunction>> hashFuncs;
    hashFuncs.push_back(std::make_shared<StdHashFunction>());
    hashFuncs.push_back(std::make_shared<DoubleHashFunction>());

    // Create a 1024-bit Bloom filter with 2 hash funcs
    bf = std::make_unique<BloomFilter>(1024, hashFuncs);

    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
