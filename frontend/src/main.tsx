import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Apply persisted theme before React mounts to avoid a flash of the wrong theme.
const savedTheme = localStorage.getItem('theme');
const prefersDark = savedTheme === 'dark'
  || (savedTheme == null && window.matchMedia('(prefers-color-scheme: dark)').matches);
document.documentElement.classList.toggle('dark', prefersDark);

createRoot(document.getElementById("root")!).render(<App />);
