import { Form, Input, Select } from 'antd';
import { zodRule } from '../../lib/zodRule';
import { memberRoles, memberSchema, memberStatuses } from '../../schemas/members.schema';
import { memberStatusMeta } from './columns';

const { shape } = memberSchema;

export function MembersFormFields() {
  return (
    <>
      <Form.Item name="name" label="姓名" rules={[zodRule(shape.name)]}>
        <Input />
      </Form.Item>
      <Form.Item name="email" label="邮箱" rules={[zodRule(shape.email)]}>
        <Input placeholder="name@example.com" />
      </Form.Item>
      <Form.Item name="role" label="角色" rules={[zodRule(shape.role)]}>
        <Select options={memberRoles.map((value) => ({ value, label: value }))} />
      </Form.Item>
      <Form.Item name="status" label="状态" rules={[zodRule(shape.status)]}>
        <Select
          options={memberStatuses.map((value) => ({ value, label: memberStatusMeta[value].label }))}
        />
      </Form.Item>
    </>
  );
}
