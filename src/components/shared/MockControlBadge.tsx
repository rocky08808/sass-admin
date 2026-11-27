import { useQueryClient } from '@tanstack/react-query';
import { Button, Popover, Space, Spin, Switch, Tag, Typography } from 'antd';
import { lazy, Suspense, useState } from 'react';
import {
  mockDelayMs,
  resetMockDb,
  setMockDelayMs,
  setSimulateError,
  simulateError,
} from '../../mocks/db';

const ApiContractModal = lazy(() =>
  import('./ApiContractModal').then(({ ApiContractModal }) => ({ default: ApiContractModal })),
);

export function MockControlBadge() {
  const queryClient = useQueryClient();
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

  return (
    <div>
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
      {contractOpen && (
        <Suspense fallback={<Spin aria-label="正在加载 API 契约" />}>
          <ApiContractModal open onClose={() => setContractOpen(false)} />
        </Suspense>
      )}
    </div>
  );
}
