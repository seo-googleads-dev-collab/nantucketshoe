const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function fetchAPI(path: string, urlParamsObject: Record<string, string> = {}, options: RequestInit = {}) {
  try {
    const mergedOptions: RequestInit = {
      next: { revalidate: 60 } as RequestInit['next'],
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    const queryString = new URLSearchParams(urlParamsObject).toString();
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
