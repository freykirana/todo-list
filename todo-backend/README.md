# Todo Backend API

Express.js + Prisma 5 Todo Management API

## Installation

```bash
npm install
```

## Environment Setup

Create a `.env` file with:
```
DATABASE_URL="postgresql://user:password@localhost:5432/todo_db"
JWT_SECRET="your_jwt_secret_key_here"
PORT=4000
```

## Database Setup

```bash
npm run prisma:push
npm run prisma:seed
```

## Running the Server

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Tasks (Protected)
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Categories (Protected)
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
