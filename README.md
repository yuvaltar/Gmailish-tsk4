# advanced_programing_tsk1
https://github.com/yuvaltar/advanced_programing_tsk1.git


# Ex1 – Bloom Filter URL Blacklist

This project implements a URL filtering system using a Bloom Filter.
It was designed following SOLID principles, and Test-Driven Development (TDD)
was used

## How It Works

- After every update, the Bloom filter (its bit array) is saved to `data/bloomfilter.bin`.

## How to Build and Run

### Option 1: Manual Build (requires a C++17 compiler)

From the project root run:
```bash
make clean 
make
./main  
./test_runner

### Option 2: Using Docker

1. Build the image:
```bash
docker build -t bloom-filter-url .

2. run the project:
docker run --rm bloom-filter-url