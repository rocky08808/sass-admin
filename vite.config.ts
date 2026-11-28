import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    // With mocking off, forward /api to the real backend (also applies to `vite preview`).
    server: {
      proxy:
        env.VITE_ENABLE_MOCK === 'false' && env.API_PROXY_TARGET
          ? { '/api': { target: env.API_PROXY_TARGET, changeOrigin: true } }
          : undefined,
    },
    build: {
      rolldownOptions: {
        output: {
          // Without this, split antd chunks can run out of order and blank the production page.
          strictExecutionOrder: true,
          codeSplitting: {
            groups: [
              {
                name: 'react-vendor',
                test: /node_modules[\\/](?:react|react-dom|scheduler)[\\/]/,
                priority: 10,
              },
              {
                name: 'antd-vendor',
                test: /node_modules[\\/](?:antd|@ant-design|@rc-component|rc-[^\\/]+)[\\/]/,
                priority: 5,
                maxSize: 400 * 1024,
              },
            ],
          },
        },
      },
    },
    test: {
      environment: 'jsdom',
      environmentOptions: { jsdom: { url: 'http://localhost:3000' } },
      setupFiles: ['./src/test/setup.ts'],
      testTimeout: 20000,
    },
  };
});
