import { CreditCardOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu, Spin, Typography, theme } from 'antd';
import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router';
import { MockControlBadge } from './components/shared/MockControlBadge';

const TenantsPage = lazy(() =>
  import('./features/tenants/TenantsPage').then(({ TenantsPage }) => ({ default: TenantsPage })),
);
const SubscriptionsPage = lazy(() =>
  import('./features/subscriptions/SubscriptionsPage').then(({ SubscriptionsPage }) => ({
    default: SubscriptionsPage,
  })),
);
const MembersPage = lazy(() =>
  import('./features/members/MembersPage').then(({ MembersPage }) => ({ default: MembersPage })),
);

const menuItems = [
  { key: '/tenants', icon: <TeamOutlined />, label: '租户管理' },
  { key: '/subscriptions', icon: <CreditCardOutlined />, label: '订阅套餐' },
  { key: '/members', icon: <UserOutlined />, label: '成员管理' },
];

export function App() {
  const { token } = theme.useToken();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Sider breakpoint="lg" collapsedWidth={0}>
        <Typography.Title
          level={4}
          style={{ color: token.colorTextLightSolid, margin: 0, padding: token.padding }}
        >
          SaaS Admin
        </Typography.Title>
        <Menu
          theme="dark"
          mode="inline"
          items={menuItems}
          selectedKeys={[pathname]}
          onClick={({ key }) => navigate(key)}
        />
      </Layout.Sider>
      <Layout>
        <Layout.Header
          style={{
            alignItems: 'center',
            background: token.colorBgContainer,
            display: 'flex',
            justifyContent: 'flex-end',
            paddingInline: token.paddingLG,
          }}
        >
          {import.meta.env.VITE_ENABLE_MOCK !== 'false' && <MockControlBadge />}
        </Layout.Header>
        <Layout.Content style={{ padding: token.paddingLG }}>
          <Suspense fallback={<Spin />}>
            <Routes>
              <Route path="/tenants" element={<TenantsPage />} />
              <Route path="/subscriptions" element={<SubscriptionsPage />} />
              <Route path="/members" element={<MembersPage />} />
              <Route path="*" element={<Navigate to="/tenants" replace />} />
            </Routes>
          </Suspense>
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
