# Chat285 - Individual Project

## Team Members

- **Xander** (Solo Contributor)

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

## Architecture

  This application follows a client-server architecture.

  - The frontend is built using React and handles user interaction and UI rendering.
  - The backend is built using NodeJS and Express to manage API requests.
  - WebSockets are used to support real-time chat communication.
  - The backend communicates with OpenAI's API to generate chat responses
  - Conversation data persists in local and session storages.

  Link: https://github.com/Xander-Murphy/ASE285-Individual-ChatGPT-Clone/blob/main/docs/architecture/system_architecture.pdf

## Tests

### Acceptance Tests

- ...

  Link: https://github.com/Xander-Murphy/ASE285-Individual-ChatGPT-Clone/tree/main/tests/acceptance_tests 

### Integration Tests

- ...

  Link: https://github.com/Xander-Murphy/ASE285-Individual-ChatGPT-Clone/tree/main/tests/integration_tests

### Regression Tests

- ...

Link: https://github.com/Xander-Murphy/ASE285-Individual-ChatGPT-Clone/tree/main/tests/regression_tests

### Unit Tests

- ...

  Link: https://github.com/Xander-Murphy/ASE285-Individual-ChatGPT-Clone/tree/main/tests/unit_tests

## Project Documentation

- [Project Plan Presentation (PPP)](https://github.com/Xander-Murphy/ASE285-Individual-ChatGPT-Clone/blob/main/docs/Presentation/01_ppp_chat285.md)
- [Individual Contributions - Xander](https://github.com/Xander-Murphy/ASE285-Individual-ChatGPT-Clone/blob/main/individual/Xander/progress.md)
- 

## Schedule & Milestones

### Sprint 1

- Project setup and Repository initialization
- Basic UI and interface
- NodeJS and Express setup
- OpenAI API integration

### Sprint 2

- Websocket integration for real-time messaging
- Conversation and session management
- Local and session storage persistance
- UI improvements and bug fixes

