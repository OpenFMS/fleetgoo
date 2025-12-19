
import React, { useState, useEffect } from 'react';
import SEO from '@/components/SEO';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Layers, HelpCircle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import { cn } from '@/lib/utils';
import { useFetchData } from '@/hooks/useFetchData';

const ProductsPage = ({ language }) => {
  const { data, loading, error } = useFetchData(`/data/${language}/products.json`);
  const [activeCategory, setActiveCategory] = useState('all');

  // Reset category when language changes to avoid stale states
  useEffect(() => {
    setActiveCategory('all');
  }, [language]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">Loading products...</div>;
  }

  if (error || !data) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-red-500">Error loading products.</div>;
  }

  const filteredProducts = activeCategory === 'all'
    ? data.items
    : data.items.filter(p => p.categoryId === activeCategory);

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
              className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-24 space-y-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0"
            >
              <div className="flex lg:flex-col gap-2 min-w-max lg:min-w-0">
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
                      <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-500 dark:text-gray-500 group-hover:text-slate-900 dark:group-hover:text-white")} />
                      <span className="flex-grow whitespace-nowrap">{cat.label}</span>
                      {isActive && (
                        <ChevronRight className="w-4 h-4 absolute right-3 opacity-100" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Product Grid */}
            <motion.div
              layout
              className="flex-grow w-full"
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product, index) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        key={product.id}
                      >
                        <Link to={`/${language}/products/${product.id}`} className="block h-full">
                          <ProductCard product={product} index={index} />
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800/30"
                  >
                    <p className="text-slate-500 dark:text-gray-400 text-lg">No products found in this category.</p>
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

export default ProductsPage;
