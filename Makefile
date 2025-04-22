# Compiler
CXX = g++
CXXFLAGS = -std=c++17 -Wall -Isrc -Itests -I/mingw64/include

# Google Test library flags
GTEST_LIBS = -L/mingw64/lib -lgtest -lgtest_main -pthread

# Source files for main program
SRC = src/main.cpp \
      src/BloomFilter.cpp \
      src/BlackList.cpp \
      src/HashFunctions.cpp \
      src/url.cpp

OBJ = $(SRC:.cpp=.o)

# Source files for tests
TEST_SRC = tests/BloomFilterTests.cpp

# Output binary names
TARGET = main
TEST_TARGET = test_runner

# Default target
all: $(TARGET)

# Build the main program
$(TARGET): $(OBJ)
	$(CXX) $(CXXFLAGS) -o $(TARGET) $(OBJ)

# Build the test runner
$(TEST_TARGET): $(TEST_SRC) src/BloomFilter.cpp src/BlackList.cpp src/HashFunctions.cpp src/url.cpp
	$(CXX) $(CXXFLAGS) -o $(TEST_TARGET) $^ $(GTEST_LIBS)

# Clean all build artifacts
clean:
	rm -f $(OBJ) $(TARGET) $(TEST_TARGET)

.PHONY: all clean
