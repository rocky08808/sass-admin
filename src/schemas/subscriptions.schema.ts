import { z } from 'zod';
import {
  createSubscriptionSchema,
  subscriptionSchema,
  updateSubscriptionSchema,
} from './subscriptions.model.schema';

export type {
  CreateSubscriptionDTO,
  Subscription,
  UpdateSubscriptionDTO,
} from './subscriptions.model.schema';
export {
  billingCycles,
  createSubscriptionSchema,
  subscriptionSchema,
  updateSubscriptionSchema,
} from './subscriptions.model.schema';

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
