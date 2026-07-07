const SITE_URL = "https://keluargabahagia.id";
const SITE_NAME = "Keluarga Bahagia";
const DEFAULT_IMAGE = "/logo.webp";

interface LandingSeoOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
}

export function useLandingSeo({
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
}: LandingSeoOptions) {
  const canonical = `${SITE_URL}${path}`;
  const imageUrl = image.startsWith("http")
    ? image
    : `${SITE_URL}${image}`;

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogType: "website",
    ogUrl: canonical,
    ogSiteName: SITE_NAME,
    ogImage: imageUrl,
    twitterCard: "summary_large_image",
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: imageUrl,
  });

  useHead({
    link: [
      {
        rel: "canonical",
        href: canonical,
      },
    ],
  });
}

export function useWebsiteStructuredData() {
  useHead({
    script: [
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": SITE_NAME,
          "url": SITE_URL,
          "logo": `${SITE_URL}${DEFAULT_IMAGE}`,
          "sameAs": [
            "https://wa.me/6285772048120",
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+62-857-7204-8120",
            "contactType": "customer service",
            "areaServed": "ID",
            "availableLanguage": ["id"],
          },
        }),
      },
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": SITE_NAME,
          "url": SITE_URL,
        }),
      },
    ],
  });
}
