# Quiz Builder

A full-stack application for creating and viewing quizzes.

**Tech Stack:**

- **Backend**: Node.js, Express, TypeScript, Prisma, SQLite

- **Frontend**: Next.js (React), TypeScript

- **Infrastructure**: `ts-node-dev` for dev mode, Prisma Migrate for database

---

## Features

### Quiz Creation

- **Quiz title** field (minimum 3 characters)

- **Dynamic question management** — add/remove questions on the fly

- **3 question types supported**:

1. **BOOLEAN**

- Question text

- Select correct answer: **True / False**

2. **INPUT**

- Question text

- Free-text correct answer

3. **CHECKBOX**

- Question text

- Minimum **3 answer options**

- Mark **one or more** correct answers

- Validation: at least one answer must be correct

### Quiz Viewing

- **All Quizzes** page — list of all quizzes:

  - Title

  - Question count

  - Creation date

- **Quiz detail** page:

  - Title and creation timestamp

  - For each question:

    - Question type (BOOLEAN / INPUT / CHECKBOX)

    - Question text

    - **Correct answers highlighted**:

      - BOOLEAN — `True` / `False` badge

      - INPUT — text badge with correct answer

      - CHECKBOX — correct options highlighted in green

---

## Requirements

- Node.js 18+

- npm (or pnpm / yarn)

---

## Setup

### 1\. Clone and Install Dependencies

```bash
git clone <repo-url> quiz-builder
cd quiz-builder

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2\. Database Setup (Prisma + SQLite)

Create `backend/.env`:

```env
DATABASE_URL="file:./dev.db"
```

Then in the `backend` directory:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

This creates the `dev.db` file and generates the Prisma Client.

---

## Running in Development Mode

### Backend

```bash
cd backend
npm run dev
# Backend listening on http://localhost:4000
```

### Frontend

In another terminal:

```bash
cd frontend
npm run dev
# Frontend running on http://localhost:3000
```

---

## Usage

### Create a Quiz

1. Open [http://localhost:3000/create](http://localhost:3000/create)

2. Fill in:

- **Quiz title**

- Add questions via `+ Add question`

- Select type for each question:

  - **Boolean** — True/False

  - **Input** — free text

  - **Checkbox** — list of options with ability to mark correct ones

1. Click **Create quiz**

2. After successful creation, navigate to the quiz list to see your new quiz

### View All Quizzes

- Go to [http://localhost:3000](http://localhost:3000) or click **All Quizzes** in the menu

- Click on a quiz title to open the detail page

### View a Single Quiz

- URL format: `http://localhost:3000/quizzes/<id>`

- The page displays all questions and correct answers

## Known Limitations / Future Improvements

- **Legacy `pages` router**  
  The project currently uses the legacy `pages` router. In a real production application I would use the `app` router (Next.js 13+) with server components and more modern routing patterns.

- **Manual validation (no Zod / react-hook-form yet)**  
  Request and form validation is implemented manually in controllers/services on the backend and directly in React components on the frontend. A better approach would be to introduce a shared schema layer using [Zod](https://github.com/colinhacks/zod) and use it together with `react-hook-form` on the frontend and with the backend DTOs.

- **Inline styles and limited componentization**  
  Many UI pieces still use inline styles and some logic (e.g. rendering different question types) lives inside a single component. As a next step, this could be refactored into smaller presentational components and shared helpers, and styled using a utility-first framework like Tailwind CSS.
