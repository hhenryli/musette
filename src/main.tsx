import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CollectionsProvider } from "./context/CollectionsContext"

import './index.css'
import App from './App.tsx'
import { DiscoveryProvider } from './context/DiscoveryContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <CollectionsProvider>
        <DiscoveryProvider>
          <App />
        </DiscoveryProvider>
      </CollectionsProvider>
    </BrowserRouter>
  </StrictMode>,
)
