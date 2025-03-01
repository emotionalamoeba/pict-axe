/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

import { IndexPage } from './pages/IndexPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={process.env.PUBLIC_URL + '/'} Component={IndexPage} />        
      </Routes>
    </BrowserRouter>
  );
}
