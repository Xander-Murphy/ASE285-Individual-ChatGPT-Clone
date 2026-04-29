# Non-Functional Requirements

- React-based frontend organized into screens, widgets, services, and models
- Integration with Groq's OpenAI-compatible API for AI language model responses
- localStorage persistence for conversations and active session — chosen over sessionStorage
  to survive browser restarts and Electron relaunches
- Cross-platform desktop support via Electron
- Comprehensive test suite across unit, integration, acceptance, and regression layers