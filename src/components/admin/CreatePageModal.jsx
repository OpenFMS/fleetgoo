import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Folder, FileJson, LayoutTemplate, Package } from 'lucide-react';

const PAGE_TYPES = [
    { id: 'product', label: 'Product Page', icon: Package, folder: 'products' },
    { id: 'solution', label: 'Solution Page', icon: LayoutTemplate, folder: 'solutions' },
    { id: 'blank', label: 'Blank JSON', icon: FileJson, folder: '' },
];

const TEMPLATES = {
    product: (filename) => ({
        id: filename,
        categoryId: "generic",
        title: "New Product Title",
        metaTitle: "New Product | FleetGoo",
        metaDesc: "Product description...",
        fullDescription: "Detailed product description goes here...",
        images: ["/images/placeholder.png"],
        features: ["Feature 1", "Feature 2"],
        parameters: [{ label: "Spec 1", value: "Value 1" }],
        downloads: [],
        packaging: "Standard Standard box",
        gradient: "from-blue-600 to-cyan-500",
        icon: "Box"
    }),
    solution: (filename) => ({
        id: filename,
        categoryId: "solution",
        title: "New Solution Title",
        metaTitle: "New Solution | FleetGoo",
        metaDesc: "Solution description...",
        image: "",
        color: "blue",
        blocks: [
            {
                type: "hero",
                title: "Solution Headline",
                subtitle: "Compelling subtitle goes here.",
                backgroundImage: "",
                ctaText: "Learn More",
                ctaLink: "/contact"
            },
            {
                type: "features",
                title: "Key Features",
                layout: "grid",
                items: [
                    { title: "Feature 1", desc: "Description..." }
                ]
            }
        ]
    }),
    blank: () => ({})
};

const CreatePageModal = ({ isOpen, onClose, onCreate, languages = ['en', 'zh', 'es'] }) => {
    const [pageType, setPageType] = useState('product');
    const [language, setLanguage] = useState('en');
    const [fileName, setFileName] = useState('');
    const [customPath, setCustomPath] = useState(''); // For blank type

    const selectedType = PAGE_TYPES.find(t => t.id === pageType);

    const handleSubmit = (e) => {
        e.preventDefault();

        let finalPath = '';
        let content = {};

        if (pageType === 'blank') {
            finalPath = customPath.endsWith('.json') ? customPath : `${customPath}.json`;
            // If user didn't provide lang prefix, prepend current selected lang
            if (!finalPath.startsWith(language + '/')) {
                finalPath = `${language}/${finalPath}`;
            }
            content = {};
        } else {
            const safeName = fileName.toLowerCase().replace(/[^a-z0-9-]/g, '-');
            finalPath = `${language}/${selectedType.folder}/${safeName}.json`;
            content = TEMPLATES[pageType](safeName);
        }

        onCreate(finalPath, content);
        onClose();
        // Reset
        setFileName('');
        setCustomPath('');
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New Page</DialogTitle>
                    <DialogDescription>
                        Select a page type to generate a template or create a blank file.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    {/* Page Type Selection */}
                    <div className="grid grid-cols-3 gap-4">
                        {PAGE_TYPES.map((type) => {
                            const Icon = type.icon;
                            const isSelected = pageType === type.id;
                            return (
                                <div
                                    key={type.id}
                                    onClick={() => setPageType(type.id)}
                                    className={`cursor-pointer border-2 rounded-lg p-3 flex flex-col items-center gap-2 transition-all hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 ${isSelected ? 'border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/30' : 'border-slate-200 dark:border-slate-800'}`}
                                >
                                    <Icon className={`w-6 h-6 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}`} />
                                    <span className={`text-xs font-medium ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-slate-600'}`}>{type.label}</span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-4 gap-4 items-end">
                            {/* Language */}
                            <div className="col-span-1 space-y-2">
                                <Label>Language</Label>
                                <Select value={language} onValueChange={setLanguage}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {languages.map(lang => (
                                            <SelectItem key={lang} value={lang}>{lang.toUpperCase()}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Path / Filename */}
                            <div className="col-span-3 space-y-2">
                                <Label>
                                    {pageType === 'blank' ? 'File Path' : 'File Name (ID)'}
                                </Label>
                                <div className="flex items-center">
                                    {pageType !== 'blank' && (
                                        <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-r-0 border-slate-300 dark:border-slate-700 rounded-l-md text-sm text-slate-500 whitespace-nowrap">
                                            /{selectedType?.folder}/
                                        </div>
                                    )}
                                    <Input
                                        value={pageType === 'blank' ? customPath : fileName}
                                        onChange={e => pageType === 'blank' ? setCustomPath(e.target.value) : setFileName(e.target.value)}
                                        placeholder={pageType === 'blank' ? 'e.g., custom/page.json' : 'e.g., public-safety'}
                                        className={pageType !== 'blank' ? 'rounded-l-none' : ''}
                                        required
                                    />
                                    {pageType !== 'blank' && (
                                        <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-l-0 border-slate-300 dark:border-slate-700 rounded-r-md text-sm text-slate-500">
                                            .json
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={(!fileName && pageType !== 'blank') || (!customPath && pageType === 'blank')}>
                            Create Page
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreatePageModal;
