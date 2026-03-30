import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/api-config";

// Proxy to backend API server

export async function GET(request: NextRequest) {
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    return NextResponse.json(
      { error: "API URL not configured" },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const industry = searchParams.get("industry");
    const slug = searchParams.get("slug");

    let url = `${apiUrl}/api/case-studies`;

    if (slug) {
      url = `${apiUrl}/api/case-studies/${slug}`;
    } else if (featured) {
      url = `${apiUrl}/api/case-studies/featured`;
    } else if (industry) {
      url = `${apiUrl}/api/case-studies?industry=${industry}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Case Studies API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    return NextResponse.json(
      { error: "API URL not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();

    const response = await fetch(`${apiUrl}/api/case-studies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status
    });
  } catch (error) {
    console.error("Case Studies API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}