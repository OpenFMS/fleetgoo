
import React from 'react';
import SEO from '@/components/SEO';
import Contact from '@/components/Contact';
import { useFetchData } from '@/hooks/useFetchData';

const ContactPage = ({ language, settings }) => {
  const { data, loading, error } = useFetchData(`/data/${language}/contact.json`);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">Loading contact information...</div>;
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-red-500">
        <p>Error loading contact page. Please try again later.</p>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={data.metaTitle}
        description={data.metaDesc}
        language={language}
        type="website"
        settings={settings}
      />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <Contact data={data} language={language} settings={settings} />
      </div>
    </>
  );
};

export default ContactPage;
