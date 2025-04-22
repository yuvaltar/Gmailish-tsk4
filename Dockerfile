# Use official Ubuntu with build tools
FROM ubuntu:22.04

# Install required packages and GoogleTest source
RUN apt-get update && apt-get install -y \
    g++ \
    cmake \
    make \
    git \
    libgtest-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Compile GoogleTest since libgtest-dev only gives source
RUN cd /usr/src/gtest && cmake . && make && \
    cp lib/libgtest*.a /usr/lib

# Set the working directory inside the container
WORKDIR /app

# Copy local project files into the container
COPY . .

# Build the project using the provided Makefile
RUN make clean && make

# Default command: run test suite
CMD ["./test_runner"]
