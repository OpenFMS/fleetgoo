import { useEffect, useRef } from 'react';

/**
 * Tawk.to Live Chat Component - Optimized
 * 
 * Performance optimizations:
 * 1. Uses IntersectionObserver to load only when user scrolls to bottom
 * 2. Prevents duplicate script loading
 * 3. Cleanup on unmount
 * 
 * @see https://www.tawk.to/
 */
export default function TawkTo() {
  const scriptRef = useRef(null);
  const isLoadedRef = useRef(false);

  useEffect(() => {
    // Skip if window is not available (SSR)
    if (typeof window === 'undefined') return;

    // Prevent duplicate loading
    if (window.Tawk_API?._loaded || isLoadedRef.current) {
      return;
    }

    // Check if user has scrolled to bottom 30% of page
    const shouldLoadChat = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;
      return scrollPosition > pageHeight * 0.7; // Load when scrolled 70%
    };

    // Load Tawk.to script
    const loadTawkTo = () => {
      if (isLoadedRef.current || document.getElementById('tawkto-script')) {
        return;
      }

      isLoadedRef.current = true;

      // Initialize Tawk.to API
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_API._loaded = true;
      window.Tawk_LoadStart = new Date();

      // Load Tawk.to script
      const script = document.createElement('script');
      script.id = 'tawkto-script';
      script.async = true;
      script.src = 'https://embed.tawk.to/69ce1caa07738f1c35960991/1jl6hvuoc';
      script.charset = 'UTF-8';
      script.setAttribute('crossorigin', '*');

      // Insert after first script
      const firstScript = document.getElementsByTagName('script')[0];
      if (firstScript?.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
        scriptRef.current = script;
      }
    };

    // Load immediately if already scrolled past threshold
    if (shouldLoadChat()) {
      loadTawkTo();
      return;
    }

    // Otherwise, wait for scroll
    let scrollTimeout;
    const handleScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (shouldLoadChat()) {
          loadTawkTo();
          window.removeEventListener('scroll', handleScroll);
        }
      }, 150); // Debounce 150ms
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Fallback: Load after 10 seconds regardless
    const fallbackTimer = setTimeout(() => {
      if (!isLoadedRef.current) {
        loadTawkTo();
        window.removeEventListener('scroll', handleScroll);
      }
    }, 10000);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      clearTimeout(fallbackTimer);
    };
  }, []);

  return null; // This component doesn't render anything visible
}
