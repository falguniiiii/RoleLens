# RoleLens

RoleLens is an AI-powered interview preparation app that analyzes a job description and a candidate's resume or self-description to generate a structured interview strategy.

## Stack

- React + Vite
- Express
- MongoDB + Mongoose
- Gemini API via `@google/genai`
- Puppeteer for generated resume PDFs
- Zod for validation
- Helmet + rate limiting for API hardening

## Local setup

### Backend

```bash
cd Backend
npm install
```

Create `Backend/.env` locally using `Backend/.env.example` as the template.

Start the API:

```bash
npm run dev
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

Create `Frontend/.env` locally using `Frontend/.env.example` if the backend is not running at the default `http://localhost:3000`.

## Environment variables

Never commit real credentials. `.env` is ignored by Git. Only `.env.example` files belong in the repository.

## API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/get-me`
- `POST /api/interview`
- `GET /api/interview`
- `GET /api/interview/report/:interviewId`
- `DELETE /api/interview/report/:interviewId`
- `POST /api/interview/resume/pdf/:interviewReportId`

Authentication uses an HTTP-only JWT cookie. The JWT is never stored in localStorage or returned to the browser as a client-managed token.

## Security notes

The backend validates user input, restricts resume uploads to small PDF files, checks PDF signature bytes, rate-limits sensitive endpoints, restricts report access by owner, validates structured AI output, and keeps Gemini/MongoDB credentials server-side.

## Postman

Postman is optional for running the app. It can be used to test the API independently. Login establishes the HTTP-only cookie that Postman can reuse for protected requests.
