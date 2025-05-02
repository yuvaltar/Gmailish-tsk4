# Compiler and flags
CXX = g++
CXXFLAGS = -std=c++17 -Wall -I../src -I../third_party/googletest/googletest/include
LDFLAGS = -pthread

# Directories
GTEST_DIR = ../third_party/googletest/googletest
BUILD_DIR = ../build
GTEST_LIB = $(BUILD_DIR)/libgtest.a

# Source files for the main program and tests
SRC = ../src/BloomFilter/BloomFilter.cpp \
      ../src/BloomFilter/BlackList.cpp \
      ../src/BloomFilter/url.cpp \
      ../src/server/server.cpp \
      ../src/server/SessionHandler.cpp \
      ../src/server/CommandManager.cpp

TEST_SRC = server/server_client_tests.cpp

# Output binary
TEST_TARGET = test_runner

# Default target builds the test runner
all: $(TEST_TARGET)

# Build the test runner
$(TEST_TARGET): $(TEST_SRC) $(SRC) $(GTEST_LIB)
    $(CXX) $(CXXFLAGS) -o $@ $^ $(LDFLAGS)

# Build Google Test library
$(GTEST_LIB):
    @mkdir -p $(BUILD_DIR)
    $(CXX) -std=c++17 -isystem $(GTEST_DIR)/include -I$(GTEST_DIR) -pthread -c $(GTEST_DIR)/src/gtest-all.cc -o $(BUILD_DIR)/gtest-all.o
    ar rcs $(GTEST_LIB) $(BUILD_DIR)/gtest-all.o

# Run tests
run_tests: $(TEST_TARGET)
    ./$(TEST_TARGET)

# Clean build artifacts
clean:
    rm -rf $(BUILD_DIR) *.o $(TEST_TARGET)

.PHONY: all clean run_tests