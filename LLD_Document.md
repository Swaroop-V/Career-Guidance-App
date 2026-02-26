# Low-Level Design (LLD) Document
**Project:** Career Guidance Application
**Version:** 1.0
**Date:** February 25, 2026

---

## 1. Introduction
The Career Guidance Application is a web-based platform designed to connect students with educational institutions and help them discover their ideal career paths. It features role-based access for Students and Colleges, an aptitude testing engine, and a college discovery system.

## 2. System Architecture
The application follows a **Client-Side Rendering (CSR)** architecture using **React** (Vite) for the frontend and **Firebase** (Backend-as-a-Service) for authentication and data storage.

*   **Frontend**: React 18, TypeScript, Tailwind CSS.
*   **Backend**: Firebase (Auth, Firestore).
*   **State Management**: React Context API.
*   **Routing**: React Router DOM v6.

---

## 3. Solution Design Strategies

### 3.1 Authentication & Role Management Strategy
**Problem**: The system needs to support two distinct user types (Student, College) using a single authentication provider (Firebase Auth).
**Strategy**: **"Claim-based" Role Resolution via Firestore.**

*   **Logic**:
    1.  **Identity**: Firebase Auth handles the core identity (Email/Password).
    2.  **Role Assignment**:
        *   **College**: When a college registers, a document is created in the `colleges` Firestore collection with the document ID matching the User UID.
        *   **Student**: Default role. If a user is authenticated but has no document in `colleges`, they are treated as a Student.
    3.  **Session Persistence**:
        *   The `AuthContext` initializes an `onAuthStateChanged` listener.
        *   On login, it checks Firestore: `exists(db/colleges/{uid})`.
        *   If true $\rightarrow$ `userRole = 'college'`.
        *   If false $\rightarrow$ `userRole = 'student'`.

### 3.2 Component Design Strategy
**Problem**: Maintain consistency and reduce code duplication across pages.
**Strategy**: **Atomic Design Principles & Composition.**

*   **Atoms (Base UI)**:
    *   `Button`, `Input`, `Label`: Wrappers around HTML elements with consistent Tailwind styling (`shadcn/ui` pattern).
    *   `Card`: Composable parts (`CardHeader`, `CardContent`, `CardFooter`) to build complex UIs flexibly.
*   **Molecules (Form Elements)**:
    *   `RadioGroup`: Custom accessible radio buttons used in the Aptitude Test.
*   **Organisms (Complex Features)**:
    *   `Navbar`: Context-aware navigation that changes links based on `userRole`.
    *   `AptitudeTest`: Self-contained quiz engine.
*   **Templates**:
    *   `Layout`: Handles the persistent Navbar and Footer, wrapping the `Outlet` for page content.

### 3.3 Data Validation Strategy
**Problem**: Ensure data integrity before it reaches the database.
**Strategy**: **Schema-First Validation (Zod).**

*   **Implementation**:
    *   Schemas are defined using `zod` (e.g., `collegeSignUpSchema`).
    *   **React Hook Form** integrates with `zodResolver`.
    *   **Benefits**: Type safety is inferred directly from the validation schema (`zod.infer`), ensuring TypeScript types always match the validation logic.

### 3.4 Aptitude Test Engine Design
**Problem**: Administer a test, track answers, and generate recommendations without server round-trips for every click.
**Strategy**: **Client-Side State Machine.**

*   **State Model**:
    *   `currentQuestionIndex` (number): Tracks progress.
    *   `answers` (Record<number, number>): Maps QuestionID to SelectedOptionIndex.
    *   `score` (number): Calculated only upon completion.
*   **Re-render Optimization**:
    *   The `RadioGroup` component uses a `key={currentQuestion.id}` prop. This forces React to unmount and remount the component when the question changes, automatically clearing the internal state of the radio inputs and preventing "ghost" selections.
*   **Scoring Logic**:
    *   Simple linear evaluation: `Score = Sum(Matches(UserAnswer, CorrectAnswer))`.
    *   Recommendation Engine: Conditional logic based on percentage thresholds (>80%, >60%, <60%).

### 3.5 Logging Strategy
**Problem**: Debugging issues in production without exposing sensitive info or cluttering the console.
**Strategy**: **Environment-Aware Logging Wrapper.**

*   **Implementation**: `src/lib/logger.ts` wraps the `loglevel` library.
*   **Logic**:
    *   `IF (import.meta.env.DEV)` $\rightarrow$ Log Level: `DEBUG` (Show everything).
    *   `ELSE` $\rightarrow$ Log Level: `WARN` (Show only warnings/errors).

---

## 4. Database Schema (Firestore)

### Collection: `colleges`
Stores profile information for institutional accounts.

| Field | Type | Description |
| :--- | :--- | :--- |
| `uid` | String (PK) | Matches Firebase Auth UID. |
| `name` | String | Name of the institution. |
| `email` | String | Official contact email. |
| `country` | String | "India", "USA", etc. |
| `role` | String | Fixed value: "college". |
| `details` | Map | Nested object containing fees, facilities, etc. |
| `createdAt` | Timestamp | Account creation time. |

### Collection: `users` (Planned/Implicit)
Stores profile information for students.

| Field | Type | Description |
| :--- | :--- | :--- |
| `uid` | String (PK) | Matches Firebase Auth UID. |
| `displayName` | String | Student Name. |
| `email` | String | Student Email. |
| `preferences` | Map | Career interests, test scores. |

---

## 5. Security & Error Handling

### 5.1 Error Handling
*   **Global Boundary**: React Error Boundaries (planned) to catch UI crashes.
*   **Async Handling**: All async operations (Firebase calls) are wrapped in `try/catch` blocks.
*   **User Feedback**: Errors are captured in state (`const [error, setError]`) and displayed via UI alerts (red banners) rather than just failing silently.

### 5.2 Security Best Practices
*   **Environment Variables**: API keys are stored in `.env` and accessed via `import.meta.env`.
*   **Input Sanitization**:
    *   `zod` schemas prevent injection of invalid data types.
    *   Specific regex patterns (e.g., `/^[a-zA-Z\s&]+$/`) restrict input characters for names.
*   **Route Protection**:
    *   `AuthContext` prevents unauthenticated users from accessing `/dashboard`.
    *   Role checks redirect students away from college-specific pages.

---

## 6. Future Scalability Considerations
*   **Pagination**: The `CollegeList` currently loads all colleges. For scale, Firestore `limit()` and `startAfter()` cursors should be implemented.
*   **Server-Side Logic**: Move sensitive scoring or complex matching logic to **Firebase Cloud Functions** to prevent client-side tampering.
*   **Caching**: Implement `react-query` for caching Firestore data to reduce read costs.
