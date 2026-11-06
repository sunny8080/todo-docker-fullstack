# Todo Frontend

React and TypeScript frontend built with Vite. The API base URL is read from `VITE_BED_URL`.

## Run locally

```sh
npm ci
cp .env.example .env
npm run dev
```

Vite serves the app at <http://localhost:5173>. Set `VITE_BED_URL` in `.env` to the backend's browser-accessible URL. For the backend's example settings, that is `http://localhost:5000`.

## Run in development with Docker Compose

From the repository root, start the full development stack:

```sh
docker compose -f docker-compose.dev.yml up --build
```

The app is served at <http://localhost:5173>. This Compose setup bind-mounts the source for Vite hot reload. See the root [README](../README.md) for backend and MongoDB details.

## Build a production image

From this directory, build the image and set the API URL that browsers will use:

```sh
docker build \
  --build-arg VITE_BED_URL=https://api.example.com \
  -t todo-frontend .
```

Run the static Nginx server with:

```sh
docker run --rm -p 5173:80 todo-frontend
```

Then open <http://localhost:5173>. The API URL is embedded into the bundle during the build. It must be reachable by users' browsers and is public, so do not put secrets in it. The API must also allow the frontend's origin through CORS.

For a coordinated frontend and backend deployment, use the root production Compose file: `docker compose up --build -d`.

> Notes -
> -v "$PWD:/app" - mounts your local frontend folder into /app inside the container. Changes you save in VS Code become visible inside the container.
> -v /app/node_modules - keeps the container's installed dependencies available without your local folder's node_modules hiding them.
