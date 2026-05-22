import { useEffect, useState } from 'react'
import {
  Drawer,
  Form,
  Input,
  Select,
  Radio,
  Row,
  Col,
  Button,
  Space,
  InputNumber,
  Switch,
} from 'antd'
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons'
import {
  getInvalidLocationValues,
  getLocationLabel,
  getLocationRuleByType,
  locationTypeOptions,
  splitLocationValues,
  type ChannelLocationType,
  validChannels,
} from './channelRules'

interface TimePromiseConfig {
  promiseDays?: number
  locationType?: ChannelLocationType
  storageLocations?: string[]
}

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
  status: string
  timeStartNode?: string
  timeEndNode?: string
  promiseDays?: number
  storageLocations?: string | string[]
  timePromiseConfigs?: TimePromiseConfig[]
}

interface EditDrawerProps {
  open: boolean
  record: ServiceRecord | null
  onClose: () => void
  onSave: (values: any) => void
}

export default function EditDrawer({ open, record, onClose, onSave }: EditDrawerProps) {
  const [form] = Form.useForm()
  const [timePromiseEnabled, setTimePromiseEnabled] = useState(false)

  const getEmptyTimePromiseConfig = (): TimePromiseConfig => ({
    promiseDays: undefined,
    locationType: 'warehouse',
    storageLocations: [],
  })

  const parseStorageLocations = (value?: string | string[]) => {
    return splitLocationValues(value)
  }

  const buildTimePromiseConfigs = (currentRecord: ServiceRecord) => {
    if (currentRecord.timePromiseConfigs?.length) {
      return currentRecord.timePromiseConfigs.map((item) => ({
        ...item,
        locationType: item.locationType || 'warehouse',
        storageLocations: parseStorageLocations(item.storageLocations),
      }))
    }

    if (
      currentRecord.timeStartNode ||
      currentRecord.timeEndNode ||
      currentRecord.promiseDays ||
      currentRecord.storageLocations
    ) {
      return [{
        promiseDays: currentRecord.promiseDays,
        locationType: 'warehouse',
        storageLocations: parseStorageLocations(currentRecord.storageLocations),
      }]
    }

    return []
  }

  useEffect(() => {
    if (open && record) {
      const timePromiseConfigs = buildTimePromiseConfigs(record)
      setTimePromiseEnabled(timePromiseConfigs.length > 0)
      form.setFieldsValue({
        ...record,
        timePromiseConfigs,
      })
    } else if (open && !record) {
      form.resetFields()
      setTimePromiseEnabled(false)
    }
  }, [open, record, form])

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const configs: TimePromiseConfig[] = timePromiseEnabled ? values.timePromiseConfigs || [] : []
      const firstConfig = configs[0] || {}

      onSave({
        ...values,
        timePromiseEnabled,
        timePromiseConfigs: configs,
        promiseDays: firstConfig.promiseDays,
        storageLocations: firstConfig.storageLocations?.join(',') || '',
      })
    })
  }

  return (
    <Drawer
      title={record ? '编辑服务' : '创建服务'}
      open={open}
      onClose={onClose}
      width={900}
      className="edit-drawer"
      destroyOnClose
      extra={
        <Space>
          <Button type="primary" onClick={handleSubmit}>保存</Button>
          <Button onClick={onClose}>取消</Button>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        size="middle"
        initialValues={{ isSchedule: '是' }}
      >
        {/* ======== 基础信息 ======== */}
        <div className="section-title">基础信息</div>
        <Row gutter={24}>
          {/* 第一列 */}
          <Col span={8}>
            <Form.Item name="route" label="线路" rules={[{ required: true, message: '请选择' }]}>
              <Select placeholder="请选择">
                <Select.Option value="美线">美线</Select.Option>
                <Select.Option value="英线">英线</Select.Option>
                <Select.Option value="欧洲线">欧洲线</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="serviceCode" label="服务代码" rules={[{ required: true, message: '请输入' }]}>
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item name="country" label="国家" rules={[{ required: true, message: '请选择' }]}>
              <Select placeholder="请选择">
                <Select.Option value="US">美国</Select.Option>
                <Select.Option value="UK">英国</Select.Option>
                <Select.Option value="DE">德国</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="clearanceMethod" label="清关方式" rules={[{ required: true, message: '请选择' }]}>
              <Select placeholder="请选择">
                <Select.Option value="DDP">DDP</Select.Option>
                <Select.Option value="DDU">DDU</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="lastMileDelivery" label="尾程派送" rules={[{ required: true, message: '请选择' }]}>
              <Select placeholder="请选择">
                <Select.Option value="FEDEX">FEDEX</Select.Option>
                <Select.Option value="UPS">UPS</Select.Option>
                <Select.Option value="DPD">DPD</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="serviceProvider" label="服务商" rules={[{ required: true, message: '请选择' }]}>
              <Select placeholder="请选择">
                <Select.Option value="provider1">服务商1</Select.Option>
                <Select.Option value="provider2">服务商2</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="printingCurrency" label="打单币种" rules={[{ required: true, message: '请选择' }]}>
              <Select placeholder="请选择">
                <Select.Option value="USD">USD</Select.Option>
                <Select.Option value="GBP">GBP</Select.Option>
                <Select.Option value="EUR">EUR</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="transportLevel" label="运输级别" rules={[{ required: true, message: '请输入' }]}>
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>

          {/* 第二列 */}
          <Col span={8}>
            <Form.Item name="channel" label="渠道" rules={[{ required: true, message: '请选择' }]}>
              <Select
                placeholder="请选择"
                options={validChannels.map((channel) => ({ label: channel, value: channel }))}
              />
            </Form.Item>
            <Form.Item name="serviceType" label="服务类型" rules={[{ required: true, message: '请选择' }]}>
              <Select placeholder="请选择">
                <Select.Option value="海运">海运</Select.Option>
                <Select.Option value="空运">空运</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="currency" label="币种" rules={[{ required: true, message: '请选择' }]}>
              <Select placeholder="请选择">
                <Select.Option value="USD">USD</Select.Option>
                <Select.Option value="GBP">GBP</Select.Option>
                <Select.Option value="EUR">EUR</Select.Option>
                <Select.Option value="CNY">CNY</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="taxMethod" label="交税方式" rules={[{ required: true, message: '请选择' }]}>
              <Select placeholder="请选择">
                <Select.Option value="DDP">DDP</Select.Option>
                <Select.Option value="DDU">DDU</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="surchargeCategory" label="附加费分类" rules={[{ required: true, message: '请选择' }]}>
              <Select placeholder="请选择">
                <Select.Option value="fuel">燃油附加费</Select.Option>
                <Select.Option value="peak">旺季附加费</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="destinationPort" label="目的港" rules={[{ required: true, message: '请选择' }]}>
              <Select placeholder="请选择">
                <Select.Option value="LAX">洛杉矶</Select.Option>
                <Select.Option value="NYC">纽约</Select.Option>
                <Select.Option value="LON">伦敦</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="labelDisplayService" label="标签显示服务" rules={[{ required: true, message: '请选择' }]}>
              <Select placeholder="请选择">
                <Select.Option value="显示">显示</Select.Option>
                <Select.Option value="不显示">不显示</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="isSchedule" label="船期表" rules={[{ required: true, message: '请选择' }]}>
              <Radio.Group>
                <Radio value="是">是</Radio>
                <Radio value="否">否</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>

          {/* 第三列 */}
          <Col span={8}>
            <Form.Item name="serviceName" label="服务名称" rules={[{ required: true, message: '请输入' }]}>
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item name="serviceCategory" label="服务分类" rules={[{ required: true, message: '请选择' }]}>
              <Select placeholder="请选择">
                <Select.Option value="海运">海运</Select.Option>
                <Select.Option value="空运">空运</Select.Option>
                <Select.Option value="陆运">陆运</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="customsMethod" label="报关方式" rules={[{ required: true, message: '请选择' }]}>
              <Select placeholder="请选择">
                <Select.Option value="general">一般贸易</Select.Option>
                <Select.Option value="cross-border">跨境电商</Select.Option>
                <Select.Option value="personal">个人物品</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="waybillPrefix" label="运单前缀" rules={[{ required: true, message: '请输入' }]}>
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item name="deliveryMethod" label="派送方式" rules={[{ required: true, message: '请选择' }]}>
              <Select placeholder="请选择">
                <Select.Option value="FEDEX">FEDEX</Select.Option>
                <Select.Option value="UPS">UPS</Select.Option>
                <Select.Option value="DPD">DPD</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="transportMethod" label="运输方式" rules={[{ required: true, message: '请选择' }]}>
              <Select placeholder="请选择">
                <Select.Option value="海运">海运</Select.Option>
                <Select.Option value="空运">空运</Select.Option>
                <Select.Option value="陆运">陆运</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="performanceType" label="业绩类型" rules={[{ required: true, message: '请选择' }]}>
              <Select placeholder="请选择">
                <Select.Option value="weight">重量</Select.Option>
                <Select.Option value="volume">体积</Select.Option>
                <Select.Option value="ticket">票数</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="estimatedDeliveryWeek" label="预计送达周">
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
        </Row>

        {/* ======== 计算规则 ======== */}
        <div className="section-title" style={{ marginTop: 24 }}>计算规则</div>
        <Row gutter={24}>
          {/* 第一列 */}
          <Col span={8}>
            <Form.Item name="billingMethod" label="计费方式" rules={[{ required: true, message: '请选择' }]}>
              <Select placeholder="请选择">
                <Select.Option value="体积重">体积重</Select.Option>
                <Select.Option value="实际重">实际重</Select.Option>
                <Select.Option value="两者取大">两者取大</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="densityRatio" label="密度比" rules={[{ required: true, message: '请输入' }]}>
              <InputNumber
                style={{ width: '100%' }}
                placeholder="请输入"
                min={0}
                precision={2}
                addonAfter="kg/m³"
              />
            </Form.Item>
            <Form.Item name="minCumulativeWeight" label="最低累计费重" rules={[{ required: true, message: '请输入' }]}>
              <InputNumber
                style={{ width: '100%' }}
                placeholder="请输入"
                min={0}
                precision={2}
                addonAfter="kg"
              />
            </Form.Item>
          </Col>

          {/* 第二列 */}
          <Col span={8}>
            <Form.Item name="bubbleCoefficient" label="计泡系数" rules={[{ required: true, message: '请输入' }]}>
              <InputNumber
                style={{ width: '100%' }}
                placeholder="请输入"
                min={0}
                precision={0}
              />
            </Form.Item>
            <Form.Item name="roundingMethod" label="进位方式" rules={[{ required: true, message: '请选择' }]}>
              <Select placeholder="请选择">
                <Select.Option value="round">四舍五入</Select.Option>
                <Select.Option value="ceil">向上取整</Select.Option>
                <Select.Option value="floor">向下取整</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="cumulativeWeightRounding" label="累计费重进位" rules={[{ required: true, message: '请选择' }]}>
              <Select placeholder="请选择">
                <Select.Option value="0.5">0.5</Select.Option>
                <Select.Option value="1">1</Select.Option>
                <Select.Option value="0.1">0.1</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          {/* 第三列 */}
          <Col span={8}>
            <Form.Item name="bubbleRatio" label="分泡比例" rules={[{ required: true, message: '请输入' }]}>
              <InputNumber
                style={{ width: '100%' }}
                placeholder="请输入"
                min={0}
                precision={0}
                addonAfter="%"
              />
            </Form.Item>
            <Form.Item name="minBoxChargeableWeight" label="最低箱计费重" rules={[{ required: true, message: '请输入' }]}>
              <InputNumber
                style={{ width: '100%' }}
                placeholder="请输入"
                min={0}
                precision={2}
                addonAfter="kg"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* ======== 时效承诺配置 ======== */}
        <div className="section-title" style={{ marginTop: 24 }}>时效承诺配置</div>
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: '#666' }}>是否开启时效承诺</span>
          <Switch
            checked={timePromiseEnabled}
            onChange={(checked) => {
              setTimePromiseEnabled(checked)
              if (checked) {
                const configs = form.getFieldValue('timePromiseConfigs')
                if (!configs?.length) {
                  form.setFieldValue('timePromiseConfigs', [getEmptyTimePromiseConfig()])
                }
              } else {
                form.resetFields(['timePromiseConfigs'])
              }
            }}
          />
        </div>
        {timePromiseEnabled && (
          <Form.List name="timePromiseConfigs">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Row gutter={24} key={field.key} align="top">
                    <Col span={5}>
                      <Form.Item
                        name={[field.name, 'promiseDays']}
                        label="承诺天数"
                        rules={[
                          { required: true, message: '请输入' },
                          {
                            validator: (_, value) => {
                              if (Number.isInteger(value) && value >= 1) {
                                return Promise.resolve()
                              }
                              return Promise.reject(new Error('请输入正整数天数'))
                            },
                          },
                        ]}
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          placeholder="请输入"
                          min={1}
                          step={1}
                          precision={0}
                          addonAfter="天"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item
                        name={[field.name, 'locationType']}
                        label="类型"
                        rules={[{ required: true, message: '请选择类型' }]}
                      >
                        <Select
                          placeholder="请选择"
                          options={locationTypeOptions}
                          onChange={() => {
                            form.setFieldValue(['timePromiseConfigs', field.name, 'storageLocations'], [])
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={14}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        <Form.Item
                          noStyle
                          shouldUpdate={(prev, current) => (
                            prev.timePromiseConfigs?.[field.name]?.locationType !==
                            current.timePromiseConfigs?.[field.name]?.locationType
                          )}
                        >
                          {({ getFieldValue }) => {
                            const locationType = getFieldValue(['timePromiseConfigs', field.name, 'locationType']) || 'warehouse'
                            const locationRule = getLocationRuleByType(locationType)
                            const locationLabel = getLocationLabel(locationRule.locationType)

                            return (
                              <Form.Item
                                name={[field.name, 'storageLocations']}
                                label={locationLabel}
                                rules={[
                                  { required: true, message: `请选择${locationLabel}` },
                                  {
                                    validator: (_, value) => {
                                      const values = splitLocationValues(value)
                                      if (!values.length) return Promise.resolve()

                                      const invalidValues = getInvalidLocationValues(locationRule.locationType, values)
                                      if (!invalidValues.length) return Promise.resolve()

                                      const message = locationRule.locationType === 'postalCode'
                                        ? `${locationLabel}不在可选邮编范围内：${invalidValues.join(',')}`
                                        : `${locationLabel}不在可选库点范围内：${invalidValues.join(',')}`
                                      return Promise.reject(new Error(message))
                                    },
                                  },
                                ]}
                                style={{ flex: 1 }}
                              >
                                <Select
                                  mode="multiple"
                                  placeholder={`请选择${locationLabel}`}
                                  showSearch
                                  tokenSeparators={[',', '，']}
                                  filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                  }
                                  options={locationRule.locations.map((location) => ({ label: location, value: location }))}
                                />
                              </Form.Item>
                            )
                          }}
                        </Form.Item>
                        <Space style={{ marginTop: 30 }} size={4}>
                          <Button
                            type="text"
                            icon={<PlusCircleOutlined style={{ fontSize: 22 }} />}
                            onClick={() => add(getEmptyTimePromiseConfig())}
                            style={{ width: 36, height: 32 }}
                          />
                          {index > 0 && (
                            <Button
                              type="text"
                              danger
                              icon={<MinusCircleOutlined style={{ fontSize: 20 }} />}
                              onClick={() => remove(field.name)}
                              style={{ width: 32, height: 32 }}
                            />
                          )}
                        </Space>
                      </div>
                    </Col>
                  </Row>
                ))}
              </>
            )}
          </Form.List>
        )}
      </Form>
    </Drawer>
  )
}
