# ATLAS: Advanced Traffic Layer Anomaly System

Welcome to the ATLAS frontend repository. This application is a modern, responsive, and AI-enhanced dashboard for security operations, built with Next.js, React, and Tailwind CSS.

## Table of Contents

- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Connecting to Your Backend](#connecting-to-your-backend)
- [Generative AI Integration](#generative-ai-integration)

---

## Technology Stack

The frontend is built with a curated set of modern technologies to ensure a high-quality, performant, and maintainable application:

- **Framework**: **Next.js 15** (with App Router)
- **Language**: **TypeScript**
- **UI Library**: **React 19**
- **Styling**: **Tailwind CSS**
- **Component Library**: **shadcn/ui** for foundational UI primitives.
- **Data Visualization**: **Recharts** for charts and graphs.
- **Icons**: **Lucide React** for the entire icon set.
- **Generative AI**: **Genkit** with **Google's Gemini** models.
- **Form Handling**: **React Hook Form** for robust and validated forms.

---

## Project Structure

The project follows a feature-oriented structure within the Next.js App Router paradigm.

```
/src
├── app
│   ├── (dashboard)         # Main application pages (e.g., Overview, Incidents)
│   │   ├── api-monitoring
│   │   ├── ...
│   │   └── layout.tsx      # Shared layout for the dashboard
│   ├── (auth)              # Authentication pages (Login, Signup, etc.)
│   │   └── layout.tsx      # Shared layout for auth cards
│   ├── api                 # **API Proxy Routes** (Connects frontend to your backend)
│   │   ├── overview
│   │   │   └── route.ts
│   │   └── ...
│   ├── globals.css         # Global styles & Tailwind theme
│   └── layout.tsx          # Root application layout
│
├── components
│   ├── ui                  # Core shadcn/ui components (Button, Card, etc.)
│   ├── dashboard           # Dashboard-specific components (Sidebar, Header)
│   └── auth                # Auth-specific components
│
├── ai
│   ├── flows               # Genkit server-side AI flows
│   └── genkit.ts           # Genkit configuration
│
├── context
│   └── EnvironmentContext.tsx # Manages "Cloud" vs "Local" state
│
├── lib
│   ├── types.ts            # TypeScript type definitions for all data structures
│   ├── utils.ts            # Utility functions
│   └── placeholder-images.json # Manages placeholder image data
│
└── ...
```

---

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Run the development server**:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:9002`.

---

## Connecting to Your Backend

This frontend is designed to be backend-agnostic. It uses a **proxy pattern** through Next.js API Routes to communicate with your backend. This prevents CORS issues and securely hides your backend URL from the client-side code.

### Step 1: Configure Your Backend URL

The most important step is to tell the frontend where your backend is located.

1.  Open the `.env` file in the root of the project.
2.  Set the `NEXT_PUBLIC_ATLAS_BACKEND_URL` variable to the URL of your running backend server.

    ```
    NEXT_PUBLIC_ATLAS_BACKEND_URL=http://localhost:8000
    ```

### Step 2: Review the API Proxy Routes

The frontend components **do not** fetch data directly from your backend. Instead, they make requests to local API routes located in `src/app/api/`. These routes are responsible for forwarding the request to your actual backend.

**Example: The Overview Page**

-   The page component `src/app/(dashboard)/overview/page.tsx` makes a `fetch` call to `/api/overview`.
-   The API route `src/app/api/overview/route.ts` receives this request.
-   This route then makes a server-to-server request to `{NEXT_PUBLIC_ATLAS_BACKEND_URL}/overview`.
-   It forwards the response (or an error) back to the frontend component.

```typescript
// src/app/api/overview/route.ts

import {NextResponse} from 'next/server';

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url);
  const env = searchParams.get('env') || 'cloud';

  const backendUrl = `${process.env.NEXT_PUBLIC_ATLAS_BACKEND_URL}/overview?env=${env}`;

  try {
    const response = await fetch(backendUrl);
    // ... forward response
  } catch (error) {
    // ... handle connection error
  }
}
```

If your backend has different endpoint paths (e.g., `/api/v1/dashboard-overview` instead of `/overview`), you will need to **update the `backendUrl` variable** in the corresponding route file within `src/app/api/`.

### Step 3: Match Data Structures

The frontend expects data to be in a specific format, which is defined by TypeScript types in `src/lib/types.ts`.

For example, the `Incident` type is defined as:

```typescript
// src/lib/types.ts
export type Incident = {
    id: string;
    eventName: string;
    timestamp: string;
    severity: Severity;
    // ... and so on
};
```

If your backend returns incident data with different property names (e.g., `incident_id` instead of `id`), you have two options:

1.  **(Recommended)** Update the types in `src/lib/types.ts` to match your backend's data structure.
2.  **(Alternative)** Transform the data within the API proxy route (`src/app/api/...`) before sending it to the frontend.

### Step 4: Authentication for POST/PUT Requests

For actions that modify data (like quarantining a device or remediating an incident), you will need to pass an authentication token. This logic should be added to the relevant API proxy route.

**Example (Conceptual):**

```typescript
// src/app/api/incidents/remediate/route.ts

// import { cookies } from 'next/headers'; // Example for getting a cookie

export async function POST(request: Request) {
  // 1. Get the auth token (from a cookie, for example)
  // const token = cookies().get('auth_token')?.value;

  const backendUrl = `${process.env.NEXT_PUBLIC_ATLAS_BACKEND_URL}/incidents/remediate`;

  const response = await fetch(backendUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 2. Add the Authorization header
      // 'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(await request.json()),
  });

  // ...
}
```

---

## Generative AI Integration

The application uses **Genkit** for all AI-powered features, such as the Daily Briefing and the AI Investigator.

-   **Flows**: All AI prompts and logic are defined as "flows" in `src/ai/flows/`. These are server-side functions marked with `'use server';`.
-   **Configuration**: The Genkit instance is configured in `src/ai/genkit.ts`. It defaults to using Google's Gemini models. You can change the model or provider here if needed.
-   **Calling Flows**: Client components import and call these flows directly, as if they were regular async functions. Next.js and Genkit handle the server-side execution automatically.
