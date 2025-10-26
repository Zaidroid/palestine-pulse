import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import App from "./App.tsx";
import "./index.css";
import "./i18n/config"; // Initialize i18n

const queryClient = new QueryClient();

// Prevent transitions on initial page load
document.documentElement.classList.add('no-transitions');

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider 
        attribute="class" 
        defaultTheme="light" 
        enableSystem
        storageKey="theme"
        disableTransitionOnChange={false}
      >
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
