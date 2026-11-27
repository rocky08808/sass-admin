import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import { AppProviders } from '../AppProviders';

export function renderPage(page: ReactNode) {
  return render(<AppProviders>{page}</AppProviders>);
}
