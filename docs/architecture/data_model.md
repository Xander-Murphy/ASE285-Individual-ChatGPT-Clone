# Data Model
The system stores chat-related data locally using localStorage to support conversation persistence.

### Conversation
- conversationID
- title
- createdAt
- messages[]

### Message
- messageID
- role (user or assistant)
- content
- timestamp