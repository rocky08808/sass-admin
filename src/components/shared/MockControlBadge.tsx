import { useQueryClient } from '@tanstack/react-query';
import { Button, Popover, Space, Switch, Tag, Typography } from 'antd';
import { useState } from 'react';
import { mockDelayMs, resetMockDb, setMockDelayMs } from '../../mocks/db';

export function MockControlBadge() {
  const queryClient = useQueryClient();
  const [latencyEnabled, setLatencyEnabled] = useState(mockDelayMs === 500);

  const resetData = async () => {
    resetMockDb();
    await queryClient.invalidateQueries();
  };

  const toggleLatency = (enabled: boolean) => {
    setLatencyEnabled(enabled);
    setMockDelayMs(enabled ? 500 : 0);
  };

  return (
    <Popover
      title="Mock DevTools"
      trigger="click"
      content={
        <Space direction="vertical" size="small">
          <Button block onClick={resetData}>
            Reset Data
          </Button>
          <Space>
            <Switch size="small" checked={latencyEnabled} onChange={toggleLatency} />
            <Typography.Text>500ms Latency</Typography.Text>
          </Space>
        </Space>
      }
    >
      <Button type="text" size="small" style={{ height: 'auto', padding: 0 }}>
        <Tag color="green" style={{ cursor: 'pointer', marginInlineEnd: 0 }}>
          MSW Mock Active
        </Tag>
      </Button>
    </Popover>
  );
}
