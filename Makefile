# Compiler and flags
CXX = g++
CXXFLAGS = -std=c++17 -Wall
LDFLAGS = -pthread

# Directories
SRC_DIR = src
BUILD_DIR = build
GTEST_DIR = third_party/googletest/googletest
GTEST_LIB = $(BUILD_DIR)/libgtest.a

# Includes
INCLUDES = -I$(SRC_DIR)/BloomFilter -I$(SRC_DIR)/server -I$(GTEST_DIR)/include

# Source files
MAIN_SRC = \
    $(SRC_DIR)/main.cpp \
    $(SRC_DIR)/BloomFilter/BloomFilter.cpp \
    $(SRC_DIR)/BloomFilter/BlackList.cpp \
    $(SRC_DIR)/BloomFilter/url.cpp \
    $(SRC_DIR)/server/server.cpp \
    $(SRC_DIR)/server/SessionHandler.cpp \
    $(SRC_DIR)/server/CommandManager.cpp

# All non-main sources (for test_runner)
SRC_NO_MAIN = \
    $(SRC_DIR)/BloomFilter/BloomFilter.cpp \
    $(SRC_DIR)/BloomFilter/BlackList.cpp \
    $(SRC_DIR)/BloomFilter/url.cpp \
    $(SRC_DIR)/server/server.cpp \
    $(SRC_DIR)/server/SessionHandler.cpp \
    $(SRC_DIR)/server/CommandManager.cpp

# Test sources
TEST_SRC = tests/server_client_tests.cpp

# Targets
MAIN_TARGET = server
TEST_TARGET = test_runner

# Default target: build only (DO NOT RUN for Docker safety)
all: $(MAIN_TARGET) $(TEST_TARGET)

# Build main server binary
$(MAIN_TARGET): $(MAIN_SRC)
	$(CXX) $(CXXFLAGS) $(INCLUDES) -o $@ $^ $(LDFLAGS)

# Build test runner binary (no main.cpp)
$(TEST_TARGET): $(TEST_SRC) $(SRC_NO_MAIN) $(GTEST_LIB)
	$(CXX) $(CXXFLAGS) $(INCLUDES) -o $@ $^ $(LDFLAGS)

# Build Google Test static library
$(GTEST_LIB):
	@mkdir -p $(BUILD_DIR)
	$(CXX) -std=c++17 -isystem $(GTEST_DIR)/include -I$(GTEST_DIR) -pthread \
		-c $(GTEST_DIR)/src/gtest-all.cc -o $(BUILD_DIR)/gtest-all.o
	ar rcs $(GTEST_LIB) $(BUILD_DIR)/gtest-all.o

# Run server manually
run: $(MAIN_TARGET)
	./$(MAIN_TARGET)

# Run tests manually
run_tests: $(TEST_TARGET)
	./$(TEST_TARGET)

# Alias for run_tests
test: run_tests

# Clean all artifacts
clean:
	rm -rf $(BUILD_DIR) *.o $(MAIN_TARGET) $(TEST_TARGET)

.PHONY: all clean run test run_tests
