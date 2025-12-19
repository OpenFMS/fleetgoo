import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Code, LayoutTemplate } from 'lucide-react';
import SchemaForm from './SchemaForm';
import DataGrid from './DataGrid';

const SmartEditor = ({ data, onChange }) => {
    const [mode, setMode] = useState('visual'); // 'visual' | 'raw'
    const [rawData, setRawData] = useState('');
    const [validJson, setValidJson] = useState(true);

    // Sync raw text when data changes externally
    useEffect(() => {
        setRawData(JSON.stringify(data, null, 2));
    }, [data]);

    const handleRawChange = (e) => {
        const newVal = e.target.value;
        setRawData(newVal);
        try {
            const parsed = JSON.parse(newVal);
            onChange(parsed);
            setValidJson(true);
        } catch (err) {
            setValidJson(false);
        }
    };

    const isCollection = Array.isArray(data);
    const isPageWithItems = !isCollection && data && typeof data === 'object' && 'items' in data && Array.isArray(data.items);

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <div className="text-sm font-medium text-slate-500">
                    {mode === 'visual' ? (
                        <span>
                            {isCollection ? 'List View' : isPageWithItems ? 'Page & Items View' : 'Form View'}
                        </span>
                    ) : (
                        <span>JSON Source</span>
                    )}
                </div>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    <button
                        onClick={() => setMode('visual')}
                        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${mode === 'visual' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <LayoutTemplate className="w-3.5 h-3.5" />
                        Visual
                    </button>
                    <button
                        onClick={() => setMode('raw')}
                        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${mode === 'raw' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Code className="w-3.5 h-3.5" />
                        Raw
                    </button>
                </div>
            </div>

            <div className="">
                {mode === 'raw' && (
                    <div className="h-[600px] flex flex-col">
                        <Textarea
                            value={rawData}
                            onChange={handleRawChange}
                            className={`font-mono text-sm h-full resize-none ${!validJson ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                            spellCheck={false}
                        />
                        {!validJson && <p className="text-xs text-red-500 mt-2">Invalid JSON syntax</p>}
                    </div>
                )}

                {mode === 'visual' && (
                    <div className="space-y-6 pb-20">
                        {isCollection ? (
                            <DataGrid
                                data={data}
                                onChange={onChange}
                            />
                        ) : isPageWithItems ? (
                            <Tabs defaultValue="items" className="w-full">
                                <TabsList>
                                    <TabsTrigger value="items">Items ({data.items.length})</TabsTrigger>
                                    <TabsTrigger value="metadata">Page Info</TabsTrigger>
                                </TabsList>
                                <TabsContent value="items" className="mt-4">
                                    <DataGrid
                                        data={data.items}
                                        onChange={(newItems) => onChange({ ...data, items: newItems })}
                                    />
                                </TabsContent>
                                <TabsContent value="metadata" className="mt-4">
                                    <SchemaForm
                                        data={{ ...data, items: undefined }} // Hide items from form
                                        onChange={(newMeta) => onChange({ ...newMeta, items: data.items })}
                                    />
                                </TabsContent>
                            </Tabs>
                        ) : (
                            <SchemaForm
                                data={data}
                                onChange={onChange}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SmartEditor;
