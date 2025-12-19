
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { motion } from 'framer-motion';
import { useFetchData } from '@/hooks/useFetchData';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft, CheckCircle2, ArrowRight, Zap, Target, BarChart,
  Settings, Users, Globe, HelpCircle
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const SolutionDetailPage = ({ language }) => {
  const { id } = useParams();
  const { data, loading, error } = useFetchData(`/data/${language}/solutions/${id}.json`);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">Loading solution details...</div>;
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white gap-4">
        <h2 className="text-2xl font-bold text-red-500">Solution Not Found</h2>
        <p className="text-slate-500">The solution you are looking for does not exist or failed to load.</p>
        <Link to={`/${language}/solutions`}>
          <Button variant="outline">Back to Solutions</Button>
        </Link>
      </div>
    );
  }

  const MainIcon = data.icon ? (LucideIcons[data.icon] || HelpCircle) : HelpCircle;

  return (
    <>
      <SEO
        title={data.metaTitle || data.title}
        description={data.metaDesc || data.description?.slice(0, 150)}
        language={language}
        image={data.image}
        type="article"
      />

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 pb-20">

        {/* Breadcrumb Area */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-24 pb-6">
          <div className="container mx-auto px-4">
            <Link to={`/${language}/solutions`} className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Solutions
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative bg-slate-900 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-40">
            <img src={data.image} alt="Background" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/50" />
          </div>

          <div className="container mx-auto px-4 py-20 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-${data.color || 'blue'}-500/20 border border-${data.color || 'blue'}-500/30 text-${data.color || 'blue'}-300 text-sm font-medium mb-6`}>
                <MainIcon className="w-4 h-4" />
                <span>Industry Solution</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">{data.title}</h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-2xl">
                {data.description}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to={`/${language}/contact`}>
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white border-none">
                    Schedule Consultation
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 -mt-10 relative z-20">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Left Column: Challenges & Solutions */}
            <div className="lg:col-span-2 space-y-8">

              {/* Pain Points / Challenges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400">
                    <Target className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Industry Challenges</h2>
                </div>
                <div className="space-y-4">
                  {data.challenges && data.challenges.map((challenge, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="mt-1 w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{challenge.title}</h4>
                        <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed">{challenge.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Our Approach / Solution */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Our Solution</h2>
                </div>
                <p className="text-slate-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {data.solutionOverview}
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {data.features && data.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-500 mt-0.5 shrink-0" />
                      <span className="text-slate-700 dark:text-gray-300 font-medium text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

            </div>

            {/* Right Column: Sidebar Stats & Benefits */}
            <div className="space-y-6">

              {/* Key Benefits Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-900/20"
              >
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <BarChart className="w-5 h-5" />
                  Expected Results
                </h3>
                <div className="space-y-6">
                  {data.stats && data.stats.map((stat, idx) => (
                    <div key={idx} className="border-b border-blue-500/30 pb-4 last:border-0 last:pb-0">
                      <div className="text-3xl font-bold mb-1">{stat.value}</div>
                      <div className="text-blue-100 text-sm">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Contact / CTA */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-slate-600 dark:text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Need a Custom Strategy?</h3>
                <p className="text-slate-600 dark:text-gray-400 text-sm mb-6">
                  Our experts can tailor this solution to your specific operational needs.
                </p>
                <Link to={`/${language}/contact`}>
                  <Button variant="outline" className="w-full">Contact Sales</Button>
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SolutionDetailPage;
