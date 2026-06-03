import { useMemo, useState } from 'react'
import {
  Button,
  Checkbox,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Switch,
  Table,
  Tooltip,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
  SettingOutlined,
} from '@ant-design/icons'

type ParseField = 'country' | 'zone' | 'city' | 'transitDays'
const parseFieldOrder: ParseField[] = ['country', 'zone', 'city', 'transitDays']

interface QuoteRecord {
  key: string
  name: string
  service: string
  createTime: string
  creator: string
  updateTime: string
  updater: string
  supportTransitDays: boolean
}

interface RateEditRow {
  key: string
  country: string
  zone: string
  city: string
  price: number
  transitDays?: number
}

const quoteData: QuoteRecord[] = [
  {
    key: '1',
    name: 'YJDF-整柜-洛杉矶CLX13日达-LA01仓NBS-卡派',
    service: 'YJDF-整柜-洛杉矶CLX13日达-LA01仓NBS',
    createTime: '2026-05-20 12:34:47',
    creator: '天杰',
    updateTime: '2026-05-20 12:41:27',
    updater: '天旭',
    supportTransitDays: true,
  },
  {
    key: '2',
    name: 'YJDF-整柜-洛杉矶MAX14日达-LA01仓NBS-卡派',
    service: 'YJDF-整柜-洛杉矶MAX14日达-LA01仓NBS',
    createTime: '2026-05-20 12:34:31',
    creator: '天杰',
    updateTime: '2026-05-20 12:42:01',
    updater: '天旭',
    supportTransitDays: false,
  },
  {
    key: '3',
    name: 'YJDF-整柜-洛杉矶EXX16日达-LA01仓NBS-卡派',
    service: 'YJDF-整柜-洛杉矶EXX16日达-LA01仓NBS',
    createTime: '2026-05-20 12:34:15',
    creator: '天杰',
    updateTime: '2026-05-20 12:42:30',
    updater: '天旭',
    supportTransitDays: true,
  },
  {
    key: '4',
    name: 'YJDF-洛杉矶CLX13日达-LA01仓快递派',
    service: 'YJDF-洛杉矶CLX13日达-LA01仓快递派',
    createTime: '2026-05-20 12:01:53',
    creator: '天杰',
    updateTime: '2026-05-20 12:04:48',
    updater: '天旭',
    supportTransitDays: false,
  },
  {
    key: '5',
    name: 'YJDF-洛杉矶CLX13日达-LA01仓卡派',
    service: 'YJDF-洛杉矶CLX13日达-LA01仓卡派',
    createTime: '2026-05-20 12:01:38',
    creator: '天杰',
    updateTime: '2026-05-20 12:14:01',
    updater: '天旭',
    supportTransitDays: true,
  },
  {
    key: '6',
    name: '美转加CLX加西16日达-加拿大卡尔加里商业/私人地址-卡派',
    service: '美转加CLX加西16日达-加拿大卡尔加里商业/私人地址',
    createTime: '2026-05-19 21:20:53',
    creator: '天杰',
    updateTime: '2026-05-20 11:41:17',
    updater: '天翰',
    supportTransitDays: true,
  },
  {
    key: '7',
    name: '美转加DFMAX17日达-加拿大卡尔加里商业/私人地址-卡派',
    service: '美转加DFMAX17日达-加拿大卡尔加里商业/私人地址',
    createTime: '2026-05-19 21:20:08',
    creator: '天杰',
    updateTime: '2026-05-19 21:29:40',
    updater: '天翰',
    supportTransitDays: false,
  },
  {
    key: '8',
    name: '美转加DFMAX17日达-加拿大多伦多商业/私人地址-快递派',
    service: '美转加DFMAX17日达-加拿大多伦多商业/私人地址',
    createTime: '2026-05-19 21:17:28',
    creator: '天杰',
    updateTime: '2026-05-19 21:26:31',
    updater: '天翰',
    supportTransitDays: false,
  },
  {
    key: '9',
    name: '美转加加西MAX17日达-UPS派',
    service: '美转加加西MAX17日达-UPS派',
    createTime: '2026-05-19 18:08:08',
    creator: '天杰',
    updateTime: '2026-05-19 18:20:09',
    updater: '天旭',
    supportTransitDays: false,
  },
  {
    key: '10',
    name: '美转加加西MAX17日达-卡派-NBS',
    service: '美转加加西MAX17日达-卡派-NBS',
    createTime: '2026-05-19 18:07:13',
    creator: '天杰',
    updateTime: '2026-05-19 18:16:37',
    updater: '天旭',
    supportTransitDays: true,
  },
  {
    key: '11',
    name: 'YJDF-洛杉矶MAX14日达-LA01仓快递派',
    service: 'YJDF-洛杉矶MAX14日达-LA01仓快递派',
    createTime: '2026-05-20 13:22:10',
    creator: '天杰',
    updateTime: '2026-05-20 13:30:15',
    updater: '天旭',
    supportTransitDays: false,
  },
  {
    key: '12',
    name: 'YJDF-洛杉矶EXX16日达-LA01仓快递派',
    service: 'YJDF-洛杉矶EXX16日达-LA01仓快递派',
    createTime: '2026-05-20 11:45:33',
    creator: '天旭',
    updateTime: '2026-05-20 12:10:42',
    updater: '天翰',
    supportTransitDays: false,
  },
  {
    key: '13',
    name: 'YJDF-整柜-洛杉矶CLX13日达-LA01仓快递派',
    service: 'YJDF-整柜-洛杉矶CLX13日达-LA01仓快递派',
    createTime: '2026-05-19 16:08:22',
    creator: '天翰',
    updateTime: '2026-05-20 09:15:08',
    updater: '天杰',
    supportTransitDays: false,
  },
  {
    key: '14',
    name: '美转加CLX加西16日达-快递派',
    service: '美转加CLX加西16日达-快递派',
    createTime: '2026-05-19 14:30:55',
    creator: '天杰',
    updateTime: '2026-05-19 17:42:18',
    updater: '天旭',
    supportTransitDays: false,
  },
  {
    key: '15',
    name: '美转加DFMAX17日达-加拿大多伦多快递派',
    service: '美转加DFMAX17日达-加拿大多伦多快递派',
    createTime: '2026-05-19 10:12:07',
    creator: '天翰',
    updateTime: '2026-05-19 14:55:36',
    updater: '天翰',
    supportTransitDays: false,
  },
  {
    key: '16',
    name: '英国海运DPD18日达-LON仓快递派',
    service: '英国海运DPD18日达-LON仓快递派',
    createTime: '2026-05-18 09:48:12',
    creator: '天杰',
    updateTime: '2026-05-19 11:20:44',
    updater: '天旭',
    supportTransitDays: false,
  },
  {
    key: '17',
    name: '美国空运UPS10日达-JFK仓快递派',
    service: '美国空运UPS10日达-JFK仓快递派',
    createTime: '2026-05-18 15:33:29',
    creator: '天旭',
    updateTime: '2026-05-19 08:10:53',
    updater: '天杰',
    supportTransitDays: false,
  },
]

