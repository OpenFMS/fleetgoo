import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useOutletContext, useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useFetchData } from '@/hooks/useFetchData';

// Lazy loading components
const HomePage = lazy(() => import('@/pages/HomePage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ProductsPage = lazy(() => import('@/pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'));
const SolutionsPage = lazy(() => import('@/pages/SolutionsPage'));
const SolutionDetailPage = lazy(() => import('@/pages/SolutionDetailPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const SoftwarePage = lazy(() => import('@/pages/SoftwarePage'));
const LegalPage = lazy(() => import('@/pages/LegalPage'));

// Admin Components - Only load in development
const isDevelopment = import.meta.env.MODE === 'development';
const AdminLayout = isDevelopment ? lazy(() => import('@/components/admin/AdminLayout')) : null;
const ContentEditor = isDevelopment ? lazy(() => import('@/pages/admin/ContentEditor')) : null;
const LanguageManager = isDevelopment ? lazy(() => import('@/pages/admin/LanguageManager')) : null;

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Wrapper specifically for Legal Page to check valid docIds
const LegalPageWrapper = () => {
  const context = useOutletContext();
  const { docId } = useParams(); // Start from v6, useParams works inside children too
  // Only allow specific legal docs
  const VALID_DOCS = ['privacy', 'terms'];
  if (!VALID_DOCS.includes(docId)) {
    return <Navigate to="/" replace />; // Or 404
  }
  return <LegalPage />;
};

// Helper component to pass language context to pages
const PageWrapper = ({ Component }) => {
  const context = useOutletContext();
  const language = context ? context.language : 'en';
  const settings = context ? context.settings : null;
  const commonData = context ? context.commonData : null;
  return <Component language={language} settings={settings} commonData={commonData} />;
};

const LanguageRedirect = () => {
  const { data: settings, loading } = useFetchData('/data/settings.json');
  if (loading) return <LoadingFallback />;
  const defaultLang = settings?.defaultLanguage || 'en';
  return <Navigate to={`/${defaultLang}`} replace />;
};

const App = () => {
  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Admin Routes - Only in development */}
          {isDevelopment && AdminLayout && (
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<div className="p-8 text-center text-slate-500">Select a file from the sidebar or manage languages</div>} />
              <Route path="editor" element={<ContentEditor />} />
              <Route path="languages" element={<LanguageManager />} />
            </Route>
          )}

          {/* Public Routes */}
          <Route path="/" element={<LanguageRedirect />} />

          <Route path="/:lang" element={<Layout />}>
            <Route index element={<PageWrapper Component={HomePage} />} />
            <Route path="about-us" element={<PageWrapper Component={AboutPage} />} />
            <Route path="products" element={<PageWrapper Component={ProductsPage} />} />
            <Route path="products/:id" element={<PageWrapper Component={ProductDetailPage} />} />

            <Route path="solutions" element={<PageWrapper Component={SolutionsPage} />} />
            <Route path="solutions/:id" element={<PageWrapper Component={SolutionDetailPage} />} />

            <Route path="contact" element={<PageWrapper Component={ContactPage} />} />
            <Route path="software" element={<PageWrapper Component={SoftwarePage} />} />
            <Route path=":docId" element={<LegalPageWrapper />} />
          </Route>

          <Route path="*" element={<LanguageRedirect />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
