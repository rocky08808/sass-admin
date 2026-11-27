import { Button, Drawer, Form, Space } from 'antd';
import { type ReactNode, useId, useState } from 'react';

interface CrudFormDrawerProps<T> {
  open: boolean;
  title: string;
  initialValues?: Partial<T>;
  onSubmit: (values: T) => void;
  onClose: () => void;
  loading?: boolean;
  children: ReactNode;
}

export function CrudFormDrawer<T extends object>({
  open,
  title,
  initialValues,
  onSubmit,
  onClose,
  loading,
  children,
}: CrudFormDrawerProps<T>) {
  const formId = useId();
  // Each opening gets a fresh Form (and store), so values never leak between records.
  const [session, setSession] = useState({ open, key: 0 });
  if (session.open !== open) {
    setSession({ open, key: open ? session.key + 1 : session.key });
  }

  return (
    <Drawer
      open={open}
      title={title}
      width={420}
      onClose={onClose}
      destroyOnHidden
      extra={
        <Space>
          <Button onClick={onClose}>取消</Button>
          <Button type="primary" htmlType="submit" form={formId} loading={loading}>
            提交
          </Button>
        </Space>
      }
    >
      <Form
        key={session.key}
        id={formId}
        layout="vertical"
        disabled={loading}
        initialValues={initialValues}
        onFinish={onSubmit}
      >
        {children}
      </Form>
    </Drawer>
  );
}
