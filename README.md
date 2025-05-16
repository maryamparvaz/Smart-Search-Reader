📱 Smart Search Reader - Progressive Web App (PWA)
A blazing-fast Progressive Web App (PWA) built with React and TypeScript featuring smart autocomplete search, offline capability, and installability on desktop and mobile devices.

🔗 Demo
👉 Live Demo
📦 Try installing the app and using it offline!

✨ Features
🔍 Autocomplete Search – Instantly see search suggestions as you type.

🧠 Search Recommendations – Based on your recent or frequent searches.

🪄 Infinite Scroll – Load more results smoothly as you scroll.

📥 Installable PWA – Works like a native app on mobile and desktop.

🔌 Offline Support – Full offline experience using Service Workers and Cache API.

🖼️ Modern UI – Clean and responsive design built with TailwindCSS.

🎯 Project Goals
Deliver a native-like experience in a web environment

Enable install prompt and persistent offline support

Ensure real-time, smart search functionality with efficient rendering

Create a seamless and lightweight UI/UX for mobile-first users

🧪 Tech Stack
⚛️ React 18 + Hooks

⌨️ TypeScript

🎨 TailwindCSS

⚡ Vite + vite-plugin-pwa

🔧 Service Workers & Cache API

🧩 How It Works
Install Prompt Logic
App listens to the beforeinstallprompt event and shows an install banner.

Users can install the app directly onto their devices.

Once installed, the app behaves like a standalone native app.

Offline Mode
Static assets and dynamic content are cached using a Service Worker.

Previously loaded pages and searches are available without internet.

🚧 Challenges
Handling smooth autocomplete UX under high-frequency input

Ensuring search data is accessible offline

Managing caching strategies efficiently

Making install prompt show reliably on different devices

🚀 Getting Started
bash
Copy
Edit
# Install dependencies
npm install

# Run in development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
