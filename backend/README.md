# Todo Backend

Express and Mongoose API for the todo app.

## Run locally

Start MongoDB locally, then from this directory:

```sh
npm ci
cp .env.sample .env
npm run dev
```

The sample `.env` uses MongoDB at `mongodb://127.0.0.1:27017/todo_app` and sets the API port to `5000`. The API health endpoint is <http://localhost:5000/api/health>. Configure the frontend's `VITE_BED_URL` to the same API origin and set `CLIENT_ORIGIN` to the frontend origin.

## Run in development with Docker Compose

From the repository root:

```sh
docker compose -f docker-compose.dev.yml up --build -d
```

Compose runs the API on <http://localhost:3000> and connects it to the MongoDB service at `mongodb://database:27017/todo_app`. The database is persisted in a named Docker volume. Use `docker compose -f docker-compose.dev.yml down` to stop the stack; add `-v` to remove the database volume as well.

## Build and run the production image

The production image uses `npm start` and does not include development dependencies. Create a private `.env.prod` file in this directory with at least `MONGO_URI`, `PORT=3000`, and `CLIENT_ORIGIN`. Do not commit database credentials.

Copy .env file and update env vars:

```sh
cp .env.sample .env
nano .env
```

Build and run docker container:

```sh
docker build -t todo-backend .
docker run --rm --name todo-backend \
  --env-file .env.prod \
  -p 3000:3000 \
  todo-backend
```

The backend listens on port `3000` in the container. `MONGO_URI` is provided when the container starts; it is not baked into the image. For the full production stack, use `docker compose up --build -d` from the repository root.

## API routes

- `GET /api/health` reports API health.
- `GET /api/todos` lists todos.
- `POST /api/todos` creates a todo.
- `PATCH /api/todos/:id` updates a todo.
- `DELETE /api/todos/:id` deletes a todo.
