# Use official Ubuntu base image
FROM ubuntu:22.04

# Install necessary packages and GoogleTest
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    git \
    libgtest-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Compile GoogleTest (libgtest-dev only provides source)
RUN cd /usr/src/gtest && cmake . && make && cp lib/libgtest*.a /usr/lib

# Set the working directory inside the container
WORKDIR /app

# Copy local project files into the container
COPY . .

# Build the project using the provided Makefile
RUN make clean && make

# Default command: run the test runner
CMD ["./main"]
