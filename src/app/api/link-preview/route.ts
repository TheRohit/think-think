import { getLinkPreview } from "link-preview-js";
import { NextResponse } from "next/server";
import { z } from "zod";
import { type LinkPreviewResponse, getContentType } from "~/types/link-preview";

const urlSchema = z.object({
  url: z.string().min(1, "URL is required"),
});

export async function GET(
  request: Request,
): Promise<NextResponse<LinkPreviewResponse>> {
  try {
    // Get URL from query parameters
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    // Validate the URL
    const result = urlSchema.safeParse({ url });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input",
          validationErrors: result.error.format(),
        },
        { status: 400 },
      );
    }

    let validUrl = result.data.url;

    if (!validUrl.startsWith("http://") && !validUrl.startsWith("https://")) {
      validUrl = `https://${validUrl}`;
    }

    const contentType = getContentType(validUrl);

    const metadata = await getLinkPreview(validUrl, {
      timeout: 5000,
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        title: "title" in metadata ? metadata.title : "",
        description:
          "description" in metadata ? (metadata.description ?? "") : "",
        image:
          "images" in metadata && metadata.images.length > 0
            ? metadata.images[0]
            : "",
        siteName: "siteName" in metadata ? (metadata.siteName ?? "") : "",
        url: metadata.url,
        type: contentType,
      },
    });
  } catch (error) {
    console.error("Error fetching link preview:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch link preview",
      },
      { status: 500 },
    );
  }
}
