# # Compiler and flags
# CXX = g++
# CXXFLAGS = -std=c++17 -Wall -Isrc -Itests -I/mingw64/include
# LDFLAGS = -pthread
# GTEST_LIBS = -L/mingw64/lib -lgtest -lgtest_main $(LDFLAGS)

# # Output binaries
# TARGET = main
# TEST_TARGET = test_runner

# # Source files for main program
# SRC = src/main.cpp \
#       src/BloomFilter.cpp \
#       src/BlackList.cpp \
#       src/url.cpp

# OBJ = $(SRC:.cpp=.o)

# # Source files for tests
# TEST_SRC = tests/tests.cpp
# TEST_OBJ = $(TEST_SRC:.cpp=.o)

# # Default target builds the main program
# all: $(TARGET) $(TEST_TARGET)

# # Build the main program
# $(TARGET): $(OBJ)
# 	$(CXX) $(CXXFLAGS) -o $@ $^

# # Build the test runner (with all necessary files)
# $(TEST_TARGET): $(TEST_SRC) src/BloomFilter.cpp src/BlackList.cpp src/url.cpp
# 	$(CXX) $(CXXFLAGS) -o $@ $^ $(GTEST_LIBS)

# # Run tests
# run_tests: $(TEST_TARGET)
# 	./$(TEST_TARGET)

# # Clean all build artifacts
# clean:
# 	rm -f $(OBJ) $(TEST_OBJ) $(TARGET) $(TEST_TARGET)

# .PHONY: all clean run_tests

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

# All non-main sources (for tests)
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

# Default target
all: run

# Build main program
$(MAIN_TARGET): $(MAIN_SRC)
	$(CXX) $(CXXFLAGS) $(INCLUDES) -o $@ $^

# Run the main program
run: $(MAIN_TARGET)
	./$(MAIN_TARGET)

# Build test runner (exclude main.cpp)
$(TEST_TARGET): $(TEST_SRC) $(SRC_NO_MAIN) $(GTEST_LIB)
	$(CXX) $(CXXFLAGS) $(INCLUDES) -o $@ $^ $(LDFLAGS)

# Run tests
test: run_tests

run_tests: $(TEST_TARGET)
	./$(TEST_TARGET)

# Build GTest static lib
$(GTEST_LIB):
	@mkdir -p $(BUILD_DIR)
	$(CXX) -std=c++17 -isystem $(GTEST_DIR)/include -I$(GTEST_DIR) -pthread \
        -c $(GTEST_DIR)/src/gtest-all.cc -o $(BUILD_DIR)/gtest-all.o
	ar rcs $(GTEST_LIB) $(BUILD_DIR)/gtest-all.o

# Clean
clean:
	rm -rf $(BUILD_DIR) *.o $(MAIN_TARGET) $(TEST_TARGET)
