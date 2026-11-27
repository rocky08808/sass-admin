import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { db } from '../../mocks/db';
import { renderPage } from '../../test/renderPage';
import { MembersPage } from './MembersPage';

describe('MembersPage', () => {
  it('renders the member list', async () => {
    renderPage(<MembersPage />);

    expect(await screen.findByText('林晓')).toBeInTheDocument();
    expect(screen.getByText('chenmo@example.com')).toBeInTheDocument();
  });

  it('creates a member through the drawer form', async () => {
    const user = userEvent.setup();
    renderPage(<MembersPage />);
    await screen.findByText('林晓');

    await user.click(screen.getByRole('button', { name: /新建成员/ }));
    const drawer = await screen.findByRole('dialog');
    await user.type(within(drawer).getByLabelText('姓名'), '王宁');
    await user.type(within(drawer).getByLabelText('邮箱'), 'wangning@example.com');
    await user.click(within(drawer).getByRole('button', { name: /提\s*交/ }));

    expect(await screen.findByRole('cell', { name: '王宁' })).toBeInTheDocument();
    expect(db.members[0]).toMatchObject({
      name: '王宁',
      email: 'wangning@example.com',
      role: 'Member',
      status: 'Invited',
    });
  });
});
