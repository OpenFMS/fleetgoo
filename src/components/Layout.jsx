
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

import { useFetchData } from '@/hooks/useFetchData';

const Layout = () => {
    const { lang } = useParams();
    const { data: settings } = useFetchData('/data/settings.json');
    const { data: commonData, loading } = useFetchData(lang ? `/data/${lang}/common.json` : null);

    const validLanguages = settings?.languages?.map(l => l.code) || ['en', 'es', 'zh'];

    // If lang is not valid, redirect to 'en'
    if (settings && !validLanguages.includes(lang)) {
        return <Navigate to={`/${settings.defaultLanguage || 'en'}`} replace />;
    }

    if (loading || !settings) return null;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
            <ScrollToTop />
            <Header language={lang} commonData={commonData} settings={settings} />

            <main className="flex-grow pt-20">
                <Outlet context={{ language: lang, commonData, settings }} />
            </main>

            <Footer language={lang} commonData={commonData} settings={settings} />
            <Toaster />
        </div>
    );
};

export default Layout;
