import { type TableColumnsType, Tag } from 'antd';
import type { Tenant } from '../../schemas/tenants.model.schema';

export const tenantColumns: TableColumnsType<Tenant> = [
  { title: '租户名称', dataIndex: 'name' },
  { title: '域名', dataIndex: 'domain' },
  { title: '套餐', dataIndex: 'plan' },
  {
    title: '状态',
    dataIndex: 'status',
    render: (status: Tenant['status']) => (
      <Tag color={status === 'Active' ? 'success' : 'error'}>
        {status === 'Active' ? '启用' : '停用'}
      </Tag>
    ),
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    render: (value: string) => new Date(value).toLocaleDateString('zh-CN'),
  },
];
