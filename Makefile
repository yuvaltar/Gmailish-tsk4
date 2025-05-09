# Compiler and flags
CXX = g++
CXXFLAGS = -std=c++17 -Wall -Isrc/BloomFilter -Isrc/server

# C++ source files for the server
SERVER_SRC = \
    src/main.cpp \
    src/BloomFilter/BloomFilter.cpp \
    src/BloomFilter/BlackList.cpp \
    src/BloomFilter/url.cpp \
    src/server/server.cpp \
    src/server/SessionHandler.cpp \
    src/server/CommandManager.cpp

# Output binary
SERVER_TARGET = server

# Default: compile the server
all: $(SERVER_TARGET)

# Compile the server
$(SERVER_TARGET): $(SERVER_SRC)
	$(CXX) $(CXXFLAGS) -o $@ $^

# Run the Python client
run_client:
	python3 src/client.py

# Clean all compiled files
clean:
	rm -f $(SERVER_TARGET)

.PHONY: all clean run_client
