import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { MockControlBadge } from '../../components/shared/MockControlBadge';
import { db } from '../../mocks/db';
import { renderPage } from '../../test/renderPage';
import { TenantsPage } from './TenantsPage';

describe('TenantsPage', () => {
  it('renders the tenant list', async () => {
    renderPage(<TenantsPage />);

    expect(await screen.findByText('星河科技')).toBeInTheDocument();
    expect(screen.getByText('qingning.example.com')).toBeInTheDocument();
    expect(screen.getByText('10 条/页')).toBeInTheDocument();
  });

  it('shows a simulated server error toast without crashing the page', async () => {
    const user = userEvent.setup();
    renderPage(
      <>
        <MockControlBadge />
        <TenantsPage />
      </>,
    );

    await user.click(screen.getByRole('button', { name: 'MSW 模拟已启用' }));
    await user.click(screen.getByRole('switch', { name: '模拟服务器错误' }));

    expect(await screen.findByRole('heading', { name: '租户管理' })).toBeInTheDocument();
    await waitFor(() => {
      expect(document.querySelector('.ant-message-notice')).toHaveTextContent(
        'Simulated Server Error',
      );
    });
  });

  it('loads the API contract modal when requested', async () => {
    const user = userEvent.setup();
    renderPage(<MockControlBadge />);

    await user.click(screen.getByRole('button', { name: 'MSW 模拟已启用' }));
    await user.click(screen.getByRole('button', { name: '查看 API 契约' }));

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('API 契约')).toBeInTheDocument();
    expect(within(dialog).getByText(/\/api\/tenants/)).toBeInTheDocument();
    expect(within(dialog).getByText(/\/api\/subscriptions/)).toBeInTheDocument();
  });

  it('creates a tenant through the drawer form', async () => {
    const user = userEvent.setup();
    renderPage(<TenantsPage />);
    await screen.findByText('星河科技');

    await user.click(screen.getByRole('button', { name: /新建租户/ }));
    const drawer = await screen.findByRole('dialog');
    await user.type(within(drawer).getByLabelText('租户名称'), '云帆数据');
    await user.type(within(drawer).getByLabelText('域名'), 'yunfan.example.com');
    await user.click(within(drawer).getByRole('button', { name: /提\s*交/ }));

    expect(await screen.findByRole('cell', { name: '云帆数据' })).toBeInTheDocument();
    expect(db.tenants[0]).toMatchObject({
      name: '云帆数据',
      domain: 'yunfan.example.com',
      plan: 'Free',
      status: 'Active',
    });
  });

  it('does not carry values over between drawer openings', async () => {
    const user = userEvent.setup();
    renderPage(<TenantsPage />);
    await screen.findByText('星河科技');
    const [first, second] = screen.getAllByRole('button', { name: /编\s*辑/ });

    const nameInput = () => within(screen.getByRole('dialog')).getByLabelText('租户名称');
    const cancel = () => user.click(screen.getByRole('button', { name: /取\s*消/ }));

    await user.click(first as HTMLElement);
    expect(nameInput()).toHaveValue('星河科技');
    await cancel();

    await user.click(second as HTMLElement);
    expect(nameInput()).toHaveValue('青柠工作室');
    await cancel();

    await user.click(screen.getByRole('button', { name: /新建租户/ }));
    expect(nameInput()).toHaveValue('');
  });

  it('shows Chinese validation messages for empty required fields', async () => {
    const user = userEvent.setup();
    renderPage(<TenantsPage />);
    await screen.findByText('星河科技');

    await user.click(screen.getByRole('button', { name: /新建租户/ }));
    await user.click(screen.getByRole('button', { name: /提\s*交/ }));

    expect(await screen.findByText('请输入租户名称')).toBeInTheDocument();
    expect(screen.getByText('请输入域名')).toBeInTheDocument();
  });
});
