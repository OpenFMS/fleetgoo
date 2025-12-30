
import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ContactForm from '@/components/forms/ContactForm';

const Contact = ({ data, language, settings }) => {
  const { toast } = useToast();

  // Safety checks for data structure
  const form = data?.form || {};
  const contactInfo = data?.contactInfo || {};
  const contactInfoItems = contactInfo.items || [];

  return (
    <div className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">{data?.title}</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">{data?.subtitle}</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-xl dark:shadow-none">
              <ContactForm language={language} labels={data?.form} settings={settings} />
            </div>
          </motion.div>

          {/* Contact Info (Right Side) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-600/20 dark:to-cyan-600/20 border border-blue-200 dark:border-blue-500/30 rounded-2xl p-8 shadow-lg dark:shadow-none">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{contactInfo.title}</h3>
              <div className="space-y-6">
                {contactInfoItems.map((info, index) => {
                  const Icon = LucideIcons[info.icon] || HelpCircle;
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-slate-500 dark:text-gray-400 mb-1">{info.label}</div>
                        <div className="text-slate-900 dark:text-white font-medium">{info.value}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden h-64 shadow-xl dark:shadow-none">
              <img
                alt="Modern office building headquarters"
                className="w-full h-full object-cover"
                src={data?.officeImage || "https://images.unsplash.com/photo-1697673468681-d536aa3bc870"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
