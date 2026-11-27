import { type TableColumnsType, Tag } from 'antd';
import type { Subscription } from '../../schemas/subscriptions.schema';

export const subscriptionColumns: TableColumnsType<Subscription> = [
  { title: '套餐名称', dataIndex: 'planName' },
  {
    title: '月费',
    dataIndex: 'priceMonthly',
    render: (value: number) => `¥${value.toLocaleString('zh-CN')}`,
  },
  { title: '用户上限', dataIndex: 'maxUsers' },
  {
    title: '计费周期',
    dataIndex: 'billingCycle',
    render: (value: Subscription['billingCycle']) => (value === 'Monthly' ? '按月' : '按年'),
  },
  {
    title: '状态',
    dataIndex: 'isActive',
    render: (value: boolean) => (
      <Tag color={value ? 'success' : 'default'}>{value ? '启用' : '停用'}</Tag>
    ),
  },
];
