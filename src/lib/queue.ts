import { Queue, Worker } from "bullmq"
import Redis from "ioredis"

let _connection: Redis | null = null
let _queue: Queue | null = null

function getRedisUrl(): string {
  return process.env.REDIS_URL || "redis://localhost:6379"
}

function getConnection(): Redis {
  if (!_connection) {
    _connection = new Redis(getRedisUrl(), {
      maxRetriesPerRequest: null,
      lazyConnect: true,
    })
  }
  return _connection
}

export function getProcessingQueue(): Queue {
  if (!_queue) {
    _queue = new Queue("audio-processing", { connection: getConnection() as any })
  }
  return _queue
}

export function createProcessingWorker(handler: (job: any) => Promise<void>) {
  return new Worker("audio-processing", async (job) => handler(job), {
    connection: getConnection() as any,
    concurrency: 5,
  })
}

export async function enqueueJob(
  type: "separate_vocal" | "split_stem",
  payload: Record<string, unknown>
) {
  const q = getProcessingQueue()
  return q.add(type, payload, {
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 },
  })
}
