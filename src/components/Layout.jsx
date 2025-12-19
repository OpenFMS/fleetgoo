
import React from 'react';
import { Outlet, useParams, Navigate, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';

// Helper component to scroll to top on route change
const ScrollToTop = () => {
    const { pathname } = useLocation();

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

const Layout = () => {
    const { lang } = useParams();
    const validLanguages = ['en', 'es', 'zh'];

    // If lang is not valid, redirect to 'en'
    // Note: This check might happen before rendering current content, 
    // but usually generic 404 is better or explicit redirect.
    // For simplicity, if we are in this component, the route matched /:lang
    // so let's validate it.
    if (!validLanguages.includes(lang)) {
        return <Navigate to="/en" replace />;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
            <ScrollToTop />
            {/* Header now takes lang directly. setLanguage will be handled by navigation in Header */}
            <Header language={lang} />

            <main className="flex-grow pt-20">
                <Outlet context={{ language: lang }} />
            </main>

            <Footer language={lang} />
            <Toaster />
        </div>
    );
};

export default Layout;
