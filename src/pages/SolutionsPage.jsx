
import React, { useState, useEffect } from 'react';
import SEO from '@/components/SEO';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Building2, ShieldCheck, Truck, Bike, Car, Key,
  Database, HardHat, ChevronRight, Layers, ArrowRight,
  HelpCircle
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFetchData } from '@/hooks/useFetchData';

const SolutionsPage = ({ language }) => {
  const { data, loading, error } = useFetchData(`/data/${language}/solutions.json`);
  const [activeCategory, setActiveCategory] = useState('all');

  // Reset category when language changes
  useEffect(() => {
    setActiveCategory('all');
  }, [language]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">Loading solutions...</div>;
  }

  if (error || !data) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-red-500">Error loading solutions.</div>;
  }

  const filteredSolutions = activeCategory === 'all'
    ? data.items
    : data.items.filter(s => s.categoryId === activeCategory);

  return (
    <>
      <SEO
        title={data.page.metaTitle}
        description={data.page.metaDesc}
        language={language}
        type="website"
      />
      <div className="py-20 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
        <div className="container mx-auto px-4">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">{data.page.title}</h1>
            <p className="text-xl text-slate-600 dark:text-gray-400 max-w-3xl mx-auto">{data.page.subtitle}</p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* Sidebar / Categories Filter */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full lg:w-72 flex-shrink-0 lg:sticky lg:top-24 space-y-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide"
            >
              <div className="flex lg:flex-col gap-2 min-w-max lg:min-w-0 pr-4 lg:pr-0">
                {data.categories.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  const Icon = LucideIcons[cat.icon] || Layers;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium w-full text-left relative overflow-hidden group",
                        isActive
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                          : "bg-white dark:bg-slate-800/50 text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border border-transparent hover:border-slate-300 dark:hover:border-slate-700"
                      )}
                    >
                      <Icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-white" : "text-slate-500 dark:text-gray-500 group-hover:text-slate-900 dark:group-hover:text-white")} />
                      <span className="flex-grow whitespace-nowrap">{cat.label}</span>
                      {isActive && (
                        <ChevronRight className="w-4 h-4 absolute right-3 opacity-100" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Solutions Grid */}
            <motion.div
              layout
              className="flex-grow w-full"
            >
              <AnimatePresence mode="popLayout">
                {filteredSolutions.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {filteredSolutions.map((solution, index) => {
                      const Icon = LucideIcons[solution.icon] || HelpCircle;

                      return (
                        <motion.div
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3 }}
                          key={solution.id}
                        >
                          <Link to={`/${language}/solutions/${solution.id}`} className="block h-full group">
                            <div className="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 h-full flex flex-col">
                              {/* Image Section */}
                              <div className="h-48 relative overflow-hidden">
                                <img
                                  src={solution.image}
                                  alt={solution.title}
                                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60" />
                                <div className="absolute bottom-4 left-4">
                                  <div className={`w-10 h-10 rounded-lg bg-${solution.color}-500/20 backdrop-blur-md border border-${solution.color}-500/30 flex items-center justify-center text-white`}>
                                    <Icon className="w-5 h-5" />
                                  </div>
                                </div>
                              </div>

                              {/* Content Section */}
                              <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                  {solution.title}
                                </h3>
                                <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                                  {solution.summary}
                                </p>
                                <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-semibold mt-auto">
                                  {data.page.readMore || "Read Case Study"}
                                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800/30"
                  >
                    <p className="text-slate-500 dark:text-gray-400 text-lg">No solutions found in this category yet.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

          </div>
        </div>
      </div>
    </>
  );
};

export default SolutionsPage;
