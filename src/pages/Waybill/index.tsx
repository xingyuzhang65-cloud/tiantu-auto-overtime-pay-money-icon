import { useState } from 'react'
import {
  Button,
  Select,
  Table,
  Space,
  Input,
  DatePicker,
  Tag,
  Tooltip,
  App,
} from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  DownOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PrinterOutlined,
  ExportOutlined,
  CheckCircleOutlined,
  StopOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import EditWaybillDrawer from './EditDrawer'

const { RangePicker } = DatePicker

interface WaybillRecord {
  key: string
  waybillNo: string
  orderNo: string
  mark: string
  channel: string
  senderName: string
  receiverName: string
  destination: string
  transportMethod: string
  packageCount: number
  weight: number
  currency: string
  declaredValue: number
  trackingNo: string
  status: string
  createTime: string
  timeoutInfo?: {
    startNode: string
    endNode: string
    promiseDays: number
    actualDays: number | null
  }
}

const mockData: WaybillRecord[] = [
  {
    key: '1',
    waybillNo: 'WB202605150001',
    orderNo: 'ORD20260501001',
    mark: '普货',
    channel: '美国海运',
    senderName: '深圳天图供应链',
    receiverName: 'ABC Logistics Inc.',
    destination: '美国洛杉矶',
    transportMethod: '海运',
    packageCount: 12,
    weight: 350.5,
    currency: 'USD',
    declaredValue: 25000.00,
    trackingNo: 'COSU1234567890',
    status: '运输中',
    createTime: '2026-05-15 08:30:00',
    timeoutInfo: { startNode: '出运', endNode: '提取', promiseDays: 18, actualDays: 22 },
  },
  {
    key: '2',
    waybillNo: 'WB202605150002',
    orderNo: 'ORD20260501002',
    mark: '带电',
    channel: '美国空运',
    senderName: '深圳天图供应链',
    receiverName: 'XYZ Trading Co.',
    destination: '美国纽约',
    transportMethod: '空运',
    packageCount: 5,
    weight: 120.8,
    currency: 'USD',
    declaredValue: 18000.00,
    trackingNo: 'UPS1234567890',
    status: '已签收',
    createTime: '2026-05-14 16:20:00',
    timeoutInfo: { startNode: '揽收', endNode: '签收', promiseDays: 7, actualDays: 5 },
  },
  {
    key: '3',
    waybillNo: 'WB202605150003',
    orderNo: 'ORD20260501003',
    mark: '普货',
    channel: '英国海运',
    senderName: '深圳天图供应链',
    receiverName: 'UK Distribution Ltd.',
    destination: '英国伦敦',
    transportMethod: '海运',
    packageCount: 20,
    weight: 580.2,
    currency: 'GBP',
    declaredValue: 35000.00,
    trackingNo: 'MAEU9876543210',
    status: '待发货',
    createTime: '2026-05-15 10:00:00',
    timeoutInfo: { startNode: '出运', endNode: '入仓', promiseDays: 25, actualDays: null },
  },
  {
    key: '4',
    waybillNo: 'WB202605150004',
    orderNo: 'ORD20260501004',
    mark: '普货',
    channel: '美国海运',
    senderName: '深圳天图供应链',
    receiverName: 'Global Imports LLC',
    destination: '美国芝加哥',
    transportMethod: '海运',
    packageCount: 8,
    weight: 210.0,
    currency: 'USD',
    declaredValue: 15000.00,
    trackingNo: 'MSCU1122334455',
    status: '已揽收',
    createTime: '2026-05-15 09:15:00',
    timeoutInfo: { startNode: '开船', endNode: '入仓', promiseDays: 25, actualDays: 30 },
  },
  {
    key: '5',
    waybillNo: 'WB202605150005',
    orderNo: 'ORD20260501005',
    mark: '普货',
    channel: '美国空运',
    senderName: '深圳天图供应链',
    receiverName: 'FastShip Inc.',
    destination: '美国迈阿密',
    transportMethod: '空运',
    packageCount: 3,
    weight: 65.3,
    currency: 'USD',
    declaredValue: 8000.00,
    trackingNo: 'FEDEX9988776655',
    status: '清关中',
    createTime: '2026-05-14 14:00:00',
  },
  {
    key: '6',
    waybillNo: 'WB202605150006',
    orderNo: 'ORD20260501006',
    mark: '大货',
    channel: '英国海运',
    senderName: '深圳天图供应链',
    receiverName: 'EuroLink Logistics',
    destination: '英国曼彻斯特',
    transportMethod: '海运',
    packageCount: 15,
    weight: 420.0,
    currency: 'GBP',
    declaredValue: 28000.00,
    trackingNo: 'HLCU5566778899',
    status: '异常',
    createTime: '2026-05-13 11:45:00',
  },
]

