import { Card, Typography } from 'antd';
import { CrudFormDrawer } from '../../components/shared/CrudFormDrawer';
import { CrudTable } from '../../components/shared/CrudTable';
import { useCrudPage } from '../../lib/useCrudPage';
import type { CreateMemberDTO, Member } from '../../schemas/members.model.schema';
import { useDeleteMember, useMembers, useSaveMember } from './api';
import { memberColumns } from './columns';
import { MembersFormFields } from './MembersFormFields';

const defaults: Partial<CreateMemberDTO> = { role: 'Member', status: 'Invited' };

export function MembersPage() {
  const { data, isLoading, error } = useMembers();
  const save = useSaveMember();
  const remove = useDeleteMember();
  const page = useCrudPage<Member, CreateMemberDTO>({
    save: save.mutateAsync,
    remove: remove.mutateAsync,
  });

  return (
    <Card>
      <Typography.Title level={4}>成员管理</Typography.Title>
      <CrudTable<Member>
        columns={memberColumns}
        data={data}
        loading={isLoading}
        error={error}
        searchKeys={['name', 'email']}
        searchPlaceholder="搜索姓名或邮箱"
        createButtonText="新建成员"
        onCreate={page.openCreate}
        onEdit={page.openEdit}
        onDelete={page.destroy}
      />
      <CrudFormDrawer<CreateMemberDTO>
        open={page.open}
        title={page.editing ? '编辑成员' : '新建成员'}
        initialValues={page.editing ?? defaults}
        loading={save.isPending}
        onSubmit={page.submit}
        onClose={page.close}
      >
        <MembersFormFields />
      </CrudFormDrawer>
    </Card>
  );
}
