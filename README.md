# Flashcards Frontend

This is the **frontend part of the Flash cards web application**, which is part of my bachelor's thesis at the Czech Technical University in Prague (CTU). The frontend is built with **React** using the **Next.js** framework.

It provides a user-friendly interface for interacting with flashcards, handling user authentication, and managing personal collections and accounts. The frontend communicates with the backend via REST API.

The project is **deployed on [Vercel.com](https://vercel.com/)**. The frontend project is located inside the `frontend` directory of the repository. You can visit the flash cards web appliaction **[here](https://flashcards-cafoulu1.vercel.app)**.

---

## Project Structure

The frontend source code resides in:

### Main Directories

| Directory | Description                                                         |
|-----------|---------------------------------------------------------------------|
| `public`  | Public static assets used by the application (images, icons, etc.). |
| `src/app` | Main application code, structured by routes and supporting modules. |

### Pages (`src/app`)

All folders (except `context`, `hooks`, and `components`) represent **pages** in the Next.js routing system:

| Page               | Description                                                                                                                                                                                                                                                |
|--------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `about-app`        | Page with information about the Flashcards application.                                                                                                                                                                                                    |
| `account`          | User account management page.                                                                                                                                                                                                                              |
| `admin-page`       | Administrative interface (for admin users).                                                                                                                                                                                                                |
| `auth`             | Authentication-related pages, including login, registration, reset password, and OAuth2 redirect handling.                                                                                                                                                 |
| `collections/[id]` | Dynamic routing for displaying and practicing flashcard collections (`collections/[id]`). Subpages for different practice modes: base, multiple choice, true/false. Collections page handles exploration and browsing through collections (`collections`). |
| `contact`          | Contact page for user feedback or support.                                                                                                                                                                                                                 |
| `home`             | The main landing page of the application if a user is not logged in.                                                                                                                                                                                       |

### Supporting Directories

| Directory                           | Description                                                            |
|-------------------------------------|------------------------------------------------------------------------|
| `context`                           | Only AuthProvider context at the time to manage global state of users. |
| `hooks`                             | Custom React hooks for working with context or fetching data.          |
| `components`                        | Reusable UI components, organized for better code clarity:             |
| &nbsp;&nbsp;&nbsp;&nbsp;`elements`  | UI elements (buttons, inputs, etc.).                                   |
| &nbsp;&nbsp;&nbsp;&nbsp;`functions` | Utility components or functions used across pages.                     |
| &nbsp;&nbsp;&nbsp;&nbsp;`fetches`   | Components handling data fetching logic.                               |

### Middleware

The project includes **middleware** to handle user redirection based on authentication state. Unauthorized users are redirected to login pages when accessing protected routes.

---

## Deployment & Running the Application

The application is **deployed on Vercel** and is built using **next build**.

### Environment Variables

The application requires several environment variables to be set for the proper configuration. These are configured on Vercel.com and are not included in the codebase due to their sensitivity.
