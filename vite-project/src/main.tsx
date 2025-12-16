import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import './index.css';
import App from './App.tsx';
import { CartProvider } from './context/CartContext.tsx';
import { ProductProvider } from './context/ProductContext.tsx';
import { CategoryProvider } from './context/CategoryContext.tsx';



import { BrowserRouter as Router } from 'react-router-dom';
import { UserProvider } from './context/UserContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <UserProvider>
        <CategoryProvider>
          <ProductProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </ProductProvider>
        </CategoryProvider>
      </UserProvider>
    </Router>
  </StrictMode>
);
