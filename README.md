Gmailish-tsk4: Full-Stack Gmail-Inspired Messaging Platform
GitHub Repository
https://github.com/yuvaltar/Gmailish-tsk4.git

Table of Contents
Overview

Features

Architecture

How It Works

Supported API Routes

Persistence

Building and Running

Docker Setup

Screenshots

Code Structure

Jira Link

Authors

Overview
Gmailish-tsk4 is a comprehensive full-stack messaging platform that brings together the robust backend from task 3 with a modern React frontend. This Gmail-inspired application delivers a complete user experience with real-time messaging, intelligent spam filtering, and responsive design. The system combines a RESTful Node.js backend, a dynamic React frontend, and a high-performance C++ Bloom Filter service for URL blacklisting - all orchestrated through Docker for seamless deployment and scalability.

Features
🎨 Modern User Interface

Dark mode and light mode toggle

Responsive sidebar with collapse functionality (hamburger menu)

Gmail-inspired design and layout

Real-time updates without page refreshes

📧 Email Management

Complete inbox management with read/unread status

Label-based organization system

Default labels: Starred, Archived, Deleted, Drafts, and more

Pagination system (50 mails per page with navigation arrows)

Email composition and editing capabilities

🛡️ Security & Authentication

JWT-based authentication with 2-hour session duration

Strong password requirements (8+ characters, uppercase, lowercase, number, special character)

Username uniqueness validation

Secure user registration and login

🚫 Intelligent Spam Protection

Advanced spam detection using Bloom Filter technology

URL-based blacklisting - emails containing flagged URLs automatically go to spam

Real-time spam classification and filtering

👤 User Profile Management

Profile picture upload and display

Comprehensive user registration with validation

Persistent user sessions with JWT tokens

⚡ Performance & Scalability

Component-based React architecture for optimal rendering

Real-time data fetching and updates

Modular backend with RESTful API design

Architecture
The system follows a modern three-tier architecture:

Frontend Layer (React - Port 3001)

Component-based UI with pages and reusable components

State management using React hooks

Real-time communication with backend APIs

Responsive design with theme switching capabilities

Backend Layer (Express.js - Port 3000)

RESTful API server handling all business logic

JWT-based authentication middleware

In-memory data storage for users, emails, and labels

Integration with Bloom Filter service for spam detection

Filter Service Layer (C++ - Port 4000)

High-performance Bloom Filter implementation

TCP server for URL blacklist management

Persistent blacklist data storage

Real-time spam URL detection and classification

How It Works
The Gmailish platform orchestrates seamless communication between its three core services. Users interact with the intuitive React frontend, which communicates with the Express backend through secure JWT-authenticated API calls. The backend processes all email operations, user management, and label organization while consulting the C++ Bloom Filter service for intelligent spam detection. When emails are sent, URLs within the content are analyzed against the blacklist, and suspicious emails are automatically routed to the spam folder. The system maintains session persistence through JWT tokens, allowing users to stay logged in for up to 2 hours without re-authentication.

Supported API Routes
The backend maintains the same comprehensive RESTful API from task 3, including:

User Management: Registration, authentication, and profile operations

Email Operations: Send, receive, update, delete, and search functionality

Label Management: Create, update, delete, and organize email labels

Blacklist Control: Add/remove URLs from spam detection system

Authentication: JWT token generation and validation

All routes are secured with appropriate authentication middleware and input validation.

Persistence
Currently, the application uses an in-memory storage system:

Application Data: Users, emails, and labels are stored in memory on the web server

Blacklist Data: Persistently stored by the Bloom Filter service to disk

Session Data: JWT tokens manage user sessions with 2-hour expiration

Note: Application data is reset upon server restart

Building and Running
Local Development
Prerequisites: Node.js, npm, and a Linux environment for the C++ Bloom Filter service.

1. Start the React Frontend

bash
cd react
npm start
Runs on port 3001

2. Start the Express Backend

bash
cd server  
node app.js
Runs on port 3000

3. Start the Bloom Filter Service (Linux only)

bash
cd src
g++ main.cpp BloomFilter/BloomFilter.cpp BloomFilter/BlackList.cpp BloomFilter/url.cpp server/server.cpp server/SessionHandler.cpp server/CommandManager.cpp -I. -IBloomFilter -Iserver -o cpp_server -pthread -std=gnu++17

./cpp_server 4000 1024 3 5
Runs on port 4000

Access the Application
Navigate to http://localhost:3001 to access the Gmailish platform.

Docker Setup
Build and Run All Services
# Build and start all containers
docker-compose up --build

# Run without rebuilding 
docker-compose up

Screenshots
[Screenshots section to be populated with application interface images showing login, inbox, compose, dark/light modes, etc.]

Code Structure

Jira Link
Project planning and task tracking are managed in Jira:

[Jira link to be provided]

Authors

Yuval Tarnopolsky
Tal Amitay
Itay Smouha
