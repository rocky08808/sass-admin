import type { z } from 'zod';

async function send(path: string, method: string, body?: unknown): Promise<Response> {
  const response = await fetch(new URL(path, window.location.origin), {
    method,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!response.ok) {
    const error: { message?: string } = await response.json().catch(() => ({}));
    throw new Error(error.message ?? `请求失败（${response.status}）`);
  }
  return response;
}

export async function request<T>(
  schema: z.ZodType<T>,
  path: string,
  method = 'GET',
  body?: unknown,
): Promise<T> {
  const response = await send(path, method, body);
  return schema.parse(await response.json());
}

export async function requestVoid(path: string, method: string): Promise<void> {
  await send(path, method);
}
