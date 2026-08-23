# Flux Chat Application

Welcome to the Flux Chat Application repository! This project was built as part of the Senior Frontend Developer Take-Home Assignment.

## Live Demos
- **Landing Page (Part 2):** https://chating-application-xi.vercel.app/
- **Chat App (Part 1):**[[ [Vercel URL here]/login](https://chating-application-xi.vercel.app/chat)](https://chating-application-xi.vercel.app/login)

## Tech Stack
- **Framework:** Next.js 15 (App Router) + TypeScript
- **Styling:** Tailwind CSS + Framer Motion
- **State Management:** TanStack Query (React Query)
- **Real-time:** Socket.io-client
- **HTTP Client:** Axios

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/alifhossinsajjad/Chatting-Application-Client.git
   cd Chatting-Application-Client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Part 3: Thought Process

### Architecture & Libraries Choices (Part 1)
- **Next.js (App Router) + TypeScript:** Chosen for its robust routing, layout system, and strong type safety. TypeScript is essential for preventing runtime errors and maintaining a clean, self-documenting codebase.
- **TanStack Query + Axios:** Rather than using Redux, I chose TanStack Query for data fetching. It provides caching, optimistic updates, and seamless background refetching, allowing the app to traverse complex data states quickly and efficiently.
- **Service Layer Pattern:** I abstracted all API calls into dedicated service files (e.g., `src/services/chatService.ts`). This ensures the UI components remain clean.
- **WebSocket Integration:** I wrapped `socket.io-client` in a React Context so the connection is maintained globally. The socket listener directly updates the TanStack Query cache, meaning new messages appear instantly.
- **Smart Auto-scroll Hook:** Implemented an optimized `useSmartScroll` hook. It detects if the user is near the bottom of the chat container; if they are, it auto-scrolls when a new message arrives.

### AI Tools Usage
As permitted by the assignment guidelines, I utilized AI tools (like GitHub Copilot / LLMs) during development primarily for:
1. **Boilerplate Generation:** Quickly generating the initial structure of Tailwind CSS classes and React component skeletons.
2. **Debugging:** Assisting in identifying the root cause of WebSocket edge cases and React Query caching issues.
3. **Drafting:** Helping to structure this thought process document and the API documentation logic.
*Note: All architectural decisions, component structures, and complex logic (like the centralized Axios interceptor for mapping IDs, or the `isGroup` detection fallbacks) were manually curated, reviewed, and implemented by me.*

### Design Choices (Part 2 - Landing Page)
- **Visual Direction:** The landing page was designed with a premium, minimalist "Dark Mode SaaS" aesthetic. I utilized deep slate backgrounds, glassmorphism effects (blurred glowing orbs), and vibrant indigo/cyan accents.
- **Animations:** Used `framer-motion` to add subtle, elegant stagger animations on page load, and micro-interactions (like cards shifting on hover). This creates a dynamic, responsive feel that generic templates lack.
- **Layout:** Kept the messaging clear—"Conversations, without the clutter"—immediately followed by a strong CTA and a realistic dashboard mockup to ground the product.

### Issues Encountered & Handled
- **API Response Variations:** While implementing the data fetching, I added robust array checking (`Array.isArray(data)`) in the chat and sidebar components to handle potential API edge cases.
- **Group Detection Quirk:** The backend sometimes returns `type: "group"` instead of `isGroup: true`, or fails to return either for the creator. I built a bulletproof check that infers a group if it has an `admins` array.
- **ID Field Discrepancies:** The API sometimes returns `_id` instead of `id`. I added an Axios interceptor to recursively normalize all `_id` fields to `id` across the entire app.

### Future Improvements
With more time, I would:
1. Implement virtualized lists (e.g., `react-virtual`) for the message history to ensure 60fps performance even with thousands of messages.
2. Add end-to-end (E2E) testing using Cypress or Playwright.
3. Add Lodash debounce on the user search input to reduce API calls while typing.
