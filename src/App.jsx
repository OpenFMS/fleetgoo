import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useOutletContext } from 'react-router-dom';
import Layout from '@/components/Layout';

// Lazy loading components
const HomePage = lazy(() => import('@/pages/HomePage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ProductsPage = lazy(() => import('@/pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'));
const SolutionsPage = lazy(() => import('@/pages/SolutionsPage'));
const SolutionDetailPage = lazy(() => import('@/pages/SolutionDetailPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const SoftwarePage = lazy(() => import('@/pages/SoftwarePage'));

// Admin Components
const AdminLayout = lazy(() => import('@/components/admin/AdminLayout'));
const ContentEditor = lazy(() => import('@/pages/admin/ContentEditor'));
const LanguageManager = lazy(() => import('@/pages/admin/LanguageManager'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Helper component to pass language context to pages
const PageWrapper = ({ Component }) => {
  const context = useOutletContext();
  const language = context ? context.language : 'en';
  return <Component language={language} />;
};

const App = () => {
  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<div className="p-8 text-center text-slate-500">Select a file from the sidebar or manage languages</div>} />
            <Route path="editor" element={<ContentEditor />} />
            <Route path="languages" element={<LanguageManager />} />
          </Route>

          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/en" replace />} />

          <Route path="/:lang" element={<Layout />}>
            <Route index element={<PageWrapper Component={HomePage} />} />
            <Route path="about-us" element={<PageWrapper Component={AboutPage} />} />
            <Route path="products" element={<PageWrapper Component={ProductsPage} />} />
            <Route path="products/:id" element={<PageWrapper Component={ProductDetailPage} />} />

            <Route path="solutions" element={<PageWrapper Component={SolutionsPage} />} />
            <Route path="solutions/:id" element={<PageWrapper Component={SolutionDetailPage} />} />

            <Route path="contact" element={<PageWrapper Component={ContactPage} />} />
            <Route path="software" element={<PageWrapper Component={SoftwarePage} />} />
          </Route>

          <Route path="*" element={<Navigate to="/en" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
