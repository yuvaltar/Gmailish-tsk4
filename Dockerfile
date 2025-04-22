
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
>>>>>>> caaf22d612d1d7677442205fa401ffb765417402

# Install build tools and required packages
RUN apt-get update && apt-get install -y \
    g++ \
    cmake \
    make \
    git \
    libgtest-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Compile GoogleTest since libgtest-dev only provides source
RUN cd /usr/src/gtest && cmake . && make && cp lib/libgtest*.a /usr/lib

# Set working directory
WORKDIR /app

# Copy project files into the container
COPY . .

# Compile using your Makefile
RUN make clean && make all

# Allow choosing the run command (main or test_runner)
CMD ["./main"]

#docker run --rm myproject ./test_runner

#docker run --rm myproject ./main

#docker build -t myproject .
