import { Card, Typography } from 'antd';
import { CrudFormDrawer } from '../../components/shared/CrudFormDrawer';
import { CrudTable } from '../../components/shared/CrudTable';
import { useCrudPage } from '../../lib/useCrudPage';
import type { CreateTenantDTO, Tenant } from '../../schemas/tenants.model.schema';
import { useDeleteTenant, useSaveTenant, useTenants } from './api';
import { tenantColumns } from './columns';
import { TenantsFormFields } from './TenantsFormFields';

const defaults: Partial<CreateTenantDTO> = { plan: 'Free', status: 'Active' };

export function TenantsPage() {
  const { data, isLoading, error } = useTenants();
  const save = useSaveTenant();
  const remove = useDeleteTenant();
  const page = useCrudPage<Tenant, CreateTenantDTO>({
    save: save.mutateAsync,
    remove: remove.mutateAsync,
  });

  return (
    <Card>
      <Typography.Title level={4}>租户管理</Typography.Title>
      <CrudTable<Tenant>
        columns={tenantColumns}
        data={data}
        loading={isLoading}
        error={error}
        searchKeys={['name', 'domain']}
        searchPlaceholder="搜索租户名称或域名"
        createButtonText="新建租户"
        onCreate={page.openCreate}
        onEdit={page.openEdit}
        onDelete={page.destroy}
      />
      <CrudFormDrawer<CreateTenantDTO>
        open={page.open}
        title={page.editing ? '编辑租户' : '新建租户'}
        initialValues={page.editing ?? defaults}
        loading={save.isPending}
        onSubmit={page.submit}
        onClose={page.close}
      >
        <TenantsFormFields />
      </CrudFormDrawer>
    </Card>
  );
}
