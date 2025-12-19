
import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, BarChart3, Shield, Smartphone, Bell, MapPinned } from 'lucide-react';

const iconMap = {
  Cloud, BarChart3, Shield, Smartphone, Bell, MapPinned
};

const Software = ({ data }) => {
  if (!data) return null;

  return (
    <div className="py-20 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{data.hero.title}</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">{data.hero.subtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.features.map((feature, index) => {
            const Icon = iconMap[feature.icon] || Cloud;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:bg-slate-800/50 hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 relative"
        >
          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-2xl p-8 md:p-12 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <img alt="Fleet management software dashboard interface" className="rounded-xl shadow-2xl shadow-blue-500/20" src="https://images.unsplash.com/photo-1639060015191-9d83063eab2a" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Software;
