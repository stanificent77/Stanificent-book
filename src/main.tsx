import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import ErrorBoundary from './ErrorBoundary';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <Router>
    { navigator.onLine ? (
    <ErrorBoundary>
    <App />
    </ErrorBoundary>) : (
      <App/>
    )
    }
    </Router>
  </React.StrictMode>
);