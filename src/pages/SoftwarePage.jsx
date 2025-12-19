
import React from 'react';
import SEO from '@/components/SEO';
import Software from '@/components/Software';
import { useFetchData } from '@/hooks/useFetchData';

const SoftwarePage = ({ language }) => {
  const { data, loading, error } = useFetchData(`/data/${language}/software.json`);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">Loading...</div>;
  }

  if (error || !data) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-red-500">Error loading data</div>;
  }

  return (
    <>
      <SEO
        title={data.page.metaTitle}
        description={data.page.metaDesc}
        language={language}
        type="website"
      />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <Software data={data} />
      </div>
    </>
  );
};

export default SoftwarePage;
