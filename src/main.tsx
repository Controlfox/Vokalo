import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './ErrorBoundary.tsx'
import { UserProvider } from './Context/UserContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <UserProvider>
        <App />
      </UserProvider>

    </ErrorBoundary>
  </StrictMode>,
)
