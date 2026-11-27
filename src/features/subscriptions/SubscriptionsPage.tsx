import { Card, Typography } from 'antd';
import { CrudFormDrawer } from '../../components/shared/CrudFormDrawer';
import { CrudTable } from '../../components/shared/CrudTable';
import { useCrudPage } from '../../lib/useCrudPage';
import type { CreateSubscriptionDTO, Subscription } from '../../schemas/subscriptions.schema';
import { useDeleteSubscription, useSaveSubscription, useSubscriptions } from './api';
import { subscriptionColumns } from './columns';
import { SubscriptionsFormFields } from './SubscriptionsFormFields';

const defaults: Partial<CreateSubscriptionDTO> = { billingCycle: 'Monthly', isActive: true };

export function SubscriptionsPage() {
  const { data, isLoading, error } = useSubscriptions();
  const save = useSaveSubscription();
  const remove = useDeleteSubscription();
  const page = useCrudPage<Subscription, CreateSubscriptionDTO>({
    save: save.mutateAsync,
    remove: remove.mutateAsync,
  });

  return (
    <Card>
      <Typography.Title level={4}>订阅套餐</Typography.Title>
      <CrudTable<Subscription>
        columns={subscriptionColumns}
        data={data}
        loading={isLoading}
        error={error}
        searchKeys={['planName']}
        searchPlaceholder="搜索套餐名称"
        createButtonText="新建套餐"
        onCreate={page.openCreate}
        onEdit={page.openEdit}
        onDelete={page.destroy}
      />
      <CrudFormDrawer<CreateSubscriptionDTO>
        open={page.open}
        title={page.editing ? '编辑套餐' : '新建套餐'}
        initialValues={page.editing ?? defaults}
        loading={save.isPending}
        onSubmit={page.submit}
        onClose={page.close}
      >
        <SubscriptionsFormFields />
      </CrudFormDrawer>
    </Card>
  );
}
