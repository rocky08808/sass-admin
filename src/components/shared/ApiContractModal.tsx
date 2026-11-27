import { CopyOutlined } from '@ant-design/icons';
import { App as AntdApp, Button, Modal, theme } from 'antd';
import { apiContract as subscriptionApiContract } from '../../schemas/subscriptions.schema';
import { apiContract as tenantApiContract } from '../../schemas/tenants.schema';

const apiContractJson = JSON.stringify(
  {
    tenants: tenantApiContract,
    subscriptions: subscriptionApiContract,
  },
  null,
  2,
);

interface ApiContractModalProps {
  open: boolean;
  onClose: () => void;
}

export function ApiContractModal({ open, onClose }: ApiContractModalProps) {
  const { message } = AntdApp.useApp();
  const { token } = theme.useToken();

  const copyContract = async () => {
    try {
      await navigator.clipboard.writeText(apiContractJson);
      message.success('API 契约已复制');
    } catch {
      message.error('复制 API 契约失败');
    }
  };

  return (
    <Modal
      title="API 契约"
      open={open}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="close" onClick={onClose}>
          关闭
        </Button>,
        <Button key="copy" type="primary" icon={<CopyOutlined />} onClick={copyContract}>
          复制 JSON
        </Button>,
      ]}
    >
      <pre
        style={{
          background: token.colorFillQuaternary,
          borderRadius: token.borderRadius,
          margin: 0,
          maxHeight: '60vh',
          overflow: 'auto',
          padding: token.padding,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        <code>{apiContractJson}</code>
      </pre>
    </Modal>
  );
}
