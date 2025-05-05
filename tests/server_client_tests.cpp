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
#include "BloomFilter.h"

// ===============================
// Utility: Send one command, receive response
// ===============================
std::string sendCommandToServer(const std::string& command, int port = 54321) {
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0) return "socket_error";

    sockaddr_in serverAddr;
    std::memset(&serverAddr, 0, sizeof(serverAddr));
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_port = htons(port);
    inet_pton(AF_INET, "127.0.0.1", &serverAddr.sin_addr);

    if (connect(sock, (sockaddr*)&serverAddr, sizeof(serverAddr)) < 0) {
        close(sock);
        return "connect_error";
    }

    send(sock, command.c_str(), command.size(), 0);
    char buffer[4096] = {};
    int bytesRead = recv(sock, buffer, sizeof(buffer) - 1, 0);
    close(sock);
    return (bytesRead > 0) ? std::string(buffer, bytesRead) : "recv_error";
}

// Global variables for server
Server* globalTestServer = nullptr;
std::thread serverThread;

// ===============================
// Tests
// ===============================
TEST(ServerClientTest, PostCommandRoundTrip) {
    std::string msg = "POST http://example.com\n";
    std::string response = sendCommandToServer(msg);
    EXPECT_EQ(response, "201 Created\n");
}

TEST(ServerClientTest, InvalidFormatCommandReturns400) {
    std::string response = sendCommandToServer("INVALIDCMD something\n");
    EXPECT_EQ(response, "400 Bad Request\n");
}

TEST(ServerClientTest, InvalidLogicAfterValidInit) {
    sendCommandToServer("POST http://good.com\n");
    std::string response = sendCommandToServer("BOOM!!\n");
    EXPECT_EQ(response, "400 Bad Request\n");
}

// deleting a url that wasnt in the list


class PersistentServerTest : public ::testing::Test {
protected:
    void SetUp() override {
        sendCommandToServer("POST http://url1.com\n");
        sendCommandToServer("POST http://url2.com\n");
        sendCommandToServer("POST http://url3.com\n");
        sendCommandToServer("DELETE http://url3.com\n");
    }
};

TEST_F(PersistentServerTest, SimulatedPersistenceAcrossSessions) {
    std::string res1 = sendCommandToServer("GET http://url2.com\n");
    EXPECT_EQ(res1, "200 Ok\n\ntrue true\n");

    std::string res2 = sendCommandToServer("GET http://url3.com\n");
    EXPECT_TRUE(res2 == "200 Ok\n\nfalse" || res2 == "200 Ok\n\ntrue false");

}

// ===============================
// Entry Point
// ===============================
int main(int argc, char **argv) {
    std::vector<std::shared_ptr<IHashFunction>> hashFns = {
        std::make_shared<StdHashFunction>(3),
        std::make_shared<StdHashFunction>(5)
    };

    BloomFilter bloom(512, hashFns);
    globalTestServer = new Server(54321, bloom);

    serverThread = std::thread([]() {
        globalTestServer->run();
    });

    std::this_thread::sleep_for(std::chrono::milliseconds(200));
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
