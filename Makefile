#make file
# Compiler
CXX = g++
CXXFLAGS = -std=c++17 -Wall -Isrc

# Source files
SRC = src/main.cpp \
      src/BloomFilter.cpp \
      src/BlackList.cpp \
      src/HashFunctions.cpp \
      src/url.cpp

OBJ = $(SRC:.cpp=.o)

# Output binary name
TARGET = main

# Build rule
$(TARGET): $(OBJ)
	$(CXX) $(CXXFLAGS) -o $(TARGET) $(OBJ)

# Clean up
clean:
	rm -f $(OBJ) $(TARGET)