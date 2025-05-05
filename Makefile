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

CXX = g++
CXXFLAGS = -std=c++17 -Wall -Isrc/BloomFilter -Isrc/server

SRC = \
    src/main.cpp \
    src/BloomFilter/BloomFilter.cpp \
    src/BloomFilter/BlackList.cpp \
    src/BloomFilter/url.cpp \
    src/server/server.cpp \
    src/server/SessionHandler.cpp \
    src/server/CommandManager.cpp

TARGET = server

all: $(TARGET)

$(TARGET): $(SRC)
	$(CXX) $(CXXFLAGS) -o $@ $^

clean:
	rm -f $(TARGET)
