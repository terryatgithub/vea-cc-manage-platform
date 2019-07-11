function optionsToText(options) {
  return options.reduce((result, { label, value }) => {
    result[value] = label
    return result
  }, {})
}

function optionsToEnums(options) {
  return options.reduce((result, item) => {
    result[item.label] = item.value
    return result
  }, {})
}

const status = {
  offShelves: 0,
  onShelves: 1,
  draft: 2,
  waiting: 3,
  accepted: 4,
  rejected: 5,
  auditing: 6,
  processing: 7,
  waiting2: 9
}
const statusText = {
  0: '下架',
  1: '上架',
  2: '草稿',
  3: '待审核',
  4: '审核通过',
  5: '审核不通过',
  6: '审核中',
  7: '审核通过未上线',
  9: '待二次审核'
}

const statusOptions = Object.keys(statusText).reduceRight((result, key) => {
  if (key < 6) {
    result.push({
      label: statusText[key],
      value: key
    })
  }
  return result
}, [])

const statusEnums = Object.keys(statusText).reduceRight((result, key) => {
  if (key < 6) {
    result[statusText[key]] = key
  }
  return result
}, {})

const sourceOptions = [
  {
    label: '腾讯',
    value: 'o_tencent'
  },
  {
    label: '爱奇艺',
    value: 'o_iqiyi'
  },
  {
    label: '优酷',
    value: 'o_youku'
  }
]
const sourceEnums = optionsToEnums(sourceOptions)
const sourceOptionsWithEmpty = [
  {
    label: '无',
    value: ''
  }
].concat(sourceOptions)
const sourceOptionsWithNone = [
  {
    label: '无',
    value: 'none'
  }
].concat(sourceOptions)
const sourceOptionsWithNoneEnums = optionsToEnums(sourceOptionsWithNone)
const sourceToPartner = {
  'o_tencent': 'tencent',
  'o_iqiyi': 'yinhe',
  'o_youku': 'youku'
}

const sourceText = {
  o_tencent: '腾讯',
  o_iqiyi: '爱奇艺',
  o_youku: '优酷'
}
const sourceTextWithNone = {
  none: '无',
  o_tencent: '腾讯',
  o_iqiyi: '爱奇艺',
  o_youku: '优酷'
}
const sourceNumberOptions = [
  {
    label: '无',
    value: 0
  },
  {
    label: '腾讯',
    value: 1
  },
  {
    label: '爱奇艺',
    value: 2
  },
  {
    label: '优酷',
    value: 3
  }
]

const sourceNumberText = optionsToText(sourceNumberOptions)
const sourceNumberEnums = optionsToEnums(sourceNumberOptions)

const partnerOptions = [
  {
    label: '腾讯',
    value: 'tencent'
  },
  {
    label: '爱奇艺',
    value: 'yinhe'
  },
  {
    label: '优酷',
    value: 'youku'
  }
]

const partnerText = optionsToText(partnerOptions)
const partnerEnums = optionsToEnums(partnerOptions)

const panelTypeOptions = [
  {
    label: '普通版块',
    value: 'normal'
  },
  {
    label: '分组版块',
    value: 'group'
  }
]
const panelTypeText = optionsToText(panelTypeOptions)

const panelFocusOptions = [
  {
    label: '面落焦',
    value: 1
  },
  {
    label: '线落焦',
    value: 0
  }
]

const panelFocusText = optionsToText(panelFocusOptions)

const cornerIconPositionOptions = [
  {
    label: '左上',
    value: 0
  },
  {
    label: '右上',
    value: 1
  },
  {
    label: '右下',
    value: 2
  },
  {
    label: '左下',
    value: 3
  }
]

const cornerIconPositionEnums = optionsToEnums(cornerIconPositionOptions)
const cornerIconPositionText = optionsToText(cornerIconPositionOptions)

const topicTypesOptions = [
  {
    label: '标记话题',
    value: 1
  },
  {
    label: '普通话题',
    value: 2
  }
]
const topicTypesText = optionsToText(topicTypesOptions)
const topicTypesEnum = optionsToEnums(topicTypesOptions)

const idPrefix = '10'
const idPrefixOptions = [
  {
    label: '酷开',
    value: '10'
  },
  {
    label: '江苏有线',
    value: '11'
  }
]
const idPrefixEnums = optionsToEnums(idPrefixOptions)

export default {
  status,
  statusText,
  statusOptions,
  statusEnums,

  sourceOptions,
  sourceEnums,
  sourceOptionsWithNoneEnums,
  sourceOptionsWithEmpty,
  sourceOptionsWithNone,
  sourceToPartner,
  sourceText,
  sourceTextWithNone,

  sourceNumberOptions,
  sourceNumberText,
  sourceNumberEnums,

  partnerOptions,
  partnerText,
  partnerEnums,

  panelFocusOptions,
  panelFocusText,
  panelTypeOptions,
  panelTypeText,

  cornerIconPositionOptions,
  cornerIconPositionEnums,
  cornerIconPositionText,

  topicTypesOptions,
  topicTypesText,
  topicTypesEnum,

  idPrefix,
  idPrefixOptions,
  idPrefixEnums,

  optionsToEnums,
  optionsToText
}
