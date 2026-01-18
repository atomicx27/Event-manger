# AR Space - Premium Web AR Experience

A premium Augmented Reality web application that allows users to explore and place 3D objects in their real environment directly from the browser. Built with React, Vite, Firebase, and Cloudinary.

🚀 **Live Demo**: [https://ar-app-1b2b4.web.app](https://ar-app-1b2b4.web.app)

## ✨ Features

- **Augmented Reality**: Seamless AR experience using Google's `<model-viewer>` (WebXR). Place, rotate, and resize objects.
- **Dual-Role Authentication**:
  - **User Portal**: Browse a gallery of 3D objects.
  - **Admin Portal**: Secure dashboard to manage content.
- **Cloud Management**:
  - Files stored in **Cloudinary** (optimized for delivery).
  - Metadata managed in **Firebase Firestore**.
- **Premium UI**: Glassmorphism design, dark mode aesthetics, and smooth animations.

## 🛠️ Tech Stack

- **Frontend**: React, Vite
- **Styling**: Vanilla CSS (CSS Variables, Glassmorphism)
- **AR Engine**: `@google/model-viewer`
- **Backend (Serverless)**:
  - **Auth**: Firebase Authentication
  - **Database**: Firebase Firestore
  - **Storage**: Cloudinary (for .glb content)

## 🚀 Getting Started

### Prerequisites

- Node.js installed.
- A Firebase Project (with Auth & Firestore enabled).
- A Cloudinary Account (Unsigned Upload Preset needed).

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/atomicx27/AR-project.git
    cd AR-project
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Keys:
    - Update `src/lib/firebase.js` with your Firebase config.
    - Update `src/utils/cloudinary.js` with your Cloud Name & Upload Preset.

4.  Run the development server:
    ```bash
    npm run dev
    ```

## 📖 Usage Guide

### Admin Access
To manage 3D objects, log in to the admin portal.

- **URL**: `/admin-login`
- **Default Credentials** (for demo/dev):
  - **Email**: `admin@orange.com`
  - **Password**: `admin123`
- **Dashboard**: Upload `.glb` files (max 10MB) and thumbnail images.

### User Experience
- Visit the home page to see the gallery.
- Click on an item to view it in 3D.
- **Mobile Only**: Tap the **"View in AR"** button to activate the camera and place the object in your room.

## 📦 Deployment

This project is configured for **Firebase Hosting**.

```bash
npm run build
npx firebase deploy --only hosting
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
