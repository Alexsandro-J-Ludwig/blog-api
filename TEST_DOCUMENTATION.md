# API Integration Tests and Database Seeding Documentation

This document outlines the testing strategy, test coverage, and database seeding structure implemented for the NestJS Blog API.

## 1. Database Seeder (`src/seed.ts`)

A database seeding script was created to populate the database with initial mock data for local testing and development.

### Seeder Features
* **Environment Aware**: Leverages the NestJS application context to reuse database configuration and type definitions.
* **Idempotent / Clean Database**: Automatically drops existing posts and users before seeding to ensure a consistent state.
* **10 Users**: Generates exactly 10 users (`user_1` to `user_10`) with secure hashed passwords (`password123` via `bcrypt`).
* **50 Posts**: Generates exactly 50 posts distributed evenly among the created users, with random dates and likes spread out over time.

### Execution
To seed the database, run:
```bash
# Build the TypeScript files
npm run build

# Run the compiled seeder script
node dist/seed.js
```

---

## 2. Integration Test Suite (`src/api.spec.ts`)

The integration test suite utilizes **Jest** and **supertest** to perform end-to-end HTTP assertions against a running application instance.

### Test Configuration
* **Global Pipes**: Uses the exact validation settings as the main application (`whitelist`, `forbidNonWhitelisted`, `transform`).
* **TypeORM Database Isolation**: Run against the local/test database. Tests create a dynamically named user to prevent conflict with seeded users.
* **State Cleanliness**: Cleans up created data at the end of the test suite (deletes test posts and user).

### Endpoint Test Coverage

| Endpoint | Method | Description | Expected Status |
| :--- | :--- | :--- | :--- |
| `/users/create` | `POST` | Registers a new user with unique username and email | `201 Created` |
| `/users/create` | `POST` | Rejects registration with an already existing username | `400 Bad Request` |
| `/users/login` | `POST` | Authenticates user credentials and returns a signed JWT | `201 Created` |
| `/users/update` | `PUT` | Updates authenticated user profile details | `200 OK` |
| `/post/create` | `POST` | Creates a new blog post | `201 Created` |
| `/post/getByUser` | `GET` | Retrieves posts authored by the logged-in user | `200 OK` |
| `/post/getAll` | `GET` | Retrieves all blog posts across the platform | `200 OK` |
| `/post/postUser:username` | `GET` | Retrieves posts by a specific user's username | `200 OK` |
| `/post/alterPost:uuidPost` | `PUT` | Modifies an existing blog post | `200 OK` |
| `/post/:postUuid/like` | `POST` | Likes a post (increments likes count by 1) | `201 Created` |
| `/post/:postUuid/like` | `POST` | Unlikes a post when called again (toggles likes) | `201 Created` |
| `/post/:postUuid` | `DELETE` | Deletes a post | `200 OK` |
| `/users/delete` | `DELETE` | Deletes the test user account | `200 OK` |

### Running the Tests
To run the entire suite:
```bash
npm run test
```

### Execution Output
```text
PASS src/api.spec.ts
  Blog API Integration Tests
    User Endpoints
      √ should register a new user (POST /users/create) (966 ms)
      √ should not register user with existing username (POST /users/create) (215 ms)
      √ should authenticate user and return JWT token (POST /users/login) (288 ms)
      √ should update authenticated user fields (PUT /users/update) (409 ms)
    Post Endpoints
      √ should create a new post (POST /post/create) (617 ms)
      √ should fetch posts of the logged-in user (GET /post/getByUser) (229 ms)
      √ should fetch all posts (GET /post/getAll) (349 ms)
      √ should fetch posts by username (GET /post/postUser:username) (403 ms)
      √ should update a post (PUT /post/alterPost:uuidPost) (437 ms)
      √ should like a post (POST /post/:postUuid/like) (1618 ms)
      √ should unlike the post when liked again (POST /post/:postUuid/like) (1564 ms)
      √ should delete a post (DELETE /post/:postUuid) (397 ms)
    User Cleanup
      √ should delete the test user (DELETE /users/delete) (408 ms)

Test Suites: 1 passed, 1 total
Tests:       13 passed, 13 total
Snapshots:   0 total
Time:        19.191 s
Ran all test suites.
```
