
import React from 'react';
import SEO from '@/components/SEO';
import About from '@/components/About';
import { useFetchData } from '@/hooks/useFetchData';

const AboutPage = ({ language, settings }) => {
  const { data, loading, error } = useFetchData(`/data/${language}/about.json`);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">Loading...</div>;
  }

  if (error || !data) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-red-500">Error loading data</div>;
  }

  return (
    <>
      <SEO
        title={data.metaTitle || data.page?.metaTitle}
        description={data.metaDesc || data.page?.metaDesc}
        language={language}
        type="website"
        settings={settings}
      />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <About data={data} />
      </div>
    </>
  );
};

export default AboutPage;
