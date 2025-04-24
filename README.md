# advanced_programing_tsk1
GitHub Repository: https://github.com/yuvaltar/advanced_programing_tsk1.git

# Ex1 – Bloom Filter URL Blacklist

This project implements a URL filtering system using a Bloom Filter to efficiently manage and query blacklisted URLs. It was built using SOLID object-oriented design principles and follows a Test-Driven Development (TDD) workflow to ensure correctness and robustness, especially in edge and extreme cases.

## How It Works:

The project provides a hybrid filtering system based on:

1. A Bloom Filter – a probabilistic data structure optimized for space and speed, allowing fast lookups with a small probability of false positives.

2. An Exact Matching List (BlackList) – for exact verification in case of positive hits from the Bloom Filter.

## Program Stages:

At startup, the program loads a previously saved Bloom filter from data/bloomfilter.bin (if available) and an exact blacklist from data/blacklist.txt.

The first line of user input should define:

The size of the Bloom filter (bit array)

A list of integers, each representing the number of iterations for a separate hash function.

The program then enters a loop, reading commands in the format:
<command_id> <url>

For example:
1 example.com → adds the URL to both the Bloom filter and the exact blacklist.
2 example.com → checks if the URL possibly exists in the Bloom filter, and if so, confirms it using the exact list.

Upon each update (specifically on each addition), the Bloom filter is saved to data/bloomfilter.bin, and the exact list is saved to data/blacklist.txt.

### How to Build and Run:

You can build and run the project in two main ways:

#### Option 1: Manual Build (requires a C++17 compiler)

You can run the program either in interactive mode with your own input (main), or run the automated test suite (test_runner) which verifies functionality and edge cases.

From the project root, use the following commands:

make clean
make
./main

Example usage: 16 5 4 7 → sets Bloom filter size to 16, with hash functions using 5, 4, and 7 iterations
1 https://example.com → adds the URL to the filter
2 https://example.com → checks if the URL is in the filter and confirms against the exact list

To run the test version instead:

make clean
make
./test_runner

Sample Outputs:
Running the main program: (see ./images/main_run.png)
(Another example of the main program): (see ./images/second_test_run.png)
Running the test version: (see ./images/tests_run.png)

#### Option 2: Using Docker

Docker allows a fully isolated and portable environment to build and run the project regardless of local setup.

To build the Docker image: 
docker build -t bloom-filter-url .

To run the main program (default): 
docker run -it --rm bloom-filter-url

This runs the main program in interactive mode. You can type input directly into the terminal as described above.

To run the test runner:
docker run --rm bloom-filter-url ./test_runner

This runs the automated test version inside the Docker container.

#### Folder Structure:

src/ – core implementation files (BloomFilter, URL class, etc.)
tests/ – Google Test unit test files
data/ – contains the persisted Bloom filter and blacklist
Dockerfile – Docker configuration
Makefile – build configuration
main.cpp – main application logic (interactive)
test_runner.cpp – test entry point

##### Author Information:

Yuval Tarnopolsky
Tal Amitay
Itay Smouha