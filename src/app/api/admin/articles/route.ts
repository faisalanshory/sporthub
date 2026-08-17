import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { title, content, coverImage } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ error: "Title and Content are required" }, { status: 400 });
    }

    const admin = await db.user.findFirst({ where: { role: "ADMIN" } });
    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 400 });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    const article = await db.article.create({
      data: {
        title,
        slug: `${slug}-${Date.now()}`,
        content,
        coverImage: coverImage || "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800",
        authorId: admin.id,
      }
    });

    return NextResponse.json({ success: true, article });
  } catch (error: any) {
    console.error("Failed to create article:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
