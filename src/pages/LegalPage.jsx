import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

const LegalPage = () => {
    const { lang, docId } = useParams();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);

    // Legal documents are English only by policy
    const LEGAL_DOC_PATH = `/data/en/legal/${docId}.md`;

    useEffect(() => {
        const fetchDoc = async () => {
            try {
                setLoading(true);
                const response = await fetch(LEGAL_DOC_PATH);
                if (!response.ok) throw new Error('Document not found');
                const text = await response.text();
                setContent(text);
            } catch (error) {
                console.error("Failed to load legal document:", error);
                setContent("# Document Not Found\nWe are sorry, but the requested legal document could not be loaded.");
            } finally {
                setLoading(false);
            }
        };

        fetchDoc();
    }, [docId]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-20 px-4"
        >
            <div className="container mx-auto max-w-4xl">
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden p-8 md:p-12 border border-slate-100 dark:border-slate-800">

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-slate-500 dark:text-gray-400">Loading document...</p>
                        </div>
                    ) : (
                        <article className="prose prose-slate dark:prose-invert lg:prose-lg max-w-none">
                            {/* Force English disclaimer for non-English users */}
                            {lang !== 'en' && (
                                <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 p-4 rounded-lg mb-8 text-sm flex items-start gap-3">
                                    <span className="text-xl">ℹ️</span>
                                    <div>
                                        <strong>Note:</strong> Legal documents are officially maintained in English.
                                        Any translations would be for reference only and might not be legally binding.
                                    </div>
                                </div>
                            )}
                            <ReactMarkdown>{content}</ReactMarkdown>
                        </article>
                    )}

                </div>
            </div>
        </motion.div>
    );
};

export default LegalPage;
