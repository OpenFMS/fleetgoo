
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/ThemeToggle';

const translations = {
  en: {
    home: 'Home',
    products: 'Products',
    solutions: 'Solutions',
    software: 'Software',
    about: 'About Us',
    contact: 'Contact'
  },
  es: {
    home: 'Inicio',
    products: 'Productos',
    solutions: 'Soluciones',
    software: 'Software',
    about: 'Nosotros',
    contact: 'Contacto'
  },
  zh: {
    home: '首页',
    products: '产品',
    solutions: '解决方案',
    software: '软件',
    about: '关于我们',
    contact: '联系'
  }
};

const languageNames = {
  en: 'English',
  es: 'Español',
  zh: '中文'
};

const Header = ({ language }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const t = translations[language] || translations.en;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeLanguage = (newLang) => {
    const pathSegments = location.pathname.split('/');
    // pathSegments: ['', 'en', 'products'...]
    if (pathSegments.length > 1) {
      pathSegments[1] = newLang;
      navigate(pathSegments.join('/'));
    } else {
      // Fallback if something weird, just go to root of new lang
      navigate(`/${newLang}`);
    }
  };

  const menuItems = [{
    id: 'home',
    label: t.home,
    path: `/${language}`
  }, {
    id: 'products',
    label: t.products,
    path: `/${language}/products`
  }, {
    id: 'solutions',
    label: t.solutions,
    path: `/${language}/solutions`
  }, {
    id: 'software',
    label: t.software,
    path: `/${language}/software`
  }, {
    id: 'about',
    label: t.about,
    path: `/${language}/about-us`
  }, {
    id: 'contact',
    label: t.contact,
    path: `/${language}/contact`
  }];

  const isActive = path => {
    // Exact match for home to avoid highlighting on sub-pages
    if (path === `/${language}`) {
      return location.pathname === path || location.pathname === `${path}/`;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 dark:bg-slate-900/95 backdrop-blur-md shadow-lg' : 'bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm'}`}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to={`/${language}`}>
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 cursor-pointer">
              <img
                src="https://horizons-cdn.hostinger.com/d7bb4810-a883-4ff6-8fd8-0ad7f5b4a494/562e9d2eff059326def4743368c28927.png"
                alt="FleetGoo Official Logo"
                className="h-8 md:h-10 w-auto"
              />
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map(item => (
              <Link
                key={item.id}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-blue-500 dark:hover:text-blue-400 ${isActive(item.path) ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-700 dark:text-gray-300'}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-slate-100 dark:hover:bg-blue-500/10 text-slate-700 dark:text-white dark:hover:text-blue-400">
                  <Globe className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                {Object.entries(languageNames).map(([code, name]) => (
                  <DropdownMenuItem
                    key={code}
                    onClick={() => changeLanguage(code)}
                    className={`cursor-pointer ${language === code ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' : 'text-slate-700 dark:text-gray-300'} hover:bg-slate-100 dark:hover:bg-blue-500/10 dark:hover:text-blue-400`}
                  >
                    {name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Toggle */}
            <Button variant="ghost" size="icon" className="md:hidden text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:text-blue-400 dark:hover:bg-blue-500/10" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4 border-t border-slate-200 dark:border-slate-700 pt-4"
          >
            {menuItems.map(item => (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block w-full text-left py-2 px-4 rounded-lg transition-colors ${isActive(item.path) ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' : 'text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-blue-500/10 dark:hover:text-blue-400'}`}
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
};

export default Header;
