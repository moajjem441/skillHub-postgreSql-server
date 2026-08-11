# SkillHub PostgreSQL Server

SkillHub is a robust and scalable RESTful API backend built with **Express**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**. The server handles course management, user enrollments, and authentication through JWT token verification.

---

## 🚀 Features

* **TypeScript Support:** End-to-end typed code for improved code quality, maintainability, and type safety.
* **Prisma ORM (v6) & PostgreSQL:** Relational database integration with typed models, migrations, and schema validation.
* **Authentication & Security:** Remote JWK Set (JWKS) integration using `jose-cjs` for JWT verification.
* **Transactions:** Atomic database updates for critical operations, such as creating an enrollment while safely incrementing course enrollment counts.
* **Modular Architecture:** Clean separation of concerns between Express application configuration (`app.ts`) and server initialization (`server.ts`).

---

## 🛠️ Tech Stack

| Technology        | Purpose                       |
| ----------------- | ----------------------------- |
| **Node.js**       | JavaScript Runtime            |
| **Express.js**    | REST API Framework            |
| **TypeScript**    | Programming Language          |
| **PostgreSQL**    | Relational Database           |
| **Prisma ORM v6** | Database ORM                  |
| **tsx**           | TypeScript Development Runner |
| **jose-cjs**      | JWT/JWKS Verification         |

---

## 📁 Project Structure

```text
skillhub-postgresql/
├── prisma/
│   ├── migrations/
│   └── schema.prisma          # PostgreSQL schema models
│
├── src/
│   ├── app.ts                 # Express app, middleware & routes
│   └── server.ts              # Server entry point & database connection
│
├── .env                       # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚙️ Getting Started

### 1. Prerequisites

Make sure you have the following installed:

* **Node.js** (v18 or higher)
* **PostgreSQL** (installed locally or hosted)
* **pgAdmin 4** *(optional, for database management)*

---

### 2. Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/moajjem441/skillhub-postgresql.git
cd skillhub-postgresql
npm install
```

---

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
PORT=5000

DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/skillhub?schema=public"

