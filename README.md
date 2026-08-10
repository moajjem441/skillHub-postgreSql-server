# SkillHub PostgreSQL Server

SkillHub is a robust, scalable RESTful API backend built with **Express**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**. The server handles course management, user enrollments, and authentication via JWT token verification.

---

## 🚀 Features

- **TypeScript Support:** End-to-end typed code for maximum code quality and safety.
- **Prisma ORM (v6) & PostgreSQL:** Relational database integration with typed models, migrations, and schema validation.
- **Authentication & Security:** Remote JWK Set (JWKS) integration using `jose-cjs` for verification.
- **Transactions:** Atomic updates for critical flows (e.g., creating an enrollment while incrementing course counts safely).
- **Modular Architecture:** Clean separation of concerns between Express routes (`app.ts`) and server initialization (`server.ts`).

---

## 🛠️ Tech Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma Client (v6)
- **Dev Runner:** `tsx` (TypeScript Execution Engine)

---

## 📁 Project Structure

```text
skillhub-postgresql/
├── prisma/
│   ├── migrations/
│   └── schema.prisma    # PostgreSQL Schema Models
├── src/
│   ├── app.ts           # Express app, middleware, & routes
│   └── server.ts        # Server entry point & DB connection
├── .env                 # Environment variables
├── package.json
├── tsconfig.json
└── README.md
⚙️ Getting Started1. PrerequisitesMake sure you have installed:Node.js (v18 or higher)PostgreSQL database installed locally or hostedpgAdmin 4 (optional, for viewing database GUI)2. InstallationClone the repository and install the dependencies:Bashgit clone [https://github.com/your-username/skillhub-postgresql.git](https://github.com/your-username/skillhub-postgresql.git)
cd skillhub-postgresql
npm install
3. Environment SetupCreate a .env file in the root directory and add the following configuration:Code snippetPORT=5000
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/skillhub?schema=public"
CLIENT_URL="http://localhost:3000"
Note: Replace YOUR_PASSWORD with your local PostgreSQL password, and ensure a database named skillhub exists in PostgreSQL.4. Database Setup & MigrationsRun Prisma client generation and execute database migrations to set up tables:Bash# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init_course_and_enrollment
5. Running the ApplicationStart the development server with live-reloading:Bashnpm run dev
The server should be running live at http://localhost:5000.🔌 API Endpoints ReferencePublic RoutesMethodEndpointDescriptionGET/Health check endpointGET/coursesGet all available coursesGET/courses/dataGet top 4 featured coursesGET/courses/:idGet single course details by IDProtected Routes (Admin)MethodEndpointDescriptionPOST/admin/courseCreate a new course (Requires JWT Auth)DELETE/admin/course/:idDelete a course (Requires JWT Auth)Enrollment RoutesMethodEndpointDescriptionPOST/enrollEnroll a student into a courseGET/check-enrollmentCheck if a user is enrolled in a specific courseGET/my-coursesFetch all courses enrolled by a specific user📜 Available Scriptsnpm run dev - Starts the development server with hot-reload via tsx.npm run build - Compiles TypeScript code into production-ready JavaScript (dist/).