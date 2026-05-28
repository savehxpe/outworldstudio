import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase"

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    const userId = formData.get("userId") as string

    if (!file || !userId) {
      return NextResponse.json({ error: "Missing file or userId" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const filePath = `${userId}/uploads/${crypto.randomUUID()}-${file.name}`

    const { error: uploadError } = await getSupabaseAdmin().storage
      .from("audio_uploads")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      return NextResponse.json({ error: "Upload failed" }, { status: 500 })
    }

    const { data: { publicUrl } } = getSupabaseAdmin().storage
      .from("audio_uploads")
      .getPublicUrl(filePath)

    return NextResponse.json({
      url: publicUrl,
      path: filePath,
      size: buffer.length,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
