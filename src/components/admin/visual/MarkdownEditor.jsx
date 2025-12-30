import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Eye, Code, GripVertical } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useResizablePane } from '@/hooks/admin/useResizablePane';
import { useScrollSync } from '@/hooks/admin/useScrollSync';

const MarkdownEditor = ({ content, onChange, readOnly = false }) => {
    // 1. Resize Logic Hook
    const { containerRef, leftPanelWidth, startResizing } = useResizablePane(50);

    // 2. Scroll Sync Hook
    const { sourceRef: editorRef, targetRef: previewRef, handleScroll, handleMouseEnter, handleMouseLeave } = useScrollSync();

    return (
        <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900 overflow-hidden">
            <Tabs defaultValue="split" className="h-full flex flex-col">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 shrink-0">
                    <TabsList className="bg-slate-100 dark:bg-slate-900">
                        <TabsTrigger value="split" className="text-xs"><Code className="w-3 h-3 mr-1" />Split</TabsTrigger>
                        <TabsTrigger value="edit" className="text-xs">Edit</TabsTrigger>
                        <TabsTrigger value="preview" className="text-xs"><Eye className="w-3 h-3 mr-1" />Preview</TabsTrigger>
                    </TabsList>
                    <span className="text-xs text-slate-400">Markdown Mode</span>
                </div>

                {/* Split View (Default) */}
                <TabsContent value="split" className="flex-1 flex overflow-hidden m-0 data-[state=inactive]:hidden" ref={containerRef}>
                    {/* Editor */}
                    <div
                        className="h-full border-r border-slate-200 dark:border-slate-800 flex flex-col"
                        style={{ width: `${leftPanelWidth}%` }}
                    >
                        <textarea
                            ref={editorRef}
                            className="w-full h-full p-4 resize-none bg-white dark:bg-slate-950 font-mono text-sm focus:outline-none custom-scrollbar"
                            value={content || ''}
                            onChange={(e) => !readOnly && onChange(e.target.value)}
                            onScroll={() => handleScroll(editorRef, previewRef, 'source')}
                            onMouseEnter={() => handleMouseEnter('source')}
                            onMouseLeave={handleMouseLeave}
                            placeholder="# Start writing markdown..."
                            disabled={readOnly}
                        />
                    </div>

                    {/* Drag Handle */}
                    <div
                        className="w-4 flex items-center justify-center cursor-col-resize hover:bg-blue-50 dark:hover:bg-blue-900/20 active:bg-blue-100 transition-colors z-10 flex-shrink-0 bg-white dark:bg-slate-900 -ml-2 border-l border-slate-200 dark:border-slate-800"
                        onMouseDown={startResizing}
                    >
                        <div className="w-1 h-8 bg-slate-300 dark:bg-slate-700 rounded-full flex items-center justify-center pointer-events-none">
                            <GripVertical className="w-3 h-3 text-slate-500" />
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="flex-1 h-full bg-white dark:bg-slate-900 overflow-hidden">
                        <div
                            ref={previewRef}
                            className="h-full overflow-y-auto p-8 custom-scrollbar"
                            onScroll={() => handleScroll(previewRef, editorRef, 'target')}
                            onMouseEnter={() => handleMouseEnter('target')}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className="prose prose-slate dark:prose-invert max-w-none">
                                <ReactMarkdown>{content || ''}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Full Edit View */}
                <TabsContent value="edit" className="flex-1 overflow-hidden m-0 data-[state=inactive]:hidden">
                    <textarea
                        className="w-full h-full p-6 resize-none bg-white dark:bg-slate-950 font-mono text-sm focus:outline-none max-w-3xl mx-auto block border-x border-slate-100 dark:border-slate-800"
                        value={content || ''}
                        onChange={(e) => !readOnly && onChange(e.target.value)}
                        placeholder="# Start writing markdown..."
                        disabled={readOnly}
                    />
                </TabsContent>

                {/* Full Preview View */}
                <TabsContent value="preview" className="flex-1 overflow-auto bg-white dark:bg-slate-900 p-8 m-0 data-[state=inactive]:hidden">
                    <div className="prose prose-slate dark:prose-invert max-w-2xl mx-auto">
                        <ReactMarkdown>{content || ''}</ReactMarkdown>
                    </div>
                </TabsContent>

            </Tabs>
        </div>
    );
};

export default MarkdownEditor;
