import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, status, output, error } = body

    if (!id) {
      return NextResponse.json({ error: "Missing job ID" }, { status: 400 })
    }

    const { data: job } = await getSupabaseAdmin()
      .from("processing_jobs")
      .select("*")
      .eq("suno_job_id", id)
      .single()

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    if (status === "completed" && output?.audio_url) {
      const stemType = job.stem_type || "instrumental"
      const stemId = crypto.randomUUID()

      const { error: stemError } = await getSupabaseAdmin().from("stems").insert({
        id: stemId,
        project_id: job.project_id,
        type: stemType,
        audio_url: output.audio_url,
        duration: output.duration || 0,
        status: "completed",
      })

      if (stemError) throw stemError

      await getSupabaseAdmin()
        .from("projects")
        .update({ status: "completed", updated_at: new Date().toISOString() })
        .eq("id", job.project_id)

      const { data: project } = await getSupabaseAdmin()
        .from("projects")
        .select("user_id")
        .eq("id", job.project_id)
        .single()

      if (project?.user_id) {
        await getSupabaseAdmin().rpc("deduct_credits", {
          user_id: project.user_id,
          amount: job.credits_consumed,
        })
      }
    } else if (status === "failed") {
      await getSupabaseAdmin()
        .from("projects")
        .update({ status: "failed", updated_at: new Date().toISOString() })
        .eq("id", job.project_id)

      await getSupabaseAdmin()
        .from("processing_jobs")
        .update({
          status: "failed",
          error: error || "Unknown error",
          updated_at: new Date().toISOString(),
        })
        .eq("id", job.id)
    } else {
      await getSupabaseAdmin()
        .from("processing_jobs")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", job.id)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
