import { z } from 'zod';
import { createTenantSchema, tenantSchema, updateTenantSchema } from './tenants.model.schema';

export type {
  CreateTenantDTO,
  Tenant,
  UpdateTenantDTO,
} from './tenants.model.schema';
export {
  createTenantSchema,
  tenantPlans,
  tenantSchema,
  tenantStatuses,
  updateTenantSchema,
} from './tenants.model.schema';

export const apiContract = {
  module: 'tenants',
  endpoints: [
    {
      method: 'GET',
      path: '/api/tenants',
      response: { status: 200, schema: z.toJSONSchema(z.array(tenantSchema)) },
    },
    {
      method: 'POST',
      path: '/api/tenants',
      requestBody: z.toJSONSchema(createTenantSchema),
      response: { status: 201, schema: z.toJSONSchema(tenantSchema) },
    },
    {
      method: 'PUT',
      path: '/api/tenants/{id}',
      requestBody: z.toJSONSchema(updateTenantSchema),
      response: { status: 200, schema: z.toJSONSchema(tenantSchema) },
    },
    {
      method: 'DELETE',
      path: '/api/tenants/{id}',
      response: { status: 204 },
    },
  ],
} as const;
