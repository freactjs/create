import { createRoot } from '@freact/core';
import { BrowserRouter } from '@freact/router';
import { App } from './App';
import './main.css';

createRoot('#root').render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
