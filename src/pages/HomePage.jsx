
import React, { useState } from 'react';
import Hero from '@/components/Hero';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  ArrowRight, Shield, Zap, TrendingUp, CheckCircle2,
  Settings, Award, Globe, Factory, Radio, Check
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from '@/components/ui/use-toast';
import { useFetchData } from '@/hooks/useFetchData';

// Icon mapping for dynamic loading
const iconMap = {
  Shield, Zap, TrendingUp, CheckCircle2,
  Settings, Award, Globe, Factory, Radio, Check
};

const HomePage = ({ language, settings }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data, loading, error } = useFetchData(`/data/${language}/home.json`);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Quote Request Sent!",
        description: "Thank you for your inquiry. Our team will contact you shortly.",
      });
      e.target.reset();
    }, 1500);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">Loading content...</div>;
  }

  if (error || !data) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-red-500">Error loading content. Please try again later.</div>;
  }

  return (
    <>
      <SEO
        title={data.metaTitle || "Home"}
        description={data.metaDesc || "Welcome to FleetGoo Horizons"}
        language={language}
        settings={settings}
      />
      <Hero language={language} data={data.hero} />

      {/* 1. Value Proposition Section */}
      <section className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">{data.valueProps.title}</h2>
            <p className="text-slate-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">{data.valueProps.subtitle}</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {data.valueProps.items.map((item, index) => {
              const Icon = iconMap[item.icon] || Shield;
              const colorClasses = {
                0: { bg: "bg-red-100 dark:bg-red-500/10", text: "text-red-600 dark:text-red-400" },
                1: { bg: "bg-blue-100 dark:bg-blue-500/10", text: "text-blue-600 dark:text-blue-400" },
                2: { bg: "bg-purple-100 dark:bg-purple-500/10", text: "text-purple-600 dark:text-purple-400" }
              }[index] || { bg: "bg-slate-100", text: "text-slate-600" };

              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -10 }}
                  className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500/50 hover:shadow-lg dark:hover:shadow-none transition-all"
                >
                  <div className={`w-14 h-14 ${colorClasses.bg} rounded-xl flex items-center justify-center mb-6`}>
                    <Icon className={`w-7 h-7 ${colorClasses.text}`} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                  <p className="text-slate-600 dark:text-gray-400 leading-relaxed mb-4">
                    <strong className="text-red-600 dark:text-red-300">Pain:</strong> {item.pain}
                  </p>
                  <p className="text-slate-600 dark:text-gray-300">
                    <strong className="text-green-600 dark:text-green-400">Solution:</strong> {item.solution}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Product Showcase Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300" id="products">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">{data.featuredProducts.title}</h2>
            <p className="text-slate-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">{data.featuredProducts.subtitle}</p>
          </motion.div>

          <Tabs defaultValue={data.featuredProducts.tabs[0]?.id} className="w-full max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 mb-8 p-1 h-auto rounded-xl">
              {data.featuredProducts.tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-blue-600 data-[state=active]:text-blue-700 dark:data-[state=active]:text-white text-slate-600 dark:text-gray-400 py-3 rounded-lg text-lg transition-all shadow-sm dark:shadow-none"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {data.featuredProducts.tabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id} className="mt-0">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-12 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-12 items-center shadow-lg dark:shadow-none">
                  <div className="w-full md:w-1/2">
                    <img
                      src={tab.image}
                      alt={tab.title}
                      className="rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-blue-900/20 w-full object-cover h-[350px]"
                    />
                  </div>
                  <div className="w-full md:w-1/2 space-y-6">
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{tab.title}</h3>
                    <p className="text-slate-600 dark:text-gray-400 text-lg">
                      {tab.description}
                    </p>

                    <div className="space-y-4">
                      <h4 className="text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider text-sm">Key Benefits</h4>
                      <ul className="space-y-3">
                        {tab.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-gray-300">
                            <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-500 shrink-0 mt-0.5" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4">
                      <span className="text-sm text-slate-500 dark:text-gray-500 block mb-2 font-medium uppercase">Best For:</span>
                      <div className="flex flex-wrap gap-2">
                        {tab.bestFor.map((tag, i) => (
                          <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-gray-300 text-sm rounded-full">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* 3. Why Us Section */}
      <section className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">{data.whyUs.title}</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.whyUs.items.map((item, i) => {
              const Icon = iconMap[item.icon] || Settings;
              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  className="bg-slate-50 dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500/50 hover:shadow-lg dark:hover:shadow-none transition-all"
                >
                  <Icon className="w-10 h-10 text-blue-600 dark:text-blue-500 mb-4" />
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h4>
                  <p className="text-slate-600 dark:text-gray-400 text-sm">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Social Proof Section */}
      <section className="py-16 bg-blue-50 dark:bg-blue-900/10 border-y border-blue-100 dark:border-blue-900/20 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{data.socialProof.title}</h2>
          </div>

          <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center">
            {data.socialProof.stats.map((stat, i) => {
              const Icon = iconMap[stat.icon] || Award;
              const colorClasses = {
                yellow: "text-yellow-500",
                blue: "text-blue-500 dark:text-blue-400",
                green: "text-green-500",
                purple: "text-purple-500"
              }[stat.color] || "text-slate-500";

              return (
                <div key={i} className="flex flex-col items-center gap-2 group">
                  <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 group-hover:border-blue-500 flex items-center justify-center transition-colors shadow-md dark:shadow-none">
                    <Icon className={`w-8 h-8 ${colorClasses}`} />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-gray-300">{stat.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Lead Magnet Form Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300" id="contact">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{data.leadMagnet.title}</h2>
              <p className="text-slate-600 dark:text-gray-400">{data.leadMagnet.subtitle}</p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700 dark:text-gray-300">{data.leadMagnet.form.nameLabel} <span className="text-red-500">*</span></Label>
                  <Input id="name" placeholder="John Doe" required className="bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 dark:text-gray-300">{data.leadMagnet.form.emailLabel} <span className="text-red-500">*</span></Label>
                  <Input id="email" type="email" placeholder="john@company.com" required className="bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-slate-700 dark:text-gray-300">{data.leadMagnet.form.companyLabel}</Label>
                  <Input id="company" placeholder="Acme Logistics" className="bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-700 dark:text-gray-300">{data.leadMagnet.form.phoneLabel}</Label>
                  <Input id="phone" placeholder="+1 (555) 000-0000" className="bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product-interest" className="text-slate-700 dark:text-gray-300">{data.leadMagnet.form.productInterestLabel}</Label>
                <Select>
                  <SelectTrigger className="bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white w-full">
                    <SelectValue placeholder="Select a product..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                    <SelectItem value="d510">D510 AI Dashcam</SelectItem>
                    <SelectItem value="d901">D901 MDVR System</SelectItem>
                    <SelectItem value="platform">Software Platform</SelectItem>
                    <SelectItem value="other">Other / General Inquiry</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-slate-700 dark:text-gray-300">{data.leadMagnet.form.messageLabel}</Label>
                <Textarea id="message" placeholder="Tell us about your fleet size and specific requirements..." className="bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 min-h-[120px]" />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg h-12"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : data.leadMagnet.form.submitBtn}
                {!isSubmitting && <ArrowRight className="ml-2 w-5 h-5" />}
              </Button>

              <p className="text-center text-xs text-slate-500 dark:text-gray-500 mt-4">
                {data.leadMagnet.form.privacyNote}
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
