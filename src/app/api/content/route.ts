import { auth } from "~/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getContentByUserId } from "~/server/db/queries";

export async function GET(request: NextRequest) {
  try {
    // Authenticate the user
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const userId = session.user.id;

    // Parse limit and offset from URL query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") ?? "100", 10);
    const offset = parseInt(searchParams.get("offset") ?? "0", 10);

    // Fetch content from database
    const data = await getContentByUserId(userId, limit, offset);

    return NextResponse.json({
      success: true,
      data,
      total: data.length,
    });
  } catch (error) {
    console.error("Error fetching content:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch content",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
