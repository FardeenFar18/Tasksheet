import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client'; // Import createRoot
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Header1 from './Header';
import Footer from './Footer';





const renderApp = () => {
  createRoot(document.getElementById('root')).render(
    
      <BrowserRouter>
        <Header1/>
        <App />
      
      <Footer/>
      </BrowserRouter>
    
  );
};

renderApp();

reportWebVitals();