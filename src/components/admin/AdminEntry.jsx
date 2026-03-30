import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import ContentEditor from '@/views/admin/ContentEditor';
import LanguageManager from '@/views/admin/LanguageManager';
import { Toaster } from '@/components/ui/toaster';

if (typeof window !== 'undefined' && import.meta.hot) {
    import.meta.hot.on('vite:beforeFullReload', () => {
        if (window.location.pathname.startsWith('/admin')) {
            console.log("Blocking Vite full-reload on Admin panel to prevent crash.");
            throw new Error("BLOCK_VITE_RELOAD");
        }
    });
}

export default function AdminEntry() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<div className="p-8 text-center text-slate-500">Select a file from the sidebar or manage languages</div>} />
            <Route path="editor" element={<ContentEditor />} />
            <Route path="languages" element={<LanguageManager />} />
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}
