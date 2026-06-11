import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

export async function POST(req: NextRequest) {
  const { isValidSignature, body } = await parseBody<{ _type: string }>(req, process.env.SANITY_REVALIDATE_SECRET);
  if (!isValidSignature) return NextResponse.json({ ok: false }, { status: 401 });
  if (body?._type) revalidateTag(body._type, "max");
  return NextResponse.json({ ok: true, revalidated: body?._type });
}
