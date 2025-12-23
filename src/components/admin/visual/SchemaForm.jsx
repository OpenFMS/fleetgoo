import React from 'react';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button.jsx';
import { ChevronDown, ChevronRight, Image as ImageIcon, X, Plus, PlusCircle, ArrowUp, ArrowDown, Trash2, GripVertical } from 'lucide-react';
import DataGrid from './DataGrid';
import ImagePicker from './ImagePicker';

// Helper to determine field type
const getFieldType = (key, value, fieldConfig = null) => {
    if (fieldConfig?.type) return fieldConfig.type; // Priority to explicit config

    const k = key.toLowerCase();
    // Smart Image Detection
    // Smart Image Detection
    if (k.endsWith('image') || k.endsWith('img') || k.endsWith('icon') || k.endsWith('logo') || k.endsWith('poster')) return 'image';

    if (value === null || value === undefined) return 'text';
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'string') {
        if (value.length > 100) return 'textarea';
        // Try to guess colors
        if (k.includes('color') || k.includes('background')) return 'color';
        return 'text';
    }
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object') return 'object';
    return 'text';
};

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

const BLOCK_TYPES = [
    { type: 'hero', label: 'Hero Section', icon: 'LayoutTemplate', default: { type: 'hero', title: 'Start with a Headline', subtitle: '', backgroundImage: '', ctaText: 'Learn More', ctaLink: '#' } },
    { type: 'pain_points', label: 'Pain Points', icon: 'AlertTriangle', default: { type: 'pain_points', title: 'Challenges', items: [{ title: 'Problem 1', desc: 'Description' }] } },
    {
        type: 'features',
        label: 'Feature Grid',
        icon: 'Grid',
        default: { type: 'features', title: 'Our Solution', layout: 'grid', items: [{ title: 'Feature 1', desc: 'Description', icon: 'Check', image: '' }] },
        fields: {
            layout: {
                type: 'select',
                options: [
                    { label: 'Grid (3 Cols)', value: 'grid' },
                    { label: 'Alternating (Left/Right)', value: 'alternating' }
                ],
                help: "Grid uses standard 3-column layout. Alternating swaps image/text side for each item."
            }
        }
    },
    {
        type: 'media',
        label: 'Media (Image/Video)',
        icon: 'Image',
        default: { type: 'media', mediaType: 'image', url: '', caption: '', width: 'container' },
        fields: {
            mediaType: {
                type: 'select',
                options: [{ label: 'Image', value: 'image' }, { label: 'Video', value: 'video' }],
                help: "Use 'Image' for static pictures, 'Video' for embedded players."
            },
            width: {
                type: 'select',
                options: [{ label: 'Container Width', value: 'container' }, { label: 'Full Width', value: 'full' }, { label: 'Narrow', value: 'narrow' }],
                help: "Container: Standard width (recommended). Full: Edge-to-edge. Narrow: Small width for icons/diagrams."
            },
            url: { type: 'image' }
        }
    },
    {
        type: 'stats',
        label: 'Stats / Numbers',
        icon: 'BarChart',
        default: { type: 'stats', background: 'blue', items: [{ value: '100%', label: 'Efficiency' }] },
        fields: {
            background: { type: 'select', options: [{ label: 'Blue', value: 'blue' }, { label: 'White', value: 'white' }, { label: 'Gray', value: 'gray' }] }
        }
    },
    { type: 'product_list', label: 'Product List', icon: 'Package', default: { type: 'product_list', title: 'Recommended Hardware', productIds: ['prod-1', 'prod-2'] } },
    { type: 'logo_wall', label: 'Logo Wall', icon: 'Users', default: { type: 'logo_wall', title: 'Trusted By', logos: ['/logo1.png'] } },
    { type: 'cta', label: 'Call to Action', icon: 'Megaphone', default: { type: 'cta', title: 'Ready to start?', buttonText: 'Contact Us', link: '/contact' } },
    {
        type: 'rich_text',
        label: 'Rich Text',
        icon: 'Type',
        default: { type: 'rich_text', content: 'Enter text here...', align: 'left' },
        fields: {
            align: { type: 'select', options: [{ label: 'Left', value: 'left' }, { label: 'Center', value: 'center' }, { label: 'Right', value: 'right' }] }
        }
    },
];

