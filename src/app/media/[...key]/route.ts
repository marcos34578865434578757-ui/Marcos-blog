import { NextResponse } from "next/server";
import { readImage } from "@/lib/media-storage";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    key?: string[];
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const params = await context.params;
  const key = params.key?.join("/");

  if (!key) {
    return NextResponse.json({ error: "Missing media key." }, { status: 400 });
  }

  const image = await readImage(key);
  if (!image) {
    return NextResponse.json({ error: "Media not found." }, { status: 404 });
  }

  return new NextResponse(image.bytes, {
    status: 200,
    headers: {
      "Content-Type": image.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
