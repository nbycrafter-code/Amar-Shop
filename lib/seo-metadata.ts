// lib/seo-metadata.ts
import { getSetting } from "@/queries/settings";
import { getSeoByProductId, getSeoByPageId } from "@/queries/seos";
import { ISeo } from "@/models/seo-model";

interface SeoMetadataOptions {
  type: 'product' | 'page' | 'blog' | 'category' | 'home';
  id?: string;
  data?: any;
  fallback?: boolean;
  language?: string;
}

export interface SeoMetadataResult {
  title?: string;
  description?: string;
  keywords?: string[];
  alternates?: any;
  openGraph?: any;
  twitter?: any;
  robots?: any;
  jsonLd?: object[] | null;
}

// language অনুযায়ী লোকাল নির্ধারণ
function getLanguage(language?: string): string {
  return language === 'bn' ? 'bn_BD' : 'en_US';
}

// language অনুযায়ী সাইটের নাম
function getSiteName(language?: string): string {
  return language === 'bn' ? 'আমারশপ' : 'AmarShop';
}

function getValidOgType(type: string): string {
  switch (type) {
    case 'blog': return 'article';
    default: return 'website';
  }
}

// URL জেনারেটর (language অনুযায়ী)
function generateUrl(baseUrl: string, type: string, slug: string, language?: string): string {
  const langPrefix = language === 'bn' ? '/bn' : '';

  let typePath = '';
  switch (type) {
    case 'product': typePath = '/product'; break;
    case 'blog': typePath = '/blog'; break;
    case 'page': typePath = '/page'; break;
    case 'category': typePath = '/category'; break;
    default: typePath = '';
  }

  return `${baseUrl}${langPrefix}${typePath}/${slug}`;
}

// প্রোডাক্ট স্কিমা (বাংলা সাপোর্ট সহ)
function generateProductSchema(pageData: any, url: string, imageUrl: string, baseUrl: string, language?: string) {
  if (!pageData) return null;

  const priceValidUntil = new Date();
  priceValidUntil.setDate(priceValidUntil.getDate() + 30);

  const productName = language === 'bn'
    ? (pageData.nameBn || pageData.name)
    : (pageData.name || pageData.nameBn);

  const productDescription = language === 'bn'
    ? (pageData.descriptionBn || pageData.description || "").substring(0, 200)
    : (pageData.description || pageData.descriptionBn || "").substring(0, 200);

  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": productName,
    "description": productDescription,
    "image": imageUrl,
    "sku": pageData.sku || pageData._id,
    "mpn": pageData.mpn || pageData.sku || pageData._id,
    "brand": {
      "@type": "Brand",
      "name": pageData.brand?.name || pageData.brandName || pageData.brand || (language === 'bn' ? 'আমারশপ' : 'AmarShop')
    },
    // ✅ FIX 1: category কে string এ পরিবর্তন করুন (object না)
    "category": pageData.category?.name || pageData.categoryName || pageData.category || (language === 'bn' ? 'আমারশপ' : 'AmarShop'),

    // ✅ FIX 2: offers ঠিক করুন
    "offers": {
      "@type": "Offer",
      "url": url,
      "priceCurrency": "BDT",
      "price": Number(pageData.salePrice || pageData.price || 0),  // ✅ number এ কনভার্ট
      "priceValidUntil": priceValidUntil.toISOString().split('T')[0],
      "availability": pageData.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      "itemCondition": pageData.condition === "used"
        ? "https://schema.org/UsedCondition"
        : "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": language === 'bn' ? 'আমারশপ' : 'AmarShop'
      }
    }
  };

  if (pageData.rating && pageData.rating > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": pageData.rating,
      "reviewCount": pageData.reviewCount || 0,
      "bestRating": "5",
      "worstRating": "1"
    };
  }

  if (pageData.gallery && pageData.gallery.length > 0) {
    schema.image = [pageData.image, ...pageData.gallery.map((img: any) => img.url)];
  }

  return schema;
}

