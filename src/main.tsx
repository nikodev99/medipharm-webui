import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {store} from "@/lib/localStorage.ts";

// Initialize root theme ASAP (avoid FOUC)
// This runs before React mounts; keep minimal, no window listeners here.
(function () {
    const storedTheme = store.get<string | undefined>('ui-theme')
    if (storedTheme) {
        document.documentElement.classList.add(storedTheme)
    }else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        document.documentElement.classList.toggle('dark', prefersDark)
    }
})()

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5_000
        }
    }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <QueryClientProvider client={queryClient}>
          <App />
      </QueryClientProvider>
  </StrictMode>,
)
