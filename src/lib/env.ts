import { z } from "zod"

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SUNO_API_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  STRIPE_PRICE_HOBBY: z.string().default(""),
  STRIPE_PRICE_PRO: z.string().default(""),
  STRIPE_PRICE_STUDIO: z.string().default(""),
  REDIS_URL: z.string().url().default("redis://localhost:6379"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
})

export function validateEnv() {
  const parsed = envSchema.safeParse(process.env)
  if (!parsed.success) {
    console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors)
    throw new Error("Invalid environment variables")
  }
  return parsed.data
}

export function getEnv() {
  return {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    sunoApiKey: process.env.SUNO_API_KEY!,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY!,
    stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
    stripePriceHobby: process.env.STRIPE_PRICE_HOBBY!,
    stripePricePro: process.env.STRIPE_PRICE_PRO!,
    stripePriceStudio: process.env.STRIPE_PRICE_STUDIO!,
    redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
    appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  }
}
