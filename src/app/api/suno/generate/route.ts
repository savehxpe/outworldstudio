import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase"
import { separateVocals, splitStem, type StemType, type ProcessingMode } from "@/lib/suno"
import { enqueueJob } from "@/lib/queue"
import { absoluteUrl, generateId } from "@/lib/utils"
import { CREDIT_COSTS } from "@/types"

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("audio") as File
    const mode = formData.get("mode") as string
    const stemType = formData.get("stem") as string | null

    if (!file) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    const allowedTypes = ["audio/mpeg", "audio/wav", "audio/flac", "audio/mp3", "audio/x-wav", "audio/x-flac"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Unsupported format. Use MP3, WAV, or FLAC" }, { status: 400 })
    }

    const userId = req.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const creditCost = mode === "split_stem" ? CREDIT_COSTS.split_stem : CREDIT_COSTS.separate_vocal

    const { data: user, error: userError } = await getSupabaseAdmin()
      .from("users")
      .select("credits, tier")
      .eq("id", userId)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.credits < creditCost) {
      const needed = creditCost - user.credits
      return NextResponse.json(
        {
          error: "Insufficient credits",
          code: "insufficient_credits",
          needed,
          upgradeUrl: "/pricing",
        },
        { status: 402 }
      )
    }

    if (user.tier === "free" && mode === "split_stem") {
      return NextResponse.json(
        {
          error: "Stem splitting requires a paid plan",
          code: "upgrade_required",
          upgradeUrl: "/pricing",
        },
        { status: 402 }
      )
    }

    await getSupabaseAdmin().rpc("deduct_credits", {
      user_id: userId,
      amount: creditCost,
    })

    const buffer = Buffer.from(await file.arrayBuffer())
    const projectId = generateId()
    const fileName = `${userId}/${projectId}/${file.name}`

    const { error: uploadError } = await getSupabaseAdmin().storage
      .from("audio_uploads")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      return NextResponse.json({ error: "Upload failed" }, { status: 500 })
    }

    const { data: { publicUrl } } = getSupabaseAdmin().storage
      .from("audio_uploads")
      .getPublicUrl(fileName)

    await getSupabaseAdmin().from("projects").insert({
      id: projectId,
      user_id: userId,
      title: file.name.replace(/\.[^/.]+$/, ""),
      original_filename: file.name,
      original_file_url: publicUrl,
      original_size: buffer.length,
      format: file.type.split("/")[1],
      status: "processing",
    })

    const webhookUrl = absoluteUrl("/api/webhooks/stems")

    let result
    if (mode === "split_stem" && stemType) {
      result = await splitStem(publicUrl, stemType as StemType, webhookUrl)
    } else {
      result = await separateVocals(publicUrl, webhookUrl)
    }

    await getSupabaseAdmin().from("processing_jobs").insert({
      project_id: projectId,
      user_id: userId,
      mode: mode || "separate_vocal",
      stem_type: stemType,
      suno_job_id: result.id,
      status: "processing",
      credits_consumed: creditCost,
    })

    await enqueueJob((mode || "separate_vocal") as ProcessingMode, {
      projectId,
      userId,
      sunoJobId: result.id,
      audioUrl: publicUrl,
    })

    return NextResponse.json({
      success: true,
      projectId,
      jobId: result.id,
      message: "Processing initiated",
    })
  } catch (error) {
    console.error("Generate error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Processing failed" },
      { status: 500 }
    )
  }
}
