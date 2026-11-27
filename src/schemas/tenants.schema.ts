import { z } from 'zod';

export const tenantPlans = ['Free', 'Pro', 'Enterprise'] as const;
export const tenantStatuses = ['Active', 'Suspended'] as const;

export const tenantSchema = z.object({
  id: z.string(),
  name: z.string('请输入租户名称').trim().min(1, '请输入租户名称'),
  domain: z
    .string('请输入域名')
    .trim()
    .regex(/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i, '请输入有效域名，例如 acme.com'),
  plan: z.enum(tenantPlans, '请选择套餐'),
  status: z.enum(tenantStatuses, '请选择状态'),
  createdAt: z.iso.datetime(),
});

export const createTenantSchema = tenantSchema.omit({ id: true, createdAt: true });
export const updateTenantSchema = createTenantSchema.partial();

export type Tenant = z.infer<typeof tenantSchema>;
export type CreateTenantDTO = z.infer<typeof createTenantSchema>;
export type UpdateTenantDTO = z.infer<typeof updateTenantSchema>;
