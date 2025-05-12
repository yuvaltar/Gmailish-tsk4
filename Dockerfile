FROM ubuntu:22.04

# Install dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    git \
    python3 \
    libgtest-dev \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

# Build Google Test
RUN cd /usr/src/gtest && cmake . && make && cp lib/libgtest*.a /usr/lib

# Set working directory
WORKDIR /app

# Copy all files
COPY . .

# Build everything using your Makefile
RUN make clean && make

# This is the fix — always run ./server and allow args
ENTRYPOINT ["./server"]
