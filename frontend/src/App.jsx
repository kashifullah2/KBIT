import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Extractor } from './pages/Extractor';
import CVBuilderRoot from './pages/CVBuilder/Root';
import CVGallery from './pages/CVBuilder/Gallery';
import { CVEditor } from './pages/CVBuilder/Editor';

import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import PDFMerger from './pages/PDFMerger';
import AIAssistant from './pages/AIAssistant';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

import { HelmetProvider } from 'react-helmet-async';
import { Home } from './pages/Home';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="extractor" element={<Extractor />} />
              <Route path="cv-builder" element={<CVBuilderRoot />}>
                <Route index element={<CVGallery />} />
                <Route path="edit" element={<CVEditor />} />
              </Route>
              <Route path="pdf-merger" element={<PDFMerger />} />
              <Route path="ai-assistant" element={<AIAssistant />} />

              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
