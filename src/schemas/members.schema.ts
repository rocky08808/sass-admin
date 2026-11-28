import { z } from 'zod';
import { createMemberSchema, memberSchema, updateMemberSchema } from './members.model.schema';

export type {
  CreateMemberDTO,
  Member,
  UpdateMemberDTO,
} from './members.model.schema';
export {
  createMemberSchema,
  memberRoles,
  memberSchema,
  memberStatuses,
  updateMemberSchema,
} from './members.model.schema';

export const apiContract = {
  module: 'members',
  endpoints: [
    {
      method: 'GET',
      path: '/api/members',
      response: { status: 200, schema: z.toJSONSchema(z.array(memberSchema)) },
    },
    {
      method: 'POST',
      path: '/api/members',
      requestBody: z.toJSONSchema(createMemberSchema),
      response: { status: 201, schema: z.toJSONSchema(memberSchema) },
    },
    {
      method: 'PUT',
      path: '/api/members/{id}',
      requestBody: z.toJSONSchema(updateMemberSchema),
      response: { status: 200, schema: z.toJSONSchema(memberSchema) },
    },
    {
      method: 'DELETE',
      path: '/api/members/{id}',
      response: { status: 204 },
    },
  ],
} as const;
