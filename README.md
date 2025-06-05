# Gmailish-tsk3: Multi-Service Gmail-Inspired Messaging System

## GitHub Repository

[https://github.com/yuvaltar/Gmailish-tsk3.git]

---

## Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Architecture](#architecture)
* [How It Works](#how-it-works)
* [Supported API Routes](#supported-api-routes)
* [Curl Examples](#curl-examples)
* [Persistence](#persistence)
* [Building and Running](#building-and-running)
* [Docker Setup](#docker-setup)
* [Screenshots](#screenshots)
* [Code Structure](#code-structure)
* [Jira Link](#jira-link)
* [Authors](#authors)

---

## Overview

**Gmailish-tsk3** is a RESTful Node.js + Docker-based messaging system inspired by Gmail. It supports user registration/login, inbox management, label-based organization, and spam protection via a Bloom Filter microservice.

---

## Features

* ✅ RESTful MVC Node.js backend (no frontend views)  
* ✅ In-memory data store (users, mails, labels)  
* ✅ Blacklist persisted by Bloom Filter server  
* ✅ Multi-thread-style architecture  
* ✅ Mail content filtering using a connected Bloom Filter microservice  
* ✅ Dockerized services: Web, BloomFilter, Client  
* ✅ Modular, SOLID-compliant design  

---

## Architecture

* **Web Service (Node.js)**: REST API for users, mails, labels, and blacklist.  
* **BloomFilter Service**: TCP server filtering URLs and saving blacklist data.  
* **Communication**: Internal network via Docker Compose.  

---

## How It Works

1. **User registers** via `/api/users` with details like firstName, lastName, username, password, birthdate, etc.  
2. **Login** generates a token (simulated via ID) using `/api/tokens`.  
3. **Sending mails** validates recipients and checks URLs against the Bloom filter.  
4. **Labels** can be created, edited, and assigned.  
5. **Blacklist** filters malicious URLs and supports POST/DELETE operations via the Bloom server.  

---

## Supported API Routes

### Users

* `POST /api/users` — Register a user  
* `GET /api/users/:id` — Get user by ID  

### Tokens

* `POST /api/tokens` — Log in and validate credentials  

### Mails

* `GET /api/mails` — Get inbox mails  
* `POST /api/mails` — Send mail (checks URL via Bloom filter)  
* `GET /api/mails/:id` — Get specific mail  
* `PATCH /api/mails/:id` — Update a mail  
* `DELETE /api/mails/:id` — Delete a mail  
* `GET /api/mails/search/:query` — Search mails by content  

### Labels

* `GET /api/labels` — List all labels  
* `POST /api/labels` — Create a new label  
* `GET /api/labels/:id` — Get label by ID  
* `PATCH /api/labels/:id` — Rename label  
* `DELETE /api/labels/:id` — Delete label  

### Blacklist

* `POST /api/blacklist` — Add URL to blacklist  
* `DELETE /api/blacklist/:id` — Remove URL  

---

## Curl Examples

Below are common `curl` commands to exercise each endpoint. Replace placeholders (`<USER_ID>`, `<TOKEN>`, `<MAIL_ID>`, etc.) with actual IDs/tokens obtained from previous steps.

### Register User

```bash
curl -i -X POST http://localhost:3000/api/users   -H "Content-Type: application/json"   -d '{
    "firstName": "Yuval",
    "lastName": "Tarnopolsky",
    "username": "yuval",
    "gender": "male",
    "password": "1234",
    "birthdate": "2000-05-01"
  }'
```

### Get User by ID

```bash
curl -i http://localhost:3000/api/users/<USER_ID>
```

### Login

```bash
curl -i -X POST http://localhost:3000/api/tokens   -H "Content-Type: application/json"   -d '{
    "username": "yuval",
    "password": "1234"
  }'
```

_The response will include a token. Save it to an environment variable for subsequent calls:_  
```bash
export TOKEN="<PASTE_RECEIVED_TOKEN_HERE>"
```

### Send Mail

```bash
curl -i -X POST http://localhost:3000/api/mails   -H "Content-Type: application/json"   -H "Authorization: Bearer $TOKEN"   -d '{
    "to": "<RECIPIENT_USER_ID>",
    "subject": "Hello",
    "content": "This is the message content"
  }'
```

### Get Inbox

```bash
curl -i -X GET http://localhost:3000/api/mails   -H "Authorization: Bearer $TOKEN"
```

### Get Mail by ID

```bash
curl -i -X GET http://localhost:3000/api/mails/<MAIL_ID>   -H "Authorization: Bearer $TOKEN"
```

### Delete Mail

```bash
curl -i -X DELETE http://localhost:3000/api/mails/<MAIL_ID>   -H "Authorization: Bearer $TOKEN"
```

### Update Mail

```bash
curl -i -X PATCH http://localhost:3000/api/mails/<MAIL_ID>   -H "Content-Type: application/json"   -H "Authorization: Bearer $TOKEN"   -d '{
    "subject": "Updated subject",
    "content": "Updated content"
  }'
```

### Search Mail

```bash
curl -i -H "Authorization: Bearer $TOKEN"   http://localhost:3000/api/mails/search/<QUERY>
```

### Add URL to Blacklist

```bash
curl -i -X POST http://localhost:3000/api/blacklist   -H "Content-Type: application/json"   -H "Authorization: Bearer $TOKEN"   -d '{
    "url": "http://example.com/bad6"
  }'
```

### Remove URL from Blacklist

```bash
curl -i -X DELETE http://localhost:3000/api/blacklist/http%3A%2F%2Fexample.com%2Fbad5   -H "Authorization: Bearer $TOKEN"
```

### Label Operations

**Get all labels:**

```bash
curl -i -H "Authorization: Bearer $TOKEN"   http://localhost:3000/api/labels
```

**Create label:**

```bash
curl -i -X POST http://localhost:3000/api/labels   -H "Content-Type: application/json"   -H "Authorization: Bearer $TOKEN"   -d '{
    "name": "Work"
  }'
```

**Update label:**

```bash
curl -i -X PATCH http://localhost:3000/api/labels/<LABEL_ID>   -H "Content-Type: application/json"   -H "Authorization: Bearer $TOKEN"   -d '{
    "name": "Work & Projects"
  }'
```

**Get label by ID:**

```bash
curl -i -H "Authorization: Bearer $TOKEN"   http://localhost:3000/api/labels/<LABEL_ID>
```

**Delete label:**

```bash
curl -i -X DELETE http://localhost:3000/api/labels/<LABEL_ID>   -H "Authorization: Bearer $TOKEN"
```

---

## Persistence

* All application data (users, mails, labels) is stored **in-memory** on the web server. It is lost upon server restart.  
* The **blacklist** is **persisted** by the Bloom Filter server to disk automatically.

---

## Building and Running

### Run Locally

```bash
cd web
npm install
node app.js
```

The server will start on port `3000` by default. You can then use the `curl` examples above to exercise each endpoint.

---

## Docker Setup

We can run the entire system via Docker Compose. Below are the commands along with accompanying screenshots.

### 1. Build Docker Images

```bash
docker-compose build
```

![1. Docker Build](screenshots/1.%20docker%20build.png)

### 2. Start All Services

```bash
docker-compose up
```

![2. Docker Compose and Run](screenshots/2.%20docker%20compose%20and%20run.png)

Once the services are up, open a new terminal to begin interacting with the API (e.g., register users, send mails).

---

## Screenshots

Below is a curated list of key scenarios. Each screenshot demonstrates a critical piece of functionality, from authentication to mail operations and blacklist handling.

1. **Registering and Logging In**  
   ![3. Registering and Logging In](screenshots/3.%20registering%20and%20logging%20in%20with%20two%20different%20users.png).  
   *Shows the `POST /api/users` registration followed by `POST /api/tokens` login.*

2. **Sending Two Mails and Getting Inbox**  
   ![4. Sending Two Mails and Getting Inbox](screenshots/4.%20sending%20two%20mails%20and%20getting%20a%20mailbox.png).  
   *Alice sends two mails; the inbox displays both for Alice.*

3. **Update a Mail and Search for a Term**  
   ![5. Update a Mail and Search for a Term](screenshots/5.%20update%20a%20mail%20and%20search%20for%20a%20word%20in%20a%20mail.png).  
   *Shows `PATCH /api/mails/<MAIL_ID>` updating mail content, then `GET /api/mails/search/<QUERY>` to find it.*

4. **Creating and Getting a New Label**  
   ![6. Creating and Getting a New Label](screenshots/6.%20creating%20and%20getting%20a%20new%20label.png).  
   *Demonstrates `POST /api/labels` → creation, then `GET /api/labels` to retrieve it.*

5. **Deleting a Label and Then Trying to Get It**  
   ![7. Deleting a Label and Then Trying to Get It](screenshots/7.%20deleting%20a%20label%20and%20then%20trying%20to%20get%20it.png).  
   *Shows `DELETE /api/labels/<LABEL_ID>` → **204 No Content**, followed by `GET /api/labels/<LABEL_ID>` → **404 Not Found**.*

6. **Listing a URL to Blacklist and Error When Sending a Mail with It**  
   ![8. Listing a URL to Blacklist and Error When Sending a Mail with It](screenshots/8.%20listing%20a%20url%20to%20black%20list%20and%20eror%20when%20sending%20a%20mail%20with%20it.png).  
   *Demonstrates `POST /api/blacklist` adding a malicious URL, then `POST /api/mails` failing due to Bloom filter rejection.*

7. **Sending a Mail, Then Trying to Access It Without Proper Permission**  
   ![9. Sending a Mail, Then Trying to Access It Without Proper Permission](screenshots/9.%20sending%20a%20mail%2C%20then%20trying%20to%20access%20it%20without%20proper%20permission.png).  
   *Alice sends a mail to Bob; Bob attempts `PATCH /api/mails/<MAIL_ID>` (which he did not send) → **403 Forbidden**.*

---

## Code Structure

```
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
```

---

## Jira Link

Project planning and task tracking are managed in Jira:  
https://yuvaltarno1337.atlassian.net/jira/software/projects/GIT3/boards/100/timeline

---

## Authors

* Yuval Tarnopolsky  
* Tal Amitay  
* Itay Smouha  
