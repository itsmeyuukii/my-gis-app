import React from 'react';
import ReactDOM from 'react-dom/client';

import 'maplibre-gl/dist/maplibre-gl.css'; // MUST be before App
import './index.css';
import 'maplibre-gl/dist/maplibre-gl.css';

import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
);