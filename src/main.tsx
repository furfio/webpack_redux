import { createRoot } from 'react-dom/client';
import App from './component/App'
import React from 'react';

// Application to Render
const app = <App />;

// Render application in DOM
createRoot(document.getElementById('app')).render(app);