// ব্লগ স্কিমা (বাংলা সাপোর্ট সহ)
function generateBlogSchema(pageData: any, url: string, imageUrl: string, baseUrl: string, language?: string) {
  if (!pageData) return null;

  const title = language === 'bn'
    ? (pageData.titleBn || pageData.title)
    : (pageData.title || pageData.titleBn);

  const description = language === 'bn'
    ? (pageData.excerptBn || pageData.excerpt || pageData.description?.substring(0, 160))
    : (pageData.excerpt || pageData.excerptBn || pageData.description?.substring(0, 160));

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "image": imageUrl,
    "datePublished": pageData.created_at || pageData.publishedAt || new Date().toISOString(),
    "dateModified": pageData.updated_at || pageData.updatedAt || new Date().toISOString(),
    "author": {
      "@type": "Person",
      "name": pageData.author?.name || pageData.author || (language === 'bn' ? 'আমারশপ টিম' : 'AmarShop Team')
    },
    "publisher": {
      "@type": "Organization",
      "name": language === 'bn' ? 'আমারশপ' : 'AmarShop',
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    }
  };
}

function generateWebsiteSchema(baseUrl: string, siteName: string, language?: string) {
  const langPrefix = language === 'bn' ? '/bn' : '';

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteName,
    "url": `${baseUrl}${langPrefix}`,
    "inLanguage": language === 'bn' ? 'bn-BD' : 'en-US',
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}${langPrefix}/products?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
}

function generateLocalBusinessSchema(baseUrl: string, settings: any, language?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": language === 'bn' ? (settings?.titleBn || settings?.title || "আমারশপ") : (settings?.title || "AmarShop"),
    "url": baseUrl,
    "logo": `${baseUrl}${settings?.logo}`,
    "description": language === 'bn'
      ? (settings?.descriptionBn || settings?.description || "সেরা দামে কেনাকাটা করুন")
      : (settings?.description || "Best price shopping"),
    "address": {
      "@type": "PostalAddress",
      "streetAddress": settings?.address?.street || "Dhaka",
      "addressLocality": settings?.address?.city || "Dhaka",
      "addressRegion": settings?.address?.division || "Dhaka",
      "addressCountry": "BD"
    },
    "telephone": settings?.phone || "+880123456789",
    "email": settings?.email || "info@amarshop.com"
  };
}

