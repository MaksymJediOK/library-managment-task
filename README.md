# Library Management System

A NestJS-based library management system with Prisma ORM for database operations.

## Features

- Book management (CRUD operations)
- Member registration and management
- Book borrowing and returning system
- Genre categorization
- Search functionality

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- PostgreSQL database

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd LibrarySystem/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following content:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/library_db"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma migrate dev

   # Seed the database with initial data
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run start:dev
   # or
   yarn start:dev
   ```

The server will start at `http://localhost:3000`

## API Documentation

Once the server is running, you can access the Swagger documentation at:
`http://localhost:3000/api`

## Available Scripts

- `npm run start` - Start the production server
- `npm run start:dev` - Start the development server with hot-reload
- `npm run build` - Build the application
- `npm run test` - Run tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:cov` - Run tests with coverage
- `npm run lint` - Run linting

## Project Structure

```
src/
├── book/           # Book management module
├── member/         # Member management module
├── borrowing/      # Book borrowing module
├── prisma/         # Database configuration and migrations
└── main.ts         # Application entry point
```

## API Endpoints

### Books
- `GET /books` - List all books
- `GET /books/:isbn` - Get book details
- `POST /books` - Add a new book
- `PATCH /books/:isbn` - Update book information
- `DELETE /books/:isbn` - Delete a book
- `GET /books/search` - Search books

### Members
- `POST /members` - Register a new member
- `GET /members/:id` - Get member details by ID
- `GET /members/member-id/:memberId` - Get member details by memberId

### Borrowings
- `POST /borrowings/borrow` - Borrow a book
- `POST /borrowings/return` - Return a book

