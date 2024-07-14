#docker: https://hub.docker.com/repository/docker/juank3690/api_rest_kanban/general
# Kanban Board API

This is the documentation for the API of the Kanban board web application. The API allows users to create, modify, and manage cards and columns, and incorporates a complete authentication and authorization system.
deploy: https://apikanbants.onrender.com
use: https://apikanbants.onrender.com/api

## Endpoints

# Authentication API Endpoints

## Overview

This API provides endpoints for user authentication, including registration, login, and logout. It handles user validation, password hashing, token generation, and cookie management.

## Functions

### Register User

- **URL:** `POST /register`
- **Description:** Registers a new user with the provided username, email, and password.
- **Request Body:**
  "username": "string",
  "email": "string",
  "password": "string"
- **Responses:**
  - `201 Created`: User successfully registered.
  - `400 Bad Request`: Validation error or missing parameters.
  - `409 Conflict`: Username or email already exists.
  - `500 Internal Server Error`: Server error.

### Login User

- **URL:** `POST /login`
- **Description:** Logs in a user with the provided email and password, generating a JWT token for authentication.
- **Request Body:**
  "email": "string",
  "password": "string"
- **Responses:**
  - `200 OK`: User successfully logged in, returns a JWT token.
  - `400 Bad Request`: Validation error or missing parameters.
  - `401 Unauthorized`: Invalid credentials.
  - `500 Internal Server Error`: Server error.

### Logout User

- **URL:** `GET /logout`
- **Description:** Logs out the currently authenticated user by clearing the access token cookie.
- **Responses:**
  - `200 OK`: User successfully logged out.
  - `500 Internal Server Error`: Server error.

## Error Handling

- `400 Bad Request`: Invalid request format or missing parameters.
- `401 Unauthorized`: Invalid credentials or unauthorized access.
- `409 Conflict`: User already exists (during registration).
- `500 Internal Server Error`: Server encountered an unexpected condition.



# Section API Endpoints

## Overview

This API provides endpoints to manage sections associated with users in a database. It includes functionalities for creating, retrieving, updating, and deleting sections, as well as retrieving all sections of a user.

## Endpoints

### Get All Sections

- **URL:** `GET /sections`
- **Description:** Retrieves all sections for the authenticated user.
- **Responses:**
  - `200 OK`: Returns an array of sections.
  - `401 Unauthorized`: User is not authenticated.
  - `404 Not Found`: No sections found for the user.
  - `500 Internal Server Error`: Server error.

### Create Section

- **URL:** `POST /sections`
- **Description:** Creates a new section for the authenticated user.
- **Request Body:**
  - `title_section`: `string`
- **Responses:**
  - `201 Created`: Section successfully created.
  - `400 Bad Request`: Validation error or missing parameters.
  - `401 Unauthorized`: User is not authenticated.
  - `500 Internal Server Error`: Server error.

### Update Section

- **URL:** `PUT /sections/:id_section`
- **Description:** Updates an existing section for the authenticated user.
- **Request Parameters:**
  - `id_section` (path parameter): The ID of the section to update.
- **Request Body:**
  - `title_section`: `string`
- **Responses:**
  - `200 OK`: Section successfully updated.
  - `400 Bad Request`: Validation error or missing parameters.
  - `401 Unauthorized`: User is not authenticated.
  - `404 Not Found`: Section not found or does not belong to the user.
  - `500 Internal Server Error`: Server error.

### Delete Section

- **URL:** `DELETE /sections/:id_section`
- **Description:** Deletes a section for the authenticated user.
- **Request Parameters:**
  - `id_section` (path parameter): The ID of the section to delete.
- **Responses:**
  - `204 No Content`: Section successfully deleted.
  - `401 Unauthorized`: User is not authenticated.
  - `404 Not Found`: Section not found or does not belong to the user.
  - `500 Internal Server Error`: Server error.


# Task API Endpoints

## Overview

This API provides endpoints to manage tasks associated with sections in a database. It includes functionalities for creating, retrieving, updating, and deleting tasks, as well as retrieving all tasks for a user.

## Endpoints

### Get Task by ID

