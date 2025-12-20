import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, AlertTriangle, LayoutTemplate, MapPin, Video, CheckCircle2, Package, Users, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

/* --- 1. Hero Block --- */
const HeroBlock = ({ data }) => {
    return (
        <div className="relative isolate overflow-hidden bg-slate-900 py-24 sm:py-32 rounded-3xl mx-4 mt-4">
            {data.backgroundImage && (
                <img
                    src={data.backgroundImage}
                    alt=""
                    className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30"
                />
            )}

            <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center relative z-10">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6">
                    {data.title}
                </h1>
                <p className="mt-4 text-lg leading-8 text-gray-300 max-w-2xl mx-auto">
                    {data.subtitle}
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link
                        to={data.ctaLink || '/contact'}
                        className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                        {data.ctaText || 'Get Started'}
                    </Link>
                </div>
            </div>
        </div>
    );
};

/* --- 2. Pain Points Block --- */
const PainPointsBlock = ({ data }) => {
    return (
        <div className="py-24 bg-white dark:bg-slate-950">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">{data.title}</h2>
                </div>
                <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {data.items?.map((item, idx) => (
                        <div key={idx} className="flex flex-col items-start">
                            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-2 ring-1 ring-red-100 dark:ring-red-900/50 mb-4">
                                <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
                            </div>
                            <dt className="text-base font-semibold leading-7 text-slate-900 dark:text-white">{item.title}</dt>
                            <dd className="mt-1 text-base leading-7 text-slate-600 dark:text-slate-400">{item.desc}</dd>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

/* --- 3. Media Block (Architecture) --- */
/* --- Helper: Extract YouTube ID --- */
const getYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

/* --- 3. Media Block (Architecture) --- */
const MediaBlock = ({ data }) => {
    const isVideo = data.mediaType === 'video';
    const youtubeId = isVideo ? getYoutubeId(data.url) : null;
    const [isPlaying, setIsPlaying] = React.useState(false);

    return (
        <div className="py-16 bg-slate-50 dark:bg-slate-900/50">
            <div className="container mx-auto px-4 text-center">
                {data.url && (
                    <div className={`relative rounded-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-black ${data.width === 'container' ? 'max-w-5xl mx-auto' : 'w-full'}`}>
                        {isVideo ? (
                            <div className="aspect-video w-full relative group">
                                {youtubeId ? (
                                    !isPlaying ? (
                                        /* 1. Cover View (Click to Load) */
                                        <button
                                            onClick={() => setIsPlaying(true)}
                                            className="absolute inset-0 w-full h-full block cursor-pointer group focus:outline-none"
                                            aria-label="Play Video"
                                        >
                                            <img
                                                src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
                                                alt={data.caption || "Video Thumbnail"}
                                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                            />
                                            {/* Play Button Overlay */}
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                                                </div>
                                            </div>
                                        </button>
                                    ) : (
                                        /* 2. Active Player (Autoplay on Load) */
                                        <iframe
                                            className="absolute inset-0 w-full h-full"
                                            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                                            title={data.caption || "Video Content"}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            referrerPolicy="strict-origin-when-cross-origin"
                                            allowFullScreen
                                        ></iframe>
                                    )
                                ) : (
                                    <video
                                        className="w-full h-full object-contain"
                                        controls
                                        src={data.url}
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                )}
                            </div>
                        ) : (
                            <img src={data.url} alt={data.caption} className="w-full h-auto" />
                        )}
                    </div>
                )}
                {data.caption && (
                    <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 italic">{data.caption}</p>
                )}
            </div>
        </div>
    );
};

/* --- 4. Feature Grid Block --- */
const FeatureGridBlock = ({ data }) => {
    if (data.layout === 'alternating') {
        return (
            <div className="py-24 overflow-hidden">
                <div className="container mx-auto px-4 space-y-24">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{data.title}</h2>
                    </div>
                    {data.items?.map((item, idx) => (
                        <div key={idx} className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
                            <div className={`flex-1 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                                <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800">
                                    {item.image ? (
                                        <img src={item.image} alt={item.title} className="w-full h-auto" />
                                    ) : (
                                        <div className="bg-slate-100 h-64 flex items-center justify-center text-slate-400">No Image</div>
                                    )}
                                </div>
                            </div>
                            <div className={`flex-1 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{item.title}</h3>
                                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    // Default Grid
    return (
        <div className="py-24 bg-white dark:bg-slate-950">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{data.title}</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {data.items?.map((item, idx) => (
                        <div key={idx} className="bg-slate-50 dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 mb-6">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

/* --- 5. Stats Block --- */
const StatsBlock = ({ data }) => {
    return (
        <div className={`${data.background === 'blue' ? 'bg-blue-600' : 'bg-slate-50 dark:bg-slate-900'} py-16`}>
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/10">
                    {data.items?.map((item, idx) => (
                        <div key={idx} className="px-4">
                            <div className={`text-4xl font-bold mb-2 ${data.background === 'blue' ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                                {item.value}
                            </div>
                            <div className={`text-sm font-medium ${data.background === 'blue' ? 'text-blue-100' : 'text-slate-500'}`}>
                                {item.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

/* --- 6. Product List Block --- */
const ProductListBlock = ({ data }) => {
    // Note: In a real implementation this would fetch product data by IDs.
    // For now, we assume admin provides minimal data manually or we mock it.
    // To adapt to the "Headless" request, we'd typically need a Context with allProducts 
    // or pass it down. For simplicity, we'll render placeholders if not connected.

    return (
        <div className="py-24 bg-slate-50 dark:bg-slate-900">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-wide">{data.title}</h3>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Simplified - assumes manual entry for now or placeholder IDs */}
                    {data.productIds?.map((pid, idx) => (
                        <div key={idx} className="bg-white dark:bg-slate-950 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-800 group">
                            <div className="h-48 bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                                <Package className="w-12 h-12 text-slate-300" />
                            </div>
                            <div className="p-6">
                                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Hardware Model {pid}</h4>
                                <Link to={`/en/products/${pid}`} className="text-blue-600 font-medium text-sm hover:underline">View Specs &rarr;</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

/* --- 7. Logo Wall Block --- */
const LogoWallBlock = ({ data }) => {
    return (
        <div className="py-16 border-t border-slate-200 dark:border-slate-800">
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-8">{data.title}</p>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    {data.logos?.map((logo, idx) => (
                        <img key={idx} src={logo} alt="Client Logo" className="h-8 md:h-12 object-contain" />
                    ))}
                </div>
            </div>
        </div>
    )
}

/* --- 8. CTA / Lead Form Block --- */
const CTABlock = ({ data }) => {
    return (
        <div className="bg-slate-900 py-16 sm:py-24">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white mb-6 max-w-2xl mx-auto">{data.title}</h2>
                <Link
                    to={data.link || '/contact'}
                    className="inline-block rounded-md bg-white px-8 py-3.5 text-base font-semibold text-slate-900 shadow-sm hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                    {data.buttonText}
                </Link>
            </div>
        </div>
    )
}

/* --- 9. Rich Text Block --- */
const RichTextBlock = ({ data }) => {
    return (
        <div className="py-16 container mx-auto px-4">
            <div className={`prose dark:prose-invert max-w-3xl ${data.align === 'center' ? 'mx-auto text-center' : 'mx-0'}`}>
                <p className="whitespace-pre-line text-lg text-slate-600 dark:text-slate-300">
                    {data.content}
                </p>
            </div>
        </div>
    )
}


/* --- Main Renderer --- */
const BlockRenderer = ({ block }) => {
    switch (block.type) {
        case 'hero': return <HeroBlock data={block} />;
        case 'pain_points': return <PainPointsBlock data={block} />;
        case 'media': return <MediaBlock data={block} />;
        case 'features': return <FeatureGridBlock data={block} />;
        case 'stats': return <StatsBlock data={block} />;
        case 'product_list': return <ProductListBlock data={block} />;
        case 'logo_wall': return <LogoWallBlock data={block} />;
        case 'cta': return <CTABlock data={block} />;
        case 'rich_text': return <RichTextBlock data={block} />;
        default: return <div className="p-4 bg-red-50 text-red-500 text-center border-red-200 border rounded">Unknown Block Type: {block.type}</div>;
    }
};

export default BlockRenderer;
