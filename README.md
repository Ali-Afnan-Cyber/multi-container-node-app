# LAB: Docker Compose-Based Multi-Container Web App with Volumes

---

## 🎯 Objective

Use **Docker Compose** to deploy a multi-container stack consisting of a **Node.js web application** and a **MySQL database**, with a focus on **data persistence using named volumes**.

---

## 📝 Tasks

### ✅ Step 1: Create a Web + DB Stack

- Developed a simple Node.js app using Express.
- Backend database used: MySQL 8.
- App allows users to submit messages via a web form, stored in the MySQL database.

### ✅ Step 2: Define docker-compose.yml with Named Volumes

Docker Compose defines:
- A `web` service for the Node.js app.
- A `db` service for the MySQL container.
- A **named volume** (`db_data`) for persisting database files.

```yaml
version: '3.8'

services:
  web:
    build: ./app
    ports:
      - "3000:3000"
    depends_on:
      - db

  db:
    image: mysql:8
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: rootpass
      MYSQL_DATABASE: nodeapp
      MYSQL_USER: user
      MYSQL_PASSWORD: password
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:
    driver: local
```
![dockercompose-file](https://github.com/user-attachments/assets/feabe44e-b432-4c8f-bc6e-1b40b5765746)

### ✅ Step 3: Run the App

Start everything in the background:
```yaml
docker-compose up -d --build
```
Visit:
#### http://localhost:3000 — View stored messages.
![app-running-on-web](https://github.com/user-attachments/assets/ad093114-9d92-43e0-8e24-74984e7bdf50)

#### http://localhost:3000/form — Submit new messages.

### ✅ Step 4: Connect App to DB and Insert Data

User submits a message via form.
Message is inserted into the messages table in MySQL.
Data is retrieved and shown at /.

### ✅ Step 5: Test Volume Persistence

Insert a unique message via the form (e.g., "this is a test for persistance").
![testing-persistance](https://github.com/user-attachments/assets/21e83754-70b0-4f23-9c08-798b6c5f2902)

Confirm it appears on the homepage.


#### Shut down the containers:
```bash
docker-compose down
```
#### Restart containers:
```bash
docker-compose up -d
```
![testing-persistance-3-restarting-service](https://github.com/user-attachments/assets/5e6e03d4-fd58-42c9-845c-5849ed6a63e3)


## Finally, Testing
Revisit http://localhost:3000 to verify the message is still there.

![persistance-tested](https://github.com/user-attachments/assets/6ee20df2-40c1-477e-8d6b-2d880eddb900)

### ✅ Persistence confirmed — MySQL data was retained via the named volume db_data


## 📦 Volume Explanation

Volume Block in docker-compose.yml:
```yaml
volumes:
  db_data:
```
This creates a named volume that maps to:

```yaml
- db_data:/var/lib/mysql
```
This ensures all MySQL data is stored outside the container lifecycle. Even if the container is removed or rebuilt, the database files remain intact inside the Docker volume.

You can verify volume existence with:

```yaml
docker volume ls
docker volume inspect <volume-name>
```

## 🔧 Why Docker Compose Simplifies Orchestration

Single-file configuration (docker-compose.yml) to spin up multiple services.

#### Automatically handles:
* Networking: internal DNS resolution (web can reach db by service name).
* Service dependencies: depends_on ensures DB starts before app.
* Volume management: persist container data cleanly and declaratively.
* Fast tear-down and rebuild for testing (docker-compose down/up).

#### Without Compose, you’d have to manage:
* Container startup order
* Networks
* Data volumes
* Manual environment variable configuration

Compose makes this process repeatable and production-friendly.

## ✅ Summary

This lab demonstrates:
- Multi-container app deployment using Docker Compose.
- Integration of a Node.js frontend with a MySQL backend.
- Persistent storage using named Docker volumes.
- Easy orchestration and service management via Compose.





