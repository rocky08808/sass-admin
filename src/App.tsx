import { CreditCardOutlined, TeamOutlined } from '@ant-design/icons';
import { Layout, Menu, Typography, theme } from 'antd';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router';
import { SubscriptionsPage } from './features/subscriptions/SubscriptionsPage';
import { TenantsPage } from './features/tenants/TenantsPage';

const menuItems = [
  { key: '/tenants', icon: <TeamOutlined />, label: '租户管理' },
  { key: '/subscriptions', icon: <CreditCardOutlined />, label: '订阅套餐' },
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
        <Layout.Content style={{ padding: token.paddingLG }}>
          <Routes>
            <Route path="/tenants" element={<TenantsPage />} />
            <Route path="/subscriptions" element={<SubscriptionsPage />} />
            <Route path="*" element={<Navigate to="/tenants" replace />} />
          </Routes>
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
