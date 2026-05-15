import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Dropdown } from 'antd'
import {
  SettingOutlined,
  UserOutlined,
  BellOutlined,
  GlobalOutlined,
  CloseOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  BankOutlined,
  DollarOutlined,
  BarChartOutlined,
  DatabaseOutlined,
  ToolOutlined,
  ExportOutlined,
  FileTextOutlined,
  NotificationOutlined,
  ProductOutlined,
  ThunderboltOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'

const { Sider, Content } = Layout

const menuItems: MenuProps['items'] = [
  {
    key: 'product-service',
    icon: <ThunderboltOutlined />,
    label: '产品服务',
    children: [
      { key: '/service', icon: <AppstoreOutlined />, label: '服务' },
      { key: '/quote-maintain', label: '报价维护' },
      { key: '/service-rule', label: '服务规则' },
    ],
  },
  {
    key: 'product-config',
    icon: <SettingOutlined />,
    label: '产品配置',
  },
  {
    key: 'order',
    icon: <ShoppingCartOutlined />,
    label: '订单',
  },
  {
    key: 'warehouse',
    icon: <BankOutlined />,
    label: '仓库',
  },
  {
    key: 'finance',
    icon: <DollarOutlined />,
    label: '财务',
  },
  {
    key: 'inquiry',
    icon: <QuestionCircleOutlined />,
    label: '询价',
  },
  {
    key: 'statistics',
    icon: <BarChartOutlined />,
    label: '统计',
  },
  {
    key: 'config',
    icon: <DatabaseOutlined />,
    label: '配置',
  },
  {
    key: 'manage',
    icon: <ToolOutlined />,
    label: '管理',
  },
  {
    key: 'export',
    icon: <ExportOutlined />,
    label: '导出',
  },
  {
    key: 'system',
    icon: <SettingOutlined />,
    label: '系统',
  },
  {
    key: 'marketing',
    icon: <NotificationOutlined />,
    label: '营销',
  },
  {
    key: 'customs',
    icon: <FileTextOutlined />,
    label: '报关',
  },
]

interface Tab {
  key: string
  label: string
}

const initialTabs: Tab[] = [
  { key: 'pre-manifest', label: '预清单' },
  { key: '/waybill', label: '运单' },
  { key: '404', label: '404' },
  { key: '/service', label: '服务' },
]

const userMenuItems: MenuProps['items'] = [
  { key: 'profile', label: '个人中心' },
  { key: 'settings', label: '账号设置' },
  { type: 'divider' },
  { key: 'logout', label: '退出登录' },
]

export default function MainLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [tabs, setTabs] = useState<Tab[]>(initialTabs)
  const [collapsed, setCollapsed] = useState(false)

  const handleMenuClick: MenuProps['onClick'] = (info) => {
    navigate(info.key)
  }

  const handleCloseTab = (key: string) => {
    setTabs((prev) => {
      const next = prev.filter((t) => t.key !== key)
      if (next.length === 0) return prev
      if (key === location.pathname && next.length > 0) {
        navigate(next[next.length - 1].key)
      }
      return next
    })
  }

  return (
    <Layout style={{ height: '100vh' }}>
      {/* 顶部栏 */}
      <div className="header-bar" style={{ flexShrink: 0, width: '100%', zIndex: 100 }}>
        <div className="header-left">
          <div className="header-logo">
            <div className="logo-icon">T</div>
            <div>
              天图通途<span style={{ fontSize: 10, color: '#999', marginLeft: 4 }}>TIANTU</span>
            </div>
            <span className="logo-subtitle">聚焦美英 空海运专线</span>
          </div>
          <div className="header-tags">
            {tabs.map((tab) => (
              <div
                key={tab.key}
                className="header-tag"
                style={{
                  background: location.pathname === tab.key ? '#e6f0ff' : '#fafafa',
                  fontWeight: location.pathname === tab.key ? 600 : 400,
                }}
                onClick={() => navigate(tab.key)}
              >
                {tab.label}
                <CloseOutlined className="close-icon" onClick={(e) => { e.stopPropagation(); handleCloseTab(tab.key) }} />
              </div>
            ))}
          </div>
        </div>
        <div className="header-right">
          <BellOutlined style={{ fontSize: 16 }} />
          <GlobalOutlined style={{ fontSize: 16 }} />
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              <UserOutlined />
              admin
            </span>
          </Dropdown>
        </div>
      </div>

      <Layout style={{ flex: 1, overflow: 'hidden' }}>
        {/* 左侧导航 */}
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={200}
          style={{ background: '#001529' }}
        >
          <div className="sidebar">
            <Menu
              mode="inline"
              defaultOpenKeys={['product-service']}
              selectedKeys={[location.pathname]}
              items={menuItems}
              onClick={handleMenuClick}
              style={{ background: 'transparent', color: '#fff' }}
              theme="dark"
            />
          </div>
        </Sider>

        {/* 右侧内容 */}
        <Content className="main-content" style={{ overflow: 'auto' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
