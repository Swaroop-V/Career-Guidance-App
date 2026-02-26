# System Architecture & Wireframe Design Document
**Project:** Career Guidance Application
**Version:** 1.0
**Date:** February 25, 2026

---

## 1. System Architecture Design

### 1.1 High-Level Architecture Diagram
The system follows a **Serverless / Backend-as-a-Service (BaaS)** architecture.

```mermaid
graph TD
    Client[Client Browser (React SPA)]
    Auth[Firebase Authentication]
    DB[Firestore Database]
    Hosting[Vite Dev Server / CDN]
    
    Client -->|Auth Requests| Auth
    Client -->|Read/Write Data| DB
    Client -->|Load Assets| Hosting
    
    subgraph "Frontend Layer"
        Client
        Router[React Router]
        State[Context API]
    end
    
    subgraph "Backend Services (Firebase)"
        Auth
        DB
    end
```

### 1.2 Component Architecture
The frontend is modularized into reusable components following Atomic Design principles.

*   **Pages (Views)**:
    *   `Home`: Landing page.
    *   `Login/SignUp`: Authentication forms.
    *   `Dashboard`: Role-based landing area (Student vs. College).
    *   `CollegeList`: Search and filter interface.
    *   `AptitudeTest`: Interactive quiz engine.
*   **Context Providers**:
    *   `AuthProvider`: Wraps the app to provide `currentUser` and `userRole` globally.
*   **Services**:
    *   `firebase.ts`: Initializes app instance.
    *   `logger.ts`: Handles environment-specific logging.

### 1.3 Data Flow Architecture
1.  **User Action**: User submits a form (e.g., College Signup).
2.  **Validation Layer**: `zod` schema validates input on the client side.
3.  **Service Layer**: `createUserWithEmailAndPassword` is called.
4.  **Data Persistence**:
    *   Auth Token received.
    *   Profile data written to `colleges/{uid}` collection in Firestore.
5.  **State Update**: `AuthContext` detects change $\rightarrow$ Updates UI $\rightarrow$ Redirects to Dashboard.

---

## 2. Wireframe Design

### 2.1 User Flow: Student Journey
1.  **Landing Page** $\rightarrow$ Click "Get Started"
2.  **Auth Selection** $\rightarrow$ Choose "Student"
3.  **Sign Up Form** $\rightarrow$ Enter Email/Password
4.  **Dashboard** $\rightarrow$ View Options:
    *   [Take Aptitude Test]
    *   [Find Colleges]
    *   [Edit Profile]
5.  **Aptitude Test** $\rightarrow$ Answer Questions $\rightarrow$ View Result & Recommendation.

### 2.2 User Flow: College Journey
1.  **Landing Page** $\rightarrow$ Click "Get Started"
2.  **Auth Selection** $\rightarrow$ Choose "College"
3.  **Registration Form** $\rightarrow$ Enter Details (Fees, Facilities, Country).
4.  **Dashboard** $\rightarrow$ View "My College Profile" (Admin View).

### 2.3 Screen Layouts (Wireframes)

#### A. Landing Page
```
+------------------------------------------------------+
|  [Logo] Career Guidance           [Login] [Sign Up]  |
+------------------------------------------------------+
|                                                      |
|           Find Your Dream Career Path                |
|       [ Student ]           [ College ]              |
|                                                      |
+------------------------------------------------------+
|  Features:                                           |
|  - Aptitude Tests                                    |
|  - Global College Search                             |
|  - Expert Guidance                                   |
+------------------------------------------------------+
```

#### B. Dashboard (Student View)
```
+------------------------------------------------------+
|  [Logo]              Dashboard        [User Profile] |
+------------------------------------------------------+
|  Welcome back, Student!                              |
|                                                      |
|  +----------------+    +----------------+            |
|  |  Aptitude Test |    |  Find Colleges |            |
|  |   [Start Now]  |    |   [Search]     |            |
|  +----------------+    +----------------+            |
|                                                      |
|  +----------------+    +----------------+            |
|  |  My Profile    |    |  Applications  |            |
|  |   [Edit]       |    |   [View]       |            |
|  +----------------+    +----------------+            |
+------------------------------------------------------+
```

#### C. Aptitude Test Interface
```
+------------------------------------------------------+
|  Question 4 of 10                      Quantitative  |
|  [=====================>           ] Progress        |
+------------------------------------------------------+
|                                                      |
|  The average of first 50 natural numbers is?         |
|                                                      |
|  ( ) 25.30                                           |
|  (•) 25.50                                           |
|  ( ) 25.00                                           |
|  ( ) 12.25                                           |
|                                                      |
+------------------------------------------------------+
|  [Previous]                          [Next Question] |
+------------------------------------------------------+
```

#### D. College Registration Form
```
+------------------------------------------------------+
|  Register Your Institution                           |
+------------------------------------------------------+
|  Institution Name: [_________________]               |
|  Country:          [ Select Country v]               |
|  Email:            [_________________]               |
|                                                      |
|  Tuition Fees:     [_________________]               |
|  Housing Fees:     [_________________]               |
|                                                      |
|  Eligibility:      [_________________]               |
|  Facilities:       [_________________]               |
|                                                      |
|  Password:         [_________________]               |
|  Confirm Password: [_________________]               |
|                                                      |
|              [ Register Institution ]                |
+------------------------------------------------------+
```

---

## 3. Technology Stack Justification

| Component | Technology | Justification |
| :--- | :--- | :--- |
| **Frontend Framework** | **React (Vite)** | Fast development, component reusability, rich ecosystem. |
| **Language** | **TypeScript** | Type safety prevents runtime errors and improves maintainability. |
| **Styling** | **Tailwind CSS** | Rapid UI development with utility-first classes; responsive by design. |
| **Authentication** | **Firebase Auth** | Secure, ready-to-use solution for email/password and social login. |
| **Database** | **Firestore** | NoSQL database perfect for flexible document structures (like college profiles). |
| **Icons** | **Lucide React** | Lightweight, consistent SVG icons. |
| **Validation** | **Zod + React Hook Form** | Robust schema validation with minimal re-renders. |
