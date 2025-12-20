import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Save, RefreshCw, AlertCircle, AlertTriangle, GripVertical, Copy, Globe, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import SmartEditor from '@/components/admin/visual/SmartEditor';

const ContentEditor = () => {
    const [searchParams] = useSearchParams();
    const file = searchParams.get('file'); // e.g., "en/home.json"

    // State for Target (Editable)
    const [content, setContent] = useState(null);
    const [originalContent, setOriginalContent] = useState(null);

    // State for Master (Reference)
    const [masterContent, setMasterContent] = useState(null);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    // Split Pane State
    const [leftPanelWidth, setLeftPanelWidth] = useState(50); // percentage
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);

    // Scroll Sync Refs
    const masterScrollRef = useRef(null);
    const targetScrollRef = useRef(null);
    const activeScroller = useRef(null); // 'master' | 'target' | null

    const handleMouseEnter = (side) => {
        activeScroller.current = side;
    };

    const handleMouseLeave = () => {
        activeScroller.current = null;
    };

    // Sync scrolling logic
    const handleScroll = (sourceRef, targetRef, side) => {
        if (activeScroller.current !== side) return;
        if (!sourceRef.current || !targetRef.current) return;


        const source = sourceRef.current;
        const target = targetRef.current;

        // Calculate percentage
        const percentage = source.scrollTop / (source.scrollHeight - source.clientHeight);

        // Apply to target
        target.scrollTop = percentage * (target.scrollHeight - target.clientHeight);

    };

    // Resize Handler Logic
    const startResizing = (e) => {
        setIsDragging(true);
        e.preventDefault(); // Prevent text selection
    };

    const stopResizing = () => {
        setIsDragging(false);
    };

    const resize = (e) => {
        if (isDragging && containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
            // Limit between 20% and 80%
            if (newLeftWidth > 20 && newLeftWidth < 80) {
                setLeftPanelWidth(newLeftWidth);
            }
        }
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', resize);
            window.addEventListener('mouseup', stopResizing);
        } else {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        }
        return () => {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        };
    }, [isDragging]);

    // Derived info
    const isMasterFile = file?.startsWith('zh/');
    // const relativePath = file ? file.split('/').slice(1).join('/') : ''; 

    useEffect(() => {
        if (file) {
            loadData(file);
        }
    }, [file]);

    const loadData = async (filePath) => {
        setLoading(true);
        setContent(null);
        setMasterContent(null);

        try {
            // 1. Load Target Content
            const resTarget = await fetch(`/api/admin/content?file=${encodeURIComponent(filePath)}`);
            if (!resTarget.ok) throw new Error('Failed to load file');
            const textTarget = await resTarget.text();

            try {
                const jsonTarget = JSON.parse(textTarget);
                setContent(jsonTarget);
                setOriginalContent(jsonTarget);
            } catch (e) {
                console.error("Target Invalid JSON", e);
                // Allow user to see error but can't edit visually
                toast({ variant: "destructive", title: "Target Invalid JSON", description: e.message });
                setLoading(false);
                return;
            }

            // 2. Load Master Content (if not editing master)
            if (!filePath.startsWith('zh/')) {
                // relativePath extraction: "en/home.json" -> "home.json"
                const rel = filePath.split('/').slice(1).join('/');
                try {
                    const resMaster = await fetch(`/api/admin/master-content?file=${encodeURIComponent(rel)}`);
                    if (resMaster.ok) {
                        const textMaster = await resMaster.text();
                        setMasterContent(JSON.parse(textMaster));
                    }
                } catch (e) {
                    console.warn("Could not load master content", e);
                }
            }

        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error loading",
                description: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!file) return;

        setSaving(true);
        try {
            const res = await fetch('/api/admin/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ file, content })
            });

            if (!res.ok) throw new Error('Failed to save');

            setOriginalContent(content);
            toast({
                title: "Saved successfully",
                description: `${file} has been updated.`
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error saving",
                description: error.message
            });
        } finally {
            setSaving(false);
        }
    };

    // Helper to find missing keys
    const getMissingKeys = (master, target) => {
        if (!master || !target || typeof master !== 'object' || typeof target !== 'object') return [];
        if (Array.isArray(master)) return []; // Arrays difficult to map by key 1:1 without ID

        const targetKeys = Object.keys(target);
        return Object.keys(master).filter(k => !targetKeys.includes(k));
    };

    const missingKeys = !isMasterFile ? getMissingKeys(masterContent, content) : [];

    const handleSyncStructure = () => {
        if (!masterContent) return;
        const newContent = { ...content };
        missingKeys.forEach(key => {
            // Primitive copy of value structure (empty string or copy value)
            const masterVal = masterContent[key];
            if (typeof masterVal === 'string') newContent[key] = masterVal + " (TRANSLATE ME)";
            else newContent[key] = masterVal; // Copy objects/arrays purely
        });
        setContent(newContent);
        toast({ title: "Synced", description: `Added ${missingKeys.length} missing keys from Master.` });
    };

    const handleCloneToLang = async (targetLang) => {
        if (!file) return;
        const parts = file.split('/');
        if (parts[0] === targetLang) return; // Ignore if same

        const newPath = [targetLang, ...parts.slice(1)].join('/');

        if (!window.confirm(`This will overwrite/create ${newPath} with the current content. Continue?`)) return;

        try {
            const res = await fetch('/api/admin/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ file: newPath, content })
            });

            if (!res.ok) throw new Error('Failed to clone');

            toast({
                title: "Cloned successfully",
                description: `Content copied to ${newPath}`
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error cloning",
                description: error.message
            });
        }
    };

    if (!file) {
        return (
            <div className="flex h-full items-center justify-center text-slate-400">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Select a file from the sidebar to edit.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border dark:border-slate-800 shadow-sm">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-bold dark:text-white">Editor</h1>
                        {isMasterFile && <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded font-bold">MASTER</span>}
                    </div>
                    <p className="text-xs text-slate-500 font-mono">
                        {file}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {missingKeys.length > 0 && (
                        <div className="flex items-center gap-2 mr-4 text-amber-600 bg-amber-50 px-3 py-1 rounded-md text-sm border border-amber-200">
                            <AlertTriangle className="w-4 h-4" />
                            <span>Missing {missingKeys.length} keys</span>
                            <Button size="sm" variant="ghost" className="h-6 text-amber-700 hover:bg-amber-100" onClick={handleSyncStructure}>
                                Sync
                            </Button>
                        </div>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="mr-2">
                                <Copy className="w-4 h-4 mr-2" />
                                Clone to...
                                <ChevronDown className="w-3 h-3 ml-1 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {['en', 'zh', 'es'].map(lang => (
                                <DropdownMenuItem key={lang} onClick={() => handleCloneToLang(lang)} disabled={file.startsWith(lang + '/')}>
                                    <Globe className="w-3 h-3 mr-2" />
                                    {lang.toUpperCase()}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadData(file)}
                        disabled={saving || loading}
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Reset
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={saving || loading || !content}
                        variant="default"
                    >
                        {saving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 min-h-0 flex overflow-hidden" ref={containerRef}>
                {/* Master Pane (Left) - Only if not master file */}
                {!isMasterFile && (
                    <>
                        <div
                            className="flex flex-col min-w-0 bg-slate-50 dark:bg-slate-900/50 border dark:border-slate-800 rounded-xl overflow-hidden opacity-80 hover:opacity-100 transition-opacity"
                            style={{ width: `${leftPanelWidth}%` }}
                        >
                            <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 border-b dark:border-slate-700 flex justify-between items-center flex-shrink-0">
                                <span className="font-bold text-sm text-slate-500 flex items-center gap-2">
                                    <span className="bg-slate-200 dark:bg-slate-700 px-1.5 rounded text-xs">ZH</span>
                                    Master Reference
                                </span>
                                <span className="text-xs text-slate-400">Read Only</span>
                            </div>
                            <div
                                ref={masterScrollRef}
                                onMouseEnter={() => handleMouseEnter('master')}
                                onMouseLeave={handleMouseLeave}
                                onScroll={() => handleScroll(masterScrollRef, targetScrollRef, 'master')}
                                className="flex-1 overflow-y-auto p-4 custom-scrollbar"
                            >
                                {masterContent ? (
                                    <div className="pointer-events-none select-none grayscale-[0.5]">
                                        <SmartEditor data={masterContent} mode="visual" readOnly />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                                        Loading Master...
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Drag Handle */}
                        <div
                            className="w-4 flex items-center justify-center cursor-col-resize hover:bg-blue-50 dark:hover:bg-blue-900/20 active:bg-blue-100 transition-colors z-10 flex-shrink-0"
                            onMouseDown={startResizing}
                        >
                            <div className="w-1 h-8 bg-slate-300 dark:bg-slate-700 rounded-full flex items-center justify-center">
                                <GripVertical className="w-3 h-3 text-slate-500" />
                            </div>
                        </div>
                    </>
                )}

                {/* Target Pane (Right) */}
                <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-white dark:bg-slate-800 px-4 py-2 border-b dark:border-slate-700 flex-shrink-0">
                        <span className="font-bold text-sm text-blue-600 dark:text-blue-400 flex items-center gap-2">
                            <span className="uppercase bg-blue-50 dark:bg-blue-900/20 px-1.5 rounded text-xs">{file.split('/')[0]}</span>
                            Target Content
                        </span>
                    </div>
                    <div
                        ref={targetScrollRef}
                        onMouseEnter={() => handleMouseEnter('target')}
                        onMouseLeave={handleMouseLeave}
                        onScroll={() => handleScroll(targetScrollRef, masterScrollRef, 'target')}
                        className="flex-1 overflow-y-auto p-4 relative"
                    >
                        {loading ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 z-10">
                                <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                            </div>
                        ) : content ? (
                            <SmartEditor
                                data={content}
                                onChange={setContent}
                            />
                        ) : (
                            <div className="text-center text-slate-400 mt-20">
                                {loading ? 'Loading...' : 'Unable to display editor.'}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContentEditor;
