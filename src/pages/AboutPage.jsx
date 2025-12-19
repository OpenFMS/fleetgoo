
import React from 'react';
import { Helmet } from 'react-helmet';
import About from '@/components/About';
import { useFetchData } from '@/hooks/useFetchData';

const AboutPage = ({ language }) => {
  const { data, loading, error } = useFetchData(`/data/${language}/about.json`);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">Loading...</div>;
  }

  if (error || !data) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-red-500">Error loading data</div>;
  }

  return (
    <>
      <Helmet>
        <title>{data.page.metaTitle}</title>
        <meta name="description" content={data.page.metaDesc} />
      </Helmet>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <About data={data} />
      </div>
    </>
  );
};

export default AboutPage;
