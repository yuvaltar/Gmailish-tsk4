# Use an official Ubuntu image with build tools
FROM ubuntu:22.04

# Install dependencies
RUN apt-get update && apt-get install -y \
    g++ \
    cmake \
    make \
    git \
    libgtest-dev \
    && rm -rf /var/lib/apt/lists/*

# Build GoogleTest (libgtest-dev provides only the source)
RUN cd /usr/src/gtest && cmake . && make && cp lib/*.a /usr/lib

# Set working directory
WORKDIR /app

# Copy everything to the container
COPY . .

# Build the project using your Makefile
RUN make

# Set default command to run tests
CMD ["./test_runner"]