// Main metadata generator
function generateMetadataFromSeo(
  seoData: ISeo | null,
  pageData: any,
  type: string,
  baseUrl: string,
  siteName: string,
  defaultImage: string,
  language?: string
): SeoMetadataResult {
  if (!seoData) return getDefaultMetadata(baseUrl, siteName, defaultImage, language);

  // Get slug for URL
  let slug = seoData.slug || seoData.pageId || seoData.productId;
  if (type === 'product' && pageData) {
    slug = language === 'bn' ? (pageData.slugBn || pageData.slug) : (pageData.slug || pageData.slugBn);
  } else if (type === 'blog' && pageData) {
    slug = language === 'bn' ? (pageData.slugBn || pageData.slug) : (pageData.slug || pageData.slugBn);
  }

  const url = seoData.canonicalUrl || generateUrl(baseUrl, type, slug, language);
  const imageUrl = seoData.ogImage || pageData?.image || pageData?.thumbnail || defaultImage;

  // Title generation based on language
  let title = '';
  if (language === 'bn') {
    title = seoData.seoTitleBn || seoData.seoTitle ||
      pageData?.nameBn || pageData?.name ||
      pageData?.titleBn || pageData?.title ||
      siteName;
  } else {
    title = seoData.seoTitle || seoData.seoTitleBn ||
      pageData?.name || pageData?.nameBn ||
      pageData?.title || pageData?.titleBn ||
      siteName;
  }

  // Description generation based on language
  let description = '';
  if (language === 'bn') {
    description = seoData.seoDescriptionBn || seoData.seoDescription ||
      pageData?.descriptionBn || pageData?.description ||
      pageData?.excerptBn || pageData?.excerpt || '';
  } else {
    description = seoData.seoDescription || seoData.seoDescriptionBn ||
      pageData?.description || pageData?.descriptionBn ||
      pageData?.excerpt || pageData?.excerptBn || '';
  }

  const ogType = getValidOgType(type);

  // Generate alternate language URLs
  const getAlternateUrl = (targetLang: string) => {
    const targetPrefix = targetLang === 'bn' ? '/bn' : '';
    if (type === 'product') {
      const productSlug = targetLang === 'bn' ? (pageData?.slugBn || pageData?.slug) : (pageData?.slug || pageData?.slugBn);
      return `${baseUrl}${targetPrefix}/product/${productSlug}`;
    } else if (type === 'blog') {
      const blogSlug = targetLang === 'bn' ? (pageData?.slugBn || pageData?.slug) : (pageData?.slug || pageData?.slugBn);
      return `${baseUrl}${targetPrefix}/blog/${blogSlug}`;
    }
    return `${baseUrl}${targetPrefix}${type === 'home' ? '' : `/${type}/${slug}`}`;
  };

  const schemas: object[] = [];
  if (type === 'product' && pageData) {
    const s = generateProductSchema(pageData, url, imageUrl, baseUrl, language);
    if (s) schemas.push(s);
  } else if (type === 'blog' && pageData) {
    const s = generateBlogSchema(pageData, url, imageUrl, baseUrl, language);
    if (s) schemas.push(s);
  }

  // OG Title based on language
  let ogTitle = '';
  if (language === 'bn') {
    ogTitle = seoData.ogTitleBn || seoData.ogTitle || title;
  } else {
    ogTitle = seoData.ogTitle || seoData.ogTitleBn || title;
  }

  // OG Description based on language
  let ogDescription = '';
  if (language === 'bn') {
    ogDescription = seoData.ogDescriptionBn || seoData.ogDescription || description;
  } else {
    ogDescription = seoData.ogDescription || seoData.ogDescriptionBn || description;
  }

  // Twitter Title based on language
  let twitterTitle = '';
  if (language === 'bn') {
    twitterTitle = seoData.twitterTitleBn || seoData.twitterTitle || title;
  } else {
    twitterTitle = seoData.twitterTitle || seoData.twitterTitleBn || title;
  }

  // Twitter Description based on language
  let twitterDescription = '';
  if (language === 'bn') {
    twitterDescription = seoData.twitterDescriptionBn || seoData.twitterDescription || description;
  } else {
    twitterDescription = seoData.twitterDescription || seoData.twitterDescriptionBn || description;
  }

  return {
    title,
    description,
    keywords: seoData.primaryKeyword
      ? [seoData.primaryKeyword, ...(seoData.secondaryKeywords || [])]
      : seoData.seoTags,
    alternates: {
      canonical: url,
      languages: {
        'en': getAlternateUrl('en'),
        'bn': getAlternateUrl('bn'),
      }
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: seoData.ogUrl || url,
      siteName: getSiteName(language),
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      locale: getLanguage(language),
      type: ogType,
    },
    twitter: {
      card: seoData.twitterCard || 'summary_large_image',
      title: twitterTitle,
      description: twitterDescription,
      images: [seoData.twitterImage || imageUrl],
      site: seoData.twitterSite || '@amarshop',
    },
    robots: {
      index: seoData.robotsMeta?.includes('index') ?? true,
      follow: seoData.robotsMeta?.includes('follow') ?? true,
      googleBot: {
        index: seoData.robotsMeta?.includes('index') ?? true,
        follow: seoData.robotsMeta?.includes('follow') ?? true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    jsonLd: schemas.length > 0 ? schemas : null,
  };
}

async function getFallbackMetadata(
  type: string,
  pageData: any,
  baseUrl: string,
  siteName: string,
  defaultImage: string,
  language?: string
): Promise<SeoMetadataResult> {
  const settings = await getSetting();
  const langPrefix = language === 'bn' ? '/bn' : '';

  if (type === 'home') {
    const title = language === 'bn'
      ? (settings?.siteTitleBn || settings?.siteTitle || 'আমারশপ - আপনার অনলাইন শপ')
      : (settings?.siteTitle || 'AmarShop - Your Online Shop');

    const description = language === 'bn'
      ? (settings?.siteDescriptionBn || settings?.siteDescription || 'সেরা দামে কেনাকাটা করুন। সর্বোচ্চ মানের পণ্য, দ্রুত ডেলিভারি।')
      : (settings?.siteDescription || 'Best price shopping. Quality products, fast delivery.');

    const homeUrl = `${baseUrl}${langPrefix}`;

    return {
      title,
      description,
      alternates: {
        canonical: homeUrl,
        languages: {
          'en': baseUrl,
          'bn': `${baseUrl}/bn`,
        }
      },
      openGraph: {
        title,
        description,
        url: homeUrl,
        siteName: getSiteName(language),
        images: [{ url: settings?.ogImage || defaultImage, width: 1200, height: 630 }],
        locale: getLanguage(language),
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [settings?.ogImage || defaultImage],
      },
      robots: { index: true, follow: true },
      jsonLd: [
        generateWebsiteSchema(baseUrl, getSiteName(language), language),
        generateLocalBusinessSchema(baseUrl, settings, language),
      ],
    };
  }

  if (type === 'product' && pageData) {
    const slug = language === 'bn' ? (pageData.slugBn || pageData.slug) : (pageData.slug || pageData.slugBn);
    const url = generateUrl(baseUrl, 'product', slug, language);
    const imageUrl = pageData.image || defaultImage;
    const schema = generateProductSchema(pageData, url, imageUrl, baseUrl, language);

    const productName = language === 'bn'
      ? (pageData.nameBn || pageData.name)
      : (pageData.name || pageData.nameBn);

    const productDescription = language === 'bn'
      ? (pageData.descriptionBn || pageData.description || "").substring(0, 160)
      : (pageData.description || pageData.descriptionBn || "").substring(0, 160);

    // Alternate URLs for product
    const enSlug = pageData.slug || pageData.slugBn;
    const bnSlug = pageData.slugBn || pageData.slug;

    return {
      title: `${productName} | ${getSiteName(language)}`,
      description: productDescription,
      alternates: {
        canonical: url,
        languages: {
          'en': `${baseUrl}/product/${enSlug}`,
          'bn': `${baseUrl}/bn/product/${bnSlug}`,
        }
      },
      openGraph: {
        title: productName,
        description: productDescription,
        url,
        siteName: getSiteName(language),
        images: [{ url: imageUrl, width: 1200, height: 630 }],
        locale: getLanguage(language),
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: productName,
        description: productDescription,
        images: [imageUrl],
      },
      robots: { index: true, follow: true },
      jsonLd: schema ? [schema] : null,
    };
  }

  if (type === 'blog' && pageData) {
    const slug = language === 'bn' ? (pageData.slugBn || pageData.slug) : (pageData.slug || pageData.slugBn);
    const url = generateUrl(baseUrl, 'blog', slug, language);
    const imageUrl = pageData.thumbnail || defaultImage;
    const schema = generateBlogSchema(pageData, url, imageUrl, baseUrl, language);

    const title = language === 'bn'
      ? (pageData.titleBn || pageData.title)
      : (pageData.title || pageData.titleBn);

    const description = language === 'bn'
      ? (pageData.excerptBn || pageData.excerpt || pageData.description?.substring(0, 160))
      : (pageData.excerpt || pageData.excerptBn || pageData.description?.substring(0, 160));

    // Alternate URLs for blog
    const enSlug = pageData.slug || pageData.slugBn;
    const bnSlug = pageData.slugBn || pageData.slug;

    return {
      title: `${title} | ${getSiteName(language)}`,
      description,
      alternates: {
        canonical: url,
        languages: {
          'en': `${baseUrl}/blog/${enSlug}`,
          'bn': `${baseUrl}/bn/blog/${bnSlug}`,
        }
      },
      openGraph: {
        title,
        description,
        url,
        siteName: getSiteName(language),
        images: [{ url: imageUrl, width: 1200, height: 630 }],
        locale: getLanguage(language),
        type: 'article',
        publishedTime: pageData.created_at || pageData.publishedAt,
        modifiedTime: pageData.updated_at || pageData.updatedAt,
        authors: [pageData.author || (language === 'bn' ? 'আমারশপ টিম' : 'AmarShop Team')],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
      robots: { index: true, follow: true },
      jsonLd: schema ? [schema] : null,
    };
  }

  if (type === 'page' && pageData) {
    const slug = language === 'bn' ? (pageData.slugBn || pageData.slug) : (pageData.slug || pageData.slugBn);
    const url = generateUrl(baseUrl, 'page', slug, language);

    const title = language === 'bn'
      ? (pageData.titleBn || pageData.title)
      : (pageData.title || pageData.titleBn);

    const description = language === 'bn'
      ? (pageData.excerptBn || pageData.excerpt || pageData.content?.substring(0, 160))
      : (pageData.excerpt || pageData.excerptBn || pageData.content?.substring(0, 160));

    const enSlug = pageData.slug || pageData.slugBn;
    const bnSlug = pageData.slugBn || pageData.slug;

    return {
      title: `${title} | ${getSiteName(language)}`,
      description,
      alternates: {
        canonical: url,
        languages: {
          'en': `${baseUrl}/page/${enSlug}`,
          'bn': `${baseUrl}/bn/page/${bnSlug}`,
        }
      },
      openGraph: {
        title,
        description,
        url,
        siteName: getSiteName(language),
        locale: getLanguage(language),
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
      robots: { index: true, follow: true },
      jsonLd: null,
    };
  }

  return getDefaultMetadata(baseUrl, getSiteName(language), defaultImage, language);
}

function getDefaultMetadata(baseUrl: string, siteName: string, defaultImage: string, language?: string): SeoMetadataResult {
  const langPrefix = language === 'bn' ? '/bn' : '';
  const url = `${baseUrl}${langPrefix}`;

  const title = language === 'bn'
    ? `${siteName} - আপনার অনলাইন শপ`
    : `${siteName} - Your Online Shop`;

  const description = language === 'bn'
    ? 'সেরা দামে কেনাকাটা করুন। সর্বোচ্চ মানের পণ্য, দ্রুত ডেলিভারি এবং সেরা সার্ভিস।'
    : 'Best price shopping. Quality products, fast delivery and best service.';

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'en': baseUrl,
        'bn': `${baseUrl}/bn`,
      }
    },
    openGraph: {
      title: language === 'bn' ? siteName : siteName,
      description: language === 'bn' ? 'সেরা দামে কেনাকাটা করুন' : 'Best price shopping',
      url,
      siteName,
      images: [{ url: defaultImage, width: 1200, height: 630 }],
      locale: getLanguage(language),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: language === 'bn' ? siteName : siteName,
      description: language === 'bn' ? 'সেরা দামে কেনাকাটা করুন' : 'Best price shopping',
      images: [defaultImage],
    },
    robots: { index: true, follow: true },
    jsonLd: null,
  };
}

// Public API (লোকাল সাপোর্ট সহ)
export const seoMetaData = async (options: SeoMetadataOptions): Promise<SeoMetadataResult> => {
  const { type, id, data, fallback = true, language } = options;

  const baseUrl = process.env.NEXTAUTH_URL || 'https://amarshop.com';
  const siteName = getSiteName(language);
  const defaultImage = `${baseUrl}/default-og-image.jpg`;

  let seoData: ISeo | null = null;
  let pageData = data;

  if (type === 'product' && id) {
    seoData = await getSeoByProductId(id);
    if (!pageData && seoData) {
      const { getProductById } = await import('@/queries/products');
      pageData = await getProductById(id);
    }
  } else if (type === 'page' && id) {
    seoData = await getSeoByPageId(id);
  } else if (type === 'blog' && id) {
    seoData = await getSeoByPageId(id);
  } else if (type === 'home') {
    seoData = await getSeoByPageId(language === 'bn' ? 'home-bn' : 'home');
  }

  if (!seoData && fallback) {
    return getFallbackMetadata(type, pageData, baseUrl, siteName, defaultImage, language);
  }

  return generateMetadataFromSeo(seoData, pageData, type, baseUrl, siteName, defaultImage, language);
};

// Export functions with language support
export const getProductSeoMetadata = (productId: string, productData?: any, language?: string) =>
  seoMetaData({ type: 'product', id: productId, data: productData, language });

export const getPageSeoMetadata = (pageId: string, pageData?: any, language?: string) =>
  seoMetaData({ type: 'page', id: pageId, data: pageData, language });

export const getBlogSeoMetadata = (blogId: string, blogData?: any, language?: string) =>
  seoMetaData({ type: 'blog', id: blogId, data: blogData, language });

export const getHomeSeoMetadata = (language?: string) =>
  seoMetaData({ type: 'home', language });