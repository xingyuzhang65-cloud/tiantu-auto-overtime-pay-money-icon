import { Button, Card, Descriptions, Space, Switch, Table, Tag } from 'antd'
import {
  AuditOutlined,
  SafetyCertificateOutlined,
  SaveOutlined,
  SettingOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

interface RoleRecord {
  key: string
  roleName: string
  userCount: number
  permissionScope: string
  status: '启用' | '停用'
  updateTime: string
}

const roleData: RoleRecord[] = [
  {
    key: '1',
    roleName: '超级管理员',
    userCount: 2,
    permissionScope: '全部菜单与数据权限',
    status: '启用',
    updateTime: '2026-05-20 16:30:00',
  },
  {
    key: '2',
    roleName: '运营主管',
    userCount: 8,
    permissionScope: '产品服务、订单、运单',
    status: '启用',
    updateTime: '2026-05-18 09:12:00',
  },
  {
    key: '3',
    roleName: '财务专员',
    userCount: 5,
    permissionScope: '财务、账单、导出',
    status: '启用',
    updateTime: '2026-05-16 14:05:00',
  },
]

const columns: ColumnsType<RoleRecord> = [
  {
    title: '角色名称',
    dataIndex: 'roleName',
    width: 160,
  },
  {
    title: '用户数',
    dataIndex: 'userCount',
    width: 100,
  },
  {
    title: '权限范围',
    dataIndex: 'permissionScope',
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    render: (status) => (
      <Tag color={status === '启用' ? 'success' : 'default'}>{status}</Tag>
    ),
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    width: 180,
  },
]

export default function SystemPage() {
  return (
    <div>
      <div className="filter-bar" style={{ justifyContent: 'space-between' }}>
        <Space>
          <SettingOutlined style={{ color: '#1a73e8' }} />
          <span style={{ fontWeight: 600, fontSize: 15 }}>系统设置</span>
        </Space>
        <Button type="primary" icon={<SaveOutlined />}>
          保存配置
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(220px, 1fr))', gap: 16, marginBottom: 16 }}>
        <Card size="small">
          <Space direction="vertical" size={8}>
            <Space>
              <TeamOutlined style={{ color: '#1a73e8' }} />
              <span style={{ fontWeight: 600 }}>账号与角色</span>
            </Space>
            <span style={{ color: '#666', fontSize: 13 }}>维护后台用户、角色与菜单权限。</span>
          </Space>
        </Card>
        <Card size="small">
          <Space direction="vertical" size={8}>
            <Space>
              <SafetyCertificateOutlined style={{ color: '#52c41a' }} />
              <span style={{ fontWeight: 600 }}>安全策略</span>
            </Space>
            <span style={{ color: '#666', fontSize: 13 }}>控制登录校验、密码规则与访问限制。</span>
          </Space>
        </Card>
        <Card size="small">
          <Space direction="vertical" size={8}>
            <Space>
              <AuditOutlined style={{ color: '#fa8c16' }} />
              <span style={{ fontWeight: 600 }}>操作审计</span>
            </Space>
            <span style={{ color: '#666', fontSize: 13 }}>记录关键配置、导入导出和数据变更。</span>
          </Space>
        </Card>
      </div>

      <Card size="small" title="基础配置" style={{ marginBottom: 16 }}>
        <Descriptions column={2} size="small">
          <Descriptions.Item label="系统名称">天图通途后台管理系统</Descriptions.Item>
          <Descriptions.Item label="当前版本">v1.0.0</Descriptions.Item>
          <Descriptions.Item label="登录验证码">
            <Switch defaultChecked size="small" />
          </Descriptions.Item>
          <Descriptions.Item label="操作日志">
            <Switch defaultChecked size="small" />
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <div className="table-card">
        <div className="section-title">角色权限</div>
        <Table
          rowKey="key"
          columns={columns}
          dataSource={roleData}
          pagination={false}
          size="middle"
        />
      </div>
    </div>
  )
}
