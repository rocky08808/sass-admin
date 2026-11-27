import { Form, Input, InputNumber, Select, Switch } from 'antd';
import { zodRule } from '../../lib/zodRule';
import { subscriptionSchema } from '../../schemas/subscriptions.schema';

const { shape } = subscriptionSchema;

export function SubscriptionsFormFields() {
  return (
    <>
      <Form.Item name="planName" label="套餐名称" rules={[zodRule(shape.planName)]}>
        <Input />
      </Form.Item>
      <Form.Item name="priceMonthly" label="月费（元）" rules={[zodRule(shape.priceMonthly)]}>
        <InputNumber min={0} precision={2} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="maxUsers" label="用户上限" rules={[zodRule(shape.maxUsers)]}>
        <InputNumber min={1} precision={0} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="billingCycle" label="计费周期" rules={[zodRule(shape.billingCycle)]}>
        <Select
          options={[
            { value: 'Monthly', label: '按月' },
            { value: 'Yearly', label: '按年' },
          ]}
        />
      </Form.Item>
      <Form.Item name="isActive" label="启用" valuePropName="checked">
        <Switch />
      </Form.Item>
    </>
  );
}
