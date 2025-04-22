
# Use latest official GCC image
FROM gcc:13

# Set work directory
WORKDIR /app

# Install cmake and git (for Google Test)
RUN apt-get update && \
    apt-get install -y cmake git && \
    apt-get clean

# Copy the full project into the container
COPY . .

# Clone Google Test into third_party
RUN git clone https://github.com/google/googletest.git third_party/googletest

# Build Google Test manually
RUN mkdir -p third_party/googletest/build && \
    cd third_party/googletest && \
    cmake -S . -B build && \
    cmake --build build && \
    cp build/lib/libgtest*.a /usr/lib && \
    cp -r googletest/include/gtest /usr/include/gtest

# Compile everything via your Makefile
RUN make all

# Default run command (edit if you want to
