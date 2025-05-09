# Dockerfile

FROM gcc:13

WORKDIR /app

# Install Python and Git
RUN apt-get update && \
    apt-get install -y python3 git cmake make

# Copy everything into the container
COPY . .

# Build Google Test (if not precompiled)
RUN mkdir -p build && \
    g++ -std=c++17 -isystem third_party/googletest/googletest/include -Ithird_party/googletest/googletest -pthread \
    -c third_party/googletest/googletest/src/gtest-all.cc -o build/gtest-all.o && \
    ar rcs build/libgtest.a build/gtest-all.o

# Compile all binaries
RUN make all

# Set default command to bash so you can run tests or server manually
CMD ["bash"]
