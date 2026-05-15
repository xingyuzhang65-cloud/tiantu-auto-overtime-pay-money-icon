import { useEffect } from 'react'
import {
  Drawer,
  Form,
  Input,
  Select,
  Row,
  Col,
  Button,
  Space,
  InputNumber,
  DatePicker,
  Divider,
} from 'antd'

interface WaybillRecord {
  key: string
  waybillNo: string
  orderNo: string
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
}

interface EditWaybillDrawerProps {
  open: boolean
  record: WaybillRecord | null
  onClose: () => void
  onSave: (values: any) => void
}

export default function EditWaybillDrawer({ open, record, onClose, onSave }: EditWaybillDrawerProps) {
  const [form] = Form.useForm()

  useEffect(() => {
    if (open && record) {
      form.setFieldsValue(record)
    } else if (open && !record) {
      form.resetFields()
    }
  }, [open, record, form])

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSave(values)
    })
  }

  return (
    <Drawer
      title="编辑运单"
      open={open}
      onClose={onClose}
      width={900}
      destroyOnClose
      extra={
        <Space>
          <Button type="primary" onClick={handleSubmit}>保存</Button>
          <Button onClick={onClose}>取消</Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical" size="middle">
        {/* ======== 运单信息 ======== */}
        <div className="section-title">运单信息</div>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="waybillNo" label="运单号">
              <Input placeholder="系统自动生成" disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="orderNo" label="订单号" rules={[{ required: true, message: '请选择' }]}>
              <Select placeholder="请选择关联订单" showSearch>
                <Select.Option value="ORD20260501001">ORD20260501001</Select.Option>
                <Select.Option value="ORD20260501002">ORD20260501002</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="channel" label="渠道" rules={[{ required: true, message: '请选择' }]}>
              <Select placeholder="请选择">
                <Select.Option value="美国海运">美国海运</Select.Option>
                <Select.Option value="美国空运">美国空运</Select.Option>
                <Select.Option value="英国海运">英国海运</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="transportMethod" label="运输方式" rules={[{ required: true, message: '请选择' }]}>
              <Select placeholder="请选择">
                <Select.Option value="海运">海运</Select.Option>
                <Select.Option value="空运">空运</Select.Option>
                <Select.Option value="陆运">陆运</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="status" label="运单状态" rules={[{ required: true, message: '请选择' }]}>
              <Select placeholder="请选择">
                <Select.Option value="待发货">待发货</Select.Option>
                <Select.Option value="已揽收">已揽收</Select.Option>
                <Select.Option value="运输中">运输中</Select.Option>
                <Select.Option value="清关中">清关中</Select.Option>
                <Select.Option value="已签收">已签收</Select.Option>
                <Select.Option value="异常">异常</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="trackingNo" label="跟踪号">
              <Input placeholder="请输入跟踪号" />
            </Form.Item>
          </Col>
        </Row>

        <Divider style={{ margin: '16px 0' }} />

        {/* ======== 发货方信息 ======== */}
        <div className="section-title">发货方信息</div>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="senderName" label="公司名称" rules={[{ required: true, message: '请输入' }]}>
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="senderContact" label="联系人" rules={[{ required: true, message: '请输入' }]}>
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="senderPhone" label="联系电话" rules={[{ required: true, message: '请输入' }]}>
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="senderCountry" label="国家" rules={[{ required: true, message: '请选择' }]}>
              <Select placeholder="请选择">
                <Select.Option value="CN">中国</Select.Option>
                <Select.Option value="US">美国</Select.Option>
                <Select.Option value="UK">英国</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="senderProvince" label="省/州" rules={[{ required: true, message: '请输入' }]}>
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="senderCity" label="城市" rules={[{ required: true, message: '请输入' }]}>
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={16}>
            <Form.Item name="senderAddress" label="详细地址" rules={[{ required: true, message: '请输入' }]}>
              <Input placeholder="请输入详细地址" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="senderZip" label="邮编" rules={[{ required: true, message: '请输入' }]}>
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
        </Row>

        <Divider style={{ margin: '16px 0' }} />

        {/* ======== 收货方信息 ======== */}
        <div className="section-title">收货方信息</div>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="receiverName" label="公司名称" rules={[{ required: true, message: '请输入' }]}>
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="receiverContact" label="联系人" rules={[{ required: true, message: '请输入' }]}>
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="receiverPhone" label="联系电话" rules={[{ required: true, message: '请输入' }]}>
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="receiverCountry" label="国家" rules={[{ required: true, message: '请选择' }]}>
              <Select placeholder="请选择">
                <Select.Option value="US">美国</Select.Option>
                <Select.Option value="UK">英国</Select.Option>
                <Select.Option value="DE">德国</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="receiverProvince" label="省/州" rules={[{ required: true, message: '请输入' }]}>
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="receiverCity" label="城市" rules={[{ required: true, message: '请输入' }]}>
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={16}>
            <Form.Item name="receiverAddress" label="详细地址" rules={[{ required: true, message: '请输入' }]}>
              <Input placeholder="请输入详细地址" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="receiverZip" label="邮编" rules={[{ required: true, message: '请输入' }]}>
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
        </Row>

        <Divider style={{ margin: '16px 0' }} />

        {/* ======== 货物信息 ======== */}
        <div className="section-title">货物信息</div>
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item name="packageCount" label="件数" rules={[{ required: true, message: '请输入' }]}>
              <InputNumber style={{ width: '100%' }} placeholder="请输入" min={1} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="weight" label="实重(kg)" rules={[{ required: true, message: '请输入' }]}>
              <InputNumber style={{ width: '100%' }} placeholder="请输入" min={0} precision={2} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="volumeWeight" label="体积重(kg)">
              <InputNumber style={{ width: '100%' }} placeholder="请输入" min={0} precision={2} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="chargeableWeight" label="计费重(kg)" rules={[{ required: true, message: '请输入' }]}>
              <InputNumber style={{ width: '100%' }} placeholder="请输入" min={0} precision={2} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item name="length" label="长(cm)">
              <InputNumber style={{ width: '100%' }} placeholder="请输入" min={0} precision={1} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="width" label="宽(cm)">
              <InputNumber style={{ width: '100%' }} placeholder="请输入" min={0} precision={1} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="height" label="高(cm)">
              <InputNumber style={{ width: '100%' }} placeholder="请输入" min={0} precision={1} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="volume" label="体积(m³)">
              <InputNumber style={{ width: '100%' }} placeholder="自动计算" disabled precision={4} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item name="currency" label="币种" rules={[{ required: true, message: '请选择' }]}>
              <Select placeholder="请选择">
                <Select.Option value="USD">USD</Select.Option>
                <Select.Option value="GBP">GBP</Select.Option>
                <Select.Option value="EUR">EUR</Select.Option>
                <Select.Option value="CNY">CNY</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="declaredValue" label="申报价值" rules={[{ required: true, message: '请输入' }]}>
              <InputNumber style={{ width: '100%' }} placeholder="请输入" min={0} precision={2} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="cargoDesc" label="货物描述（英文）" rules={[{ required: true, message: '请输入' }]}>
              <Input placeholder="请输入英文货物描述" />
            </Form.Item>
          </Col>
        </Row>

        <Divider style={{ margin: '16px 0' }} />

        {/* ======== 其他信息 ======== */}
        <div className="section-title">其他信息</div>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="customsMethod" label="报关方式">
              <Select placeholder="请选择">
                <Select.Option value="general">一般贸易</Select.Option>
                <Select.Option value="cross-border">跨境电商</Select.Option>
                <Select.Option value="personal">个人物品</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="insurance" label="保险">
              <Select placeholder="请选择">
                <Select.Option value="yes">是</Select.Option>
                <Select.Option value="no">否</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="estimatedDelivery" label="预计送达">
              <DatePicker style={{ width: '100%' }} placeholder="请选择日期" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item name="remark" label="备注">
              <Input.TextArea rows={3} placeholder="请输入备注信息" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  )
}
