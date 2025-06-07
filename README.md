Gmailish-tsk3: Multi-Service Gmail-Inspired Messaging System
GitHub Repository
[https://github.com/yuvaltar/Gmailish-tsk3.git]

Table of Contents
Overview
Features
Architecture
How It Works
Supported API Routes
Curl Examples
Persistence
Building and Running
Docker Setup
Screenshots
Code Structure
Jira Link
Authors
Overview
Gmailish-tsk3 is a RESTful Node.js + Docker-based messaging system inspired by Gmail. It supports user registration/login, inbox management, label-based organization, and spam protection via a Bloom Filter microservice.

Features
✅ RESTful MVC Node.js backend (no frontend views)
✅ In-memory data store (users, mails, labels)
✅ Blacklist persisted by Bloom Filter server
✅ Multi-thread-style architecture
✅ Mail content filtering using a connected Bloom Filter microservice
✅ Dockerized services: Web, BloomFilter, Client
✅ Modular, SOLID-compliant design
Architecture
Web Service (Node.js): REST API for users, mails, labels, and blacklist.
BloomFilter Service: TCP server filtering URLs and saving blacklist data.
Communication: Internal network via Docker Compose.
How It Works
User registers via /api/users with details like firstName, lastName, username, password, birthdate, etc.
Login generates a token (simulated via ID) using /api/tokens.
Sending mails validates recipients and checks URLs against the Bloom filter.
Labels can be created, edited, and assigned.
Blacklist filters malicious URLs and supports POST/DELETE operations via the Bloom server.
Supported API Routes
Users
POST /api/users — Register a user
GET /api/users/:id — Get user by ID
Tokens
POST /api/tokens — Log in and validate credentials
Mails
GET /api/mails — Get inbox mails
POST /api/mails — Send mail (checks URL via Bloom filter)
GET /api/mails/:id — Get specific mail
PATCH /api/mails/:id — Update a mail
DELETE /api/mails/:id — Delete a mail
GET /api/mails/search/:query — Search mails by content
Labels
GET /api/labels — List all labels
POST /api/labels — Create a new label
GET /api/labels/:id — Get label by ID
PATCH /api/labels/:id — Rename label
DELETE /api/labels/:id — Delete label
Blacklist
POST /api/blacklist — Add URL to blacklist
DELETE /api/blacklist/:id — Remove URL
Curl Examples
Below are common curl commands to exercise each endpoint. Replace placeholders (<USER_ID>, <TOKEN>, <MAIL_ID>, etc.) with actual IDs/tokens obtained from previous steps.

Register User
curl -i -X POST http://localhost:3000/api/users \
-H "Content-Type: application/json" \
-d '{"firstName": "Yuval", "lastName": "Tarnopolsky", "username": "yuval", "gender": "male", "password": "1234", "birthdate": "2000-05-01"}'


Get User by ID
curl -i http://localhost:3000/api/users/<USER_ID>

Login
curl -i -X POST http://localhost:3000/api/tokens \
-H "Content-Type: application/json" \
-d '{"username": "yuval", "password": "1234"}'


Send Mail
curl -i -X POST http://localhost:3000/api/mails \
-H "Content-Type: application/json" \
-H "X-User-Id: <SENDER_USER_ID>" \
-d '{"to": "<RECIPIENT_USER_ID>", "subject": "Hello", "content": "This is the message content"}'


Get Inbox
curl -i -X GET http://localhost:3000/api/mails \
-H "X-User-Id: <USER_ID>"


Get Mail by ID
curl -i -X GET http://localhost:3000/api/mails/<MAIL_ID> \
-H "X-User-Id: <USER_ID>"


Delete Mail
curl -i -X DELETE http://localhost:3000/api/mails/<MAIL_ID> \
-H "X-User-Id: <SENDER_USER_ID>"


Update Mail
curl -i -X PATCH http://localhost:3000/api/mails/<MAIL_ID> \
-H "Content-Type: application/json" \
-H "X-User-Id: <SENDER_USER_ID>" \
-d '{"subject": "Updated subject", "content": "Updated content"}'


Search Mail
curl -i -H "X-User-Id: <USER_ID>" \
http://localhost:3000/api/mails/search/<QUERY>
Add URL to Blacklist
curl -i -X POST http://localhost:3000/api/blacklist \
-H "Content-Type: application/json" \
-d '{"id": "http://example.com/bad6"}'


Remove URL from Blacklist
curl -i -X DELETE http://localhost:3000/api/blacklist/http%3A%2F%2Fexample.com%2Fbad5
Label Operations


Get all labels:
curl -i -H "X-User-Id: <USER_ID>" http://localhost:3000/api/labels


Create label:

curl -i -X POST http://localhost:3000/api/labels \
-H "Content-Type: application/json" \
-H "X-User-Id: <USER_ID>" \
-d '{"name": "Work"}'


Update label:

curl -i -X PATCH http://localhost:3000/api/labels/<LABEL_ID> \
-H "Content-Type: application/json" \
-H "X-User-Id: <USER_ID>" \
-d '{"name": "Work & Projects"}'
Get label by ID:

curl -i -H "X-User-Id: <USER_ID>" http://localhost:3000/api/labels/<LABEL_ID>


Delete label:

curl -i -X DELETE http://localhost:3000/api/labels/<LABEL_ID> \
-H "X-User-Id: <USER_ID>"
Persistence
All application data (users, mails, labels) is stored in-memory on the web server. It is lost upon server restart.
The blacklist is persisted by the Bloom Filter server to disk automatically.
Building and Running
Run Locally
cd web
npm install
node app.js
The server will start on port 3000 by default. You can then use the curl examples above to exercise each endpoint.

Docker Setup
We can run the entire system via Docker Compose. Below are the commands along with accompanying screenshots.

1. Build Docker Images
docker-compose build
1. Docker Build

1. Docker Build cont.

2. Start All Services
docker-compose up
2. Docker Compose and Run
.
├── web/
│   ├── controllers/
│   │   ├── AuthController.js
│   │   ├── LabelController.js
│   │   ├── MailController.js
│   │   ├── UserController.js
│   │   └── BlacklistController.js
│   ├── middlewares/
│   │   └── authMiddleware.js
│   ├── models/
│   │   └── InMemoryStore.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── labelRoutes.js
│   │   ├── mailRoutes.js
│   │   ├── userRoutes.js
│   │   └── blacklistRoutes.js
│   ├── services/
│   │   └── TokenService.js
│   ├── server.js
│   └── app.js
├── bloomfilter-service/
│   ├── BloomFilterServer.js
│   └── data/        # persisted Bloom filter data
├── docker-compose.yml
├── Dockerfile.web
├── Dockerfile.bloomfilter
└── README.md         # <— this file
Jira Link
Project planning and task tracking are managed in Jira:
https://yuvaltarno1337.atlassian.net/jira/software/projects/GIT3/boards/100/timeline

Authors
Yuval Tarnopolsky
Tal Amitay
Itay Smouha