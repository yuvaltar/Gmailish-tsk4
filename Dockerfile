# Use a base image with g++ and Python
FROM ubuntu:22.04

# Install dependencies
RUN apt update && apt install -y g++ make python3 python3-pip

# Create and switch to app directory
WORKDIR /app

# Copy entire project into the container
COPY . .

# Build the server using your Makefile
RUN make

# Expose the server port
EXPOSE 54321

# Start the server with desired parameters
CMD ["./server", "54321", "1000", "123", "456"]
