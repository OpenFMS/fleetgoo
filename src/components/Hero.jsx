
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const translations = {
  en: {
    title: 'Advanced Vehicle Intelligence',
    subtitle: 'Transform Your Fleet with Smart Hardware & AI-Powered Software',
    description: 'Industry-leading GPS tracking, 4G dashcams, MDVR systems, and comprehensive fleet management platform trusted by businesses worldwide.',
    cta1: 'Explore Products',
    cta2: 'Contact Sales',
  },
  es: {
    title: 'Inteligencia Vehicular Avanzada',
    subtitle: 'Transforme Su Flota con Hardware Inteligente y Software con IA',
    description: 'Rastreo GPS, dashcams 4G, sistemas MDVR y plataforma integral de gestión de flotas líder en la industria, confiada por empresas en todo el mundo.',
    cta1: 'Explorar Productos',
    cta2: 'Contactar Ventas',
  },
  zh: {
    title: '先进的车辆智能',
    subtitle: '通过智能硬件和AI驱动软件转变您的车队',
    description: '行业领先的GPS追踪、4G行车记录仪、MDVR系统和全面的车队管理平台，受到全球企业信赖。',
    cta1: '探索产品',
    cta2: '联系销售',
  },
};

const Hero = ({ language, data }) => {
  // Graceful fallback if data is not yet loaded or passed
  const t = data || translations[language];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950 transition-colors duration-300">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/40 dark:bg-blue-500/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-normal"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-200/40 dark:bg-cyan-500/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-normal"
        />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-full"
            >
              <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-blue-700 dark:text-blue-400 font-medium">Next-Gen Technology</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
              {t.title}
            </h1>
            <h2 className="text-xl md:text-2xl text-blue-700 dark:text-blue-300 font-medium">
              {t.subtitle}
            </h2>
            <p className="text-slate-600 dark:text-gray-400 text-lg leading-relaxed">
              {t.description}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                onClick={() => scrollToSection('products')}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-8 py-6 text-lg rounded-lg shadow-lg shadow-blue-200 dark:shadow-blue-500/20 transition-all hover:shadow-blue-400/40 hover:scale-105"
              >
                {t.ctaPrimary || t.cta1}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                onClick={() => scrollToSection('contact')}
                variant="outline"
                className="bg-white/80 dark:bg-transparent border-2 border-blue-200 dark:border-blue-500 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 px-8 py-6 text-lg rounded-lg transition-all hover:scale-105"
              >
                {t.ctaSecondary || t.cta2}
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative">
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="relative z-10"
              >
                <img
                  alt={t.title}
                  className="rounded-2xl shadow-2xl shadow-slate-200 dark:shadow-blue-500/20"
                  src={t.image || "https://images.unsplash.com/photo-1639060015191-9d83063eab2a"}
                />
              </motion.div>
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-gradient-to-br from-blue-300/30 to-cyan-300/30 dark:from-blue-500/20 dark:to-cyan-500/20 rounded-full blur-3xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
