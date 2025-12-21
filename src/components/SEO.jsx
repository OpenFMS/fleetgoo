
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SEO = ({
    title,
    description,
    image,
    type = 'website',
    language,
    settings
}) => {
    const { pathname } = useLocation();
    const siteUrl = settings?.seo?.siteUrl || 'https://fleetgoo.com';
    const currentUrl = `${siteUrl}${pathname}`;

    const siteName = settings?.seo?.siteName || 'FleetGoo';
    const separator = settings?.seo?.titleSeparator || '|';
    const siteLanguages = settings?.languages?.map(l => l.code) || ['en', 'es', 'zh'];

    // Construct language-specific URLs for hreflang
    const pathParts = pathname.split('/').filter(Boolean);
    const currentLang = language || (pathParts.length > 0 ? pathParts[0] : 'en');
    const purePath = pathParts.slice(1).join('/');

    // Default meta values from settings
    const defaults = {
        title: `${siteName} - ${settings?.seo?.defaultTitle || 'Advanced Fleet Management Solutions'}`,
        description: settings?.seo?.defaultDescription || 'Leading provider of AI-powered fleet management solutions.',
        image: `${siteUrl}${settings?.branding?.logoLight || '/images/brand/logo-light.webp'}`
    };

    const metaTitle = title ? `${title} ${separator} ${siteName}` : defaults.title;
    const metaDesc = description || defaults.description;
    const metaImage = image || defaults.image;
    const twitterHandle = settings?.seo?.twitterHandle;

    // Structured Data (JSON-LD) Generation
    let schemaData = null;

    if (type === 'website') {
        schemaData = {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": siteName,
            "url": siteUrl,
            "potentialAction": {
                "@type": "SearchAction",
                "target": `${siteUrl}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string"
            }
        };
    } else if (type === 'product') {
        schemaData = {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": title,
            "image": metaImage,
            "description": metaDesc,
            "brand": {
                "@type": "Brand",
                "name": siteName
            }
        };
    } else if (type === 'article') {
        schemaData = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": title,
            "image": metaImage,
            "author": {
                "@type": "Organization",
                "name": siteName
            },
            "publisher": {
                "@type": "Organization",
                "name": siteName,
                "logo": {
                    "@type": "ImageObject",
                    "url": `${siteUrl}${settings?.branding?.logoLight || '/images/brand/logo-light.webp'}`
                }
            },
            "description": metaDesc
        };
    } else if (type === 'organization') {
        schemaData = {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": settings?.organization?.officialName || siteName,
            "url": siteUrl,
            "logo": `${siteUrl}${settings?.branding?.logoLight || '/images/brand/logo-light.webp'}`,
            "sameAs": settings?.socialLinks?.map(s => s.url) || [],
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": settings?.organization?.phone || "+86 150-138-15400",
                "contactType": "customer service",
                "email": settings?.organization?.email
            }
        };
    }

    const gtag = settings?.analytics?.gtag;

    return (
        <Helmet>
            {/* Standard Meta Tags */}
            <html lang={currentLang} />
            <title>{metaTitle}</title>
            <meta name="description" content={metaDesc} />
            <link rel="canonical" href={currentUrl} />
            <link rel="icon" href={settings?.branding?.favicon || "/favicon.ico"} />

            {/* Google Analytics - GTag */}
            {gtag && (
                <script async src={`https://www.googletagmanager.com/gtag/js?id=${gtag}`}></script>
            )}
            {gtag && (
                <script>
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${gtag}');
                    `}
                </script>
            )}

            {/* Open Graph / Social Media */}
            <meta property="og:url" content={currentUrl} />
            <meta property="og:type" content={type} />
            <meta property="og:title" content={metaTitle} />
            <meta property="og:description" content={metaDesc} />
            <meta property="og:image" content={metaImage} />
            <meta property="og:site_name" content={siteName} />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            {twitterHandle && <meta name="twitter:site" content={twitterHandle} />}
            <meta name="twitter:title" content={metaTitle} />
            <meta name="twitter:description" content={metaDesc} />
            <meta name="twitter:image" content={metaImage} />

            {/* Hreflang Tags for SEO */}
            {siteLanguages.map(lang => (
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
                href={`${siteUrl}/${settings?.defaultLanguage || 'en'}/${purePath}`}
            />

            {/* Structured Data (JSON-LD) */}
            {schemaData && (
                <script type="application/ld+json">
                    {JSON.stringify(schemaData)}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;
