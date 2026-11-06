# MERN Todo

A todo app with a React and Vite frontend, an Express and Mongoose API, and MongoDB.

## Run the full stack for development

Requirements: Docker and Docker Compose.

From the repository root, start the development stack:

```sh
docker compose -f docker-compose.dev.yml up --build -d
```

Open the app at <http://localhost:5173>. The API is at <http://localhost:3000>, and MongoDB is published on port `27017`. Mongo Express is available at <http://localhost:8081>.

The frontend and backend source directories are bind-mounted, so code changes are picked up by Vite and Nodemon. MongoDB data is kept in a named Docker volume.

Stop the stack with:

```sh
docker compose -f docker-compose.dev.yml down
```

To also delete the development database volume, run `docker compose -f docker-compose.dev.yml down -v`.

## Run the production stack

The production Compose file builds the frontend and backend images. It expects a MongoDB connection string in `backend/.env.prod`; create that file from `backend/.env.example` and set `MONGO_URI` to your production database. Keep the file private and out of version control.

Copy .env file and update env vars

```sh
cp .env.sample .env
nano .env
```

Start docker containers-

```sh
docker compose up -d --build
```

The app is available at <http://localhost:5173> and the API at <http://localhost:3000>. View service status and logs with `docker compose ps` and `docker compose logs -f`. Stop the production stack with `docker compose down`.

For a deployed site, set the browser-visible API URL and allowed frontend origin before building. For example:

```sh
VITE_BED_URL=https://api.example.com \
CLIENT_ORIGIN=https://app.example.com \
docker compose up -d --build
```

`VITE_BED_URL` is embedded in the frontend bundle during the build, so changing it requires rebuilding the frontend. It is a public URL and must not contain credentials or secrets.

## Run without Docker

Install Node.js and npm, and have MongoDB running locally. In separate terminals:

```sh
cd backend
npm ci
cp .env.example .env
npm run dev
```

```sh
cd frontend
npm ci
cp .env.example .env
npm run dev
```

The frontend's example API URL is `http://localhost:3000`; the backend's example MongoDB URL is `mongodb://127.0.0.1:27017/todo_app`.

## API

- `GET /api/health` reports API health.
- `GET`, `POST`, `PATCH`, and `DELETE /api/todos` manage todos. Update and delete routes take a todo ID, for example `/api/todos/:id`.
