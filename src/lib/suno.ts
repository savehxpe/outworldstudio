const SUNO_API_BASE = "https://api.sunoapi.org/api/v1"

interface SunoGenerateResponse {
  id: string
  status: "pending" | "processing" | "completed" | "failed"
  output?: {
    audio_url: string
    duration: number
  }
  error?: string
}

export async function separateVocals(
  audioUrl: string,
  webhookUrl?: string
): Promise<SunoGenerateResponse> {
  const res = await fetch(`${SUNO_API_BASE}/vocal-removal/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.SUNO_API_KEY}`,
    },
    body: JSON.stringify({
      audio_url: audioUrl,
      webhook_url: webhookUrl,
      mode: "separate_vocal",
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Suno API error (${res.status}): ${err}`)
  }

  return res.json()
}

export async function splitStem(
  audioUrl: string,
  stem: "drums" | "bass" | "vocals" | "other",
  webhookUrl?: string
): Promise<SunoGenerateResponse> {
  const res = await fetch(`${SUNO_API_BASE}/vocal-removal/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.SUNO_API_KEY}`,
    },
    body: JSON.stringify({
      audio_url: audioUrl,
      webhook_url: webhookUrl,
      mode: "split_stem",
      stem,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Suno API error (${res.status}): ${err}`)
  }

  return res.json()
}

export async function getJobStatus(jobId: string): Promise<SunoGenerateResponse> {
  const res = await fetch(`${SUNO_API_BASE}/vocal-removal/result?id=${jobId}`, {
    headers: {
      Authorization: `Bearer ${process.env.SUNO_API_KEY}`,
    },
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Suno status error (${res.status}): ${err}`)
  }

  return res.json()
}

export type StemType = "drums" | "bass" | "vocals" | "other"
export type ProcessingMode = "separate_vocal" | "split_stem"
