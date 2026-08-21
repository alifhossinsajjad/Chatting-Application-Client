# Flux Chat Application

Welcome to the Flux Chat Application repository! This project was built as part of the Senior Frontend Developer Take-Home Assignment.

## Live Demos
- **Landing Page (Part 2):** [Vercel URL here]
- **Chat App (Part 1):** [Vercel URL here]/login

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
- **TanStack Query + Axios:** Rather than using Redux (which requires massive boilerplate for server-state), I chose TanStack Query for data fetching. It provides out-of-the-box caching, pagination, and loading state management. Axios was used to easily set up a request interceptor that injects the JWT token into every protected request.
- **Service Layer Pattern:** I abstracted all API calls into dedicated service files (e.g., `src/services/chatService.ts`). This ensures the UI components remain clean, focused purely on rendering and state, and makes the application easily testable and scalable.
- **WebSocket Integration:** I wrapped `socket.io-client` in a React Context (`SocketProvider`) so the connection is maintained globally after login. The socket listener directly updates the TanStack Query cache (Optimistic UI updates), meaning new messages appear instantly without needing a hard page refresh.
- **Smart Auto-scroll Hook:** Implemented a highly optimized `useSmartScroll` hook. It detects if the user is near the bottom of the chat container; if they are, it auto-scrolls when a new message arrives. If they scrolled up to read history, it respects their position and displays a "New Messages" badge instead.

### Design Choices (Part 2 - Landing Page)
- **Visual Direction:** The landing page was designed with a premium, minimalist "Dark Mode SaaS" aesthetic. I utilized deep slate backgrounds, glassmorphism effects (blurred glowing orbs), and vibrant indigo/cyan accents.
- **Animations:** Used `framer-motion` to add subtle, elegant stagger animations on page load, and micro-interactions (like cards shifting on hover). This creates a dynamic, responsive feel that generic templates lack.
- **Layout:** Kept the messaging clear—"Conversations, without the clutter"—immediately followed by a strong CTA and a realistic dashboard mockup to ground the product.

### Issues Encountered & Handled
- **API Response Variations:** While implementing the data fetching, I added robust array checking (`Array.isArray(data)`) in the chat and sidebar components to handle potential API edge cases where the data might be wrapped in an object or return an error shape, preventing `.filter()` or `.map()` crashes.
- **Next.js Server vs Client Components:** Ensured all interactive components (providers, hooks, forms) were correctly marked with `'use client'` while keeping the potential for server-side rendering open for SEO-heavy pages like the landing page.

### Future Improvements
With more time, I would:
1. Implement virtualized lists (e.g., `react-virtual`) for the message history to ensure 60fps performance even with thousands of messages.
2. Add end-to-end (E2E) testing using Cypress or Playwright.
3. Enhance the group chat admin features (promoting members, kicking members) with dedicated modals.
