export interface Project {
  id: string
  userId: string
  title: string
  description?: string
  status: "draft" | "processing" | "completed" | "failed"
  originalFilename?: string
  originalFileUrl?: string
  originalDuration?: number
  originalSize?: number
  format?: string
  createdAt: string
  updatedAt: string
}

export interface Stem {
  id: string
  projectId: string
  type: "vocals" | "drums" | "bass" | "other" | "instrumental"
  audioUrl: string
  duration?: number
  status: string
  createdAt: string
}

export interface ProcessingJob {
  id: string
  projectId: string
  userId: string
  mode: "separate_vocal" | "split_stem"
  stemType?: string
  sunoJobId?: string
  status: "pending" | "processing" | "completed" | "failed"
  creditsConsumed: number
  error?: string
}

export interface User {
  id: string
  email: string
  name?: string
  avatarUrl?: string
  credits: number
  stripeCustomerId?: string
}

export interface CreditPackage {
  id: string
  credits: number
  price: number
  label: string
}
