import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const translations = {
  en: {
    products: 'Products',
    gpsTracker: 'GPS Tracker',
    dashcam: '4G Dashcam',
    mdvr: 'MDVR System',
    display: 'Smart Display',
    solutions: 'Solutions',
    logistics: 'Logistics',
    construction: 'Construction',
    delivery: 'Delivery',
    corporate: 'Corporate',
    company: 'Company',
    about: 'About Us',
    careers: 'Careers',
    partners: 'Partners',
    blog: 'Blog',
    support: 'Support',
    documentation: 'Documentation',
    faq: 'FAQ',
    contact: 'Contact',
    downloads: 'Downloads',
    copyright: '2025 FleetGoo. All rights reserved.',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
  },
  es: {
    products: 'Productos',
    gpsTracker: 'Rastreador GPS',
    dashcam: 'Dashcam 4G',
    mdvr: 'Sistema MDVR',
    display: 'Pantalla Inteligente',
    solutions: 'Soluciones',
    logistics: 'Logística',
    construction: 'Construcción',
    delivery: 'Entrega',
    corporate: 'Corporativo',
    company: 'Empresa',
    about: 'Nosotros',
    careers: 'Carreras',
    partners: 'Socios',
    blog: 'Blog',
    support: 'Soporte',
    documentation: 'Documentación',
    faq: 'FAQ',
    contact: 'Contacto',
    downloads: 'Descargas',
    copyright: '2025 FleetGoo. Todos los derechos reservados.',
    privacy: 'Política de Privacidad',
    terms: 'Términos de Servicio',
  },
  zh: {
    products: '产品',
    gpsTracker: 'GPS追踪器',
    dashcam: '4G行车记录仪',
    mdvr: 'MDVR系统',
    display: '智能显示屏',
    solutions: '解决方案',
    logistics: '物流',
    construction: '建筑',
    delivery: '配送',
    corporate: '企业',
    company: '公司',
    about: '关于我们',
    careers: '职业',
    partners: '合作伙伴',
    blog: '博客',
    support: '支持',
    documentation: '文档',
    faq: '常见问题',
    contact: '联系',
    downloads: '下载',
    copyright: '2025 FleetGoo. 保留所有权利。',
    privacy: '隐私政策',
    terms: '服务条款',
  },
};

const Footer = ({ language }) => {
  const t = translations[language];

  const footerSections = [
    {
      title: t.products,
      links: [t.gpsTracker, t.dashcam, t.mdvr, t.display],
    },
    {
      title: t.solutions,
      links: [t.logistics, t.construction, t.delivery, t.corporate],
    },
    {
      title: t.company,
      links: [t.about, t.careers, t.partners, t.blog],
    },
    {
      title: t.support,
      links: [t.documentation, t.faq, t.contact, t.downloads],
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#' },
    { icon: Twitter, href: '#' },
    { icon: Linkedin, href: '#' },
    { icon: Instagram, href: '#' },
  ];

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          <div className="lg:col-span-1">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 mb-4"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">About Us</span>
            </motion.div>
            <p className="text-slate-600 dark:text-gray-400 text-sm mb-4">
              Leading provider of intelligent vehicle tracking and fleet management solutions.
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