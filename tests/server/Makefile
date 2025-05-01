# Makefile in tests/server/

# Compiler and flags
CXX = g++
CXXFLAGS = -std=c++17 -Wall -I../../src -I../../src/BloomFilter -I../../src/server -I../../third_party/googletest/googletest/include

# Directories
ROOT_DIR = ../..
SRC_DIR = $(ROOT_DIR)/src
GTEST_DIR = $(ROOT_DIR)/third_party/googletest/googletest
BUILD_DIR = $(ROOT_DIR)/build
GTEST_LIB = $(BUILD_DIR)/libgtest.a

# Source and test files
SRC_FILES = $(wildcard $(SRC_DIR)/BloomFilter/*.cpp) $(wildcard $(SRC_DIR)/server/*.cpp)
TEST_FILES = server_client_tests.cpp tests.cpp

# Output
TARGET = test_runner

# Default target
all: $(TARGET)

$(TARGET): $(GTEST_LIB) $(SRC_FILES) $(TEST_FILES)
	$(CXX) $(CXXFLAGS) -pthread $(SRC_FILES) $(TEST_FILES) $(GTEST_LIB) -o $(TARGET)

# Build GTest
$(GTEST_LIB):
	@mkdir -p $(BUILD_DIR)
	$(CXX) -std=c++17 -isystem $(GTEST_DIR)/include -I$(GTEST_DIR) -pthread -c $(GTEST_DIR)/src/gtest-all.cc -o $(BUILD_DIR)/gtest-all.o
	ar rcs $(GTEST_LIB) $(BUILD_DIR)/gtest-all.o

# Cleanup
clean:
	rm -rf $(BUILD_DIR) *.o $(TARGET)
