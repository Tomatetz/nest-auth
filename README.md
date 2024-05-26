
## Description
This project is a NestJS application that implements user registration/authentication, stores refresh tokens for maintaining user sessions, uses JWT for request verification (using Passport), and runs in a Docker container with PostgreSQL, synchronized via Prisma.

### Features
- User Registration/Authentication: Enables users to register and authenticate.
- Refresh Token Storage: Maintains user sessions through refresh tokens.
- JWT Verification: Uses JWT (via Passport) for request verification.
- Docker Integration: Runs in a Docker container.
- PostgreSQL Integration: Uses PostgreSQL as the database, synchronized via Prisma.

### Getting Started
**Prerequisites**
- [Node.js](https://nodejs.org/en)
- [Docker](https://www.docker.com/)

## Installation
1. Clone the repository:
```bash
git clone https://github.com/your-repo/nestjs-app.git
cd nestjs-app
```
2. Install dependencies:
```bash
$ yarn install
```
3. Rename .env.example file to .env and update file data

## Running the app
**1. Start the Docker container:**
Ensure Docker is running on your machine, then run:
```bash
docker-compose up -d
```
**2. Generate Prisma Client:**
```bash
npx prisma generate
```
**3. Run database migrations:**
```bash
npm run start
```
The application will be available at `http://localhost:5656`.

## Endpoints
Endpoints
- POST /auth/register: Register a new user.
- POST /auth/login: Authenticate a user and receive tokens.
- POST /auth/refresh: Refresh the JWT using the refresh token.
- GET /users: Get users list (JWT required).

# development
$ yarn start:dev

## License

Nest is [MIT licensed](LICENSE).
