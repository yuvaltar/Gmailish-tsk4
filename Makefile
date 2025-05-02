# Compiler and flags
CXX = g++
CXXFLAGS = -std=c++17 -Wall -Isrc
LDFLAGS = -pthread

# Source files for the main program
SRC = src/main.cpp \
      src/BloomFilter/BloomFilter.cpp \
      src/BloomFilter/BlackList.cpp \
      src/BloomFilter/url.cpp \
      src/server/server.cpp \
      src/server/SessionHandler.cpp \
      src/server/CommandManager.cpp

# Output binary
TARGET = server

# Default target builds the main program
all: $(TARGET)

# Build the main program
$(TARGET): $(SRC)
    $(CXX) $(CXXFLAGS) -o $@ $^

# Clean build artifacts
clean:
    rm -f $(TARGET)

.PHONY: all clean