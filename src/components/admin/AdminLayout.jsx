import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Folder, FileJson, Settings, LayoutDashboard, ChevronRight, ChevronDown, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const AdminLayout = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();

    useEffect(() => {
        fetch('/api/admin/files')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch files');
                return res.json();
            })
            .then(data => {
                setFiles(data.files || []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    // Simple grouping by language
    const groupedFiles = files.reduce((acc, file) => {
        const parts = file.split('/');
        const lang = parts[0];
        if (!acc[lang]) acc[lang] = [];
        acc[lang].push(file);
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans text-slate-900 dark:text-white">
            {/* Mobile Sidebar Toggle */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <Button variant="outline" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    {sidebarOpen ? <X /> : <Menu />}
                </Button>
            </div>

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-40 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static flex flex-col",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl">
                        <LayoutDashboard className="text-blue-600" />
                        <span>Admin</span>
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {loading && <div className="text-sm text-slate-500 p-2">Loading file system...</div>}
                    {error && <div className="text-sm text-red-500 p-2">Error: {error}</div>}

                    {!loading && !error && Object.keys(groupedFiles).map(lang => (
                        <div key={lang} className="space-y-2">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500 dark:text-gray-500 px-3">
                                <Folder className="w-3 h-3" />
                                {lang.toUpperCase()}
                            </div>
                            <div className="space-y-1">
                                {groupedFiles[lang].map(file => {
                                    const isActive = location.search.includes(`file=${encodeURIComponent(file)}`);
                                    const fileName = file.split('/').pop();
                                    return (
                                        <Link
                                            key={file}
                                            to={`/admin/editor?file=${encodeURIComponent(file)}`}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                                                isActive
                                                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                                    : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-gray-400"
                                            )}
                                        >
                                            <FileJson className="w-4 h-4" />
                                            <span className="truncate" title={file}>{fileName}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="text-xs text-center text-slate-400">
                        Powered by Vite Middleware
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-x-hidden w-full p-4 lg:p-8 pt-16 lg:pt-8 bg-slate-50 dark:bg-slate-950">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
