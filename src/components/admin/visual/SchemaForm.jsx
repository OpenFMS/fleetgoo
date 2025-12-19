import React from 'react';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, Image as ImageIcon } from 'lucide-react';
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
