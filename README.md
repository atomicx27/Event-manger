# Atomic Labs Projects

This repository contains multiple experimental applications.

## Projects

### 1. [AR Space](AR/README.md) (`/AR`)
A premium Augmented Reality web application.
- **Tech**: React, Vite, Firebase, Cloudinary.
- **Features**: Admin Portal, User Gallery, WebXR AR.
- **Status**: Production Ready.

### 2. [Events](EVENTS/README.md) (`/EVENTS`)
A React + Vite application scaffold (currently template-based).
- **Tech**: React, Vite.
- **Features**: Baseline Vite setup with ESLint configuration.
- **Status**: Early scaffold.

## Repository Layout

Each app lives at the top level (`/AR`, `/EVENTS`) with its own README, dependencies,
and build workflow. Start by choosing a project directory and running its local
install and dev commands.

## App Overviews

### AR Space (`/AR`)

AR Space is a premium WebAR gallery where users browse 3D objects and admins upload
new content. It is built with React + Vite, uses Firebase for auth and Firestore
data storage, and Cloudinary for 3D model/image hosting. The experience centers on
Google's `<model-viewer>` WebXR component for in-browser AR viewing.

**Core user flow**
- Users land on the gallery and select an object to view in 3D/AR.
- Each object has a thumbnail and a WebXR-compatible model file (.glb).
- The AR viewer supports mobile AR (WebXR/Scene Viewer/Quick Look).

**Core admin flow**
- Admins authenticate and access an admin dashboard.
- Uploads push a GLB model + thumbnail to Cloudinary.
- Metadata is stored in Firestore for the gallery to render.

**Key directories**
- `src/pages`: user gallery, AR view, login, admin dashboard.
- `src/context`: auth provider + admin gating.
- `src/lib` and `src/utils`: Firebase setup + Cloudinary upload helpers.

### Events (`/EVENTS`)

Events is a social event hub app with authentication, event creation/editing,
RSVPs, comments, and personalized dashboards. It is built with React + Vite and
uses Firebase for auth, Firestore, and storage. It also includes optional AI
enhancement flows for event titles/descriptions and images.

**Core user flow**
- Users sign up/login to access the event feed.
- Create, edit, and browse events with search + category filtering.
- RSVP to events, comment on event pages, and view upcoming reminders.

**AI-assisted creation**
- Optional AI suggestions for titles/descriptions via Gemini.
- Auto-generated imagery via Pollinations (with Cloudinary upload fallback).

**Key directories**
- `src/pages`: feed, event details, create/edit, notifications, profile.
- `src/services`: Firebase, event CRUD/RSVP, notifications, AI helpers.
- `src/components`: layout + event card UI.

## Getting Started

To work on a specific project, navigate to its directory:

```bash
cd AR # or cd EVENTS
npm install
npm run dev
```
