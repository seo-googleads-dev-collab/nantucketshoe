const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

/**
 * Convert a nested object into bracket-notation query string.
 * e.g. { populate: { items: { populate: { feature_images: true } } } }
 * → "populate[items][populate][feature_images]=true"
 */
function toQueryString(obj: Record<string, any>, prefix = ''): string {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}[${key}]` : key;
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      parts.push(toQueryString(value, fullKey));
    } else if (Array.isArray(value)) {
      value.forEach((v, i) => {
        parts.push(`${encodeURIComponent(`${fullKey}[${i}]`)}=${encodeURIComponent(String(v))}`);
      });
    } else {
      parts.push(`${encodeURIComponent(fullKey)}=${encodeURIComponent(String(value))}`);
    }
  }
  return parts.filter(Boolean).join('&');
}

export async function fetchAPI(path: string, urlParamsObject: Record<string, any> = {}, options: RequestInit = {}) {
  try {
    const mergedOptions: RequestInit = {
      next: { revalidate: 60 } as RequestInit['next'],
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    const queryString = toQueryString(urlParamsObject);
    const requestUrl = `${STRAPI_URL}/api${path}${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(requestUrl, mergedOptions);

    if (!response.ok) {
      console.error(`An error occurred while fetching ${requestUrl}:`, response.statusText);
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error connecting to Strapi: `, error);
    return null;
  }
}

export function getStrapiMedia(url: string | null) {
  if (url == null) {
    return null;
  }

  if (url.startsWith('http') || url.startsWith('//')) {
    return url;
  }

  return `${STRAPI_URL}${url}`;
}
