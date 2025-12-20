import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Folder, FolderOpen, FileJson, Settings, LayoutDashboard, ChevronRight, ChevronDown, Menu, X, Globe, Trash2, PlusCircle, PanelLeftClose, PanelLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import CreatePageModal from './CreatePageModal';

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

const FileTreeItem = ({ name, node, pathStr, level = 0, activeFile, onDelete }) => {
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

    const handleDelete = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete ${fullPath}?`)) {
            onDelete(fullPath);
        }
    };

    if (isFile) {
        return (
            <div className="relative group flex items-center mb-0.5 pr-2">
                {/* Vertical Guide Line for nested items */}
                {level > 0 && (
                    <div
                        className="absolute top-0 bottom-0 border-l border-slate-200 dark:border-slate-800"
                        style={{ left: `${level * 16}px` }}
                    />
                )}
                <Link
                    to={`/admin/editor?file=${encodeURIComponent(fullPath)}`}
                    className={cn(
                        "flex-1 flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors relative z-10",
                        isActive
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                    )}
                    style={{ paddingLeft: `${(level + 1) * 16}px`, marginLeft: level > 0 ? '4px' : '0' }}
                >
                    <FileJson className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{name}</span>
                </Link>
                <button
                    onClick={handleDelete}
                    className="hidden group-hover:block p-1 text-slate-400 hover:text-red-500 transition-colors absolute right-2 z-20"
                    title="Delete File"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </div>
        );
    }

    return (
        <div className="select-none relative">
            {/* Vertical Guide Line for nested items */}
            {level > 0 && (
                <div
                    className="absolute top-0 bottom-0 border-l border-slate-200 dark:border-slate-800"
                    style={{ left: `${level * 16}px` }}
                />
            )}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm cursor-pointer transition-colors mb-0.5 relative z-10",
                    "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                )}
                style={{ paddingLeft: `${level * 16 + 8}px`, marginLeft: level > 0 ? '4px' : '0' }}
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
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const AdminLayout = () => {
    // ... (state defs) ...
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { toast } = useToast();

    // ... (logic) ...
    // Extract current active file from URL query
    const searchParams = new URLSearchParams(location.search);
    const activeFile = searchParams.get('file');

    const refreshFiles = () => {
        setLoading(true);
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
    };

    useEffect(() => {
        refreshFiles();
    }, []);

    const handleCreatePage = async (filePath, content) => {
        try {
            const res = await fetch('/api/admin/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ file: filePath, content })
            });
            if (!res.ok) throw new Error("Failed to create file");

            toast({ title: "Success", description: "Page created successfully" });
            refreshFiles();
            navigate(`/admin/editor?file=${encodeURIComponent(filePath)}`);
        } catch (err) {
            toast({ variant: "destructive", title: "Error", description: err.message });
        }
    };

    const handleDeleteFile = async (filePath) => {
        try {
            const res = await fetch(`/api/admin/files?file=${encodeURIComponent(filePath)}`, {
                method: 'DELETE'
            });
            if (!res.ok) throw new Error("Failed to delete file");

            toast({ title: "Deleted", description: `Deleted ${filePath}` });
            refreshFiles();
            if (activeFile === filePath) {
                navigate('/admin');
            }
        } catch (err) {
            toast({ variant: "destructive", title: "Error", description: err.message });
        }
    };

    const fileTree = buildFileTree(files);

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('fleetgoo_admin_token');
        if (token === 'secure-token-123') {
            setIsAuthenticated(true);
        }
        setAuthLoading(false);
    }, []);

    const handleLogin = (password) => {
        if (password === 'admin123') { // Simple hardcoded password
            localStorage.setItem('fleetgoo_admin_token', 'secure-token-123');
            setIsAuthenticated(true);
            toast({ title: "Welcome back", description: "Logged in successfully" });
        } else {
            toast({ variant: "destructive", title: "Access Denied", description: "Incorrect password" });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('fleetgoo_admin_token');
        setIsAuthenticated(false);
        setSidebarOpen(true);
    };

    if (authLoading) return null;

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="w-full max-w-md p-8 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800">
                    <div className="flex justify-center mb-8">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                            <LayoutDashboard className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-center mb-2">FleetGoo Admin</h1>
                    <p className="text-slate-500 text-center mb-6">Enter password to continue</p>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        handleLogin(e.target.password.value);
                    }} className="space-y-4">
                        <input
                            type="password"
                            name="password"
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="Password"
                            autoFocus
                        />
                        <Button type="submit" className="w-full">Login</Button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans text-slate-900 dark:text-white">
            {/* Mobile Sidebar Toggle */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <Button variant="outline" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    {sidebarOpen ? <X /> : <Menu />}
                </Button>
            </div>

            {/* Desktop Sidebar Toggle (Floating if closed) */}
            {!sidebarOpen && (
                <div className="hidden lg:block fixed top-4 left-4 z-50">
                    <Button variant="outline" size="icon" onClick={() => setSidebarOpen(true)} className="bg-white dark:bg-slate-900 shadow-md">
                        <PanelLeft className="w-4 h-4" />
                    </Button>
                </div>
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-40 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-all duration-300 ease-in-out flex flex-col",
                    sidebarOpen ? "translate-x-0 lg:w-72" : "-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden lg:border-none"
                )}
            >
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center min-w-[18rem]">
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl">
                        <LayoutDashboard className="text-blue-600" />
                        <span>Admin</span>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="hidden lg:flex" title="Collapse Sidebar">
                        <PanelLeftClose className="w-4 h-4 text-slate-400" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="lg:hidden">
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                <div className="px-4 py-4 space-y-2 border-b border-slate-200 dark:border-slate-800 min-w-[18rem]">
                    <Button onClick={() => setIsCreateModalOpen(true)} className="w-full justify-start gap-2" variant="outline" size="sm">
                        <PlusCircle className="w-4 h-4" />
                        New Page
                    </Button>
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

                <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar min-w-[18rem]">
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
                            onDelete={handleDeleteFile}
                        />
                    ))}
                </div>

                <div className="p-4 border-t border-slate-200 dark:border-slate-800 min-w-[18rem]">
                    <Button variant="ghost" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={handleLogout}>
                        Logout
                    </Button>
                    <div className="text-xs text-center text-slate-400 mt-2">
                        Powered by Vite Middleware
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main
                className={cn(
                    "flex-1 overflow-x-hidden min-h-screen p-4 lg:p-8 pt-16 lg:pt-8 bg-slate-50 dark:bg-slate-950 transition-all duration-300 ease-in-out",
                    sidebarOpen ? "lg:ml-72" : "lg:ml-0"
                )}
            >
                <Outlet />
            </main>

            <CreatePageModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleCreatePage}
                languages={Object.keys(fileTree).length > 0 ? Object.keys(fileTree) : ['en', 'zh', 'es']}
            />
        </div>
    );
};

export default AdminLayout;
