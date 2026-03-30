import React from 'react';

export const Link = ({ to, children, className, onClick, ...props }) => {
  return (
    <a href={to} className={className} onClick={onClick} {...props}>
      {children}
    </a>
  );
};

export const NavLink = ({ to, children, className, ...props }) => {
  let isActive = false;
  if (typeof window !== 'undefined') {
    isActive = window.location.pathname === to || window.location.pathname.startsWith(to + '/');
  }
  
  const resolvedClassName = typeof className === 'function' ? className({ isActive }) : className;
  
  return (
    <a href={to} className={resolvedClassName} {...props}>
      {typeof children === 'function' ? children({ isActive }) : children}
    </a>
  );
};

export const useNavigate = () => {
  return (path) => {
    if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  };
};

export const useLocation = () => {
  if (typeof window !== 'undefined') {
    return {
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash
    };
  }
  return { pathname: '/', search: '', hash: '' };
};

export const useParams = () => {
  if (typeof window !== 'undefined') {
    const parts = window.location.pathname.split('/').filter(Boolean);
    // Simple heuristic for /[lang]/something/[id]
    // parts[0] is lang, parts[2] is often id
    return {
      lang: parts[0] || 'en',
      id: parts[2] || parts[1] || ''
    };
  }
  return { lang: 'en' };
};

export const Navigate = ({ to, replace }) => {
  if (typeof window !== 'undefined') {
    if (replace) {
      window.location.replace(to);
    } else {
      window.location.assign(to);
    }
  }
  return null;
};

// Export dummies for router wrapper components that might be leftover
export const BrowserRouter = ({ children }) => <>{children}</>;
export const Router = ({ children }) => <>{children}</>;
export const Routes = ({ children }) => <>{children}</>;
export const Route = ({ children }) => <>{children}</>;
export const Outlet = ({ context }) => null;
export const useOutletContext = () => ({});
export const useSearchParams = () => [new URLSearchParams(typeof window !== 'undefined' ? window.location.search : ''), () => {}];
