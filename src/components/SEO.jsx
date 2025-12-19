
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SEO = ({
    title,
    description,
    image,
    type = 'website',
    language
}) => {
    const { pathname } = useLocation();
    const siteUrl = 'https://fleetgoo.com'; // Replace with actual domain
    const currentUrl = `${siteUrl}${pathname}`;

    // Construct language-specific URLs for hreflang
    // Assuming path format is /:lang/...
    const pathParts = pathname.split('/').filter(Boolean);
    const currentLang = language || (pathParts.length > 0 ? pathParts[0] : 'en');

    // Base path without language prefix (e.g. products/gps-tracker)
    const purePath = pathParts.slice(1).join('/');

    const languages = ['en', 'es', 'zh'];

    // Default meta values if not provided
    const defaults = {
        title: 'FleetGoo - Advanced Fleet Management Solutions',
        description: 'Leading provider of AI-powered fleet management solutions, 4G AI dashcams, MDVR,GPS tracking, and fleet management software for commercial vehicles.',
        image: `${siteUrl}/og-image.jpg` // Need to ensure this exists or use a prop
    };

    const metaTitle = title ? `${title} | FleetGoo` : defaults.title;
    const metaDesc = description || defaults.description;
    const metaImage = image || defaults.image;

    return (
        <Helmet>
            {/* Standard Meta Tags */}
            <html lang={currentLang} />
            <title>{metaTitle}</title>
            <meta name="description" content={metaDesc} />
            <link rel="canonical" href={currentUrl} />

            {/* Open Graph / Social Media */}
            <meta property="og:url" content={currentUrl} />
            <meta property="og:type" content={type} />
            <meta property="og:title" content={metaTitle} />
            <meta property="og:description" content={metaDesc} />
            <meta property="og:image" content={metaImage} />
            <meta property="og:site_name" content="FleetGoo Horizons" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={metaTitle} />
            <meta name="twitter:description" content={metaDesc} />
            <meta name="twitter:image" content={metaImage} />

            {/* Hreflang Tags for SEO */}
            {languages.map(lang => (
                <link
                    key={lang}
                    rel="alternate"
                    hreflang={lang}
                    href={`${siteUrl}/${lang}/${purePath}`}
                />
            ))}
            <link
                rel="alternate"
                hreflang="x-default"
                href={`${siteUrl}/en/${purePath}`}
            />
        </Helmet>
    );
};

export default SEO;
