import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './2-context/authContext.tsx';
import { CartProvider } from './2-context/cartContext.tsx';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from './4-components/8-error boundary/error boundary.tsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './1-assets/styles/Toast.css';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <App/>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
    <ToastContainer limit={1} position="top-right" autoClose={2000} />
  </StrictMode>
)