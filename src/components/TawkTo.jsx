import { useEffect } from 'react';

/**
 * Tawk.to Live Chat Component
 * 
 * Usage: Import and add to Layout.astro or any page
 * 
 * @see https://www.tawk.to/
 */
export default function TawkTo() {
  useEffect(() => {
    // Initialize Tawk.to API
    const Tawk_API = (window as any).Tawk_API || {};
    (window as any).Tawk_API = Tawk_API;
    (window as any).Tawk_LoadStart = new Date();

    // Load Tawk.to script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://embed.tawk.to/69ce1caa07738f1c35960991/1jl6hvuoc';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    const firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode?.insertBefore(script, firstScript);

    // Optional: Customize Tawk.to settings
    // Tawk_API.onLoad = function() {
    //   // Chat loaded successfully
    // };
    // Tawk_API.onChatMaximized = function() {
    //   // Chat maximized
    // };
    // Tawk_API.onChatMinimized = function() {
    //   // Chat minimized
    // };

    // Cleanup on unmount
    return () => {
      // Note: Tawk.to script is not removed as it may be needed on page navigation
    };
  }, []);

  return null; // This component doesn't render anything visible
}
