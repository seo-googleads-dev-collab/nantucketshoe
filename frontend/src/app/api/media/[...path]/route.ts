import { NextRequest, NextResponse } from "next/server";

/**
 * Image proxy route — makes Strapi uploads accessible through the Next.js frontend.
 * This solves the issue where remote viewers (via ngrok) can't reach localhost:1337.
 *
 * /api/media/uploads/filename.jpg → fetches http://strapi:1337/uploads/filename.jpg internally
 */

const INTERNAL_STRAPI_URL =
  process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const mediaPath = path.join("/");
  const strapiUrl = `${INTERNAL_STRAPI_URL}/${mediaPath}`;

  try {
    const response = await fetch(strapiUrl, {
      headers: {
        // Pass along accept headers for content negotiation
        Accept: request.headers.get("accept") || "*/*",
      },
    });

    if (!response.ok) {
      return new NextResponse(null, { status: response.status });
    }

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error(`[media-proxy] Failed to fetch: ${strapiUrl}`, error);
    return new NextResponse(null, { status: 502 });
  }
}
