## Screenshots

### 1 – Docker / Containers

![All three containers running](screenshots%20for%20gmailsh4/1.%20docker%20all%203%20containers%20working.png)

### 2 – Registration & Validation

![Registration succeeded](screenshots%20for%20gmailsh4/2.%20registration%20success.png)  
![Duplicate-username check](screenshots%20for%20gmailsh4/3.%20cant%20register%20with%20the%20same%20username.png)  
![Weak-password rejection](screenshots%20for%20gmailsh4/4.%20registration%20failure%20because%20Password%20isn't%20safe.png)

### 3 – Light / Dark Modes

![Light vs dark](screenshots%20for%20gmailsh4/5.%20dark%20mode%20vs%20light%20mode.png)  
![Collapsed sidebar](screenshots%20for%20gmailsh4/6.%20dark%20mode%20vs%20light%20mode%20collapsed.png)

### 4 – Sending & Reading Mail

![Sent → Inbox](screenshots%20for%20gmailsh4/7.%20sending%20a%20mail%20from%20one%20user%20to%20another%20(one%20will%20appear%20in%20sent%20the%20other%20in%20inbox).png)  
![Read vs unread](screenshots%20for%20gmailsh4/8.%20a%20difference%20between%20a%20mail%20that%20was%20read%20to%20a%20mail%20which%20is%20marked%20as%20read.png)  
![Starred mail](screenshots%20for%20gmailsh4/9.%20toggle%20a%20mail%20with%20a%20star%20would%20make%20it%20in%20the%20star%20label.png)

### 5 – Label Management

![Create labels](screenshots%20for%20gmailsh4/10.%20creating%203%20more%20labels%20named%20work%20project%20and%20school.png)  
![Mail view](screenshots%20for%20gmailsh4/11.%20mail%20view.png)  
![Assign labels in mail view](screenshots%20for%20gmailsh4/12.%20we%20can%20like%20labels%20through%20the%20mailview%20(including%20the%20mails%20we%20just%20have%20created).png)  
![Work-label inbox](screenshots%20for%20gmailsh4/13.%20work%20is%20labeled%20so%20we%20can%20see%20it%20in%20the%20Work%20labels.png)  
![Bulk read / label](screenshots%20for%20gmailsh4/14.%20we%20can%20mark%20all%20mails%20read%20or%20other%20label.png)

### 6 – Search & Tokens

![Search box](screenshots%20for%20gmailsh4/15.%20search%20functionality.png)  
![JWT present](screenshots%20for%20gmailsh4/16.%20having%20a%20unique%20token%20(jwt)%20for%20each%20user%20logged%20in%20before%20logging%20out.png)  
![JWT cleared](screenshots%20for%20gmailsh4/17.%20no%20jwt%20after%20logging%20out.png)

### 7 – Spam Detection

![Initial spam mail](screenshots%20for%20gmailsh4/18.%20having%20a%20bad%20url%20in%20the%20spam.png)  
![Repeated spam auto-filtered](screenshots%20for%20gmailsh4/19.%20sending%20the%20same%20bad%20url%20in%20a%20different%20mail%20and%20it%20goes%20directly%20to%20spam.png)



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
