# API Documentation for Blogging Website

This document provides detailed information about the API endpoints for the Blogging Website. The API allows registered users to create, edit, delete, and search blogs, follow/unfollow other users, view user profiles, and see blogs from followed users. Unregistered users can view the homepage and read specific blog articles.

**Base URL**:  (`http://localhost:5000` for local testing)

## Authentication
Most endpoints require authentication using a JSON Web Token (JWT). Include the token in the `Authorization` header as follows:


To obtain a token, use the `POST /api/auth/login` endpoint.

## Endpoints Overview
### Authentication Endpoints
- `POST /api/auth/register` - Register a new user.
- `POST /api/auth/login` - Log in and obtain a JWT token.

### Blog Endpoints
- `POST /api/blogs` - Create a new blog (authenticated users only).
- `GET /api/blogs` - Retrieve the latest blogs (paginated).
- `GET /api/blogs/:id` - Retrieve a specific blog by ID.
- `PUT /api/blogs/:id` - Update a blog (authenticated users, author only).
- `DELETE /api/blogs/:id` - Delete a blog (authenticated users, author only).
- `GET /api/blogs/search` - Search blogs by title, body, author, or tags (authenticated users only).

### User Endpoints
- `POST /api/users/follow` - Follow a user (authenticated users only).
- `POST /api/users/unfollow` - Unfollow a user (authenticated users only).
- `GET /api/users/profile/:id` - Retrieve a user's profile (authenticated users only).
- `GET /api/users/followed-blogs` - Retrieve blogs from followed users (authenticated users only).

---

## Authentication Endpoints

### 1. Register a User
Register a new user.

