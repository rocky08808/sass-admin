import { CopyOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import {
  App as AntdApp,
  Button,
  Modal,
  Popover,
  Space,
  Switch,
  Tag,
  Typography,
  theme,
} from 'antd';
import { useState } from 'react';
import {
  mockDelayMs,
  resetMockDb,
  setMockDelayMs,
  setSimulateError,
  simulateError,
} from '../../mocks/db';
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

export function MockControlBadge() {
  const queryClient = useQueryClient();
  const { message } = AntdApp.useApp();
  const { token } = theme.useToken();
  const [latencyEnabled, setLatencyEnabled] = useState(mockDelayMs === 500);
  const [errorSimulationEnabled, setErrorSimulationEnabled] = useState(simulateError);
  const [contractOpen, setContractOpen] = useState(false);

  const resetData = async () => {
    resetMockDb();
    await queryClient.invalidateQueries();
  };

  const toggleLatency = (enabled: boolean) => {
    setLatencyEnabled(enabled);
    setMockDelayMs(enabled ? 500 : 0);
  };

  const toggleErrorSimulation = async (enabled: boolean) => {
    setErrorSimulationEnabled(enabled);
    setSimulateError(enabled);
    await queryClient.invalidateQueries();
  };

  const copyContract = async () => {
    try {
      await navigator.clipboard.writeText(apiContractJson);
      message.success('API 契约已复制');
    } catch {
      message.error('复制 API 契约失败');
    }
  };

  return (
    <>
      <Popover
        title="模拟数据调试工具"
        trigger="click"
        content={
          <Space direction="vertical" size="small">
            <Button block onClick={resetData}>
              重置数据
            </Button>
            <Space>
              <Switch size="small" checked={latencyEnabled} onChange={toggleLatency} />
              <Typography.Text>模拟 500ms 延迟</Typography.Text>
            </Space>
            <Space>
              <Switch
                size="small"
                aria-label="模拟服务器错误"
                checked={errorSimulationEnabled}
                onChange={toggleErrorSimulation}
              />
              <Typography.Text>模拟服务器错误</Typography.Text>
            </Space>
            <Button block onClick={() => setContractOpen(true)}>
              查看 API 契约
            </Button>
          </Space>
        }
      >
        <Button type="text" size="small" style={{ height: 'auto', padding: 0 }}>
          <Tag color="green" style={{ cursor: 'pointer', marginInlineEnd: 0 }}>
            MSW 模拟已启用
          </Tag>
        </Button>
      </Popover>
      <Modal
        title="API 契约"
        open={contractOpen}
        onCancel={() => setContractOpen(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setContractOpen(false)}>
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
    </>
  );
}
