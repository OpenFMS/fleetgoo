import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Image as ImageIcon, Search } from 'lucide-react';
import { Input } from '@/components/ui/input.jsx';

const ImagePicker = ({ value, onChange, className }) => {
    const [open, setOpen] = useState(false);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (open && images.length === 0) {
            setLoading(true);
            fetch('/api/admin/images')
                .then(res => res.json())
                .then(data => {
                    setImages(data.images || []);
                })
                .catch(err => console.error("Failed to load images", err))
                .finally(() => setLoading(false));
        }
    }, [open]);

    const filteredImages = images.filter(img =>
        img.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (img) => {
        onChange(img);
        setOpen(false);
    };

    return (
        <div className={`flex gap-2 ${className}`}>
            <Input
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder="/images/..."
                className="flex-1"
            />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="icon" title="Select Image">
                        <ImageIcon className="w-4 h-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Select Image</DialogTitle>
                    </DialogHeader>

                    <div className="relative mb-4">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                        <Input
                            placeholder="Search images..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto min-h-[300px] p-1">
                        {loading ? (
                            <div className="flex items-center justify-center h-full">Loading...</div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {filteredImages.map((img) => (
                                    <div
                                        key={img}
                                        className="group relative aspect-square border-2 border-transparent hover:border-blue-500 rounded-lg overflow-hidden cursor-pointer transition-all bg-slate-100 dark:bg-slate-800"
                                        onClick={() => handleSelect(img)}
                                    >
                                        <img
                                            src={img}
                                            alt={img}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                            <span className="text-xs text-white truncate w-full">{img.split('/').pop()}</span>
                                        </div>
                                        {value === img && (
                                            <div className="absolute inset-0 border-4 border-blue-500 rounded-lg pointer-events-none" />
                                        )}
                                    </div>
                                ))}
                                {filteredImages.length === 0 && (
                                    <div className="col-span-full text-center text-slate-500 py-10">
                                        No images found
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ImagePicker;