- **Method**: POST
- **URL**: `/api/auth/register`
- **Headers**:
- **Body** (raw/JSON):
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```jsonStatus: 201 Created
{
  "token": "<jwt_token>",
  "user": {
    "_id": "680b8db7ee62ebbe1bd36922",
    "username": "testuser",
    "email": "test@example.com"
  }
}
Content-Type: application/json
Body (raw/JSON):
json


{
  "email": "test@example.com",
  "password": "password123"
}
Success Response:
Status: 200 OK
Content:
json

{
  "token": "<jwt_token>",
  "user": {
    "_id": "680b8db7ee62ebbe1bd36922",
    "username": "testuser",
    "email": "test@example.com"
  }
}
Authorization: Bearer <your_jwt_token>
Content-Type: multipart/form-data
Body (form-data):
Key	Value	Type
title	My New Blog	Text
body	This is a new blog post.	Text
tags	["tech", "coding"]	Text
photo	(image file, optional)	File


Success Response:
Status: 201 Created
Content:
json

{
  "_id": "680b8eb34752e0d6bc0f1152",
  "title": "My New Blog",
  "body": "This is a new blog post.",
  "photo": "https://res.cloudinary.com/dabcdefg123/image/upload/v1234567890/sample.jpg",
  "author": "680b8db7ee62ebbe1bd36922",
  "tags": [
    {
      "_id": "60d5f3b2c7b1b123456789ac",
      "name": "tech"
    }
  ],
  "createdAt": "2025-04-25T12:34:56.789Z"
}
2. Get Latest Blogs
Retrieve a paginated list of the latest blogs.

Method: GET
URL: /api/blogs?page=<page>&limit=<limit>
Query Parameters:
page (optional, default: 1) - Page number.
limit (optional, default: 10) - Number of blogs per page.
Headers: None
Body: None
Success Response:
Status: 200 OK
Content:
json


[
  {
    "_id": "680b8eb34752e0d6bc0f1152",
    "title": "My First Blog",
    "body": "This is the content of my blog.",
    "photo": "https://res.cloudinary.com/dabcdefg123/image/upload/v1234567890/sample.jpg",
    "author": {
      "_id": "680b8db7ee62ebbe1bd36922",
      "username": "testuser"
    },
    "tags": [
      {
        "_id": "60d5f3b2c7b1b123456789ac",
        "name": "tech"
      }
    ],
    "createdAt": "2025-04-25T12:34:56.789Z"
  }
]

Get Blog by ID
Retrieve details of a specific blog.

Method: GET
URL: /api/blogs/:id
URL Parameters:
id - Blog ID (e.g., 680b8eb34752e0d6bc0f1152)
Headers: None
Body: None
Success Response:
Status: 200 OK
Content:
json


{
  "_id": "680b8eb34752e0d6bc0f1152",
  "title": "My First Blog",
  "body": "This is the content of my blog.",
  "photo": "https://res.cloudinary.com/dabcdefg123/image/upload/v1234567890/sample.jpg",
  "author": {
    "_id": "680b8db7ee62ebbe1bd36922",
    "username": "testuser"
  },
  "tags": [
    {
      "_id": "60d5f3b2c7b1b123456789ac",
      "name": "tech"
    }
  ],
  "createdAt": "2025-04-25T12:34:56.789Z"
}
Update a Blog
Update an existing blog (authenticated users, author only).

Method: PUT
URL: /api/blogs/:id
URL Parameters:
id - Blog ID (e.g., 680b8eea4752e0d6bc0f1156)
Headers:
text


Authorization: Bearer <your_jwt_token>
Content-Type: multipart/form-data
Body (form-data):
Key	Value	Type
title	My Updated Blog	Text
body	This is the updated content.	Text
tags	["tech", "coding"]	Text
photo	(image file, optional)	File
Success Response:
Status: 200 OK
Content:
json


{
  "_id": "680b8eea4752e0d6bc0f1156",
  "title": "My Updated Blog",
  "body": "This is the updated content.",
  "photo": "https://res.cloudinary.com/dabcdefg123/image/upload/v1234567890/sample.jpg",
  "author": "680b8db7ee62ebbe1bd36922",
  "tags": [
    {
      "_id": "60d5f3b2c7b1b123456789ac",
      "name": "tech"
    }
  ],
  "createdAt": "2025-04-25T12:34:56.789Z"
}
5. Delete a Blog
Delete an existing blog (authenticated users, author only).

Method: DELETE
URL: /api/blogs/:id
URL Parameters:
id - Blog ID (e.g., 680b8eea4752e0d6bc0f1156)
Headers:
text


Authorization: Bearer <your_jwt_token>
Body: None
Success Response:
Status: 200 OK
Content:
json


{ "message": "Blog deleted" }

6. Search Blogs
Search blogs by title, body, author, or tags (authenticated users only).

Method: GET
URL: /api/blogs/search?query=<search_term>&page=<page>&limit=<limit>
Query Parameters:
query - Search term (e.g., tech)
page (optional, default: 1) - Page number.
limit (optional, default: 10) - Number of blogs per page.
Headers:
text


Authorization: Bearer <your_jwt_token>
Body: None
Success Response:
Status: 200 OK
Content:
json


[
  {
    "_id": "680b8eb34752e0d6bc0f1152",
    "title": "My First Blog",
    "body": "This is the content of my blog.",
    "photo": "https://res.cloudinary.com/dabcdefg123/image/upload/v1234567890/sample.jpg",
    "author": {
      "_id": "680b8db7ee62ebbe1bd36922",
      "username": "testuser"
    },
    "tags": [
      {
        "_id": "60d5f3b2c7b1b123456789ac",
        "name": "tech"
      }
    ],
    "createdAt": "2025-04-25T12:34:56.789Z"
  }
]
User Endpoints
1. Follow a User
Follow another user (authenticated users only).

Method: POST
URL: /api/users/follow
Headers:
text


Authorization: Bearer <your_jwt_token>
Content-Type: application/json
Body (raw/JSON):
json


{
  "userId": "680b8db7ee62ebbe1bd36922"
}
Success Response:
Status: 200 OK
Content:
json


{ "message": "User followed" }

2. Unfollow a User
Unfollow a user (authenticated users only).

Method: POST
URL: /api/users/unfollow
Headers:
text


Authorization: Bearer <your_jwt_token>
Content-Type: application/json
Body (raw/JSON):
json


{
  "userId": "680b8db7ee62ebbe1bd36922"
}
Success Response:
Status: 200 OK
Content:
json


{ "message": "User unfollowed" }

3. Get User Profile
Retrieve a user's profile by ID (authenticated users only).

Method: GET
URL: /api/users/profile/:id
URL Parameters:
id - User ID (e.g., 680b8db7ee62ebbe1bd36922)
Headers:
text


Authorization: Bearer <your_jwt_token>
Body: None
Success Response:
Status: 200 OK
Content:
json


{
  "_id": "680b8db7ee62ebbe1bd36922",
  "username": "testuser",
  "email": "test@example.com",
  "blogs": [
    {
      "_id": "680b8eb34752e0d6bc0f1152",
      "title": "My First Blog"
    }
  ],
  "followers": [
    {
      "_id": "60d5f3b2c7b1b123456789ad",
      "username": "follower1"
    }
  ],
  "following": []
}
4. Get Followed Blogs
Retrieve blogs from users the authenticated user follows.

Method: GET
URL: /api/users/followed-blogs
Headers:
text


Authorization: Bearer <your_jwt_token>
Body: None
Success Response:
Status: 200 OK
Content:
json


[
  {
    "_id": "680b8eb34752e0d6bc0f1152",
    "title": "My First Blog",
    "body": "This is the content of my blog.",
    "photo": "https://res.cloudinary.com/dabcdefg123/image/upload/v1234567890/sample.jpg",
    "author": {
      "_id": "680b8db7ee62ebbe1bd36922",
      "username": "testuser"
    },
    "tags": [
      {
        "_id": "60d5f3b2c7b1b123456789ac",
        "name": "tech"
      }
    ],
    "createdAt": "2025-04-25T12:34:56.789Z"
  }
]