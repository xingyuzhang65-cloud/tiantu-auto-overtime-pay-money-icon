export type ChannelLocationType = 'warehouse' | 'postalCode'

export interface ChannelLocationRule {
  channel: string
  channelType: 'normal' | 'special'
  locationType: ChannelLocationType
  locations: string[]
}

export interface LocationTypeRule {
  locationType: ChannelLocationType
  label: string
  locations: string[]
}

const defaultWarehouses = [
  'ONT8','LGB8','LAX9','SBD1','GYR3','PHX7','LAS1','SMF3','OAK3','PDX9',
  'BFI3','SLC3','DEN3','MCI1','STL4','ORD5','MDW6','IND9','CMH3','DTW3',
  'CLE3','BNA3','MEM1','ATL8','MCO2','MIA1','TPA2','CLT2','RDU5','BWI2',
  'PHL4','EWR9','BOS7','DFW6','HOU8','SAT4','ABE8','AVP1','TEB9','PIT5',
  'MGE3','JAX3','SAV3','CHA2','GSP1','BFL1','FAT2','RNO4','BOI2','TUL2',
  'OKC2','ABQ2','ELP1','HSV1','RIC1','ORF2','BHX4','MAN4',
]

export const defaultPostalCodes = [
  '14765','26935','41269','15568','10001','10002','10003','10004','10005','10006',
  '10007','10009','10010','10011','10012','10013','10014','10016','10017','10018',
  '10019','10020','10021','10022','10023','10024','10025','10026','10027','10028',
  '10029','10030','10031','10032','10033','10034','10035','10036','10037','10038',
  '10039','10040','10044','10065','10069','10075','10128','10280','10282','10301',
  '10302','10303','10304','10305','10306','10307','10308','10309','10310','10312',
  '10314','10451','10452','10453','10454','10455','10456','10457','10458','10459',
  '10460','10461','10462','10463','10464','10465','10466','10467','10468','10469',
  '10470','10471','10472','10473','10474','10475','11001','11003','11004','11005',
  '11010','11020','11021','11023','11024','11030','11040','11042','11050','11101',
]

export const locationTypeOptions: Array<{ label: string; value: ChannelLocationType }> = [
  { label: '库点', value: 'warehouse' },
  { label: '邮编', value: 'postalCode' },
]

export const locationTypeRules: LocationTypeRule[] = [
  {
    locationType: 'warehouse',
    label: '库点',
    locations: defaultWarehouses,
  },
  {
    locationType: 'postalCode',
    label: '邮编',
    locations: defaultPostalCodes,
  },
]

export const channelLocationRules: ChannelLocationRule[] = [
  {
    channel: '美国海运',
    channelType: 'normal',
    locationType: 'warehouse',
    locations: ['ONT8', 'LGB8', 'LAX9', 'SBD1'],
  },
  {
    channel: '美国空运',
    channelType: 'special',
    locationType: 'postalCode',
    locations: defaultPostalCodes,
  },
  {
    channel: '英国海运',
    channelType: 'normal',
    locationType: 'warehouse',
    locations: ['BHX4', 'MAN4'],
  },
]

export const validChannels = channelLocationRules.map((rule) => rule.channel)

export const validWarehouses = Array.from(new Set([
  ...defaultWarehouses,
  ...channelLocationRules
    .filter((rule) => rule.locationType === 'warehouse')
    .flatMap((rule) => rule.locations),
]))

export const getChannelLocationRule = (channel?: string): ChannelLocationRule => {
  const rule = channelLocationRules.find((item) => item.channel === channel)

  if (rule) return rule

  return {
    channel: channel || '',
    channelType: channel?.includes('特殊') ? 'special' : 'normal',
    locationType: channel?.includes('特殊') ? 'postalCode' : 'warehouse',
    locations: defaultWarehouses,
  }
}

export const getLocationLabel = (locationType: ChannelLocationType) => (
  locationType === 'postalCode' ? '邮编' : '库点'
)

export const getLocationRuleByType = (locationType?: ChannelLocationType): LocationTypeRule => (
  locationTypeRules.find((rule) => rule.locationType === locationType) || locationTypeRules[0]
)

export const splitLocationValues = (value?: string | string[]) => {
  if (Array.isArray(value)) return value
  if (!value) return []
  return value.split(/[,，]/).map((item) => item.trim()).filter(Boolean)
}

export const isValidPostalCode = (value: string) => /^[0-9A-Za-z][0-9A-Za-z -]{2,11}$/.test(value)

export const getLocationTypeByLabel = (label: string): ChannelLocationType | undefined => (
  locationTypeOptions.find((option) => option.label === label || option.value === label)?.value
)

export const getInvalidLocationValues = (locationType: ChannelLocationType, values: string[]) => {
  const rule = getLocationRuleByType(locationType)

  if (rule.locationType === 'postalCode') {
    return values.filter((value) => !isValidPostalCode(value) || !rule.locations.includes(value))
  }

  return values.filter((value) => !rule.locations.includes(value))
}
