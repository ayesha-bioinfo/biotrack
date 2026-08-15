# 🧬 BioTrack

### Research. Track. Discover.

BioTrack is a full-stack research operations and biological sample tracking web application designed to provide a centralized workspace for managing research samples, researchers, workflows, and operational insights.

The application combines a modern scientific user interface with persistent database storage, allowing biological sample information to be registered, managed, and retrieved through a structured full-stack architecture.

---

## 🚀 Overview

Research workflows often involve biological samples, researchers, analysis methods, metadata, and multiple stages of processing.

BioTrack was developed to bring these components together into a single digital workspace.

The current application focuses on three core areas:

- 🧪 **Sample Management** — Register and track biological samples and associated metadata.
- 👥 **Researcher Coordination** — Organize researcher-related information and research activity.
- 📊 **Research Analytics** — Summarize sample and workflow information through an analytical interface.

---

## ✨ Key Features

### 🏠 Research Dashboard

The dashboard provides a central entry point into the BioTrack workflow.

It connects the major modules of the application:

**Register & Track Samples → Coordinate Researchers → Explore Analytics**

The interface includes a scientific dark-theme design, responsive navigation, workflow cards, animations, and visual research elements.

### 🧪 Sample Management

The Samples module allows biological sample information to be managed through the application.

Sample metadata can include:

- Sample ID
- Sample type
- Analysis type
- Workflow status
- Researcher
- Notes

Sample records are retrieved from and stored in PostgreSQL through the backend REST API rather than being maintained only in temporary frontend state.

### 👥 Researcher Workspace

The Researchers module provides a dedicated interface for organizing and presenting researcher-related information within the research workflow.

### 📊 Analytics

The Analytics module provides an interface for interpreting operational research and sample information.

It is designed to transform stored research workflow data into clearer visual summaries and insights.

### ℹ️ About & Contact

Additional About and Contact pages provide information about the platform and its purpose.

---

## 🏗️ Application Architecture

BioTrack follows a full-stack architecture:

```text
                    USER
                      │
                      ▼
              React Frontend
                Vite + JSX
                      │
                      │ HTTP / JSON
                      ▼
                 REST API
                      │
              Node.js + Express
                      │
                      │ SQL
                      ▼
                 PostgreSQL
                      │
                      ▼
                Hosted on Neon
```

The React frontend does not communicate directly with the database.

Instead:

1. The user interacts with the React interface.
2. React sends HTTP requests to the Express REST API.
3. Express processes the request.
4. The backend communicates with PostgreSQL using the `pg` package.
5. PostgreSQL performs the required database operation.
6. The backend returns a JSON response.
7. React updates the user interface.

---

## 🛠️ Technology Stack

### Frontend

- React
- JavaScript / JSX
- Vite
- React Router
- CSS
- Lucide React icons

### Backend

- Node.js
- Express.js
- REST API
- CORS
- dotenv

### Database

- PostgreSQL
- Neon PostgreSQL hosting
- `pg` Node.js PostgreSQL client

### Development & Version Control

- Visual Studio Code
- Git
- GitHub
- npm

---

## 🔄 Sample Registration Workflow

One of the main full-stack workflows in BioTrack is biological sample registration.

```text
User enters sample metadata
          │
          ▼
     React Form
          │
          ▼
   Frontend Validation
          │
          ▼
 POST /api/samples
          │
          ▼
 Node.js + Express
          │
          ▼
 PostgreSQL Query
          │
          ▼
   Neon PostgreSQL
          │
          ▼
 Sample stored persistently
          │
          ▼
 JSON response returned
          │
          ▼
 React interface updates
```

This architecture allows sample records to persist beyond browser refreshes.

---

## 🔌 REST API

The backend provides REST API endpoints for communication between the frontend and database.

Typical sample operations include:

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/samples` | Retrieve sample records |
| `POST` | `/api/samples` | Register a new sample |
| `PUT` | `/api/samples/:id` | Update an existing sample |
| `DELETE` | `/api/samples/:id` | Delete a sample |

These operations represent the standard CRUD model:

**Create → Read → Update → Delete**

---

## 🗄️ Database

BioTrack uses **PostgreSQL** as its relational database management system.

The PostgreSQL database is hosted using **Neon**.

In this architecture:

- **PostgreSQL** manages the actual data, tables, records, and SQL operations.
- **Neon** provides the cloud infrastructure used to host the PostgreSQL database.
- **Express** acts as the communication layer between React and PostgreSQL.

Database credentials are stored using environment variables and are not intended to be committed to the repository.

---

## 📁 Project Structure

```text
biotrack/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env                 # Not committed
│
├── biotrack-react/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   │
│   │   ├── assets/
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── SampleForm.jsx
│   │   │   └── SampleList.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Samples.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── Researchers.jsx
│   │   │   ├── About.jsx
│   │   │   └── Contact.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   └── package.json
│
└── .gitignore
```

---

## ⚙️ Running BioTrack Locally

### 1. Clone the repository

```bash
git clone <repository-url>
cd biotrack
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the backend directory and configure the PostgreSQL connection:

```env
DATABASE_URL=your_postgresql_connection_string
```

> Never commit database credentials or the `.env` file to GitHub.

### 4. Start the backend

```bash
node server.js
```

The backend runs locally on:

```text
http://localhost:5000
```

### 5. Start the React frontend

Open another terminal:

```bash
cd biotrack-react
npm install
npm run dev
```

The Vite development server will display the local frontend URL, typically:

```text
http://localhost:5173
```

Both the frontend and backend should be running for full application functionality.

---

## 🔐 Environment & Security

Sensitive database configuration is managed through environment variables.

The project `.gitignore` should exclude files such as:

```gitignore
node_modules/
.env
```

Production deployment would require additional security measures such as authentication, authorization, restricted CORS configuration, input validation, and production environment configuration.

---

## 🎯 Project Goal

The goal of BioTrack is to demonstrate how modern full-stack technologies can be applied to scientific research operations.

The project combines:

- Scientific workflow design
- Biological sample tracking
- Persistent relational data storage
- REST API development
- Responsive React interfaces
- Research-oriented analytics
- Full-stack application architecture

---

## 🔮 Future Improvements

Potential future development includes:

- User authentication and authorization
- Role-based access control
- Explicit study/project management
- Sample-to-study relationships
- Expanded analytical dashboards
- Advanced sample filtering
- File and analysis-result management
- Audit trails and activity history
- Automated report generation
- Production deployment
- Improved security and validation
- Integration with external bioinformatics workflows

---

## 👩‍💻 Developer

**Ayesha Zubair**

MS Bioinformatics  
Bioinformatics • Computational Biology • Full-Stack Development

---

## 📌 Project Status

BioTrack is currently under active development.

The present version demonstrates the core full-stack architecture, biological sample management workflow, research-oriented interface, REST API integration, and PostgreSQL-backed persistent storage.

---

### 🧬 BioTrack

**Research. Track. Discover.**
