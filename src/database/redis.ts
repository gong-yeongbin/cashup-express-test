import Redis from "ioredis";
import "dotenv/config";
import * as process from "process";

export const redis = new Redis(process.env.REDIS_URL);

// export const redisClient = redis.createClient({
//   url: process.env.REDIS_URL,
//   legacyMode: true,
// });
//
// redisClient.on("connect", () => {
//   console.info("Redis connected!");
// });
//
// redisClient.on("error", (err) => {
//   console.error("Redis Client Error", err);
// });
