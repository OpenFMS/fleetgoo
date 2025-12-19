import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Folder, FolderOpen, FileJson, Settings, LayoutDashboard, ChevronRight, ChevronDown, Menu, X, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Helper to expand flat file list into tree structure
const buildFileTree = (files) => {
    const root = {};
    files.sort().forEach(pathStr => {
        const parts = pathStr.split('/');
        let current = root;
        parts.forEach((part, index) => {
            if (!current[part]) {
                current[part] = index === parts.length - 1 ? null : {};
            }
            current = current[part];
        });
    });
    return root;
};

const FileTreeItem = ({ name, node, pathStr, level = 0, activeFile }) => {
    const isFile = node === null;
    // Default open if level 0 (language root), otherwise closed by default
    const [isOpen, setIsOpen] = useState(level === 0 ? false : false);
    const fullPath = pathStr ? `${pathStr}/${name}` : name;

    // Check if this directory contains the active file or is fully active
    const isActive = isFile && activeFile === fullPath;
    const containsActive = !isFile && activeFile && activeFile.startsWith(fullPath + '/');

    // Auto-expand if contains active file
    useEffect(() => {
        if (containsActive) setIsOpen(true);
    }, [containsActive, fullPath]);

    if (isFile) {
        return (
            <Link
                to={`/admin/editor?file=${encodeURIComponent(fullPath)}`}
                className={cn(
                    "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors mb-0.5",
                    isActive
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                )}
                style={{ paddingLeft: `${(level + 1) * 12}px` }}
            >
                <FileJson className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{name}</span>
            </Link>
        );
    }

    return (
        <div className="select-none">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm cursor-pointer transition-colors mb-0.5",
                    "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                )}
                style={{ paddingLeft: `${level * 12 + 8}px` }}
            >
                {isOpen ? <ChevronDown className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />}
                {isOpen ? <FolderOpen className="w-4 h-4 flex-shrink-0 text-blue-500" /> : <Folder className="w-4 h-4 flex-shrink-0 text-slate-400" />}
                <span className="font-medium truncate">{name.toUpperCase()}</span>
            </div>
            {isOpen && (
                <div>
                    {Object.entries(node).map(([childName, childNode]) => (
                        <FileTreeItem
                            key={childName}
                            name={childName}
                            node={childNode}
                            pathStr={fullPath}
                            level={level + 1}
                            activeFile={activeFile}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const AdminLayout = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();

    // Extract current active file from URL query
    const searchParams = new URLSearchParams(location.search);
    const activeFile = searchParams.get('file');

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

    const fileTree = buildFileTree(files);

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

                <div className="px-4 py-4 space-y-1 border-b border-slate-200 dark:border-slate-800">
                    <Link to="/admin/languages" className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                        location.pathname === '/admin/languages'
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-gray-400"
                    )}>
                        <Globe className="w-4 h-4" />
                        <span>Languages</span>
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                    {loading && <div className="text-sm text-slate-500 p-4">Loading file system...</div>}
                    {error && <div className="text-sm text-red-500 p-4">Error: {error}</div>}

                    {!loading && !error && Object.entries(fileTree).map(([name, node]) => (
                        <FileTreeItem
                            key={name}
                            name={name}
                            node={node}
                            pathStr=""
                            level={0}
                            activeFile={activeFile}
                        />
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
