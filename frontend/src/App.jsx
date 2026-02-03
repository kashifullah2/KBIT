import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Extractor } from './pages/Extractor';
import { CVBuilder } from './pages/CVBuilder';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Extractor />} />
          <Route path="cv-builder" element={<CVBuilder />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
