import { useState, useRef } from 'react'
import {
  Button,
  Select,
  Table,
  Space,
  Tag,
  message,
  App,
} from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  DownOutlined,
  CheckCircleOutlined,
  StopOutlined,
  SettingOutlined,
  FileTextOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import EditDrawer from './EditDrawer'

interface ServiceRecord {
  key: string
  channel: string
  serviceName: string
  serviceCode: string
  serviceCategory: string
  billingMethod: string
  deliveryMethod: string
  route: string
  transportMethod: string
  bubbleRatio: number
  currency: string
  status: '启用' | '停用'
}

const mockData: ServiceRecord[] = [
  {
    key: '1',
    channel: '美国海运',
    serviceName: '美国海运专线-普货',
    serviceCode: 'US-SEA-001',
    serviceCategory: '海运',
    billingMethod: '体积重',
    deliveryMethod: 'FEDEX',
    route: '美线',
    transportMethod: '海运',
    bubbleRatio: 6000,
    currency: 'USD',
    status: '停用',
  },
  {
    key: '2',
    channel: '美国空运',
    serviceName: '美国空运专线-普货',
    serviceCode: 'US-AIR-001',
    serviceCategory: '空运',
    billingMethod: '实际重',
    deliveryMethod: 'UPS',
    route: '美线',
    transportMethod: '空运',
    bubbleRatio: 6000,
    currency: 'USD',
    status: '停用',
  },
  {
    key: '3',
    channel: '英国海运',
    serviceName: '英国海运专线-普货',
    serviceCode: 'UK-SEA-001',
    serviceCategory: '海运',
    billingMethod: '体积重',
    deliveryMethod: 'DPD',
    route: '英线',
    transportMethod: '海运',
    bubbleRatio: 6000,
    currency: 'GBP',
    status: '停用',
  },
  {
    key: '4',
    channel: '美国海运',
    serviceName: '美国海运专线-带电',
    serviceCode: 'US-SEA-002',
    serviceCategory: '海运',
    billingMethod: '体积重',
    deliveryMethod: 'FEDEX',
    route: '美线',
    transportMethod: '海运',
    bubbleRatio: 5000,
    currency: 'USD',
    status: '停用',
  },
  {
    key: '5',
    channel: '美国空运',
    serviceName: '美国空运专线-带电',
    serviceCode: 'US-AIR-002',
    serviceCategory: '空运',
    billingMethod: '实际重',
    deliveryMethod: 'UPS',
    route: '美线',
    transportMethod: '空运',
    bubbleRatio: 5000,
    currency: 'USD',
    status: '停用',
  },
]

export default function ServiceList() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<ServiceRecord | null>(null)
  const [expanded, setExpanded] = useState(false)
  const tableRef = useRef<any>(null)

  const openEditDrawer = (record: ServiceRecord) => {
    setEditingRecord(record)
    setDrawerOpen(true)
  }

  const closeEditDrawer = () => {
    setDrawerOpen(false)
    setEditingRecord(null)
  }

  const handleSave = (values: any) => {
    message.success('保存成功')
    closeEditDrawer()
  }

  const columns: ColumnsType<ServiceRecord> = [
    {
      title: '渠道',
      dataIndex: 'channel',
      key: 'channel',
      width: 110,
    },
    {
      title: '服务名称',
      dataIndex: 'serviceName',
      key: 'serviceName',
      width: 180,
    },
    {
      title: '服务代码',
      dataIndex: 'serviceCode',
      key: 'serviceCode',
      width: 120,
    },
    {
      title: '服务分类',
      dataIndex: 'serviceCategory',
      key: 'serviceCategory',
      width: 90,
    },
    {
      title: '计费方式',
      dataIndex: 'billingMethod',
      key: 'billingMethod',
      width: 90,
    },
    {
      title: '派送方式',
      dataIndex: 'deliveryMethod',
      key: 'deliveryMethod',
      width: 100,
    },
    {
      title: '线路',
      dataIndex: 'route',
      key: 'route',
      width: 70,
    },
    {
      title: '运输方式',
      dataIndex: 'transportMethod',
      key: 'transportMethod',
      width: 90,
    },
    {
      title: '分泡比例',
      dataIndex: 'bubbleRatio',
      key: 'bubbleRatio',
      width: 90,
    },
    {
      title: '币种',
      dataIndex: 'currency',
      key: 'currency',
      width: 70,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 70,
      render: (status: string) => (
        <span style={{ color: status === '停用' ? '#ff4d4f' : '#52c41a' }}>{status}</span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 220,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <a style={{ color: '#1a73e8' }}><EyeOutlined /> 查看</a>
          <a style={{ color: '#1a73e8' }} onClick={() => openEditDrawer(record)}><EditOutlined /> 编辑</a>
          <a style={{ color: '#1a73e8' }}><CopyOutlined /> 复制</a>
          <a style={{ color: '#ff4d4f' }}><DeleteOutlined /> 删除</a>
          <a style={{ color: '#52c41a' }}><CheckCircleOutlined /> 启用</a>
        </Space>
      ),
    },
  ]

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys as string[]),
  }

  return (
    <App>
      <div>
        {/* 筛选栏 */}
        <div className="filter-bar">
          <div className="filter-item">
            <span className="filter-label">服务名称</span>
            <Select placeholder="请选择" style={{ width: 180 }} allowClear>
              <Select.Option value="us-sea">美国海运专线-普货</Select.Option>
              <Select.Option value="us-air">美国空运专线-普货</Select.Option>
            </Select>
          </div>
          <div className="filter-item">
            <span className="filter-label">服务类型</span>
            <Select placeholder="服务类型" style={{ width: 150 }} allowClear>
              <Select.Option value="sea">海运</Select.Option>
              <Select.Option value="air">空运</Select.Option>
            </Select>
          </div>
          <div className="filter-item">
            <span className="filter-label">服务状态</span>
            <Select placeholder="停用" style={{ width: 120 }} allowClear>
              <Select.Option value="enabled">启用</Select.Option>
              <Select.Option value="disabled">停用</Select.Option>
            </Select>
          </div>
          <Space>
            <Button type="primary" icon={<SearchOutlined />}>查询</Button>
            <Button icon={<ReloadOutlined />}>重置</Button>
            <Button>
              展开 <DownOutlined />
            </Button>
          </Space>
        </div>

        {/* 操作按钮栏 */}
        <div className="action-bar">
          <Button type="primary" icon={<PlusOutlined />}>创建服务</Button>
          <Button icon={<CheckCircleOutlined />}>启用</Button>
          <Button icon={<StopOutlined />}>停用</Button>
          <Button icon={<SettingOutlined />}>配置渠道</Button>
          <Button icon={<EditOutlined />}>批量修改服务信息</Button>
          <Button icon={<FileTextOutlined />}>查看日志</Button>
        </div>

        {/* 数据表格 */}
        <div className="table-card">
          <Table
            ref={tableRef}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={mockData}
            scroll={{ x: 1500 }}
            pagination={{
              total: 1443,
              pageSize: 100,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
              pageSizeOptions: ['50', '100', '200'],
            }}
          />
        </div>

        {/* 编辑服务抽屉 */}
        <EditDrawer
          open={drawerOpen}
          record={editingRecord}
          onClose={closeEditDrawer}
          onSave={handleSave}
        />
      </div>
    </App>
  )
}
