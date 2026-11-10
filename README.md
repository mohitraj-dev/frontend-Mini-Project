# TaskPilot AI

An AI-powered task management app that helps you finish what you plan, not just list what you have to do.

> Status: In development. This README is updated after every build step. Items marked [Planned] are not built yet.

---

## 1. The Problem

Most task apps only store what you need to do. People still end up overwhelmed because they do not know:

* where to start
* what matters most
* what to do when the plan falls apart

## 2. The Solution

You tell the app your goal. AI agents plan it, prioritise it and follow up until it is done.

## 3. Features

| Feature                | What it does                                                                                 | Status    |
| ---------------------- | -------------------------------------------------------------------------------------------- | --------- |
| Task CRUD              | Create, view, update and delete tasks                                                        | [Planned] |
| Natural language input | Type "submit report tomorrow 5pm high priority" and the app extracts date, time and priority | [Planned] |
| AI task breakdown      | A big goal is split into small, clear, actionable steps                                      | [Planned] |
| Smart daily plan       | Your day is organised by deadline, importance and available time                             | [Planned] |
| Smart follow-ups       | Missed deadlines trigger a reminder and a suggested new time                                 | [Planned] |
| Progress insights      | Daily and weekly summaries of done, pending and next focus                                   | [Planned] |

## 4. Design Direction

* Minimal glassmorphism
* Purple colour theme
* Clean geometric font (Futura, with a sans-serif fallback)
* Calm and distraction-free

## 5. Tech Stack

| Layer             | Technology                            | Why this choice                                                      |
| ----------------- | ------------------------------------- | -------------------------------------------------------------------- |
| Language          | Java 21                               | Core language of the Java full stack course                          |
| Backend framework | Spring Boot                           | Industry standard for building REST APIs in Java                     |
| Data access       | Spring Data JPA (Hibernate)           | Maps Java classes to database tables without writing all SQL by hand |
| Database          | PostgreSQL or MySQL (to be confirmed) | Reliable relational storage for tasks and users                      |
| Frontend          | HTML, CSS, JavaScript                 | Full control over the glassmorphism design                           |
| AI                | Claude API                            | Powers task breakdown, language understanding and planning           |
| Build tool        | Maven                                 | Manages dependencies and builds the project                          |
| Version control   | Git and GitHub                        | Tracks every change and shows progress publicly                      |

## 6. Architecture

```text
Browser (HTML, CSS, JS)
        |
        | HTTP requests (JSON)
        v
Spring Boot Backend
   - Controller layer   receives requests
   - Service layer      business logic and AI agent calls
   - Repository layer   talks to the database
        |                         |
        v                         v
    Database                  Claude API
```

### How a request flows:

1. The user types a task in the browser.
2. The frontend sends it to a controller as JSON.
3. The service layer calls the AI when needed, then applies business rules.
4. The repository saves the result to the database.
5. The response goes back to the browser and the screen updates.

## 7. Project Structure (planned)

```text
taskpilot-ai/
│
├── backend/
│   ├── src/main/java/com/taskpilot/
│   │   ├── controller/     API endpoints
│   │   ├── service/        business logic and AI agents
│   │   ├── repository/     database access
│   │   ├── model/          entities (Task, User)
│   │   ├── dto/            request and response objects
│   │   └── config/         settings and security
│   │
│   ├── src/main/resources/
│   │   └── application.properties
│   │
│   └── pom.xml
│
├── frontend/
│   ├── index.html
│   ├── css/
│   └── js/
│
├── docs/
│   └── learning-notes/     one note per build step
│
└── README.md
```

## 8. Getting Started

### Prerequisites

* JDK 21
* Maven (or the Maven wrapper included in the project)
* PostgreSQL or MySQL
* An IDE such as IntelliJ IDEA or VS Code
* A Claude API key

### Setup

```bash
git clone <your-repository-url>
cd taskpilot-ai/backend
```

1. Create a database named `taskpilot`.
2. Copy `application.properties.example` to `application.properties` and fill in your database details.
3. Set your API key as an environment variable. Never commit it to Git.

```bash
export ANTHROPIC_API_KEY=your_key_here
```

4. Run the backend:

```bash
./mvnw spring-boot:run
```

5. Open `frontend/index.html` in your browser.

## 9. Roadmap

* [ ] Step 1: Project setup, Task entity, database, CRUD APIs
* [ ] Step 2: Glassmorphism user interface
* [ ] Step 3: Natural language task input
* [ ] Step 4: AI task breakdown
* [ ] Step 5: Smart daily plan
* [ ] Step 6: Smart follow-ups for missed deadlines
* [ ] Step 7: Daily and weekly progress insights
* [ ] Step 8: User login and security
* [ ] Step 9: Deployment

## 10. Learning Journey

This project is built for learning. Every step has a note in `docs/learning-notes/` that answers:

* What did we build?
* Why did we build it this way?
* How does it work, line by line?
* Where does it fit in the whole app?
* What is the objective and the meaning of each new term?
* What mistakes happened and how were they fixed?

## 11. Daily Progress Log

| Day | Date       | What was built        | Key learning                             |
| --- | ---------- | --------------------- | ---------------------------------------- |
| 1   | 2026-11-03 | Project idea and plan | Defined features, stack and architecture |

## 12. Author

**Mohit Raj**

BCA graduate, learning Java full stack, building in public.

## 13. License

To be decided.
┌──────────────────────────────────────────────┐
│                                              │
│  Good Morning 👋                       ♡     │
│  Welcome back!                               │
│                                              │
│  YOUR PERSONAL SPACE                         │
│  Your Tasks!                                 │
│  Saturday, November 7                         │
│                                              │
│  [All] [To-do] [Completed]                   │
│                                              │
├────────────────────────┬─────────────────────┤
│                        │                     │
│  TODAY'S FOCUS         │  CREATE A TASK      │
│                        │                     │
│  Daily Progress  60%   │  Task Name          │
│  ████████████          │                     │
│                        │  Due Date           │
│  🔍 Search tasks       │  Priority           │
│                        │                     │
│  □ Complete Java       │  [+ Add Task]       │
│    Priority: High      │                     │
│                        ├─────────────────────┤
│  □ Learn React         │  PRODUCTIVITY       │
│    Priority: Medium    │                     │
│                        │  05 Pending          │
│  ✓ HTML Practice       │  03 Completed       │
│                        │  01 Overdue         │
│                        │                     │
│  [Clear Completed]     │                     │
│                        │                     │
├────────────────────────┴─────────────────────┤
│                                              │
│          Designed for productivity           │
└──────────────────────────────────────────────┘