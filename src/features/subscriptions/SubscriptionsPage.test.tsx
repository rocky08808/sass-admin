import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { db } from '../../mocks/db';
import { renderPage } from '../../test/renderPage';
import { SubscriptionsPage } from './SubscriptionsPage';

describe('SubscriptionsPage', () => {
  it('renders the plan list', async () => {
    renderPage(<SubscriptionsPage />);

    expect(await screen.findByText('专业版')).toBeInTheDocument();
    expect(screen.getByText('¥999')).toBeInTheDocument();
  });

  it('creates a plan through the drawer form', async () => {
    const user = userEvent.setup();
    renderPage(<SubscriptionsPage />);
    await screen.findByText('专业版');

    await user.click(screen.getByRole('button', { name: /新建套餐/ }));
    const drawer = await screen.findByRole('dialog');
    await user.type(within(drawer).getByLabelText('套餐名称'), '团队版');
    await user.type(within(drawer).getByLabelText('月费（元）'), '399');
    await user.type(within(drawer).getByLabelText('用户上限'), '100');
    await user.click(within(drawer).getByRole('button', { name: /提\s*交/ }));

    expect(await screen.findByRole('cell', { name: '团队版' })).toBeInTheDocument();
    expect(db.subscriptions[0]).toMatchObject({
      planName: '团队版',
      priceMonthly: 399,
      maxUsers: 100,
      billingCycle: 'Monthly',
      isActive: true,
    });
  });
});
