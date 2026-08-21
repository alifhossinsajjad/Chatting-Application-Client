# Chat API Documentation

This document outlines the API endpoints required to build the Chat Application.

## Base URL
`https://frontend-task-chatapp.onrender.com/api`

## Authentication

### 1. Login / Register
- **Endpoint**: `POST /auth/login`
- **Description**: Registers a new user if the phone number is new, or logs them in if it exists.
- **Request Body**:
  ```json
  {
    "phone": "+15551234567",
    "name": "Ada Lovelace"
  }
  ```
- **Response**: Returns the user object and a JWT token.
- **Note**: The token must be sent as an `Authorization: Bearer <token>` header for all protected routes.

### 2. Get Current User
- **Endpoint**: `GET /auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Description**: Retrieves the currently logged-in user.

## Users

### 3. Search Users
- **Endpoint**: `GET /users/search?q={search_term}`
- **Headers**: `Authorization: Bearer <token>`
- **Description**: Search for users by name or phone number.

## Conversations

### 4. List My Conversations
- **Endpoint**: `GET /conversations`
- **Headers**: `Authorization: Bearer <token>`
- **Description**: Returns a list of direct and group conversations the user is a part of.

### 5. Start a Direct Conversation
- **Endpoint**: `POST /conversations`
- **Headers**: `Authorization: Bearer <token>`
- **Description**: Starts a new 1-to-1 conversation.
- **Request Body**:
  ```json
  {
    "userId": "665f0c2a9b1e4a0012ab34cd"
  }
  ```

### 6. Get Message History
- **Endpoint**: `GET /conversations/{id}/messages`
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `limit`: (Optional) Maximum number of messages per page (e.g., 20).
  - `before`: (Optional) Cursor for pagination.

## Messages

### 7. Send a Message
- **Endpoint**: `POST /messages`
- **Headers**: `Authorization: Bearer <token>`
- **Description**: Sends a message to a conversation. This triggers the `message:new` socket event for other participants.
- **Request Body**:
  ```json
  {
    "conversationId": "665f0c2a9b1e4a...",
    "text": "Hello!"
  }
  ```

## Groups

### 8. Create a Group
- **Endpoint**: `POST /conversations/group`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "name": "Project Team",
    "participantIds": ["userId1", "userId2"]
  }
  ```

### 9. Add Members to Group (Admin only)
- **Endpoint**: `POST /conversations/{id}/participants`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "userIds": ["userId3"]
  }
  ```

### 10. Remove Member / Leave Group
- **Endpoint**: `DELETE /conversations/{id}/participants/{userId}`
- **Headers**: `Authorization: Bearer <token>`

### 11. Promote Member to Admin (Admin only)
- **Endpoint**: `POST /conversations/{id}/admins`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "userId": "userId1"
  }
  ```

### 12. Rename Group (Admin only)
- **Endpoint**: `PATCH /conversations/{id}`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "name": "Renamed Team"
  }
  ```

## WebSocket Connection (Socket.io)

- **URL**: `https://frontend-task-chatapp.onrender.com`
- **Auth**: Pass token in handshake: `{ auth: { token } }`

### Events

- **Listen to (Server -> Client)**:
  - `message:new`: A new message arrived.
  - `conversation:updated`: A group you're in changed.
- **Emit (Client -> Server)**:
  - `message:send`: `{ conversationId, text }`
