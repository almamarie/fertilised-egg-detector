# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

This template includes three Dockerfiles optimized for different package managers:

- `Dockerfile` - for npm
- `Dockerfile.pnpm` - for pnpm
- `Dockerfile.bun` - for bun

To build and run using Docker:

```bash
# For npm
docker build -t my-app .

# For pnpm
docker build -f Dockerfile.pnpm -t my-app .

# For bun
docker build -f Dockerfile.bun -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.



## Seting up The Camera

- add the v4l library
  - wget http://www.linux-projects.org/listing/uv4l_repo/lrkey.asc -O - | sudo apt-key add -



- Add the repository to your sources list. (Replace **buster** with your Raspbian release if different.)
  - echo "deb http://www.linux-projects.org/listing/uv4l_repo/raspbian/ buster main" | sudo tee /etc/apt/sources.list.d/uv4l.list
- Update your package lists again:
- Install UV4L along with the necessary modules for the Raspberry Pi camera:
- bash

<pre class="!overflow-visible" data-start="1253" data-end="1337"><div class="contain-inline-size rounded-md border-[0.5px] border-token-border-medium relative bg-token-sidebar-surface-primary dark:bg-gray-950"><div class="overflow-y-auto p-4" dir="ltr"><code class="!whitespace-pre language-bash"><span>sudo apt-get install uv4l uv4l-raspicam uv4l-raspicam-extras uv4l-server
</span></code></div></div></pre>



---

Built with ❤️ using React Router.
