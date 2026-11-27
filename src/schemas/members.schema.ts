import { z } from 'zod';

export const memberRoles = ['Owner', 'Admin', 'Member'] as const;
export const memberStatuses = ['Active', 'Invited', 'Disabled'] as const;

export const memberSchema = z.object({
  id: z.string(),
  name: z.string('请输入姓名').trim().min(1, '请输入姓名'),
  email: z.string('请输入邮箱').trim().pipe(z.email('请输入有效的邮箱')),
  role: z.enum(memberRoles, '请选择角色'),
  status: z.enum(memberStatuses, '请选择状态'),
  joinedAt: z.iso.datetime(),
});

export const createMemberSchema = memberSchema.omit({ id: true, joinedAt: true });
export const updateMemberSchema = createMemberSchema.partial();

export type Member = z.infer<typeof memberSchema>;
export type CreateMemberDTO = z.infer<typeof createMemberSchema>;
export type UpdateMemberDTO = z.infer<typeof updateMemberSchema>;
