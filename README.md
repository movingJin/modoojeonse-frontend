# Modoojeonse Frontend

A React Native app for the **Modoojeonse** platform.

> ⚠️ This project requires the Modoojeonse [back-end](https://github.com/movingJin/modoojeonse-backend) and a [chatbot](https://github.com/movingJin/modoojeonse-chatbot) service to function properly.

---

## Installation / Quick Start 
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Linux](https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black)
![macOS](https://img.shields.io/badge/mac%20os-000000?style=for-the-badge&logo=macos&logoColor=F0F0F0)
![Windows](https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white)

### Project Structure
```
modoojeonse-frontend/
├── android/
├── ios/
├── src/
├── public/
├── docker/
├── .env
└── ...
```

### 1. Create a `.env` file

Add a `.env` file in the project root directory to define environment variables:

```env
REACT_APP_GOOGLE_MAP_API='...'
API_SERVER_URL='https://...'
CHATBOT_SERVER_URL='https://...'
```

### 2. Build the Project

Install dependencies and build the React project:

```
$ npm ci
$ npm run build-react
```

### 3. Deploy with Docker

Use Docker Compose to build and run the deployment:

```
$ cd docker
$ docker-compose build
$ docker-compose up -d
```
