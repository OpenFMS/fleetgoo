
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { motion } from 'framer-motion';
import { useFetchData } from '@/hooks/useFetchData';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft, Download, CheckCircle2, Package,
  ChevronRight, FileText, Zap, Shield, HelpCircle
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';

const ProductDetailPage = ({ language, settings }) => {
  const { id } = useParams();
  const { data, loading, error } = useFetchData(`/data/${language}/products/${id}.json`);
  const [activeImage, setActiveImage] = useState(0);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">Loading product details...</div>;
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white gap-4">
        <h2 className="text-2xl font-bold text-red-500">Product Not Found</h2>
        <p className="text-slate-500">The product you are looking for does not exist or failed to load.</p>
        <div className="p-4 bg-slate-200 dark:bg-slate-800 rounded text-xs font-mono text-left">
          <p><strong>Attempted URL:</strong> {`/data/${language}/products/${id}.json`}</p>
          <p><strong>Error:</strong> {error ? error.toString() : 'Data is null'}</p>
        </div>
        <Link to={`/${language}/products`}>
          <Button variant="outline">Back to Products</Button>
        </Link>
      </div>
    );
  }

  const ProductIcon = data.icon ? (LucideIcons[data.icon] || HelpCircle) : HelpCircle;

  return (
    <>
      <SEO
        title={data.metaTitle || data.title}
        description={data.metaDesc || data.fullDescription?.slice(0, 150)}
        language={language}
        image={data.images && data.images.length > 0 ? data.images[0] : undefined}
        type="product"
        settings={settings}
      />

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 pb-20">

        {/* Breadcrumbs & Header */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-24 pb-8">
          <div className="container mx-auto px-4">
            <Link to={`/${language}/products`} className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Products
            </Link>

            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${data.gradient || 'from-blue-600 to-cyan-500'} flex items-center justify-center shadow-lg`}>
                  <ProductIcon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{data.title}</h1>
                  <p className="text-slate-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                    <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      ID: {data.id?.toUpperCase()}
                    </span>
                    <span className="hidden sm:inline-block text-slate-300 dark:text-slate-700">•</span>
                    <span className="hidden sm:inline-block">Professional Series</span>
                  </p>
                </div>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <Link to={`/${language}/contact`} className="w-full md:w-auto">
                  <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                    Request Quote
                  </Button>
                </Link>
                <Button variant="outline" className="w-full md:w-auto border-slate-300 dark:border-slate-700 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Download className="w-4 h-4 mr-2" />
                  Datasheet
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 mt-8">
          <div className="grid lg:grid-cols-12 gap-10">

            {/* Left Column: Images */}
            <div className="lg:col-span-7 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl"
              >
                <div className="aspect-video relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                  {data.images && data.images[activeImage] ? (
                    <img
                      src={data.images[activeImage]}
                      alt={`${data.title} view ${activeImage + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">No Image Available</div>
                  )}
                </div>
              </motion.div>

              {data.images && data.images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {data.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={cn(
                        "aspect-square rounded-xl overflow-hidden border-2 transition-all",
                        activeImage === idx
                          ? "border-blue-500 shadow-md ring-2 ring-blue-500/20"
                          : "border-transparent hover:border-slate-300 dark:hover:border-slate-700 opacity-70 hover:opacity-100"
                      )}
                    >
                      <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Description Section */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Product Overview</h3>
                <p className="text-slate-600 dark:text-gray-300 leading-relaxed text-lg">
                  {data.fullDescription}
                </p>
              </div>
            </div>

            {/* Right Column: Specs & Info */}
            <div className="lg:col-span-5 space-y-6">

              {/* Features List */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Key Features
                </h3>
                <ul className="space-y-3">
                  {data.features && data.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-slate-600 dark:text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tabs for Details */}
              <Tabs defaultValue="specs" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
                  <TabsTrigger value="specs">Specifications</TabsTrigger>
                  <TabsTrigger value="downloads">Downloads</TabsTrigger>
                </TabsList>

                <TabsContent value="specs" className="mt-4">
                  <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                    <table className="w-full text-sm text-left">
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {data.parameters && data.parameters.map((param, idx) => (
                          <tr key={idx} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="py-3 px-4 font-medium text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/30 w-1/3">
                              {param.label}
                            </td>
                            <td className="py-3 px-4 text-slate-600 dark:text-gray-300">
                              {param.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>

                <TabsContent value="downloads" className="mt-4 space-y-3">
                  {data.downloads && data.downloads.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-blue-400 dark:hover:border-blue-500 transition-colors group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{file.title}</div>
                          <div className="text-xs text-slate-500">{file.type} • {file.size}</div>
                        </div>
                      </div>
                      <Download className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                    </div>
                  ))}
                  {(!data.downloads || data.downloads.length === 0) && (
                    <div className="text-center py-8 text-slate-500 italic">No downloads available.</div>
                  )}
                </TabsContent>
              </Tabs>

              {/* Packaging Info */}
              <div className="bg-slate-100 dark:bg-slate-800/50 rounded-2xl p-5 flex items-start gap-4 border border-slate-200 dark:border-slate-800">
                <Package className="w-6 h-6 text-slate-400 shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">In The Box</h4>
                  <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed">
                    {data.packaging}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
