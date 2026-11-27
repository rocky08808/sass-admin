import '@ant-design/v5-patch-for-react-19';
import 'antd/dist/reset.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { App } from './App';
import { AppProviders } from './AppProviders';

async function bootstrap() {
  // There is no real backend yet, so the mock worker also runs in production builds.
  const { worker } = await import('./mocks/browser');
  await worker.start({ onUnhandledRequest: 'bypass' });

  const root = document.getElementById('root');
  if (!root) throw new Error('Missing #root element');

  createRoot(root).render(
    <StrictMode>
      <BrowserRouter>
        <AppProviders>
          <App />
        </AppProviders>
      </BrowserRouter>
    </StrictMode>,
  );
}

void bootstrap();
