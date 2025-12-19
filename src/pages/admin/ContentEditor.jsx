import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Save, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import SmartEditor from '@/components/admin/visual/SmartEditor';

const ContentEditor = () => {
    const [searchParams] = useSearchParams();
    const file = searchParams.get('file');
    const [content, setContent] = useState(null);
    const [originalContent, setOriginalContent] = useState(null); // Keep original for validation
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (file) {
            loadFile(file);
        }
    }, [file]);

    const loadFile = async (filePath) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/content?file=${encodeURIComponent(filePath)}`);
            if (!res.ok) throw new Error('Failed to load file');
            const text = await res.text();
            try {
                const json = JSON.parse(text);
                setContent(json);
                setOriginalContent(json);
            } catch (e) {
                console.error("Not valid JSON", e);
                toast({
                    variant: "destructive",
                    title: "Parse Error",
                    description: "File content is not valid JSON. Cannot use Visual Editor."
                });
                setContent(null);
                setOriginalContent(null);
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error loading file",
                description: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    const validateContent = (original, current) => {
        if (!original || !current) return true;

        // 1. Check if root is same type (array vs object)
        if (Array.isArray(original) !== Array.isArray(current)) {
            return `Root type mismatch (expected ${Array.isArray(original) ? 'Array' : 'Object'})`;
        }

        // 2. If object, check if critical root keys are missing
        if (!Array.isArray(original) && typeof original === 'object') {
            const originalKeys = Object.keys(original);
            const currentKeys = Object.keys(current);

            // Allow adding new keys, but warn if existing keys are removed
            // Actually, for content file, keys usually shouldn't be removed
            const missingKeys = originalKeys.filter(k => !currentKeys.includes(k));
            if (missingKeys.length > 0) {
                return `Missing critical keys: ${missingKeys.join(', ')}`;
            }
        }

        return null; // No error
    };

    const handleSave = async () => {
        if (!file) return;

        // Validation
        const validationError = validateContent(originalContent, content);
        if (validationError) {
            const confirmSave = window.confirm(`Validation Warning: ${validationError}.\n\nSaving this might break the site. Are you sure you want to proceed?`);
            if (!confirmSave) return;
        }

        setSaving(true);
        try {
            const res = await fetch('/api/admin/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ file, content })
            });

            if (!res.ok) throw new Error('Failed to save');

            setOriginalContent(content); // Update original after success
            toast({
                title: "Saved successfully",
                description: `${file} has been updated. HMR should reflect changes soon.`
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error saving file",
                description: error.message
            });
        } finally {
            setSaving(false);
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
        <div className="max-w-5xl mx-auto space-y-6 h-[calc(100vh-8rem)] flex flex-col">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold dark:text-white">Editor</h1>
                    <p className="text-sm text-slate-500 font-mono bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded inline-block">
                        {file}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadFile(file)}
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
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>

            <div className="flex-1 relative border rounded-xl overflow-hidden shadow-sm dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
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
                        {loading ? 'Loading...' : 'Unable to display editor for this content.'}
                    </div>
                )}
            </div>

        </div>
    );
};

export default ContentEditor;
