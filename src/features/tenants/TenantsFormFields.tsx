import { Form, Input, Select } from 'antd';
import { zodRule } from '../../lib/zodRule';
import { tenantPlans, tenantSchema } from '../../schemas/tenants.schema';

const { shape } = tenantSchema;

export function TenantsFormFields() {
  return (
    <>
      <Form.Item name="name" label="租户名称" rules={[zodRule(shape.name)]}>
        <Input />
      </Form.Item>
      <Form.Item name="domain" label="域名" rules={[zodRule(shape.domain)]}>
        <Input placeholder="acme.com" />
      </Form.Item>
      <Form.Item name="plan" label="套餐" rules={[zodRule(shape.plan)]}>
        <Select options={tenantPlans.map((value) => ({ value, label: value }))} />
      </Form.Item>
      <Form.Item name="status" label="状态" rules={[zodRule(shape.status)]}>
        <Select
          options={[
            { value: 'Active', label: '启用' },
            { value: 'Suspended', label: '停用' },
          ]}
        />
      </Form.Item>
    </>
  );
}
