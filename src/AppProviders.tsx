import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App as AntdApp, ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import { type ReactNode, useState } from 'react';

export function AppProviders({ children }: { children: ReactNode }) {
  const [client] = useState(
    () => new QueryClient({ defaultOptions: { queries: { retry: false } } }),
  );

  return (
    <QueryClientProvider client={client}>
      <ConfigProvider locale={zhCN}>
        <AntdApp>{children}</AntdApp>
      </ConfigProvider>
    </QueryClientProvider>
  );
}
