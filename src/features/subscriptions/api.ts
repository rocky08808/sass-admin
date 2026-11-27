import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { request, requestVoid } from '../../lib/request';
import {
  type CreateSubscriptionDTO,
  subscriptionSchema,
  type UpdateSubscriptionDTO,
} from '../../schemas/subscriptions.model.schema';

const url = '/api/subscriptions';
const queryKey = ['subscriptions'];

export function useSubscriptions() {
  return useQuery({ queryKey, queryFn: () => request(z.array(subscriptionSchema), url) });
}

export function useSaveSubscription() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id?: string;
      values: CreateSubscriptionDTO | UpdateSubscriptionDTO;
    }) =>
      id
        ? request(subscriptionSchema, `${url}/${id}`, 'PUT', values)
        : request(subscriptionSchema, url, 'POST', values),
    onSuccess: () => client.invalidateQueries({ queryKey }),
  });
}

export function useDeleteSubscription() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => requestVoid(`${url}/${id}`, 'DELETE'),
    onSuccess: () => client.invalidateQueries({ queryKey }),
  });
}
