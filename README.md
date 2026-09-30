<div align="center">

# RoleLens

**AI-powered interview preparation: paste a job description, add your resume or self-description, and get a tailored interview strategy.**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Gemini](https://img.shields.io/badge/Google-Gemini_API-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [How It Works](#how-it-works)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Reference](#api-reference)
- [Security](#security)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [Acknowledgements](#acknowledgements)

---

## Overview

Preparing for an interview usually means guessing what will be asked and where your profile falls short. **RoleLens** removes the guesswork. You provide the job description together with your resume (PDF) or a short self-description, and RoleLens uses Google's Gemini model to produce a structured report containing:

- a **match score** showing how well your profile fits the role,
- likely **technical and behavioral questions**, each with the interviewer's intention and a model answer,
- a ranked list of **skill gaps**, and
- a **day-by-day preparation roadmap**.

It can also generate a **resume tailored to the role** and export it as a PDF.

---

## Features

| Area | What you get |
| --- | --- |
| **Interview report** | Match score (0-100), technical questions, behavioral questions, skill gaps with severity, and a day-wise preparation plan |
| **Flexible input** | Upload a PDF resume, write a self-description, or use both |
| **Tailored resume PDF** | Generate a resume tailored to the target job and download it as a PDF |
| **Report history** | Every report is saved to your account. Search your plans by title and delete the ones you no longer need |
| **Authentication** | Register, log in and log out with secure, HTTP-only cookie-based sessions |
| **Responsive UI** | Responsive interface with keyboard-accessible question cards, loading states and error handling |

---

## Tech Stack

**Frontend**

- React 19 and React Router 7
- Vite 8
- Sass (SCSS)
- Axios

**Backend**

- Node.js
- Express 5
- MongoDB with Mongoose
- Google Gemini via `@google/genai`
- JSON Web Tokens and bcryptjs for authentication
- Zod for input validation and structured AI output
- Multer and `pdf-parse` for resume upload and text extraction
- Puppeteer for rendering resume PDFs
- Helmet and `express-rate-limit` for security hardening

---

## How It Works

```
Job description + Resume (PDF) / Self-description
                     │
                     ▼
   React client ──► Express API ──► validation + PDF text extraction
                                          │
                                          ▼
                                   Gemini (structured JSON)
                                          │
                                          ▼
                              MongoDB (saved per user)
                                          │
                                          ▼
   Report view ◄── Interview plan: score, questions, gaps, roadmap
```

1. The client sends the job description and resume to the API as `multipart/form-data`.
2. The server validates the input, checks the upload is a real PDF, and extracts its text.
3. The text is sent to Gemini with a JSON schema, so the response comes back in a fixed, validated shape.
4. The report is stored against the signed-in user and displayed in the report view.
5. On request, a tailored resume is generated as HTML, rendered to PDF in a locked-down headless browser, and streamed back for download.

---

## Project Structure

```
RoleLens/
├── Backend/
│   ├── server.js                  # Entry point: env checks, DB connection, server start
│   ├── scripts/
│   │   └── syntax-check.js        # Lightweight syntax check for backend files
│   └── src/
│       ├── app.js                 # Express app: Helmet, CORS, rate limits, error handler
│       ├── config/                # Database connection
│       ├── controllers/           # Authentication and interview controllers
│       ├── middlewares/           # Authentication and file upload middleware
│       ├── models/                # User, interview report and token blacklist schemas
│       ├── routes/                # Authentication and interview routes
│       └── services/
│           └── ai.service.js      # Gemini calls and PDF generation
│
└── Frontend/
    └── src/
        ├── components/            # Shared UI components
        ├── features/
        │   ├── auth/              # Login, Register, auth context, hooks and API
        │   └── interview/         # Home, interview report, hooks, API and styles
        ├── styles/                # Shared styles
        ├── app.routes.jsx         # Route definitions
        └── style.scss             # Global styles and design tokens
```

---

## Getting Started

### Prerequisites

- **Node.js** 20.19+ or 22.12+ (required by Vite 8)
- **npm**
- A **MongoDB** database, either local or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- A **Google Gemini API key** from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone the repository

```bash
git clone https://github.com/falguniiiii/RoleLens.git
cd RoleLens
```

### 2. Set up the backend

```bash
cd Backend
npm install
cp .env.example .env
```

Open `Backend/.env` and fill in your values (see [Environment Variables](#environment-variables)). To generate a strong `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Start the API:

```bash
npm run dev
```

The server runs on `http://localhost:3000` by default.

> `npm install` also downloads a Chromium build for Puppeteer, so the first install can take a little while.

### 3. Set up the frontend

In a second terminal:

```bash
cd Frontend
npm install
npm run dev
```

The app is served at `http://localhost:5173`. If your API runs somewhere other than `http://localhost:3000`, copy `Frontend/.env.example` to `Frontend/.env` and set `VITE_API_URL`.

### 4. Try it out

1. Open `http://localhost:5173` and create an account.
2. Paste a job description, then upload a PDF resume or write a short self-description.
3. Click **Generate My Interview Strategy** and wait for the report to be generated.
4. Explore the questions, skill gaps and roadmap, then download a tailored resume.

---

## Environment Variables

### Backend (`Backend/.env`)

| Variable | Required | Description |
| --- | :---: | --- |
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Long random string used to sign session tokens |
| `GOOGLE_GENAI_API_KEY` | Yes | Gemini API key |
| `CLIENT_ORIGIN` | No | Allowed frontend origin for CORS. Default: `http://localhost:5173` |
| `NODE_ENV` | No | Set to `production` to mark cookies as `secure` (HTTPS only) |
| `PORT` | No | API port. Default: `3000` |

The server refuses to start if any required variable is missing.

### Frontend (`Frontend/.env`)

| Variable | Required | Description |
| --- | :---: | --- |
| `VITE_API_URL` | No | Base URL of the API. Default: `http://localhost:3000` |

> **Never commit real credentials.** `.env` files are git-ignored; only the `.env.example` templates belong in the repository.

---

## Available Scripts

### Backend

| Command | Description |
| --- | --- |
| `npm run dev` | Start the API with auto-reload (nodemon) |
| `node scripts/syntax-check.js` | Run the backend syntax check |


### Frontend

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Lint the source with ESLint |

---

## API Reference

All routes are prefixed with `/api`. Routes marked **Auth** require a valid session cookie, which is set on login or registration.

### Authentication

| Method | Endpoint | Auth | Description |
| --- | --- | :---: | --- |
| `POST` | `/auth/register` | | Create an account (`username`, `email`, `password`) |
| `POST` | `/auth/login` | | Log in (`email`, `password`) |
| `POST` | `/auth/logout` | | Clear the session cookie and invalidate the token |
| `GET` | `/auth/get-me` | ✔ | Get the current user |

### Interview reports

| Method | Endpoint | Auth | Description |
| --- | --- | :---: | --- |
| `POST` | `/interview` | ✔ | Generate a report. `multipart/form-data` with `jobDescription`, `selfDescription` and an optional `resume` (PDF) |
| `GET` | `/interview` | ✔ | List your reports (summary fields only) |
| `GET` | `/interview/report/:interviewId` | ✔ | Get one of your reports in full |
| `DELETE` | `/interview/report/:interviewId` | ✔ | Delete one of your reports |
| `POST` | `/interview/resume/pdf/:interviewReportId` | ✔ | Generate and download a tailored resume PDF |

### Input limits

| Field | Limit |
| --- | --- |
| Job description | Required, up to 12,000 characters |
| Self-description | Up to 5,000 characters. Required if no resume is uploaded (minimum 20 characters) |
| Resume | PDF only, up to 3 MB, one file |
| Username | 3-30 characters: letters, numbers, `.`, `_`, `-` |
| Password | 8-72 characters |

### Rate limits

Sensitive endpoints are rate-limited to reduce abuse and excessive API usage.


---

## Security

RoleLens was built with security in mind, and these protections are in place:

**Authentication and sessions**
- Passwords are hashed with **bcryptjs** (cost factor 12) and never returned by the API.
- Sessions use a JWT stored in an **HTTP-only, `SameSite=Lax` cookie** (`Secure` in production), so it is never exposed to client-side JavaScript or `localStorage`.
- Tokens are pinned to the `HS256` algorithm and expire after 24 hours. Logging out adds the token to a blacklist that cleans itself up automatically.
- Login returns the same error for unknown emails and wrong passwords, so accounts cannot be enumerated.

**Input handling**
- All auth input is validated with **Zod**. Because fields must be strings, NoSQL operator injection (for example `{"$ne": null}`) is rejected.
- Uploads are restricted to small PDFs, checked by MIME type, extension and **PDF signature bytes**.
- The AI's output is validated against a schema, and only whitelisted fields are saved, so the model can never overwrite fields such as the report owner.

**Access control**
- Every report query is scoped to the signed-in user, so one user cannot read, delete or generate a PDF from another user's report.

**AI and PDF safety**
- User text is fenced as untrusted data in prompts to reduce prompt-injection risk.
- AI-generated resume HTML is sanitized and rendered in headless Chromium with **JavaScript disabled and all network requests blocked**, which prevents script execution and server-side request forgery.

**Platform hardening**
- **Helmet** security headers, a locked-down **CORS** origin, a 100 KB JSON body limit, and **rate limiting** on authentication and AI endpoints.
- A central error handler returns generic messages, so stack traces and internals are never leaked.
- Secrets are read from environment variables only and validated at startup.

Found a vulnerability? Please open a private security advisory on GitHub rather than a public issue.

---

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `Missing required env var: ...` on startup | Make sure `Backend/.env` exists and defines `MONGO_URI`, `JWT_SECRET` and `GOOGLE_GENAI_API_KEY` |
| MongoDB connection error | Check your connection string, and on Atlas add your IP address to the network access list |
| CORS errors or login not sticking | Set `CLIENT_ORIGIN` to the exact URL of your frontend and keep `VITE_API_URL` pointing at the API |
| Cookie not set in production | Serve both apps over HTTPS (cookies are `Secure` when `NODE_ENV=production`) |
| "Could not read that PDF" | Upload a text-based PDF. Scanned or image-only resumes have no extractable text |
| Resume PDF generation fails | Puppeteer needs Chromium. Re-run `npm install` in `Backend`, or install the system libraries Chromium requires on Linux |
| Gemini errors or empty reports | Verify the API key and quota in Google AI Studio |

---

## Roadmap

- [ ] Support for `.docx` resumes
- [ ] Export the interview report as PDF
- [ ] Mock-interview mode with answer feedback
- [ ] Compare several job descriptions against one resume
- [ ] Automated test suite and CI pipeline

---

## Acknowledgements

- [Google Gemini](https://ai.google.dev/) for the generative AI models
- [Puppeteer](https://pptr.dev/) for headless PDF rendering
- The open-source maintainers of React, Express, Mongoose and Vite