CLIENT_URL="http://localhost:3000"
```

Replace `YOUR_PASSWORD` with your PostgreSQL password.

Make sure a PostgreSQL database named `skillhub` exists before running the migration.

> **Note:** Never commit your `.env` file or expose your database credentials, API keys, or authentication secrets publicly.

---

## 🗄️ Database Setup & Migrations

Generate the Prisma Client:

```bash
npx prisma generate
```

Run the database migration:

```bash
npx prisma migrate dev --name init_course_and_enrollment
```

This will create the required database tables based on the models defined in `prisma/schema.prisma`.

---

## ▶️ Running the Application

Start the development server with hot-reloading:

```bash
npm run dev
```

The server should be available at:

```text
http://localhost:5000
```

---

# 🔌 API Endpoints

## Public Routes

| Method | Endpoint        | Description                      |
| ------ | --------------- | -------------------------------- |
| `GET`  | `/`             | Health check endpoint            |
| `GET`  | `/courses`      | Get all available courses        |
| `GET`  | `/courses/data` | Get top 4 featured courses       |
| `GET`  | `/courses/:id`  | Get details of a specific course |

---

## Protected Admin Routes

These routes require JWT authentication.

| Method   | Endpoint            | Description         |
| -------- | ------------------- | ------------------- |
| `POST`   | `/admin/course`     | Create a new course |
| `DELETE` | `/admin/course/:id` | Delete a course     |

---

## Enrollment Routes

| Method | Endpoint            | Description                                           |
| ------ | ------------------- | ----------------------------------------------------- |
| `POST` | `/enroll`           | Enroll a student into a course                        |
| `GET`  | `/check-enrollment` | Check whether a user is enrolled in a specific course |
| `GET`  | `/my-courses`       | Fetch all courses enrolled by a specific user         |

---

# 🧪 Sample API Payloads

## `GET /courses`

Returns a list of available courses.

**Response:**

```json
[
  {
    "id": "c-1784410318980",
    "title": "Complete MERN Stack Web Development",
    "instructor": "Md.Moajjem Hossain",
    "rating": 4.5,
    "price": 149,
    "category": "Web Development",
    "level": "Intermediate",
    "duration": "12 Weeks",
    "lessons": 40,
    "students": 0,
    "language": "English",
    "certificate": true,
    "featured": false
  }
]
```

---

## `GET /courses/:id`

Example:

```text
GET /courses/c-1784410318980
```

Returns details of a specific course.

---

## `POST /admin/course`

Creates a new course.

**Request Body:**

```json
{
  "title": "Full-Stack Development",
  "instructor": "Moajjem Hossain",
  "rating": 4.8,
  "price": 50,
  "category": "Web Development",
  "level": "Intermediate",
  "imageUrl": "https://example.com/course-image.jpg",
  "description": "Learn full-stack web development from scratch.",
  "duration": "12 Weeks",
  "lessons": 25,
  "students": 0,
  "language": "English",
  "certificate": true,
  "featured": false
}
```

---

## `POST /enroll`

Enrolls an authenticated user into a course.

**Example Request Body:**

```json
{
  "courseId": "c-1784410318980"
}
```

The enrollment operation uses a database transaction to safely create the enrollment and update the course enrollment count.

---

# 🔐 Authentication

SkillHub uses **JWT-based authentication** for protected routes.

The server verifies JWT tokens using a **Remote JWK Set (JWKS)** with `jose-cjs`.

Protected endpoints include:

```text
POST   /admin/course
DELETE /admin/course/:id
```

The authenticated user's information is extracted from the verified JWT token before processing protected requests.

---

# 💾 Database

SkillHub uses **PostgreSQL** as its relational database and **Prisma ORM v6** for database operations.

Prisma provides:

* Type-safe database queries
* Schema management
* Database migrations
* Prisma Client generation
* Relational data modeling
* Transaction support

The database schema is defined in:

```text
prisma/schema.prisma
```

---

# 🔄 Transactions

The enrollment process uses database transactions to ensure data consistency.

For example, when a student enrolls in a course:

1. The enrollment record is created.
2. The course enrollment count is incremented.
3. Both operations succeed together.
4. If any operation fails, the transaction is rolled back.

This prevents inconsistent database states.

---

# 📜 Available Scripts

### Development

```bash
npm run dev
```

Starts the development server with hot-reloading using `tsx`.

### Build

```bash
npm run build
```

Compiles the TypeScript source code into production-ready JavaScript.

### Prisma Client

```bash
npx prisma generate
```

Generates the Prisma Client based on the Prisma schema.

### Database Migration

```bash
npx prisma migrate dev --name init_course_and_enrollment
```

Creates and applies a new development database migration.

---


# 🌐 Server URLs

### Production

**Live Production API:**

```text
https://skillhub-postgre-sql.vercel.app
```

### Local Development

**Backend:**

```text
http://localhost:5000
```

**Client Application:**

```text
http://localhost:3000
```

---


# 🚀 Deployment

The backend is deployed on **Vercel** and uses **Neon PostgreSQL** as the production database.

### Production Architecture

```text
Client Application
       │
       ▼
Vercel Frontend
       │
       │ REST API
       ▼
Vercel Backend
       │
       ▼
Prisma ORM
       │
       ▼
Neon PostgreSQL
```

The production database connection is configured through the `DATABASE_URL` environment variable.

---

# 📌 Summary

SkillHub PostgreSQL Server provides a scalable backend architecture for managing:

* 📚 Courses
* 👨‍🎓 Student enrollments
* 🔐 JWT authentication
* 🗄️ PostgreSQL database operations
* 🔄 Transaction-safe enrollment workflows
* 🌐 RESTful API endpoints

The project combines **Express.js, TypeScript, Prisma ORM, and PostgreSQL** to provide a structured and maintainable backend for the SkillHub platform.

---

## 👨‍💻 Author

**Md. Moajjem Hossain**

GitHub: https://github.com/moajjem441
