#include <gtest/gtest.h>
#include "CommandManager.h"
#include "BloomFilter.h"
#include "BlackList.h"
#include "url.h"

class CommandManagerTest : public ::testing::Test {
protected:
    BloomFilter bloom{100, {}};  // Simple Bloom filter with 100 bits
    BlackList blacklist;
    CommandManager manager{bloom, blacklist};
};

// ------------- isolated tests ---------------------

// Test 1: Valid POST adds URL and returns 201
TEST_F(CommandManagerTest, ValidPostAddsToFilterAndBlacklist) {
    std::string response = manager.execute("POST http://example.com");
    EXPECT_EQ(response, "201 Created");
}

// Test 2: Duplicate POST still returns 201
TEST_F(CommandManagerTest, DuplicatePostStillReturnsCreated) {
    manager.execute("POST http://example.com");
    std::string response = manager.execute("POST http://example.com");
    EXPECT_EQ(response, "201 Created");
}

// Test 3: Valid DELETE removes from blacklist and returns 204
TEST_F(CommandManagerTest, ValidDeleteReturnsNoContent) {
    manager.execute("POST http://example.com");
    std::string response = manager.execute("DELETE http://example.com");
    EXPECT_EQ(response, "204 No Content");
}

// Test 4: DELETE on non-blacklisted URL returns 404
TEST_F(CommandManagerTest, DeleteMissingUrlReturnsNotFound) {
    std::string response = manager.execute("DELETE http://notadded.com");
    EXPECT_EQ(response, "404 Not Found");
}

// Test 5: GET on existing URL shows bloom + blacklist status
TEST_F(CommandManagerTest, GetUrlReturnsCorrectBloomAndBlacklistStatus) {
    manager.execute("POST http://example.com");
    std::string response = manager.execute("GET http://example.com");
    EXPECT_EQ(response, "200 Ok\n\ntrue true");
}

// Test 6: GET on non-added URL should return false
TEST_F(CommandManagerTest, GetUrlNotInFilterReturnsFalse) {
    std::string response = manager.execute("GET http://unknown.com");
    EXPECT_EQ(response, "200 Ok\n\nfalse");
}

// Test 7: Invalid command format returns 400
TEST_F(CommandManagerTest, InvalidFormatReturnsBadRequest) {
    std::string response = manager.execute("INVALIDCMD onlyonepart");
    EXPECT_EQ(response, "400 Bad Request");
}

// Test 8: Extra argument returns 400
TEST_F(CommandManagerTest, TooManyArgumentsReturnsBadRequest) {
    std::string response = manager.execute("GET http://a.com extra");
    EXPECT_EQ(response, "400 Bad Request");
}
