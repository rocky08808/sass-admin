import { delay, HttpResponse, http } from 'msw';
import type { z } from 'zod';
import { createMemberSchema, updateMemberSchema } from '../schemas/members.schema';
import {
  createSubscriptionSchema,
  updateSubscriptionSchema,
} from '../schemas/subscriptions.model.schema';
import { createTenantSchema, updateTenantSchema } from '../schemas/tenants.model.schema';
import { db, mockDelayMs, simulateError } from './db';

const notFound = () => HttpResponse.json({ message: '记录不存在' }, { status: 404 });
const simulatedServerError = () =>
  HttpResponse.json({ message: 'Simulated Server Error' }, { status: 500 });
const invalid = (error: z.ZodError) =>
  HttpResponse.json({ message: error.issues[0]?.message ?? '参数错误' }, { status: 400 });

function crudHandlers<K extends keyof typeof db>(
  key: K,
  createSchema: z.ZodType<object>,
  updateSchema: z.ZodType<object>,
  defaults: () => object = () => ({}),
) {
  const url = `/api/${key}`;
  const rows = () => db[key] as { id: string }[];
  const waitForMockDelay = async () => {
    if (mockDelayMs > 0) await delay(mockDelayMs);
  };

  return [
    http.get(url, async () => {
      await waitForMockDelay();
      if (simulateError) return simulatedServerError();
      return HttpResponse.json(rows());
    }),
    http.post(url, async ({ request }) => {
      await waitForMockDelay();
      if (simulateError) return simulatedServerError();
      const result = createSchema.safeParse(await request.json());
      if (!result.success) return invalid(result.error);
      const row = { ...result.data, ...defaults(), id: crypto.randomUUID() };
      rows().unshift(row);
      return HttpResponse.json(row, { status: 201 });
    }),
    http.put(`${url}/:id`, async ({ request, params }) => {
      await waitForMockDelay();
      if (simulateError) return simulatedServerError();
      const row = rows().find((item) => item.id === params.id);
      if (!row) return notFound();
      const result = updateSchema.safeParse(await request.json());
      if (!result.success) return invalid(result.error);
      Object.assign(row, result.data);
      return HttpResponse.json(row);
    }),
    http.delete(`${url}/:id`, async ({ params }) => {
      await waitForMockDelay();
      if (simulateError) return simulatedServerError();
      const index = rows().findIndex((item) => item.id === params.id);
      if (index === -1) return notFound();
      rows().splice(index, 1);
      return new HttpResponse(null, { status: 204 });
    }),
  ];
}

export const handlers = [
  ...crudHandlers('tenants', createTenantSchema, updateTenantSchema, () => ({
    createdAt: new Date().toISOString(),
  })),
  ...crudHandlers('subscriptions', createSubscriptionSchema, updateSubscriptionSchema),
  ...crudHandlers('members', createMemberSchema, updateMemberSchema, () => ({
    joinedAt: new Date().toISOString(),
  })),
];
