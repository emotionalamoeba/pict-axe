/**
 * index.tsx
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import * as React from 'react';
import { createRoot } from 'react-dom/client';

// Use consistent styling
import 'sanitize.css/sanitize.css';

import { App } from 'app';

const rootElement = document.getElementById('root') as HTMLElement;
const root = createRoot(rootElement);

root.render(    
  <React.Fragment>
        <React.StrictMode>
          <App />
        </React.StrictMode>
    </React.Fragment>
);