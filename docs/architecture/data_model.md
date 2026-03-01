# Data Model
The system stores chat-related data locally to support conversation persistence

### User
  - userID
  - sessionID

### ChatSession
  - sessionID
  - createdAt
  - conversations

### Conversation
  - conversationID
  - title
  - messages[]

### Message
  - messageID
  - role (user or response)
  - timestamp
