import type { Subscription } from '../schemas/subscriptions.schema';
import type { Tenant } from '../schemas/tenants.schema';

const seedTenants: Tenant[] = [
  {
    id: 't-1',
    name: '星河科技',
    domain: 'xinghe.example.com',
    plan: 'Enterprise',
    status: 'Active',
    createdAt: '2026-01-15T08:00:00.000Z',
  },
  {
    id: 't-2',
    name: '青柠工作室',
    domain: 'qingning.example.com',
    plan: 'Pro',
    status: 'Active',
    createdAt: '2026-03-02T08:00:00.000Z',
  },
  {
    id: 't-3',
    name: '北岸贸易',
    domain: 'beian.example.com',
    plan: 'Free',
    status: 'Suspended',
    createdAt: '2026-06-20T08:00:00.000Z',
  },
];

const seedSubscriptions: Subscription[] = [
  {
    id: 's-1',
    planName: '入门版',
    priceMonthly: 0,
    maxUsers: 5,
    billingCycle: 'Monthly',
    isActive: true,
  },
  {
    id: 's-2',
    planName: '专业版',
    priceMonthly: 199,
    maxUsers: 50,
    billingCycle: 'Monthly',
    isActive: true,
  },
  {
    id: 's-3',
    planName: '企业版',
    priceMonthly: 999,
    maxUsers: 500,
    billingCycle: 'Yearly',
    isActive: false,
  },
];

export const db = {
  tenants: structuredClone(seedTenants),
  subscriptions: structuredClone(seedSubscriptions),
};

export function resetDb() {
  db.tenants = structuredClone(seedTenants);
  db.subscriptions = structuredClone(seedSubscriptions);
}
