#include <gtest/gtest.h>
#include <thread>
#include <chrono>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <sys/socket.h>
#include <unistd.h>
#include <cstring>
#include <memory>
#include "server.h"
#include "StdHashFunction.h"
#include "IHashFunctions.h"

// ===============================
// Utility function to send a command to the server and receive the response
// ===============================
std::string sendCommandToServer(const std::string& command, int port = 54321) {
    // Create a TCP socket
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0) return "socket_error";

    // Setup server address structure
    sockaddr_in serverAddr;
    std::memset(&serverAddr, 0, sizeof(serverAddr));
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_port = htons(port);
    inet_pton(AF_INET, "127.0.0.1", &serverAddr.sin_addr);

    // Attempt to connect to the server
    if (connect(sock, (sockaddr*)&serverAddr, sizeof(serverAddr)) < 0) {
        close(sock);
        return "connect_error";
    }

    // Send the command to the server
    send(sock, command.c_str(), command.size(), 0);

    // Buffer to receive server response
    char buffer[4096];
    std::memset(buffer, 0, sizeof(buffer));
    int bytesRead = recv(sock, buffer, sizeof(buffer) - 1, 0);
    if (bytesRead <= 0) {
        close(sock);
        return "recv_error";
    }

    // Convert received buffer to string
    std::string response(buffer, bytesRead);
    close(sock); // Close socket after communication
    return response;
}

// Global server instance and its thread
Server* globalTestServer = nullptr; // Holds pointer to the server so it's accessible from main and test threads
std::thread serverThread; // Will run server->run() in parallel so tests can execute

// ===============================
// Test 1: Round trip POST command
// ===============================
// Checks that a valid POST returns the correct HTTP-style status
TEST(ServerClientTest, PostCommandRoundTrip) {
    std::string msg = "POST http://example.com\n";
    std::string response = sendCommandToServer(msg);
    EXPECT_EQ(response, "201 Created\n");
}

// ===============================
// Test 2: Malformed command check
// ===============================
// Sends an invalid command and expects a 400 error response
TEST(ServerClientTest, InvalidFormatCommandReturns400) {
    std::string response = sendCommandToServer("INVALIDCMD something\n");
    EXPECT_EQ(response, "400 Bad Request\n");
}

// ===============================
// Test 3: Bloom logic then bad command
// ===============================
// Send a valid POST then a nonsense command to see server handles it correctly
TEST(ServerClientTest, InvalidLogicAfterValidInit) {
    sendCommandToServer("POST http://good.com\n");
    std::string response = sendCommandToServer("BOOM!!\n");
    EXPECT_EQ(response, "400 Bad Request\n");
}

// ===============================
// Fixture-based test class for persistence-related tests
// ===============================
// Sets up consistent state before each test for testing persistence behavior
class PersistentServerTest : public ::testing::Test {
protected:
    void SetUp() override {
        // Add 3 URLs, then delete 1 to simulate server state
        sendCommandToServer("POST http://url1.com\n");
        sendCommandToServer("POST http://url2.com\n");
        sendCommandToServer("POST http://url3.com\n");
        sendCommandToServer("DELETE http://url3.com\n");
    }
};

// ===============================
// Test 4: Simulated persistence check
// ===============================
// Verifies server retains correct state across commands (even though tests are short-lived)
TEST_F(PersistentServerTest, SimulatedPersistenceAcrossSessions) {
    std::string res1 = sendCommandToServer("GET http://url2.com\n");
    EXPECT_EQ(res1, "200 Ok\n\ntrue true\n"); // url2 should exist in bloom + blacklist

    std::string res2 = sendCommandToServer("GET http://url3.com\n");
    EXPECT_EQ(res2, "404 Not Found\n"); // url3 was deleted from blacklist
}

// ===============================
// Main: Initializes the server instance directly
// ===============================
int main(int argc, char **argv) {
    // Build list of hash functions for bloom filter
    std::vector<std::shared_ptr<IHashFunction>> hashFns = {
        std::make_shared<StdHashFunction>()
    };

    // Instantiate the server with chosen port, bloom size, and hashFns
    globalTestServer = new Server(54321, 100, hashFns);

    // Start server loop in a background thread so tests can connect concurrently
    serverThread = std::thread([]() {
        globalTestServer->run();
    });

    // Wait briefly to ensure server has time to bind/listen before tests start
    std::this_thread::sleep_for(std::chrono::milliseconds(200));

    // Launch Google Test suite
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
