import type { Job } from "bullmq"
import { Queue, Worker } from "bullmq"
import Redis from "ioredis"

const REDIS_URL = process.env.REDIS_URL || ""

function isRedisAvailable(): boolean {
  return REDIS_URL.length > 0
}

let _connection: Redis | null = null
let _queue: Queue | null = null
let _redisAvailable: boolean | null = null

async function checkRedis(): Promise<boolean> {
  if (_redisAvailable !== null) return _redisAvailable
  if (!isRedisAvailable()) {
    _redisAvailable = false
    return false
  }
  try {
    const conn = new Redis(REDIS_URL, {
      maxRetriesPerRequest: null,
      lazyConnect: true,
    })
    await conn.connect()
    await conn.quit()
    _redisAvailable = true
  } catch {
    _redisAvailable = false
  }
  return _redisAvailable
}

function getConnection(): Redis {
  if (!_connection) {
    _connection = new Redis(REDIS_URL, {
      maxRetriesPerRequest: null,
      lazyConnect: true,
    })
  }
  return _connection
}

export function getProcessingQueue(): Queue | null {
  if (!_redisAvailable) return null
  if (!_queue) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _queue = new Queue("audio-processing", { connection: getConnection() as any })
  }
  return _queue
}

export function createProcessingWorker(handler: (job: Job) => Promise<void>) {
  if (!isRedisAvailable()) return null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Worker("audio-processing", async (job) => handler(job as any), {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    connection: getConnection() as any,
    concurrency: 5,
  })
}

export async function enqueueJob(
  type: "separate_vocal" | "split_stem",
  payload: Record<string, unknown>
) {
  const available = await checkRedis()
  if (!available) {
    console.warn(`[queue] Redis unavailable — skipping enqueue for ${type}`)
    return
  }
  const q = getProcessingQueue()
  if (!q) return
  return q.add(type, payload, {
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 },
  })
}

export async function ensureRedis() {
  return checkRedis()
}