- **URL:** `GET /tasks/:id_task`
- **Description:** Retrieves a task by its ID for the authenticated user.
- **Responses:**
  - `200 OK`: Returns the task object.
  - `401 Unauthorized`: User is not authenticated.
  - `404 Not Found`: Task not found for the user.
  - `500 Internal Server Error`: Server error.

### Get All Tasks

- **URL:** `GET /tasks`
- **Description:** Retrieves all tasks for the authenticated user.
- **Responses:**
  - `200 OK`: Returns an array of tasks.
  - `401 Unauthorized`: User is not authenticated.
  - `404 Not Found`: No tasks found for the user.
  - `500 Internal Server Error`: Server error.

### Create Task

- **URL:** `POST /tasks`
- **Description:** Creates a new task for the authenticated user.
- **Request Body:**
  - `title_task`: `string`
  - `description_task` (optional): `string`
  - `id_section`: `string` (ID of the section to which the task belongs)
- **Responses:**
  - `201 Created`: Task successfully created.
  - `400 Bad Request`: Validation error or missing parameters.
  - `401 Unauthorized`: User is not authenticated.
  - `404 Not Found`: Section not found or does not belong to the user.
  - `500 Internal Server Error`: Server error.

### Update Task

- **URL:** `PATCH /tasks/:id_task`
- **Description:** Updates an existing task for the authenticated user.
- **Request Parameters:**
  - `id_task` (path parameter): The ID of the task to update.
- **Request Body:**
  - `title_task`: `string`
  - `description_task` (optional): `string`
  - `id_section`: `string` (ID of the section to which the task belongs)
- **Responses:**
  - `200 OK`: Task successfully updated.
  - `400 Bad Request`: Validation error or missing parameters.
  - `401 Unauthorized`: User is not authenticated.
  - `404 Not Found`: Task not found or does not belong to the user.
  - `500 Internal Server Error`: Server error.

### Delete Task

- **URL:** `DELETE /tasks/:id_task`
- **Description:** Deletes a task for the authenticated user.
- **Request Parameters:**
  - `id_task` (path parameter): The ID of the task to delete.
- **Responses:**
  - `204 No Content`: Task successfully deleted.
  - `401 Unauthorized`: User is not authenticated.
  - `404 Not Found`: Task not found or does not belong to the user.
  - `500 Internal Server Error`: Server error.




# User API Endpoints

## Overview

This API provides endpoints to manage user profiles, including retrieving and updating user information.

## Endpoints

### Get User Profile

- **URL:** `GET /user/profile`
- **Description:** Retrieves the profile of the authenticated user.
- **Responses:**
  - `200 OK`: Returns the user profile object.
  - `401 Unauthorized`: User is not authenticated.
  - `404 Not Found`: User not found.
  - `500 Internal Server Error`: Server error.

### Update User Profile

- **URL:** `PATCH /user/profile`
- **Description:** Updates the profile of the authenticated user.
- **Request Body:**
  - `username`: `string`
  - `password`: `string`
  - `email`: `string` (must be a valid email address)
- **Responses:**
  - `200 OK`: User profile successfully updated. Returns the updated user profile object.
  - `400 Bad Request`: Validation error or missing parameters.
  - `401 Unauthorized`: User is not authenticated.
  - `404 Not Found`: User not found.
  - `500 Internal Server Error`: Server error.


## Error Handling

- `400 Bad Request`: Invalid request format or missing parameters.
- `404 Not Found`: User profile not found.
- `500 Internal Server Error`: Server encountered an unexpected condition.



# Database Configuration

## Environment Variables

To connect to the database and configure JWT, we need to set the following environment variables:

### Database

- **`DB_USER`**: The database user name.
- **`DB_HOST`**: The database host address.
- **`DB_DATABASE`**: The name of the database.
- **`DB_PASSWORD`**: The database user password.
- **`DB_PORT`**: The port on which the database is listening.

### JWT

- **`JWT_SECRET`**: The secret key used to sign JWT tokens.

## Example `.env` File

Create a `.env` file in the root of your project and add the following lines with your database and JWT configuration values:

