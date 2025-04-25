#include <iostream>
#include <sstream>
#include <string>
#include <vector>
#include <memory>
#include <list>
#include <algorithm>
#include <fstream>
#include "BlackList.h"
#include "BloomFilter.h"
#include "url.h"
#include "IHashFunctions.h"
#include "StdHashFunction.h"
#include <gtest/gtest.h>

int g_bit_size = 816;
int g_hash_func1 = 17;
int g_hash_func2 = 5;

std::unique_ptr<BloomFilter> bf;
BlackList blackList;

// ---------- Valid Input Check ------------
// Check that bit size and hash function IDs are valid.
TEST(ValidationTest, InvalidInputValues) {
    EXPECT_TRUE(g_bit_size % 8 == 0);
    EXPECT_GT(g_bit_size, 0);
    EXPECT_GE(g_hash_func1, 0);
    EXPECT_GE(g_hash_func2, 0);
}

// ---------- Regex-Free HTTP Check ------------
// Check that a URL starts with "http://" or "https://".
TEST(URLTest, URLStartsWithHttp) {
    std::string url = "http://example.com";
    bool isValid = url.rfind("http://", 0) == 0 || url.rfind("https://", 0) == 0;
    ASSERT_TRUE(isValid);
}

// ---------- Inserting URLs to BloomFilter and BlackList Tests ------------

// Add a URL to both BloomFilter and BlackList and verify they contain it.
TEST(URLTest, AddURLToBloomFilter) {
    URL url("http://example.com");
    bf->add(url);
    blackList.addUrl(url);
    ASSERT_TRUE(bf->possiblyContains(url));
    ASSERT_TRUE(blackList.contains(url));
}

// Add one URL, test against another. Check BloomFilter may be positive but BlackList must be false.
TEST(BloomFilterIntegration, URLInListShouldMatch) {
    URL url("http://example.com");
    URL url2("http://example2.com");
    bf->add(url);
    blackList.addUrl(url);

    if (bf->possiblyContains(url2)) {
        ASSERT_FALSE(blackList.contains(url2));
    }
}

// Add many URLs, check target URL is found and unknown URL is not.
TEST(BloomFilterIntegration, MultipleURLsInListShouldFindTarget) {
    bf->setBitArray(std::vector<bool>(g_bit_size, false));
    blackList = BlackList();  // reinitialize blacklist

    std::vector<std::string> urls = {
        "http://a.com", "http://b.com", "http://c.com", "http://d.com",
        "http://e.com", "http://f.com", "http://g.com", "http://example.com"
    };

    for (const auto& u : urls) {
        bf->add(URL(u));
        blackList.addUrl(URL(u));
    }

    ASSERT_TRUE(bf->possiblyContains(URL("http://example.com")));
    ASSERT_TRUE(blackList.contains(URL("http://example.com")));

    URL notInList("http://not-in-list.com");
    if (bf->possiblyContains(notInList)) {
        ASSERT_FALSE(blackList.contains(notInList));
    } else {
        ASSERT_FALSE(blackList.contains(notInList));
    }
}

// ---------- Persistence Tests ------------

// Save and load BlackList, check that added URL persists.
TEST(PersistenceTest, BlackListURLFilePersistence) {
    BlackList bl;
    URL url("http://blacklisted.com");
    bl.addUrl(url);
    bl.save("data/test_blacklist.txt");

    BlackList loaded;
    loaded.load("data/test_blacklist.txt");
    EXPECT_TRUE(loaded.contains(url));
}

// Save and load BloomFilter, check that added URL persists.
TEST(PersistenceTest, BloomFilterFilePersistence) {
    URL url("http://bloomfilter.com");
    BloomFilter bf(g_bit_size, {
        std::make_shared<StdHashFunction>(g_hash_func1),
        std::make_shared<StdHashFunction>(g_hash_func2)
    });
    bf.add(url);
    bf.saveToFile("data/test_bloomfilter.bin");

    BloomFilter loaded(g_bit_size, {
        std::make_shared<StdHashFunction>(g_hash_func1),
        std::make_shared<StdHashFunction>(g_hash_func2)
    });
    loaded.loadFromFile("data/test_bloomfilter.bin");

    EXPECT_TRUE(loaded.possiblyContains(url));
}

// ---------- Bit Array Edge Tests ----------

// Test that when all BloomFilter bits are 0, no match occurs.
TEST(BloomFilterEdgeCase, AllZerosBitArrayShouldReturnFalse) {
    bf->setBitArray(std::vector<bool>(g_bit_size, false));
    URL url("http://neveradded.com");
    EXPECT_FALSE(bf->possiblyContains(url));
}

// Test that when all BloomFilter bits are 1, any URL may return true.
TEST(BloomFilterEdgeCase, AllOnesBitArrayShouldReturnTrue) {
    bf->setBitArray(std::vector<bool>(g_bit_size, true));
    URL url("http://neveradded.com");
    EXPECT_TRUE(bf->possiblyContains(url));
}

// ---------- Integration Test ------------
// Save and reload both BloomFilter and BlackList, verify persistence works and false positives are handled.
TEST(IntegrationTest, BlacklistAndBloomFilterPersistence) {
    size_t filterSize = 256;
    std::vector<std::shared_ptr<IHashFunction>> hashFunctions = {
        std::make_shared<StdHashFunction>(g_hash_func1),
        std::make_shared<StdHashFunction>(g_hash_func2)
    };

    BloomFilter bf(filterSize, hashFunctions);
    BlackList bl;

    URL goodUrl("http://safe-site.com");
    URL badUrl("http://evil-site.com");

    bf.add(badUrl);
    bl.addUrl(badUrl);

    std::string bloomFile = "integration_bloom.bin";
    std::string blacklistFile = "integration_blacklist.txt";

    bf.saveToFile(bloomFile);
    bl.save(blacklistFile);

    BloomFilter bfLoaded(filterSize, hashFunctions);
    bfLoaded.loadFromFile(bloomFile);

    BlackList blLoaded;
    blLoaded.load(blacklistFile);

    ASSERT_TRUE(bfLoaded.possiblyContains(badUrl));
    ASSERT_TRUE(blLoaded.contains(badUrl));
    ASSERT_FALSE(blLoaded.contains(goodUrl));

    if (!bfLoaded.possiblyContains(goodUrl)) {
        SUCCEED();
    } else {
        std::cout << "[ WARNING ] Bloom filter false positive for: " << goodUrl.getURL() << "\n";
    }
}

// ---------- Main Function ------------
// Initializes Google Test and sets up a default BloomFilter instance for shared use.
int main(int argc, char* argv[]) {
    std::vector<std::shared_ptr<IHashFunction>> hashFuncs = {
        std::make_shared<StdHashFunction>(g_hash_func1),
        std::make_shared<StdHashFunction>(g_hash_func2)
    };

    bf = std::make_unique<BloomFilter>(g_bit_size, hashFuncs);

    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
