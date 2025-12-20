import React from 'react';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button.jsx';
import { ChevronDown, ChevronRight, Image as ImageIcon, X } from 'lucide-react';
import DataGrid from './DataGrid';
import ImagePicker from './ImagePicker';

// Helper to determine field type
const getFieldType = (key, value) => {
    if (key.includes('image') || key.includes('src') || key.includes('url')) return 'image';
    if (value === null || value === undefined) return 'text';
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'string') {
        if (value.length > 100) return 'textarea';
        return 'text';
    }
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object') return 'object';
    return 'text';
};

const SchemaForm = ({ data, onChange, className, level = 0 }) => {
    if (!data || typeof data !== 'object') return null;

    const handleChange = (key, newValue) => {
        onChange({
            ...data,
            [key]: newValue
        });
    };

    return (
        <div className={cn("space-y-4", className)}>
            {Object.entries(data).map(([key, value]) => {
                const type = getFieldType(key, value);

                // Skip specialized keys that strictly shouldn't be edited here if we are nested
                // e.g., if we had hidden IDs. But for now we show everything.

                if (type === 'object') {
                    // Recursive nested object
                    return (
                        <div key={key} className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-slate-50/50 dark:bg-slate-900/50">
                            <Label className="uppercase text-xs text-slate-500 font-bold mb-4 block tracking-wider">{key}</Label>
                            <SchemaForm
                                data={value}
                                onChange={(newObj) => handleChange(key, newObj)}
                                level={level + 1}
                            />
                        </div>
                    );
                }

                if (type === 'array') {
                    // Start: Custom Logic for Image Arrays
                    const isImageArray = key.toLowerCase().includes('image') || (value.length > 0 && typeof value[0] === 'string' && value[0].startsWith('/images/'));

                    if (isImageArray) {
                        return (
                            <div key={key} className="space-y-3 border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-slate-50 dark:bg-slate-900/10">
                                <div className="flex justify-between items-center">
                                    <Label className="uppercase text-xs text-slate-500 font-bold tracking-wider">{key} ({value.length})</Label>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleChange(key, [...value, ''])}
                                        className="h-7 text-xs"
                                    >
                                        Add Image
                                    </Button>
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    {value.map((imgUrl, idx) => (
                                        <div key={idx} className="relative group border rounded-md overflow-hidden bg-white dark:bg-slate-800">
                                            <div className="aspect-square bg-slate-100 flex items-center justify-center relative">
                                                {imgUrl ? (
                                                    <img src={imgUrl} alt={`Item ${idx}`} className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon className="text-slate-300 w-8 h-8" />
                                                )}
                                                <button
                                                    onClick={() => handleChange(key, value.filter((_, i) => i !== idx))}
                                                    className="absolute top-1 right-1 bg-white/90 text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50"
                                                    title="Remove"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <div className="p-2 border-t dark:border-slate-700">
                                                <ImagePicker
                                                    value={imgUrl}
                                                    onChange={(newVal) => {
                                                        const newValue = [...value];
                                                        newValue[idx] = newVal;
                                                        handleChange(key, newValue);
                                                    }}
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    {value.length === 0 && (
                                        <div className="col-span-full text-center text-slate-400 text-sm py-8 border-2 border-dashed border-slate-200 rounded-lg">
                                            No images. Click "Add Image" to start.
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    }
                    // End: Custom Logic for Image Arrays

                    // For simple arrays of strings/numbers
                    if (value.length > 0 && typeof value[0] !== 'object') {
                        return (
                            <div key={key} className="space-y-2">
                                <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                                <Textarea
                                    value={value.join('\n')}
                                    onChange={e => handleChange(key, e.target.value.split('\n'))}
                                    placeholder="One item per line"
                                    className="font-mono text-sm"
                                />
                                <p className="text-xs text-slate-400">Enter one item per line</p>
                            </div>
                        );
                    }

                    // For object arrays (complex lists), use DataGrid inline
                    return (
                        <div key={key} className="space-y-2 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
                            <Label className="uppercase text-xs text-slate-500 font-bold mb-2 block tracking-wider">{key} ({value.length})</Label>
                            <DataGrid
                                data={value}
                                onChange={(newArray) => handleChange(key, newArray)}
                            />
                        </div>
                    );
                }

                if (type === 'boolean') {
                    return (
                        <div key={key} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={value}
                                onChange={e => handleChange(key, e.target.checked)}
                                className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500"
                            />
                            <Label className="capitalize cursor-pointer" onClick={() => handleChange(key, !value)}>
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                            </Label>
                        </div>
                    );
                }

                if (type === 'textarea') {
                    return (
                        <div key={key} className="space-y-1.5">
                            <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                            <Textarea
                                value={value}
                                onChange={e => handleChange(key, e.target.value)}
                                className="resize-y min-h-[100px]"
                            />
                        </div>
                    );
                }

                if (type === 'image') {
                    return (
                        <div key={key} className="space-y-1.5">
                            <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>

                            <ImagePicker
                                value={value}
                                onChange={(val) => handleChange(key, val)}
                            />

                            {value && (
                                <div className="mt-2 w-20 h-20 rounded overflow-hidden border bg-slate-100 flex-shrink-0">
                                    <img src={value} alt="preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                                </div>
                            )}
                        </div>
                    );
                }

                // Default: Text / Number
                return (
                    <div key={key} className="space-y-1.5">
                        <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                        <Input
                            type={type === 'number' ? 'number' : 'text'}
                            value={value}
                            onChange={e => handleChange(key, type === 'number' ? parseFloat(e.target.value) : e.target.value)}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default SchemaForm;
