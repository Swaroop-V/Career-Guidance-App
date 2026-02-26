# Career Guidance App

A comprehensive web application for students to find colleges, check eligibility, take aptitude tests, and register for institutions.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

## Getting Started

1.  **Clone the repository** (if you haven't already)

2.  **Install dependencies**

    Open your terminal in the project directory and run:

    ```bash
    npm install
    ```

3.  **Set up environment variables**

    Copy the example environment file to a new file named `.env`:

    ```bash
    cp .env.example .env
    ```

    Open `.env` and fill in your Firebase configuration details. You can get these from your Firebase Console project settings.

    ```env
    VITE_FIREBASE_API_KEY="your-api-key"
    VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
    VITE_FIREBASE_PROJECT_ID="your-project-id"
    VITE_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
    VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
    VITE_FIREBASE_APP_ID="your-app-id"
    ```

    *Note: If you don't configure Firebase, the app will use mock authentication for demonstration purposes.*

4.  **Run the development server**

    ```bash
    npm run dev
    ```

5.  **Open the application**

    Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

## Project Structure

-   `src/components`: Reusable UI components
-   `src/pages`: Application pages (Home, Login, Signup, Dashboard)
-   `src/lib`: Utility functions and configurations (Firebase, Logger)
-   `src/App.tsx`: Main application component and routing

## Technologies Used

-   React
-   Vite
-   Tailwind CSS
-   Firebase (Authentication)
-   React Router
-   React Hook Form & Zod
