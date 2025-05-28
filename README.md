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

### Register User

```bash
curl -i -X POST http://localhost:3000/api/users \
-H "Content-Type: application/json" \
-d '{"firstName": "Yuval", "lastName": "Tarnopolsky", "username": "yuval", "gender": "male", "password": "1234", "birthdate": "2000-05-01"}'
```

### Get User by ID

```bash
curl -i http://localhost:3000/api/users/<USER_ID>
```

### Login

```bash
curl -i -X POST http://localhost:3000/api/tokens \
-H "Content-Type: application/json" \
-d '{"username": "yuval", "password": "1234"}'
```

### Send Mail

```bash
curl -i -X POST http://localhost:3000/api/mails \
-H "Content-Type: application/json" \
-H "X-User-Id: <SENDER_USER_ID>" \
-d '{"to": "<RECIPIENT_USER_ID>", "subject": "Hello", "content": "This is the message content"}'
```

### Get Inbox

```bash
curl -i -X GET http://localhost:3000/api/mails \
-H "X-User-Id: <USER_ID>"
```

### Get Mail by ID

```bash
curl -i -X GET http://localhost:3000/api/mails/<MAIL_ID> \
-H "X-User-Id: <USER_ID>"
```

### Delete Mail

```bash
curl -i -X DELETE http://localhost:3000/api/mails/<MAIL_ID> \
-H "X-User-Id: <SENDER_USER_ID>"
```

### Update Mail

```bash
curl -i -X PATCH http://localhost:3000/api/mails/<MAIL_ID> \
-H "Content-Type: application/json" \
-H "X-User-Id: <SENDER_USER_ID>" \
-d '{"subject": "Updated subject", "content": "Updated content"}'
```

### Search Mail

```bash
curl -i -H "X-User-Id: <USER_ID>" \
http://localhost:3000/api/mails/search/<QUERY>
```

### Add URL to Blacklist

```bash
curl -i -X POST http://localhost:3000/api/blacklist \
-H "Content-Type: application/json" \
-d '{"id": "http://example.com/bad6"}'
```

### Remove URL from Blacklist

```bash
curl -i -X DELETE http://localhost:3000/api/blacklist/http%3A%2F%2Fexample.com%2Fbad5
```

### Label Operations

**Get all labels:**

```bash
curl -i -H "X-User-Id: <USER_ID>" http://localhost:3000/api/labels
```

**Create label:**

```bash
curl -i -X POST http://localhost:3000/api/labels \
-H "Content-Type: application/json" \
-H "X-User-Id: <USER_ID>" \
-d '{"name": "Work"}'
```

**Update label:**

```bash
curl -i -X PATCH http://localhost:3000/api/labels/<LABEL_ID> \
-H "Content-Type: application/json" \
-H "X-User-Id: <USER_ID>" \
-d '{"name": "Work & Projects"}'
```

**Get label by ID:**

```bash
curl -i -H "X-User-Id: <USER_ID>" http://localhost:3000/api/labels/<LABEL_ID>
```

**Delete label:**

```bash
curl -i -X DELETE http://localhost:3000/api/labels/<LABEL_ID> \
-H "X-User-Id: <USER_ID>"
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

The server will start on port `3000` by default.

---

## Docker Setup
CPP_HOST=localhost CPP_PORT=54321 npm run dev
### Step-by-Step

#### 1. Build the Docker Images

```bash
docker-compose build
```

#### 2. Start All Services

```bash
docker-compose up
```

This will start:

* The Node.js web API service
* The Bloom Filter TCP service

You may open a new terminal window and use `curl` to interact with the API.





## Jira Link

Project planning and task tracking are managed in Jira.
**[Jira: GIT3 Project Board](https://yuvaltarno1337.atlassian.net/jira/software/projects/GIT3/boards)**

---

## Authors

* Yuval Tarnopolsky
* Tal Amitay
* Itay Smouha

