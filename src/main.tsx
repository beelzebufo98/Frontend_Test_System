import '@gravity-ui/uikit/styles/fonts.css'
import '@gravity-ui/uikit/styles/styles.css'
import { ThemeProvider } from '@gravity-ui/uikit'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Application from './Application.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme="light">
      <Application />
    </ThemeProvider>
  </StrictMode>,
)
