import { createClient, RedisClientType } from "redis";

export class CacheService {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
    });

    this.client.on("error", (err) => console.error("Redis Client Error", err));

    this.client.connect();
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    if (!data) {
      return null;
    }
    return JSON.parse(data) as T;
  }

  async set<T>(
    key: string,
    value: T,
    ttl: number = 86400
    // 1 dia
  ): Promise<void> {
    await this.client.set(key, JSON.stringify(value), {
      EX: ttl,
    });
  }

  async reset(key: string): Promise<void> {
    await this.client.del(key);
  }
}
