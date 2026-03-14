import React, { ReactNode, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HelmetProvider } from 'react-helmet-async';

// ✅ Lazy load components for better initial load time
const Extractor = lazy(() => import('./pages/Extractor').then(m => ({ default: m.Extractor })));
const CVBuilderRoot = lazy(() => import('./pages/CVBuilder/Root'));
const CVGallery = lazy(() => import('./pages/CVBuilder/Gallery'));
const CVEditor = lazy(() => import('./pages/CVBuilder/Editor').then(m => ({ default: m.CVEditor })));
const PDFMerger = lazy(() => import('./pages/PDFMerger'));
const AIAssistant = lazy(() => import('./pages/AIAssistant'));

// ✅ Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen bg-slate-950 text-white">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
      <p>Loading...</p>
    </div>
  </div>
);

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingFallback />;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* AI Assistant is the default landing page */}
              <Route
                index
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <AIAssistant />
                  </Suspense>
                }
              />
              <Route path="ai-assistant" element={<Navigate to="/" replace />} />

              <Route
                path="extractor"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Extractor />
                  </Suspense>
                }
              />
              <Route
                path="cv-builder"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <CVBuilderRoot />
                  </Suspense>
                }
              >
                <Route
                  index
                  element={
                    <Suspense fallback={<LoadingFallback />}>
                      <CVGallery />
                    </Suspense>
                  }
                />
                <Route
                  path="edit"
                  element={
                    <Suspense fallback={<LoadingFallback />}>
                      <CVEditor />
                    </Suspense>
                  }
                />
              </Route>
              <Route
                path="pdf-merger"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <PDFMerger />
                  </Suspense>
                }
              />

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
