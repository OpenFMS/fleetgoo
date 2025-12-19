import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Plus, X } from 'lucide-react';
import SchemaForm from './SchemaForm';

// Simple Modal Component (Inline for simplicity)
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-lg font-bold">{title}</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
                </div>
                <div className="overflow-y-auto p-6 flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
};

const DataGrid = ({ data = [], onChange, itemSchema }) => {
    const [editingIndex, setEditingIndex] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [tempItem, setTempItem] = useState(null);

    // Infer columns from the first few items
    const allKeys = new Set();
    data.forEach(item => Object.keys(item).forEach(k => allKeys.add(k)));
    // Show only first 4 keys to prevent clutter
    const columns = Array.from(allKeys).slice(0, 4);

    const handleEdit = (index) => {
        setEditingIndex(index);
        setTempItem({ ...data[index] });
    };

    const handleAdd = () => {
        // Create empty template based on schema or generic keys
        const newItem = {};
        if (columns.length > 0) {
            columns.forEach(c => newItem[c] = "");
        } else {
            newItem['id'] = `item-${Date.now()}`;
            newItem['title'] = "New Item";
        }
        setTempItem(newItem);
        setIsAdding(true);
    };

    const saveEdit = () => {
        const newData = [...data];
        if (isAdding) {
            newData.push(tempItem);
        } else {
            newData[editingIndex] = tempItem;
        }
        onChange(newData);
        closeModal();
    };

    const closeModal = () => {
        setEditingIndex(null);
        setIsAdding(false);
        setTempItem(null);
    };

    const handleDelete = (index) => {
        if (confirm('Are you sure you want to delete this item?')) {
            const newData = data.filter((_, i) => i !== index);
            onChange(newData);
        }
    };

    return (
        <div className="space-y-4">
            <div className="rounded-md border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-medium">
                            <tr>
                                {columns.map(col => (
                                    <th key={col} className="px-4 py-3 capitalize whitespace-nowrap">{col}</th>
                                ))}
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-950">
                            {data.map((item, i) => (
                                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                                    {columns.map(col => (
                                        <td key={col} className="px-4 py-3 max-w-[200px] truncate text-slate-700 dark:text-slate-300">
                                            {(col.toLowerCase().includes('image') || col.toLowerCase().includes('src') || col.toLowerCase().includes('icon')) && typeof item[col] === 'string' && (item[col].startsWith('/') || item[col].startsWith('http')) ? (
                                                <div className="w-10 h-10 rounded border bg-slate-100 overflow-hidden flex-shrink-0">
                                                    <img src={item[col]} alt="img" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerText = item[col]; }} />
                                                </div>
                                            ) : (
                                                typeof item[col] === 'object' ? '[Object]' : String(item[col] || '')
                                            )}
                                        </td>
                                    ))}
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600" onClick={() => handleEdit(i)}>
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => handleDelete(i)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {data.length === 0 && (
                                <tr>
                                    <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-slate-400">
                                        No items found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Button onClick={handleAdd} className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
            </Button>

            {/* Editor Modal */}
            {(editingIndex !== null || isAdding) && (
                <Modal
                    isOpen={true}
                    onClose={closeModal}
                    title={isAdding ? "Add New Item" : "Edit Item"}
                >
                    <div className="space-y-6">
                        <SchemaForm
                            data={tempItem}
                            onChange={setTempItem}
                        />
                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <Button variant="outline" onClick={closeModal}>Cancel</Button>
                            <Button onClick={saveEdit}>Save Changes</Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default DataGrid;
