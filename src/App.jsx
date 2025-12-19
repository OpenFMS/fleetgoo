
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useOutletContext } from 'react-router-dom';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import ProductsPage from '@/pages/ProductsPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import SolutionsPage from '@/pages/SolutionsPage';
import SolutionDetailPage from '@/pages/SolutionDetailPage';
import SoftwarePage from '@/pages/SoftwarePage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';

// Helper component to pass language context as prop to pages
// This avoids modifying all page components immediately
const PageWrapper = ({ Component }) => {
  const context = useOutletContext();
  // Ensure context exists before accessing property
  const language = context ? context.language : 'en';
  return <Component language={language} />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to /en */}
        <Route path="/" element={<Navigate to="/en" replace />} />

        {/* Language Routes */}
        <Route path="/:lang" element={<Layout />}>
          <Route index element={<PageWrapper Component={HomePage} />} />
          <Route path="products" element={<PageWrapper Component={ProductsPage} />} />
          <Route path="products/:productId" element={<PageWrapper Component={ProductDetailPage} />} />
          <Route path="solutions" element={<PageWrapper Component={SolutionsPage} />} />
          <Route path="solutions/:solutionId" element={<PageWrapper Component={SolutionDetailPage} />} />
          <Route path="software" element={<PageWrapper Component={SoftwarePage} />} />
          <Route path="about-us" element={<PageWrapper Component={AboutPage} />} />
          <Route path="contact" element={<PageWrapper Component={ContactPage} />} />
        </Route>

        {/* Global 404 - Redirect to /en */}
        <Route path="*" element={<Navigate to="/en" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
