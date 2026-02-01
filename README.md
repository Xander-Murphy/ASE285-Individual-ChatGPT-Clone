# Chat285 - Individual Project

## Team Members

- **Xander** (Team Leader)

## Project Description

  Chat285 is made to be a real-time AI Chatbot replicating the core functionality of ChatGPT. Users interact with OpenAI in our custom web application style. This project
  is built on Node, React, Express, and WebSockets.

## Problem Domain

  As the world continues to evolve everything is expected to be done faster and people
  are expected to know more things on a base level. Chat285 helps its users solve these
  problems by giving them access to a wealth on information in a conversational form
  through our custom interface.

## Features and Requirements

### Features

  1. Chat centered user interactions
  2. Chat sessions
  3. Multiple conversations in a session
  4. Conversation History



### Non-Functional Requirements

  - React-based frontend
  - Integration with ChatGPT API
  - local torage and session storage persistence

## Data Model

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

## Architecture

  [Insert architecture diagram here]

  ...

  Link:

## Tests

### Acceptance Tests

- ...

  Link:

### Integration Tests

- ...

  Link:

### E2E Tests

- ...

## Project Documentation

- [Project Plan Presentation (PPP)](https://github.com/Xander-Murphy/ASE285-Individual-ChatGPT-Clone/blob/main/docs/Presentation/01_ppp_chat285.md)
- [Individual Contributions - Xander](https://github.com/Xander-Murphy/ASE285-Individual-ChatGPT-Clone/blob/main/individual/Xander/progress.md)
- 
## Schedule & Milestones

### Sprint 1

-
-

### Sprint 2

-
-

  Link:
