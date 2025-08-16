import Redis from 'ioredis';

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = Number(process.env.REDIS_PORT || 6379);

// Use a singleton Redis connection for publishing
let publisher: Redis;
export function getPublisher(): Redis {
  if (!publisher) {
    publisher = new (Redis as any)({ host: REDIS_HOST, port: REDIS_PORT });
  }
  return publisher;
}

export async function publishEvent<T>(
  channel: string,
  payload: T
): Promise<number> {
  const client = getPublisher();
  return client.publish(channel, JSON.stringify(payload));
}
