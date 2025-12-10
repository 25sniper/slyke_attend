# Slyke Attend (Offline Edition)

A robust, offline-first attendance tracking application built for reliability and ease of use.

## Features (V1)

-   **Dashboard**: View all subjects with quick status indicators.
-   **Add Subject**: Create new subjects with name and total hours.
-   **Subject Detail**:
    -   View comprehensive statistics (Total Present/Absent).
    -   **Remaining %**: Bank of hours model (starts at 100%).
    -   **Current %**: Real-time performance based on classes occurred.
    -   **Safe to Miss**: Hours you can miss while maintaining 75%.
-   **Mark Attendance**: Log present/absent hours with optional dates and notes.
-   **Persistence**: Data is saved locally using IndexedDB (works offline).

## Tech Stack

-   **Frontend**: React 19 + TypeScript
-   **Build Tool**: Vite
-   **Mobile**: Capacitor (Android)
-   **Storage**: IndexedDB (`idb`)
-   **UI**: Generic CSS (no external UI framework dependencies) with `lucide-react` icons.

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Dev Server**:
    ```bash
    npm run dev
    ```

3.  **Build**:
    ```bash
    npm run build
    ```

4.  **Preview**:
    ```bash
    npm run preview
    ```
