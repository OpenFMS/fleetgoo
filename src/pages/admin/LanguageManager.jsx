import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Globe, Plus, Trash2, AlertTriangle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog.jsx";

const LanguageManager = () => {
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newLangCode, setNewLangCode] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const { toast } = useToast();

    const fetchLanguages = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/languages');
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setLanguages(data.languages || []);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to load languages'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLanguages();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newLangCode) return;

        setIsCreating(true);
        try {
            const res = await fetch('/api/admin/languages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: newLangCode.toLowerCase() })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to create');

            toast({
                title: 'Success',
                description: `Language '${newLangCode}' created successfully.`
            });
            setNewLangCode('');
            fetchLanguages();
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.message
            });
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async (code) => {
        try {
            const res = await fetch('/api/admin/languages', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to delete');

            toast({
                title: 'Deleted',
                description: `Language '${code}' has been removed.`
            });
            fetchLanguages();
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.message
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold dark:text-white">Language Manager</h1>
                <p className="text-slate-500">Manage available languages for the CMS. Adding a new language will automatically clone content from the Master (zh) template.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Add New Language</CardTitle>
                    <CardDescription>Enter a language code (e.g. 'fr', 'de', 'jp') to initialize a new translation.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreate} className="flex gap-4">
                        <div className="flex-1 max-w-sm">
                            <Input
                                placeholder="Language Code (e.g. jp)"
                                value={newLangCode}
                                onChange={e => setNewLangCode(e.target.value)}
                                maxLength={5}
                            />
                        </div>
                        <Button type="submit" disabled={!newLangCode || isCreating}>
                            {isCreating ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                            Create Language
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {languages.map((lang) => (
                    <Card key={lang.code} className={`relative overflow-hidden ${lang.isMaster ? 'border-blue-500 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                        {lang.isMaster && (
                            <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-bl-lg font-bold">
                                MASTER
                            </div>
                        )}
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                    <Globe className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                                </div>
                                <div>
                                    <CardTitle className="uppercase text-xl">{lang.code}</CardTitle>
                                </div>
                            </div>
                        </CardHeader>
                        <CardFooter className="pt-4 border-t border-slate-100 dark:border-slate-800">
                            {lang.isMaster ? (
                                <div className="text-sm text-blue-600 dark:text-blue-400 font-medium flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    Source of Truth
                                </div>
                            ) : (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete Language
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will permanently delete the <strong>{lang.code}</strong> language and all its content files. This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(lang.code)} className="bg-red-500 hover:bg-red-600">
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default LanguageManager;
