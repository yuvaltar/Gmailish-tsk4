# Compiler
CXX = g++
CXXFLAGS = -std=c++17 -Wall -Isrc

# Source files
SRC = src/main.cpp \
      src/BloomFilter.cpp \
      src/BlackList.cpp \
      src/url.cpp

OBJ = $(SRC:.cpp=.o)

# Output binary name
TARGET = main
TEST_TARGET = test_runner

# Default target
all: $(TARGET)

# Build rule
$(TARGET): $(OBJ)
	$(CXX) $(CXXFLAGS) -o $@ $^

# Test binary rule
test: $(TEST_TARGET)
	./$(TEST_TARGET)

$(TEST_TARGET): $(TEST_OBJ)
	$(CXX) $(CXXFLAGS) -o $@ $^ third_party/googletest/googletest/src/gtest-all.cc $(LDFLAGS)

# Clean up
clean:
	rm -f $(OBJ) $(TARGET)