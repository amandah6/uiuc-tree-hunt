import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import Home from './pages/Home';
import BuildingMap from './pages/BuildingMap';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.4.0/dist/leaflet.css"  integrity="sha512-puBpdR0798OZvTTbP4A8Ix/l+A4dHDD0DGqYW6RQ+9jxkRFclaxxQb/SJAWZfWAkuyeQUytO7+7N4QKrDh+drA=="  crossorigin=""/> 
    <title>UIUC Tree Hunt</title>
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/map/:buildingName' element={<BuildingMap />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
