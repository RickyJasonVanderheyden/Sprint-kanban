# Sprint Kanban

Sprint Kanban is a productivity web application designed to help users organize their work, focus on what matters, and achieve more using energy-matched tasks and kanban boards. Built with [Next.js](https://nextjs.org) and TypeScript, Sprint Kanban brings together task management, focus sprints, and visual dashboards to maximize your productivity.

## Features

- **Kanban Task Management:**  
  Organize your tasks into customizable kanban columns (e.g., To Do, In Progress, Done) and track your progress visually.

- **Focus Sprints:**  
  Use energy-based focus sprints to match tasks to your current energy level and boost productivity.

- **TaskCat Companion:**  
  A cute, draggable companion that shows your remaining tasks and keeps you motivated.

- **Visual Progress Dashboards:**  
  Track overall progress, daily stats, and task completion milestones.

- **Task Editing & Management:**  
  Add, edit, categorize, and delete tasks. Assign energy level, category, estimated time, and kanban column.

- **Achievements & Motivation:**  
  Unlock achievements and enjoy playful UI elements like floating bubbles and animated feedback.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

API routes are available under `/api/*`, for example:
- `/api/kanban` for kanban board management.
- `/api/tasks` for CRUD operations on tasks.
- `/api/health` for health checks.

## Project Structure

- `Sprint/focus-sprints/` - Main app code.
  - `src/pages/` - Next.js pages (entry points for routes).
  - `src/components/` - React components (TaskList, TaskDashboard, AddTask, FocusTimer, etc.).
  - `src/lib/` - Utilities, types, and database access.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - Interactive Next.js tutorial.

## Deployment

This project is deployed on [Vercel](https://vercel.com/).
You can access the live application here: [https://sprint-kanban.vercel.app/](https://sprint-kanban.vercel.app/)

## License

This project currently does not specify a license.

---

Homepage: [https://sprint-kanban.vercel.app](https://sprint-kanban.vercel.app)
Repo: [RickyJasonVanderheyden/Sprint-kanban](https://github.com/RickyJasonVanderheyden/Sprint-kanban)
