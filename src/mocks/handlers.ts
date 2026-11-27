import { HttpResponse, http } from 'msw';
import type { z } from 'zod';
import {
  createSubscriptionSchema,
  updateSubscriptionSchema,
} from '../schemas/subscriptions.schema';
import { createTenantSchema, updateTenantSchema } from '../schemas/tenants.schema';
import { db } from './db';

const notFound = () => HttpResponse.json({ message: '记录不存在' }, { status: 404 });
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

  return [
    http.get(url, () => HttpResponse.json(rows())),
    http.post(url, async ({ request }) => {
      const result = createSchema.safeParse(await request.json());
      if (!result.success) return invalid(result.error);
      const row = { ...result.data, ...defaults(), id: crypto.randomUUID() };
      rows().unshift(row);
      return HttpResponse.json(row, { status: 201 });
    }),
    http.put(`${url}/:id`, async ({ request, params }) => {
      const row = rows().find((item) => item.id === params.id);
      if (!row) return notFound();
      const result = updateSchema.safeParse(await request.json());
      if (!result.success) return invalid(result.error);
      Object.assign(row, result.data);
      return HttpResponse.json(row);
    }),
    http.delete(`${url}/:id`, ({ params }) => {
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
];
