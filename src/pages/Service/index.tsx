import { useState, useRef } from 'react'
import {
  Button,
  Select,
  Table,
  Space,
  Tag,
  message,
  App,
  Modal,
  Upload,
  Alert,
  Dropdown,
} from 'antd'
import type { UploadProps } from 'antd'
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
  ClockCircleOutlined,
  DownloadOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import * as XLSX from 'xlsx'
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
  timeStartNode: string
  timeEndNode: string
  promiseDays: number
  storageLocations: string
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
    timeStartNode: '出运',
    timeEndNode: '提取',
    promiseDays: 18,
    storageLocations: 'ONT8,LGB8',
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
    timeStartNode: '起飞',
    timeEndNode: '入仓',
    promiseDays: 10,
    storageLocations: 'LAX9,SBD1',
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
    timeStartNode: '开船',
    timeEndNode: '提取',
    promiseDays: 25,
    storageLocations: 'BHX4,MAN4',
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
    timeStartNode: '出运',
    timeEndNode: '入仓',
    promiseDays: 20,
    storageLocations: 'ONT8',
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
    timeStartNode: '起飞',
    timeEndNode: '提取',
    promiseDays: 12,
    storageLocations: 'GYR3,PHX7,LAS1',
  },
]

export default function ServiceList() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<ServiceRecord | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [batchTimeModalOpen, setBatchTimeModalOpen] = useState(false)
  const [uploadResult, setUploadResult] = useState<{ success: number; fail: number; errors: string[] } | null>(null)
  const tableRef = useRef<any>(null)

  const openEditDrawer = (record: ServiceRecord | null = null) => {
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

  const validChannels = ['美国海运', '美国空运', '英国海运']
  const validStartNodes = ['出运', '开船', '起飞']
  const validEndNodes = ['提取', '入仓']
  const validWarehouses = [
    'ONT8','LGB8','LAX9','SBD1','GYR3','PHX7','LAS1','SMF3','OAK3','PDX9',
    'BFI3','SLC3','DEN3','MCI1','STL4','ORD5','MDW6','IND9','CMH3','DTW3',
    'CLE3','BNA3','MEM1','ATL8','MCO2','MIA1','TPA2','CLT2','RDU5','BWI2',
    'PHL4','EWR9','BOS7','DFW6','HOU8','SAT4','ABE8','AVP1','TEB9','PIT5',
    'MGE3','JAX3','SAV3','CHA2','GSP1','BFL1','FAT2','RNO4','BOI2','TUL2',
    'OKC2','ABQ2','ELP1','HSV1','RIC1','ORF2',
  ]

  const handleDownloadTemplate = () => {
    const headers = ['渠道', '开始时效节点', '结束时效节点', '承诺天数', '库点']
    const exampleRow = ['美国海运', '出运', '提取', '18', 'ONT8,LGB8']

    const ws = XLSX.utils.aoa_to_sheet([headers, exampleRow])
    ws['!cols'] = [
      { wch: 14 },
      { wch: 16 },
      { wch: 16 },
      { wch: 12 },
      { wch: 30 },
    ]

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '时效模板')

    const refWs = XLSX.utils.aoa_to_sheet([
      ['可选渠道'], ...validChannels.map(c => [c]),
      [], ['可选开始时效节点'], ...validStartNodes.map(n => [n]),
      [], ['可选结束时效节点'], ...validEndNodes.map(n => [n]),
      [], ['可选库点（多个用逗号分隔）'], ...validWarehouses.map(w => [w]),
    ])
    XLSX.utils.book_append_sheet(wb, refWs, '可选值参考')

    XLSX.writeFile(wb, '批量修改时效模板.xlsx')
  }

  const handleUpload: UploadProps['customRequest'] = (options) => {
    const { file, onSuccess } = options as any
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target?.result, { type: 'binary' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const rows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })

        if (rows.length < 2) {
          setUploadResult({ success: 0, fail: 0, errors: ['文件无数据行'] })
          onSuccess?.('ok')
          return
        }

        const errors: string[] = []
        let successCount = 0
        let failCount = 0

        for (let i = 1; i < rows.length; i++) {
          const row = rows[i]
          const rowNum = i + 1
          const channel = String(row[0] ?? '').trim()
          const startNode = String(row[1] ?? '').trim()
          const endNode = String(row[2] ?? '').trim()
          const promiseDays = String(row[3] ?? '').trim()
          const storageLocations = String(row[4] ?? '').trim()

          if (!channel && !startNode && !endNode && !promiseDays && !storageLocations) continue

          const rowErrors: string[] = []

          if (!channel) rowErrors.push('渠道为空')
          else if (!validChannels.includes(channel)) rowErrors.push(`渠道"${channel}"不在可选范围内`)

          if (!startNode) rowErrors.push('开始时效节点为空')
          else if (!validStartNodes.includes(startNode)) rowErrors.push(`开始时效节点"${startNode}"不在可选范围内`)

          if (!endNode) rowErrors.push('结束时效节点为空')
          else if (!validEndNodes.includes(endNode)) rowErrors.push(`结束时效节点"${endNode}"不在可选范围内`)

          if (!promiseDays) rowErrors.push('承诺天数为空')
          else if (!/^\d+$/.test(promiseDays) || Number(promiseDays) < 1) rowErrors.push(`承诺天数"${promiseDays}"无效`)

          if (storageLocations) {
            const locs = storageLocations.split(/[,，]/).map(s => s.trim()).filter(Boolean)
            const invalidLocs = locs.filter(l => !validWarehouses.includes(l))
            if (invalidLocs.length > 0) rowErrors.push(`库点"${invalidLocs.join(',')}"不在可选范围内`)
          }

          if (rowErrors.length > 0) {
            failCount++
            errors.push(`第${rowNum}行: ${rowErrors.join('；')}`)
          } else {
            successCount++
          }
        }

        setUploadResult({ success: successCount, fail: failCount, errors })
        onSuccess?.('ok')
      } catch {
        setUploadResult({ success: 0, fail: 0, errors: ['文件解析失败，请确认上传的是有效的 Excel 文件'] })
        onSuccess?.('ok')
      }
    }
    reader.readAsBinaryString(file)
  }

  const openBatchTimeModal = () => {
    setUploadResult(null)
    setBatchTimeModalOpen(true)
  }

  const closeBatchTimeModal = () => {
    setBatchTimeModalOpen(false)
    setUploadResult(null)
  }

  const handleBatchCloseTime = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择服务')
      return
    }
    Modal.confirm({
      title: '批量关闭承诺时效',
      content: `确认关闭已选中的 ${selectedRowKeys.length} 个服务的时效承诺配置吗？关闭后承诺时效将默认关闭。`,
      okText: '确认关闭',
      cancelText: '取消',
      onOk: () => {
        message.success(`已成功关闭 ${selectedRowKeys.length} 个服务的时效承诺`)
      },
    })
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
      title: '开始时效节点',
      dataIndex: 'timeStartNode',
      key: 'timeStartNode',
      width: 120,
    },
    {
      title: '结束时效节点',
      dataIndex: 'timeEndNode',
      key: 'timeEndNode',
      width: 120,
    },
    {
      title: '承诺天数',
      dataIndex: 'promiseDays',
      key: 'promiseDays',
      width: 90,
      render: (days: number) => `${days}天`,
    },
    {
      title: '库点',
      dataIndex: 'storageLocations',
      key: 'storageLocations',
      width: 180,
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
          <div className="filter-item">
            <span className="filter-label">是否开启承诺时效</span>
            <Select placeholder="请选择" style={{ width: 120 }} allowClear>
              <Select.Option value="yes">是</Select.Option>
              <Select.Option value="no">否</Select.Option>
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
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openEditDrawer()}>创建服务</Button>
          <Button icon={<CheckCircleOutlined />}>启用</Button>
          <Button icon={<StopOutlined />}>停用</Button>
          <Button icon={<SettingOutlined />}>配置渠道</Button>
          <Dropdown
            trigger={['click']}
            menu={{
              items: [
                { key: 'batch-edit', icon: <EditOutlined />, label: '批量修改服务信息' },
                { key: 'batch-time', icon: <ClockCircleOutlined />, label: '批量修改时效' },
                { key: 'batch-close-time', icon: <StopOutlined />, label: '批量关闭承诺时效' },
              ],
              onClick: ({ key }) => {
                if (key === 'batch-time') {
                  openBatchTimeModal()
                } else if (key === 'batch-close-time') {
                  handleBatchCloseTime()
                }
              },
            }}
          >
            <Button icon={<EditOutlined />}>
              批量操作 <DownOutlined />
            </Button>
          </Dropdown>
          <Button icon={<FileTextOutlined />}>查看日志</Button>
        </div>

        {/* 数据表格 */}
        <div className="table-card">
          <Table
            ref={tableRef}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={mockData}
            scroll={{ x: 2000 }}
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

        {/* 批量修改时效弹窗 */}
        <Modal
          title="批量修改时效"
          open={batchTimeModalOpen}
          onCancel={closeBatchTimeModal}
          width={600}
          destroyOnClose
          footer={
            uploadResult && uploadResult.success > 0
              ? [
                  <Button key="cancel" onClick={closeBatchTimeModal}>取消</Button>,
                  <Button key="confirm" type="primary" onClick={() => {
                    message.success(`已成功导入 ${uploadResult.success} 条时效配置`)
                    closeBatchTimeModal()
                  }}>确认</Button>,
                ]
              : null
          }
        >
          <div style={{ marginBottom: 24 }}>
            <div style={{ marginBottom: 12, fontSize: 14, color: '#666' }}>
              上传填好的模板文件（支持 .xlsx / .xls）
            </div>
            <Upload
              accept=".xlsx,.xls"
              customRequest={handleUpload}
              maxCount={1}
              showUploadList={{ showRemoveIcon: false }}
              onChange={(info) => {
                if (info.file.status === 'done') {
                  message.success('文件上传完成')
                }
              }}
            >
              <Button icon={<UploadOutlined />}>选择文件上传</Button>
            </Upload>
          </div>

          {uploadResult && (
            <Alert
              style={{ marginBottom: 24 }}
              type={uploadResult.fail === 0 ? 'success' : 'warning'}
              message={
                <span>
                  解析完成：成功 <b>{uploadResult.success}</b> 条，失败 <b>{uploadResult.fail}</b> 条
                </span>
              }
              description={
                uploadResult.errors.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: 20, maxHeight: 200, overflow: 'auto' }}>
                    {uploadResult.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                ) : undefined
              }
              showIcon
            />
          )}

          <a
            onClick={handleDownloadTemplate}
            style={{ fontSize: 14, color: '#1a73e8', cursor: 'pointer' }}
          >
            <DownloadOutlined style={{ marginRight: 4 }} />
            下载模板
          </a>
        </Modal>
      </div>
    </App>
  )
}
