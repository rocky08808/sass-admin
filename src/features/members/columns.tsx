import { type TableColumnsType, Tag } from 'antd';
import type { Member } from '../../schemas/members.model.schema';

export const memberStatusMeta: Record<Member['status'], { label: string; color: string }> = {
  Active: { label: '正常', color: 'success' },
  Invited: { label: '已邀请', color: 'processing' },
  Disabled: { label: '已停用', color: 'default' },
};

export const memberColumns: TableColumnsType<Member> = [
  { title: '姓名', dataIndex: 'name' },
  { title: '邮箱', dataIndex: 'email' },
  { title: '角色', dataIndex: 'role' },
  {
    title: '状态',
    dataIndex: 'status',
    render: (status: Member['status']) => (
      <Tag color={memberStatusMeta[status].color}>{memberStatusMeta[status].label}</Tag>
    ),
  },
  {
    title: '加入时间',
    dataIndex: 'joinedAt',
    render: (value: string) => new Date(value).toLocaleDateString('zh-CN'),
  },
];
