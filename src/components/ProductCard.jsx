
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, HelpCircle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const ProductCard = ({ product, index }) => {
  // Handle both component passed directly or string name from JSON
  // const Icon = typeof product.icon === 'string'
  //   ? (LucideIcons[product.icon] || HelpCircle)
  //   : (product.icon || HelpCircle);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="group bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden hover:shadow-xl dark:hover:border-blue-500/50 transition-all duration-300 h-full flex flex-col"
    >
      <div className="relative aspect-square overflow-hidden bg-transparent">
        <img
          alt={product.title}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
          src={product.image}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/600x400?text=No+Image';
          }}
        />
        <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient || 'from-blue-500/10 to-purple-500/10'} opacity-10 dark:opacity-20 group-hover:opacity-20 dark:group-hover:opacity-30 transition-opacity`} />
      </div>

      <div className="p-6 flex flex-col flex-grow">

        {/* <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${product.gradient} mb-4 shadow-md dark:shadow-none`}>
          <Icon className="w-6 h-6 text-white" />
        </div> */}

        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {product.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed flex-grow line-clamp-3">
          {product.description}
        </p>

        <div
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors group/btn mt-auto"
        >
          View Details
          <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
