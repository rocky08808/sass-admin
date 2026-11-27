import { z } from 'zod';

export const billingCycles = ['Monthly', 'Yearly'] as const;

export const subscriptionSchema = z.object({
  id: z.string(),
  planName: z.string('请输入套餐名称').trim().min(1, '请输入套餐名称'),
  priceMonthly: z.number('请输入月费').min(0, '月费不能为负数'),
  maxUsers: z.number('请输入用户上限').int('必须是整数').min(1, '至少为 1'),
  billingCycle: z.enum(billingCycles, '请选择计费周期'),
  isActive: z.boolean(),
});

export const createSubscriptionSchema = subscriptionSchema.omit({ id: true });
export const updateSubscriptionSchema = createSubscriptionSchema.partial();

export const apiContract = {
  module: 'subscriptions',
  endpoints: [
    {
      method: 'GET',
      path: '/api/subscriptions',
      response: { status: 200, schema: z.toJSONSchema(z.array(subscriptionSchema)) },
    },
    {
      method: 'POST',
      path: '/api/subscriptions',
      requestBody: z.toJSONSchema(createSubscriptionSchema),
      response: { status: 201, schema: z.toJSONSchema(subscriptionSchema) },
    },
    {
      method: 'PUT',
      path: '/api/subscriptions/{id}',
      requestBody: z.toJSONSchema(updateSubscriptionSchema),
      response: { status: 200, schema: z.toJSONSchema(subscriptionSchema) },
    },
    {
      method: 'DELETE',
      path: '/api/subscriptions/{id}',
      response: { status: 204 },
    },
  ],
} as const;

export type Subscription = z.infer<typeof subscriptionSchema>;
export type CreateSubscriptionDTO = z.infer<typeof createSubscriptionSchema>;
export type UpdateSubscriptionDTO = z.infer<typeof updateSubscriptionSchema>;
