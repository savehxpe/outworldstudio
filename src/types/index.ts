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
  tier: Tier
  stripeSubscriptionId?: string
  trialEndsAt?: string
  subscriptionStatus?: string
  monthlyCredits: number
}

export type Tier = "free" | "hobby" | "pro" | "studio"

export interface SubscriptionTier {
  id: Tier
  label: string
  monthlyCredits: number
  price: number
  priceIdEnv: string | null
  features: string[]
}

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: "free",
    label: "Free",
    monthlyCredits: 0,
    price: 0,
    priceIdEnv: null,
    features: [
      "10 one-time credits",
      "Vocal removal only",
      "Basic support",
    ],
  },
  {
    id: "hobby",
    label: "Hobby",
    monthlyCredits: 100,
    price: 12,
    priceIdEnv: "STRIPE_PRICE_HOBBY",
    features: [
      "100 credits every month",
      "Vocal removal & stem splitter",
      "Rollover unused credits",
      "7-day free trial",
    ],
  },
  {
    id: "pro",
    label: "Pro",
    monthlyCredits: 500,
    price: 49,
    priceIdEnv: "STRIPE_PRICE_PRO",
    features: [
      "500 credits every month",
      "Vocal removal & stem splitter",
      "Priority processing",
      "Rollover unused credits",
      "7-day free trial",
    ],
  },
  {
    id: "studio",
    label: "Studio",
    monthlyCredits: 2000,
    price: 149,
    priceIdEnv: "STRIPE_PRICE_STUDIO",
    features: [
      "2,000 credits every month",
      "Everything unlocked",
      "Highest processing priority",
      "Rollover unused credits",
      "7-day free trial",
    ],
  },
]

export const CREDIT_COSTS = {
  separate_vocal: 10,
  split_stem: 25,
} as const
