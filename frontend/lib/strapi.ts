const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

/**
 * Flatten nested objects into Strapi-compatible bracket notation.
 * e.g. { populate: { items: { populate: { image: true } } } }
 * becomes: populate[items][populate][image]=true
 */
function toQueryString(obj: Record<string, any>, prefix = ''): string {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}[${key}]` : key;
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      parts.push(toQueryString(value, fullKey));
    } else {
      parts.push(`${encodeURIComponent(fullKey)}=${encodeURIComponent(String(value))}`);
    }
  }
  return parts.filter(Boolean).join('&');
}

export async function fetchAPI(path: string, urlParamsObject: Record<string, any> = {}, options: any = {}) {
  try {
    const mergedOptions = {
      next: { revalidate: 60 },
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

  // Return the full URL if it's already an absolute path
  if (url.startsWith('http') || url.startsWith('//')) {
    return url;
  }

  // Otherwise, prepend the Strapi URL
  return `${STRAPI_URL}${url}`;
}