const renderEllipsis = (text: string) => (
  <Tooltip title={text}>
    <span className="quote-cell-ellipsis">{text}</span>
  </Tooltip>
)

export default function QuoteMaintainPage() {
  const [form] = Form.useForm()
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [quoteName, setQuoteName] = useState('')
  const [service, setService] = useState<string | undefined>()
  const [priceDrawerOpen, setPriceDrawerOpen] = useState(false)
  const [rateEditDrawerOpen, setRateEditDrawerOpen] = useState(false)
  const [editingQuote, setEditingQuote] = useState<QuoteRecord | null>(null)
  const [supportTransitDays, setSupportTransitDays] = useState(true)
  const [parseFields, setParseFields] = useState<ParseField[]>(['country', 'zone', 'city'])
  const [transitDaysInput, setTransitDaysInput] = useState<number | undefined>(undefined)
  const [pasteText, setPasteText] = useState('')
  const [rateRows, setRateRows] = useState<RateEditRow[]>([
    { key: '1', country: '美国', zone: 'ONT8、LGB8、LAX9、SBD1', city: '', price: 5.2, transitDays: 12 },
    { key: '2', country: '美国', zone: 'KRB1、KRB4、LGB4、LGB7', city: '', price: 5.4 },
    { key: '3', country: '美国', zone: 'SMF3、LAS1、GYR3、GYR2', city: '', price: 6.2, transitDays: 18 },
    { key: '4', country: '美国', zone: 'SCK1、OAK3、SMF6、FAT2', city: '', price: 6.2, transitDays: 20 },
  ])

  const inferLastMile = (recordName: string) => {
    if (recordName.includes('快递派')) return '快递派'
    if (recordName.includes('UPS派')) return '快递派'
    if (recordName.includes('卡派')) return '卡派'
    return '卡车配送'
  }

  const isExpressDelivery = editingQuote ? inferLastMile(editingQuote.name) === '快递派' : false
  const showTransitDaysColumn = supportTransitDays && !isExpressDelivery

  const parseTransitDays = (value: string) => {
    const parsedValue = Number(value.replace(/[^\d.]/g, ''))
    if (!Number.isFinite(parsedValue) || parsedValue === 0) return undefined
    return Math.round(parsedValue)
  }

  const splitPasteLine = (line: string) => {
    if (line.includes('\t')) return line.split('\t')
    if (line.includes(',')) return line.split(',')
    if (line.includes('，')) return line.split('，')
    return line.trim().split(/\s+/)
  }

  const applyPasteText = (text: string, fields: ParseField[]) => {
    setPasteText(text)
    if (!fields.length) return

    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)

    if (!lines.length) return

    setRateRows((prev) => {
      const next = [...prev]

      lines.forEach((line, rowIndex) => {
        const cells = splitPasteLine(line).map((cell) => cell.trim())
        const current = next[rowIndex] || {
          key: String(Date.now() + rowIndex),
          country: '',
          zone: '',
          city: '',
          price: 0,
        }

        const patched = { ...current }
        fields.forEach((field, fieldIndex) => {
          const cell = cells[fieldIndex] ?? ''
          if (field === 'transitDays') {
            patched.transitDays = parseTransitDays(cell)
          } else {
            patched[field] = cell
          }
        })
        next[rowIndex] = patched
      })

      return next
    })
  }

  const updateRateRow = (rowKey: string, patch: Partial<RateEditRow>) => {
    setRateRows((prev) => prev.map((row) => (
      row.key === rowKey ? { ...row, ...patch } : row
    )))
  }

  const normalizeParseFields = (fields: ParseField[]) => (
    parseFieldOrder.filter((field) => fields.includes(field))
  )

  const updateParseField = (field: ParseField, checked: boolean) => {
    const next = normalizeParseFields(
      checked ? [...parseFields, field] : parseFields.filter((item) => item !== field),
    )
    setParseFields(next)
    applyPasteText(pasteText, next)
  }

  const updateTransitSupport = (checked: boolean) => {
    setSupportTransitDays(checked)
    if (!checked) {
      setTransitDaysInput(undefined)
      const next = parseFields.filter((field) => field !== 'transitDays')
      setParseFields(next)
      applyPasteText(pasteText, next)
    }
  }

  const tableData = useMemo(() => {
    return Array.from({ length: 4 }).flatMap((_, groupIndex) => (
      quoteData.map((item, index) => ({
        ...item,
        key: `${groupIndex + 1}-${item.key}`,
        createTime: groupIndex === 0 ? item.createTime : `2026-05-${19 - groupIndex} ${18 + index % 5}:0${index % 6}:3${index % 8}`,
        updateTime: groupIndex === 0 ? item.updateTime : `2026-05-${20 - groupIndex} ${18 + index % 5}:2${index % 6}:4${index % 8}`,
      }))
    ))
  }, [])

  const columns: ColumnsType<QuoteRecord> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 280,
      render: renderEllipsis,
    },
    {
      title: '服务',
      dataIndex: 'service',
      key: 'service',
      width: 280,
      render: renderEllipsis,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 170,
      align: 'center',
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      width: 120,
      align: 'center',
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 170,
      align: 'center',
    },
    {
      title: '修改人',
      dataIndex: 'updater',
      key: 'updater',
      width: 120,
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      width: 190,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <Space size={10}>
          <a
            className="quote-action"
            onClick={() => {
            setEditingQuote(record)
            const lastMile = inferLastMile(record.name)
            const hasTransitDays = record.supportTransitDays
            setSupportTransitDays(hasTransitDays)
            setTransitDaysInput(undefined)
            setParseFields(hasTransitDays ? ['country', 'zone', 'city', 'transitDays'] : ['country', 'zone', 'city'])
            setPasteText('')
            form.setFieldsValue({
                name: record.name,
                service: record.service,
                lastMile,
                supportTransitDays: hasTransitDays,
              })
              setPriceDrawerOpen(true)
            }}
          >
            <EditOutlined /> 维护运价
          </a>
          <a className="quote-action">复制报价</a>
          <a className="quote-action quote-action-danger"><DeleteOutlined /> 删除</a>
        </Space>
      ),
    },
  ]

  return (
    <div className="quote-maintain-page">
      <div className="filter-bar quote-filter-bar">
        <div className="filter-item quote-filter-item">
          <span className="filter-label">报价名称</span>
          <Input
            value={quoteName}
            onChange={(event) => setQuoteName(event.target.value)}
            placeholder="报价名称"
            allowClear
            style={{ width: 360 }}
          />
        </div>
        <div className="filter-item quote-filter-item">
          <span className="filter-label">服务</span>
          <Select
            value={service}
            onChange={setService}
            placeholder="请选择"
            allowClear
            showSearch
            style={{ width: 360 }}
            options={quoteData.slice(0, 6).map((item) => ({ label: item.service, value: item.service }))}
          />
        </div>
        <Space className="quote-filter-actions">
          <Button type="primary" icon={<SearchOutlined />}>查询</Button>
          <Button icon={<ReloadOutlined />}>重置</Button>
        </Space>
      </div>

      <div className="table-card quote-table-card">
        <div className="quote-toolbar">
          <Space>
            <Button type="primary">创建运价</Button>
            <Button type="primary" icon={<DownloadOutlined />}>导出</Button>
          </Space>
          <Button type="primary" icon={<SettingOutlined />} />
        </div>

        <Table
          rowKey="key"
          size="small"
          bordered
          columns={columns}
          dataSource={tableData}
          tableLayout="fixed"
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          scroll={{ x: 1450, y: 'calc(100vh - 330px)' }}
          pagination={{
            total: 2061,
            pageSize: 100,
            current: 1,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['50', '100', '200'],
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </div>

      <Drawer
        title="维护运价"
        open={priceDrawerOpen}
        onClose={() => setPriceDrawerOpen(false)}
        width="55vw"
        className="quote-price-drawer"
        destroyOnClose
        extra={
          <Space>
            <Button type="primary" onClick={() => setPriceDrawerOpen(false)}>保存</Button>
            <Button onClick={() => setPriceDrawerOpen(false)}>取消</Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            name: editingQuote?.name,
            service: editingQuote?.service,
            lastMile: '卡车配送',
            supportTransitDays,
          }}
        >
          <div className="quote-drawer-section">
            <div className="quote-drawer-title">基础信息</div>
            <div className="quote-basic-grid">
              <div className="quote-basic-field">
                <span className="quote-basic-label quote-basic-label-required">名称:</span>
                <Form.Item name="name" rules={[{ required: true, message: '请输入名称' }]} noStyle>
                  <Input placeholder="请输入名称" />
                </Form.Item>
              </div>
              <div className="quote-basic-field">
                <span className="quote-basic-label quote-basic-label-required">服务:</span>
                <Form.Item name="service" rules={[{ required: true, message: '请选择服务' }]} noStyle>
                  <Select
                    disabled
                    options={quoteData.slice(0, 6).map((item) => ({ label: item.service, value: item.service }))}
                  />
                </Form.Item>
              </div>
              <div className="quote-basic-field quote-basic-field-compact">
                <span className="quote-basic-label">尾程派送:</span>
                <span className="quote-static-text">{editingQuote ? inferLastMile(editingQuote.name) : '卡车配送'}</span>
              </div>
              <div className="quote-basic-field quote-basic-field-compact">
                <span className="quote-basic-label">启用时效:</span>
                <Form.Item name="supportTransitDays" valuePropName="checked" noStyle>
                  <Switch checked={supportTransitDays} onChange={updateTransitSupport} />
                </Form.Item>
              </div>
              {supportTransitDays && isExpressDelivery && (
                <div className="quote-basic-field" style={{ gridColumn: 'span 2' }}>
                  <span className="quote-basic-label">天数:</span>
                  <InputNumber
                    value={transitDaysInput}
                    onChange={(val) => {
                      const num = Number(val)
                      setTransitDaysInput(Number.isFinite(num) && num > 0 ? Math.round(num) : undefined)
                    }}
                    min={1}
                    step={1}
                    precision={0}
                    placeholder="请输入天数"
                    style={{ width: 160 }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="quote-drawer-section">
            <div className="quote-section-head">
              <div>
                <div className="quote-drawer-title">运价设置</div>
                <div className="quote-subtitle">运价</div>
              </div>
              <Space>
                <Button>复制报价</Button>
                <Button onClick={() => setRateEditDrawerOpen(true)}>编辑运价</Button>
              </Space>
            </div>
            <Table
              size="small"
              bordered
              pagination={false}
              rowKey="key"
              columns={[
                { title: '国家', dataIndex: 'country', width: 120 },
                { title: '分区', dataIndex: 'zone', ellipsis: true },
                { title: '城市', dataIndex: 'city', width: 160 },
                {
                  title: '10-99999',
                  children: [
                    { title: '单价', dataIndex: 'price', width: 120 },
                  ],
                },
                ...(showTransitDaysColumn ? [{
                  title: '时效',
                  dataIndex: 'transitDays',
                  width: 120,
                  render: (value?: number) => value ? String(Math.max(1, Math.trunc(value))) : '-',
                }] : []),
              ]}
              dataSource={[
                { key: '1', country: '美国', zone: 'ONT8、LGB8、LAX9、SBD1', city: '', price: '5.2', transitDays: 12 },
                { key: '2', country: '美国', zone: 'KRB1、KRB4、LGB4、LGB7、ONT9、SBD2、XLX7、IUSJ、LGB6、LGB9、SN...', city: '', price: '5.4' },
                { key: '3', country: '美国', zone: 'SMF3、LAS1、GYR3、GYR2、SCK4、VGT2、VGT2-UPS-92518、VGT2-UPS-89...', city: '', price: '6.2', transitDays: 18 },
              ]}
            />

            <div className="quote-subtitle quote-subtitle-gap">特价运价</div>
            <Table
              size="small"
              bordered
              pagination={false}
              rowKey="key"
              columns={[
                { title: '国家', dataIndex: 'country', width: 120 },
                { title: '分区', dataIndex: 'zone' },
                { title: '城市', dataIndex: 'city', width: 160 },
                {
                  title: '10-99999',
                  children: [
                    { title: '单价', dataIndex: 'price', width: 120 },
                  ],
                },
                ...(showTransitDaysColumn ? [{
                  title: '时效',
                  dataIndex: 'transitDays',
                  width: 120,
                  render: (value?: number) => value ? String(Math.max(1, Math.trunc(value))) : '-',
                }] : []),
              ]}
              dataSource={[]}
              locale={{ emptyText: '暂无数据' }}
            />
          </div>

          <QuoteAdjustmentSection
            title="拣货货站"
            actionText="新增拣货规则"
            columns={['拣货货站', '调整值', '单位', '分区调整值', '操作']}
            rows={[
              { key: '1', first: '义乌仓', value: 0.5, unit: 'KG', extra: '查看' },
            ]}
          />

          <QuoteAdjustmentSection
            title="客户等级"
            actionText="新增客户等级"
            columns={['客户等级', '调整值', '单位', '操作']}
            rows={[
              { key: '1', first: '直客', value: 2.6, unit: 'KG' },
              { key: '2', first: '同行', value: 0.6, unit: 'KG' },
              { key: '3', first: 'vip', value: 0.3, unit: 'KG' },
            ]}
          />

          <QuoteAdjustmentSection
            title="客户调价"
            actionText="新增客户调价"
            columns={['客户名称', '调整值', '单位', '条件', '操作']}
            rows={[]}
          />
        </Form>
      </Drawer>

      <Drawer
        title="运价设置"
        open={rateEditDrawerOpen}
        onClose={() => setRateEditDrawerOpen(false)}
        width="62vw"
        className="quote-rate-edit-drawer"
        destroyOnClose
        extra={
          <Space>
            <Button type="primary">上一步</Button>
            <Button>提交</Button>
            <Button onClick={() => setRateEditDrawerOpen(false)}>关闭</Button>
          </Space>
        }
      >
        <div className="quote-rate-edit-card">
          <div className="quote-step-line">
            <div className="quote-step quote-step-done">
              <span className="quote-step-icon">✓</span>
              <span>重量段设置</span>
            </div>
            <div className="quote-step quote-step-active">
              <span className="quote-step-icon">2</span>
              <span>报价设置</span>
            </div>
          </div>

          <div className="quote-rate-title">运价</div>
          <div className="quote-rate-label">运单粘贴板:</div>
          <div className="quote-parse-options">
            <Space size={16}>
              <span><QuestionCircleOutlined /> 需要解析的内容:</span>
              <Checkbox
                checked={parseFields.includes('country')}
                onChange={(event) => updateParseField('country', event.target.checked)}
              >
                国家
              </Checkbox>
              <Checkbox
                checked={parseFields.includes('zone')}
                onChange={(event) => updateParseField('zone', event.target.checked)}
              >
                分区
              </Checkbox>
              <Checkbox
                checked={parseFields.includes('city')}
                onChange={(event) => updateParseField('city', event.target.checked)}
              >
                城市
              </Checkbox>
              {showTransitDaysColumn && (
                <Checkbox
                  checked={parseFields.includes('transitDays')}
                  onChange={(event) => updateParseField('transitDays', event.target.checked)}
                >
                  时效
                </Checkbox>
              )}
            </Space>
          </div>
          <Input.TextArea
            value={pasteText}
            onChange={(event) => applyPasteText(event.target.value, parseFields)}
            rows={4}
            placeholder="请输入内容"
            className="quote-parse-textarea"
          />

          <div className="quote-rate-controls">
            <Button type="primary" icon={<PlusOutlined />}>新增运价</Button>
            <InputNumber min={1} step={1} precision={0} defaultValue={1} addonBefore="-" addonAfter="+" />
            <span>币种:</span>
            <Select
              defaultValue="人民币"
              style={{ width: 220 }}
              options={[
                { label: '人民币', value: '人民币' },
                { label: 'USD', value: 'USD' },
                { label: 'GBP', value: 'GBP' },
              ]}
            />
          </div>

          <EditableRateTable
            rows={rateRows}
            supportTransitDays={showTransitDaysColumn}
            onChange={updateRateRow}
            parseTransitDays={parseTransitDays}
          />

          <div className="quote-effective-time">
            <span>生效时间:</span>
            <DatePicker showTime placeholder="选择日期时间" />
          </div>

          <div className="quote-rate-title quote-rate-title-gap">特价运价</div>
          <Button type="primary" icon={<PlusOutlined />} className="quote-special-add">新增特价</Button>
          <EditableRateTable
            rows={[]}
            emptyText="暂无数据"
            supportTransitDays={showTransitDaysColumn}
            onChange={updateRateRow}
            parseTransitDays={parseTransitDays}
          />
        </div>
      </Drawer>
    </div>
  )
}

function EditableRateTable({
  rows,
  emptyText = '暂无数据',
  supportTransitDays,
  onChange,
  parseTransitDays,
}: {
  rows: RateEditRow[]
  emptyText?: string
  supportTransitDays: boolean
  onChange: (rowKey: string, patch: Partial<RateEditRow>) => void
  parseTransitDays: (value: string) => number | undefined
}) {
  return (
    <Table
      size="small"
      bordered
      pagination={false}
      rowKey="key"
      className="quote-edit-rate-table"
      columns={[
        {
          title: '国家',
          dataIndex: 'country',
          width: 230,
          render: (value: string, record: RateEditRow) => (
            <Select
              mode="multiple"
              value={value ? [value] : []}
              onChange={(nextValue) => onChange(record.key, { country: nextValue[0] || '' })}
              options={[
                { label: '美国', value: '美国' },
                { label: '英国', value: '英国' },
                { label: '加拿大', value: '加拿大' },
              ]}
            />
          ),
        },
        {
          title: '分区',
          dataIndex: 'zone',
          width: 230,
          render: (value: string, record: RateEditRow) => (
            <Input
              value={value}
              onChange={(event) => onChange(record.key, { zone: event.target.value })}
              placeholder="请输入"
            />
          ),
        },
        {
          title: '城市',
          dataIndex: 'city',
          width: 210,
          render: (value: string, record: RateEditRow) => (
            <Input
              value={value}
              onChange={(event) => onChange(record.key, { city: event.target.value })}
              placeholder="请输入"
            />
          ),
        },
        {
          title: '10-99999',
          children: [
            {
              title: '单价',
              dataIndex: 'price',
              width: 180,
              render: (value: number, record: RateEditRow) => (
                <InputNumber
                  value={value}
                  onChange={(nextValue) => onChange(record.key, { price: Number(nextValue || 0) })}
                  min={0}
                  step={0.1}
                  precision={2}
                  addonBefore="-"
                  addonAfter="+"
                  style={{ width: '100%' }}
                />
              ),
            },
          ],
        },
        {
          title: '操作',
          key: 'action',
          width: 130,
          render: () => (
            <Button danger type="primary" icon={<DeleteOutlined />} />
          ),
        },
        ...(supportTransitDays ? [{
          title: '时效',
          dataIndex: 'transitDays',
          width: 160,
          render: (value: number | undefined, record: RateEditRow) => (
            <InputNumber
              value={value}
              onChange={(nextValue) => {
                const parsedValue = parseTransitDays(String(nextValue ?? ''))
                onChange(record.key, { transitDays: parsedValue })
              }}
              min={0}
              step={1}
              precision={0}
              parser={(input) => {
                const normalized = input?.replace(/[^\d.]/g, '') || ''
                const parsedValue = Number(normalized)
                if (!normalized || !Number.isFinite(parsedValue) || parsedValue === 0) return 0
                return Math.round(parsedValue)
              }}
              formatter={(value) => (Number(value) === 0 ? '' : String(value ?? ''))}
              placeholder="可为空"
              style={{ width: '100%' }}
            />
          ),
        }] : []),
      ]}
      dataSource={rows}
      locale={{ emptyText }}
    />
  )
}

interface AdjustmentRow {
  key: string
  first: string
  value: number
  unit: string
  extra?: string
}

interface QuoteAdjustmentSectionProps {
  title: string
  actionText: string
  columns: string[]
  rows: AdjustmentRow[]
}

function QuoteAdjustmentSection({ title, actionText, columns, rows }: QuoteAdjustmentSectionProps) {
  return (
    <div className="quote-drawer-section">
      <div className="quote-section-head">
        <div className="quote-drawer-title">{title}</div>
        <Space>
          <Button>复制报价</Button>
          <Button>{actionText}</Button>
        </Space>
      </div>
      <Table
        size="small"
        bordered
        pagination={false}
        rowKey="key"
        columns={columns.map((column, index) => ({
          title: column,
          dataIndex: `col${index}`,
          render: (_: unknown, record: AdjustmentRow) => {
            if (index === 0) {
              return (
                <Select
                  defaultValue={record.first}
                  options={[record.first, '洛杉矶仓', '直客', '同行', 'vip'].map((item) => ({ label: item, value: item }))}
                />
              )
            }

            if (column === '调整值') {
              return (
                <InputNumber
                  defaultValue={record.value}
                  min={0}
                  step={0.1}
                  precision={2}
                  addonBefore="-"
                  addonAfter="+"
                  style={{ width: '100%' }}
                />
              )
            }

            if (column === '单位') {
              return (
                <Select
                  defaultValue={record.unit}
                  options={[
                    { label: 'KG', value: 'KG' },
                    { label: 'CBM', value: 'CBM' },
                    { label: '票', value: '票' },
                  ]}
                />
              )
            }

            if (column === '分区调整值' || column === '条件') {
              return record.extra ? <a className="quote-action">{record.extra}</a> : '-'
            }

            return <a className="quote-action quote-action-danger">删除</a>
          },
        }))}
        dataSource={rows}
        locale={{ emptyText: '暂无数据' }}
      />
    </div>
  )
}