function BlockEditorField({ label, value = [], onChange }) {
    // Helper to add a block
    const addBlock = (blockDef) => {
        onChange([...value, JSON.parse(JSON.stringify(blockDef.default))]);
    };

    // Helper to remove a block
    const removeBlock = (index) => {
        if (window.confirm('Delete this block?')) {
            const newBlocks = [...value];
            newBlocks.splice(index, 1);
            onChange(newBlocks);
        }
    };

    // Helper to move block
    const moveBlock = (index, direction) => {
        if ((direction === -1 && index === 0) || (direction === 1 && index === value.length - 1)) return;
        const newBlocks = [...value];
        const temp = newBlocks[index];
        newBlocks[index] = newBlocks[index + direction];
        newBlocks[index + direction] = temp;
        onChange(newBlocks);
    };

    // Helper to update a block
    const updateBlock = (index, newData) => {
        const newBlocks = [...value];
        // Ensure type is preserved securely
        newBlocks[index] = { ...newBlocks[index], ...newData };
        onChange(newBlocks);
    };

    return (
        <div className="space-y-4 border rounded-lg p-4 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center justify-between mb-2">
                <Label className="uppercase text-xs text-slate-500 font-bold tracking-wider">{label} ({value.length})</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 gap-1">
                            <Plus className="w-3.5 h-3.5" /> Add Block
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-2 bg-white dark:bg-slate-950 border shadow-lg" align="end">
                        <div className="grid gap-1">
                            <p className="text-xs font-semibold text-slate-500 px-2 py-1.5">Select Block Type</p>
                            {BLOCK_TYPES.map((bt) => (
                                <button
                                    key={bt.type}
                                    onClick={() => addBlock(bt)}
                                    className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
                                >
                                    {/* Ideally render Lucide icon dynamically, for now just text */}
                                    <span>{bt.label}</span>
                                </button>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            <div className="space-y-4">
                {value.map((block, index) => {
                    if (!block) return null;
                    const blockDef = BLOCK_TYPES.find(b => b.type === block.type) || { label: block.type || 'Unknown Block' };
                    // Exclude 'type' from the form editing to avoid confusion
                    const { type, ...blockData } = block;

                    return (
                        <div key={index} className="group border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg overflow-hidden shadow-sm">
                            {/* Block Header */}
                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                                <span className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
                                    {blockDef.label}
                                </span>
                                <span className="text-xs text-slate-400 font-mono flex-1 truncate">
                                    {block.title || (block.items ? `${block.items.length} items` : '')}
                                </span>

                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveBlock(index, -1)} disabled={index === 0}>
                                        <ArrowUp className="w-3 h-3" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveBlock(index, 1)} disabled={index === value.length - 1}>
                                        <ArrowDown className="w-3 h-3" />
                                    </Button>
                                    <div className="w-[1px] h-3 bg-slate-300 mx-1" />
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => removeBlock(index)}>
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>

                            {/* Block Content Form */}
                            <div className="p-4">
                                <SchemaForm
                                    data={blockData}
                                    blockType={block.type}
                                    onChange={(newData) => updateBlock(index, newData)}
                                    level={1}
                                />
                            </div>
                        </div>
                    );
                })}

                {value.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 text-sm">
                        No blocks added yet. Click below to add one.
                    </div>
                )}
            </div>

            <div className="pt-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full h-12 border-dashed border-2 bg-transparent hover:bg-white dark:hover:bg-slate-900 text-slate-500 hover:text-blue-600 hover:border-blue-400 dark:hover:border-blue-500 transition-all flex items-center gap-2 justify-center"
                        >
                            <PlusCircle className="w-5 h-5" />
                            <span>Add New Content Block</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-2 bg-white dark:bg-slate-950 border shadow-lg" align="center">
                        <div className="grid gap-1">
                            <p className="text-xs font-semibold text-slate-500 px-2 py-1.5">Select Block Type</p>
                            {BLOCK_TYPES.map((bt) => (
                                <button
                                    key={bt.type}
                                    onClick={() => addBlock(bt)}
                                    className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
                                >
                                    <span>{bt.label}</span>
                                </button>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
};

// Helper to extract YouTube ID (duplicated for standalone usage)
const getYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

function SchemaForm({ data, onChange, className, level = 0, blockType = null }) {
    if (!data || typeof data !== 'object') return null;

    const handleChange = (key, newValue) => {
        onChange({
            ...data,
            [key]: newValue
        });
    };

    // Determine if this object corresponds to a known block type configuration
    // Use prop blockType if provided (priority), otherwise check data.type
    const effectiveType = blockType || (typeof data.type === 'string' ? data.type : null);

    const blockConfig = effectiveType
        ? BLOCK_TYPES.find(b => b.type === effectiveType)
        : null;

    return (
        <div className={cn("space-y-4", className)}>
            {Object.entries(data).map(([key, value]) => {
                const fieldConfig = blockConfig?.fields?.[key];

                // Special handling for 'url' field in media blocks to show preview
                if (key === 'url' && data.mediaType === 'video') {
                    const youtubeId = getYoutubeId(value);
                    return (
                        <div key={key} className="space-y-1.5">
                            <Label className="capitalize">{key}</Label>
                            <Input
                                value={value}
                                onChange={e => handleChange(key, e.target.value)}
                                placeholder="https://www.youtube.com/watch?v=..."
                            />
                            {fieldConfig?.help && <p className="text-[11px] text-slate-400">{fieldConfig.help}</p>}

                            {/* Video Preview Area */}
                            {value && (
                                <div className="mt-2 rounded-lg overflow-hidden border bg-slate-100 dark:bg-slate-900 w-full max-w-sm">
                                    {youtubeId ? (
                                        <div className="relative aspect-video bg-black group cursor-pointer">
                                            {/* Show Thumbnail by default for performance/stability */}
                                            <img
                                                src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
                                                alt="YouTube Thumbnail"
                                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                                    <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1"></div>
                                                </div>
                                            </div>
                                            <div className="absolute bottom-1 right-2 bg-black/70 text-white text-[10px] px-1 rounded">
                                                YouTube Preview
                                            </div>
                                        </div>
                                    ) : (
                                        <video src={value} controls className="w-full max-h-48 bg-black" />
                                    )}
                                </div>
                            )}
                        </div>
                    );
                }

                const type = getFieldType(key, value, fieldConfig);

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
                    const isImageArray = key.toLowerCase().includes('image') || key.toLowerCase().includes('files') || (value.length > 0 && typeof value[0] === 'string' && value[0].startsWith('/images/'));

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

                    // Start: Custom Logic for Blocks (Page Builder)
                    if (key === 'blocks') {
                        return (
                            <BlockEditorField
                                key={key}
                                label={key}
                                value={value}
                                onChange={(newBlocks) => handleChange(key, newBlocks)}
                            />
                        );
                    }
                    // End: Custom Logic for Blocks

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

                if (type === 'select') {
                    return (
                        <div key={key} className="space-y-1.5">
                            <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                            <div className="relative">
                                <select
                                    value={value}
                                    onChange={(e) => handleChange(key, e.target.value)}
                                    className="w-full appearance-none px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    {fieldConfig?.options?.map(opt => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                            {fieldConfig?.help && <p className="text-[11px] text-slate-400">{fieldConfig.help}</p>}
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
                            {fieldConfig?.help && <p className="text-[11px] text-slate-400">{fieldConfig.help}</p>}
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
                        {fieldConfig?.help && <p className="text-[11px] text-slate-400">{fieldConfig.help}</p>}
                    </div>
                );
            })}
        </div>
    );
};

export default SchemaForm;
