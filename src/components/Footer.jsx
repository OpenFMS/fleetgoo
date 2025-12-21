import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';

const Footer = ({ language, commonData, settings }) => {
  const t = commonData?.footer || {};

  const footerSections = t.sections ? Object.values(t.sections) : [];

  const iconMap = { Facebook, Twitter, Linkedin, Instagram, Youtube };
  const socialLinks = settings?.socialLinks?.map(link => ({
    icon: iconMap[link.platform],
    href: link.url
  })).filter(link => link.icon) || [];

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          <div className="lg:col-span-1">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 mb-4"
            >
              <img
                src={settings?.branding?.logoLight || "/images/brand/logo-light.webp"}
                alt={`${settings?.seo?.siteName || 'FleetGoo'} Logo`}
                className="h-8 w-auto dark:hidden"
              />
              <img
                src={settings?.branding?.logoDark || "/images/brand/logo-dark.png"}
                alt={`${settings?.seo?.siteName || 'FleetGoo'} Logo`}
                className="h-8 w-auto hidden dark:block"
              />
            </motion.div>
            <p className="text-slate-600 dark:text-gray-400 text-sm mb-4">
              {t.companyDescription}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {footerSections.map((section, index) => (
            <div key={index}>
              <span className="text-slate-900 dark:text-white font-semibold mb-4 block">{section.title}</span>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href="#"
                      className="text-slate-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 dark:text-gray-400 text-sm">{t.copyright}</p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">
              {t.privacy}
            </a>
            <a href="#" className="text-slate-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">
              {t.terms}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;