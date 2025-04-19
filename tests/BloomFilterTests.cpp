// BloomFilterTests.cpp

#include <gtest/gtest.h>
#include "../src/BloomFilter.h"
#include "../src/URL.h"
#include <list>
#include <algorithm>
#include <iostream>
// Global test configuration variables (set from main) 
int g_bit_size = 8;
int g_hash_func1 = 1;
int g_hash_func2 = 1;
std::list<URL> blacklist;
BloomFilter bf(g_bit_size, g_hash_func1 , g_hash_func2);

// ---------- Isolated Test Cases ------------

TEST(ValidationTest, InvalidInputValues) {
    EXPECT_TRUE(g_bit_size % 8 == 0) << "Bit size must be multiple of 8";
    EXPECT_GT(g_bit_size, 0) << "Bit size must be positive";
    EXPECT_GE(g_hash_func1, 0) << "Hash function count must be >= 0";
    EXPECT_GE(g_hash_func2, 0) << "Hash function count must be >= 0";
}

TEST(URLTest, AddURLToBlacklist) {
    URL url("http://example.com");
    blacklist.push_back(url);
    auto it = std::find(blacklist.begin(), blacklist.end(), url);
    EXPECT_NE(it, blacklist.end()) << "URL should be in the blacklist";
}

TEST(URLTest, RemoveURLFromBlacklist) {
    URL url("http://example.com");
    blacklist.push_back(url);
    blacklist.remove(url);
    auto it = std::find(blacklist.begin(), blacklist.end(), url);
    EXPECT_EQ(it, blacklist.end()) << "URL should not be in the blacklist";
}

// ---------- Integration Test with While Loop ----------

// check if bf recognize a blocked_url in a list of 1 blocked_urls

TEST(BloomFilterIntegration, URLInListShouldMatch) {

    URL url("http://example.com");
    blacklist.push_back(url);
    bf.add(url.toString());

    while (g_hash_func1 > 0 || g_hash_func2 > 0) {
        std::string hashed = bf.applyHash(url);  // assume the bf.applyhash return string -> which isnt
        // look whether url in list
        auto it = std::find(blacklist.begin(), blacklist.end(), hashed);
        ASSERT_NE(it, blacklist.end()) << "URL should be in the blacklist";
        // confirm url in list 
        auto it = std::find(blacklist.begin(), blacklist.end(), hashed);
        ASSERT_NE(it, blacklist.end()) << "URL should be in the blacklist";
        
        if (g_hash_func1 > 0) g_hash_func1--;
        else if (g_hash_func2 > 0) g_hash_func2--;
    }
}

// check if bf recognize a valid_url not in a list of 1 blocked_urls

TEST(BloomFilterIntegration, URLNotInListShouldNotMatch) {

    URL black_list_url("http://example1.com");
    blacklist.push_back(black_list_url);
    URL valid_url("http://example2.com")

    while (g_hash_func1 > 0 || g_hash_func2 > 0) {
        std::string hashed = bf.applyHash(valid_url);  // assume the bf.applyhash return string -> which isnt
    
        auto it = std::find(blacklist.begin(), blacklist.end(), hashed);
        ASSERT_EQ(it, blacklist.end()) << "URL should be in the blacklist";
        
        if (g_hash_func1 > 0) g_hash_func1--;
        else if (g_hash_func2 > 0) g_hash_func2--;
    }
}
// check if bf recognize a blocked_url in a list of many blocked_urls

TEST(BloomFilterIntegration, MultipleURLsInListShouldFindTarget) {

    // Add multiple URLs
    std::vector<std::string> urls = {
        "http://a.com", "http://b.com", "http://c.com", "http://d.com",
        "http://e.com", "http://f.com", "http://g.com", "http://example.com"
    };
    // add multiple urls to the list
    for (const auto& u : urls) {
        URL temp(u);
        blacklist.push_back(temp);
    }

    while (g_hash_func1 > 0 || g_hash_func2 > 0) {
        std::string hashed = bf.applyHash(url);  // assume the bf.applyhash return string -> which isnt
        // look whether url in list
        auto it = std::find(blacklist.begin(), blacklist.end(), hashed);
        ASSERT_NE(it, blacklist.end()) << "URL should be in the blacklist";
        // confirm url in list 
        auto it = std::find(blacklist.begin(), blacklist.end(), hashed);
        ASSERT_NE(it, blacklist.end()) << "URL should be in the blacklist";
        
        if (g_hash_func1 > 0) g_hash_func1--;
        else if (g_hash_func2 > 0) g_hash_func2--;
    }
}

// check if bf recognize a valid_url not in  list of many blocked_urls

TEST(BloomFilterIntegration, MultipleURLsInListShouldFindTarget) {

    // Add multiple URLs
    std::vector<std::string> urls = {
        "http://a.com", "http://b.com", "http://c.com", "http://d.com",
        "http://e.com", "http://f.com", "http://g.com", "http://example.com"
    };
    // add multiple urls to the list
    for (const auto& u : urls) {
        URL temp(u);
        blacklist.push_back(temp);
    }
    // the url which we are going to search if its in the list
    URL valid_url("http://example2.com")
    int g_hash_func1 = g_hash_func1;
    int g_hash_func2 = g_hash_func2;

    while (g_hash_func1 > 0 || g_hash_func2 > 0) {
        std::string hashed = bf.applyHash(valid_url);  // assume the bf.applyhash return string -> which isnt
        // look whether url in list
        auto it = std::find(blacklist.begin(), blacklist.end(), hashed);
        ASSERT_EQ(it, blacklist.end()) << "URL should be in the blacklist"; 
        if (g_hash_func1 > 0) g_hash_func1--;
        else if (g_hash_func2 > 0) g_hash_func2--;
    }
}





// ---------- Main Function ----------

int main(int argc, char* argv[]) {
    if (argc < 4) {
        std::cerr << "Usage: ./test_exe <bit_size> <hash_func1> <hash_func2>\n";
        return 1;
    }

    g_bit_size = std::stoi(argv[1]);
    g_hash_func1 = std::stoi(argv[2]);
    g_hash_func2 = std::stoi(argv[3]);

    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();

}
