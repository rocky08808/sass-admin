import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { request, requestVoid } from '../../lib/request';
import {
  type CreateMemberDTO,
  memberSchema,
  type UpdateMemberDTO,
} from '../../schemas/members.model.schema';

const url = '/api/members';
const queryKey = ['members'];

export function useMembers() {
  return useQuery({ queryKey, queryFn: () => request(z.array(memberSchema), url) });
}

export function useSaveMember() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id?: string; values: CreateMemberDTO | UpdateMemberDTO }) =>
      id
        ? request(memberSchema, `${url}/${id}`, 'PUT', values)
        : request(memberSchema, url, 'POST', values),
    onSuccess: () => client.invalidateQueries({ queryKey }),
  });
}

export function useDeleteMember() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => requestVoid(`${url}/${id}`, 'DELETE'),
    onSuccess: () => client.invalidateQueries({ queryKey }),
  });
}