const statusColorMap: Record<string, string> = {
  '待发货': '#faad14',
  '已揽收': '#1677ff',
  '运输中': '#1677ff',
  '清关中': '#722ed1',
  '已签收': '#52c41a',
  '异常': '#ff4d4f',
  '已取消': '#999',
}

export default function WaybillList() {
  const { message } = App.useApp()
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<WaybillRecord | null>(null)

  const openEditDrawer = (record: WaybillRecord) => {
    setEditingRecord(record)
    setDrawerOpen(true)
  }

  const closeEditDrawer = () => {
    setDrawerOpen(false)
    setEditingRecord(null)
  }

  const handleSave = () => {
    message.success('运单保存成功')
    closeEditDrawer()
  }

  const columns: ColumnsType<WaybillRecord> = [
    {
      title: '运单号',
      dataIndex: 'waybillNo',
      key: 'waybillNo',
      width: 170,
      fixed: 'left',
      render: (text) => <a style={{ color: '#1a73e8' }}>{text}</a>,
    },
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 160,
    },
    {
      title: '标识',
      dataIndex: 'mark',
      key: 'mark',
      width: 110,
      render: (_mark: string, record: WaybillRecord) => {
        if (record.timeoutInfo && record.timeoutInfo.actualDays !== null && record.timeoutInfo.actualDays > record.timeoutInfo.promiseDays) {
          return (
            <Tooltip
              title={
                <span>
                  判定区间：{record.timeoutInfo.startNode} - {record.timeoutInfo.endNode}；
                  承诺：{record.timeoutInfo.promiseDays} 天；实际：{record.timeoutInfo.actualDays} 天
                </span>
              }
            >
              <Tag color="red" style={{ fontSize: 13, padding: '2px 8px', fontWeight: 600, cursor: 'pointer' }}>
                超时
              </Tag>
            </Tooltip>
          )
        }
        return <span style={{ color: '#ccc' }}>-</span>
      },
    },
    {
      title: '承诺时效',
      key: 'promiseDays',
      width: 110,
      render: (_, record) => record.timeoutInfo?.promiseDays != null ? (
        <Tooltip title={`监控区间：${record.timeoutInfo.startNode} → ${record.timeoutInfo.endNode}`}>
          <span style={{ cursor: 'help' }}>{record.timeoutInfo.promiseDays} 天</span>
        </Tooltip>
      ) : null,
    },
    {
      title: '实际时效',
      key: 'actualDays',
      width: 110,
      render: (_, record) => {
        const info = record.timeoutInfo
        return info?.actualDays != null ? `${info.actualDays} 天` : null
      },
    },
    {
      title: '超时天数',
      key: 'overdueDays',
      width: 110,
      render: (_, record) => {
        const info = record.timeoutInfo
        if (info?.actualDays == null || info.promiseDays == null) return null
        const overdueDays = info.actualDays - info.promiseDays
        return overdueDays > 0 ? `${overdueDays} 天` : '未超时'
      },
    },
    {
      title: '渠道',
      dataIndex: 'channel',
      key: 'channel',
      width: 100,
    },
    {
      title: '发货方',
      dataIndex: 'senderName',
      key: 'senderName',
      width: 180,
      ellipsis: true,
    },
    {
      title: '收货方',
      dataIndex: 'receiverName',
      key: 'receiverName',
      width: 180,
      ellipsis: true,
    },
    {
      title: '目的地',
      dataIndex: 'destination',
      key: 'destination',
      width: 130,
    },
    {
      title: '运输方式',
      dataIndex: 'transportMethod',
      key: 'transportMethod',
      width: 90,
    },
    {
      title: '件数',
      dataIndex: 'packageCount',
      key: 'packageCount',
      width: 70,
    },
    {
      title: '重量(kg)',
      dataIndex: 'weight',
      key: 'weight',
      width: 90,
    },
    {
      title: '币种',
      dataIndex: 'currency',
      key: 'currency',
      width: 70,
    },
    {
      title: '申报价值',
      dataIndex: 'declaredValue',
      key: 'declaredValue',
      width: 110,
      render: (val, record) => `${record.currency} ${val.toLocaleString()}`,
    },
    {
      title: '跟踪号',
      dataIndex: 'trackingNo',
      key: 'trackingNo',
      width: 160,
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <span style={{ color: statusColorMap[status] || '#666', fontWeight: 500 }}>{status}</span>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 170,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <a style={{ color: '#1a73e8' }}><EyeOutlined /> 查看</a>
          <a style={{ color: '#1a73e8' }} onClick={() => openEditDrawer(record)}><EditOutlined /> 编辑</a>
          <a style={{ color: '#1a73e8' }}><PrinterOutlined /> 打印</a>
          <a style={{ color: '#ff4d4f' }}><DeleteOutlined /> 删除</a>
        </Space>
      ),
    },
  ]

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys as string[]),
  }

  return (
    <div>
        {/* 筛选栏 */}
        <div className="filter-bar">
          <div className="filter-item">
            <span className="filter-label">运单号</span>
            <Input placeholder="请输入运单号" style={{ width: 180 }} allowClear />
          </div>
          <div className="filter-item">
            <span className="filter-label">订单号</span>
            <Input placeholder="请输入订单号" style={{ width: 180 }} allowClear />
          </div>
          <div className="filter-item">
            <span className="filter-label">标识</span>
            <Select placeholder="请选择标识" style={{ width: 160 }} allowClear>
              <Select.Option value="超时">超时</Select.Option>
            </Select>
          </div>
          <div className="filter-item">
            <span className="filter-label">渠道</span>
            <Select placeholder="请选择" style={{ width: 150 }} allowClear>
              <Select.Option value="us-sea">美国海运</Select.Option>
              <Select.Option value="us-air">美国空运</Select.Option>
              <Select.Option value="uk-sea">英国海运</Select.Option>
            </Select>
          </div>
          <div className="filter-item">
            <span className="filter-label">状态</span>
            <Select placeholder="请选择" style={{ width: 120 }} allowClear>
              <Select.Option value="pending">待发货</Select.Option>
              <Select.Option value="picked">已揽收</Select.Option>
              <Select.Option value="transit">运输中</Select.Option>
              <Select.Option value="customs">清关中</Select.Option>
              <Select.Option value="delivered">已签收</Select.Option>
              <Select.Option value="abnormal">异常</Select.Option>
            </Select>
          </div>
          <div className="filter-item">
            <span className="filter-label">创建时间</span>
            <RangePicker style={{ width: 240 }} />
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
          <Button type="primary" icon={<PlusOutlined />}>创建运单</Button>
          <Button icon={<PrinterOutlined />}>批量打印</Button>
          <Button icon={<ExportOutlined />}>导出</Button>
          <Button icon={<CheckCircleOutlined />}>批量揽收</Button>
          <Button icon={<StopOutlined />}>批量作废</Button>
          <Button icon={<FileTextOutlined />}>查看日志</Button>
        </div>

        {/* 数据表格 */}
        <div className="table-card">
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={mockData}
            scroll={{ x: 2430 }}
            pagination={{
              total: 865,
              pageSize: 100,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
              pageSizeOptions: ['50', '100', '200'],
            }}
          />
        </div>

        {/* 编辑运单抽屉 */}
        <EditWaybillDrawer
          open={drawerOpen}
          record={editingRecord}
          onClose={closeEditDrawer}
          onSave={handleSave}
        />
      </div>
  )
}
