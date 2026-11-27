import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { request, requestVoid } from '../../lib/request';
import {
  type CreateTenantDTO,
  tenantSchema,
  type UpdateTenantDTO,
} from '../../schemas/tenants.schema';

const url = '/api/tenants';
const queryKey = ['tenants'];

export function useTenants() {
  return useQuery({ queryKey, queryFn: () => request(z.array(tenantSchema), url) });
}

export function useSaveTenant() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id?: string; values: CreateTenantDTO | UpdateTenantDTO }) =>
      id
        ? request(tenantSchema, `${url}/${id}`, 'PUT', values)
        : request(tenantSchema, url, 'POST', values),
    onSuccess: () => client.invalidateQueries({ queryKey }),
  });
}

export function useDeleteTenant() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => requestVoid(`${url}/${id}`, 'DELETE'),
    onSuccess: () => client.invalidateQueries({ queryKey }),
  });
}
