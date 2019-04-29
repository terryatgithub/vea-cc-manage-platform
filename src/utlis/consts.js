const status = {
  offShelves: 0,
  onShelves: 1,
  draft: 2,
  waiting: 3,
  accepted: 4,
  reject: 5,
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

const statusOptions = Object.keys(statusText).map((k) => {
  return {
    label: statusText[k],
    value: k
  }
})

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

const sourceOptionsWithEmpty = [
  {
    label: '无',
    value: ''
  }
].concat(sourceOptions)

const sourceText = {
  o_tencent: '腾讯',
  o_iqiyi: '爱奇艺',
  o_youku: '优酷'
}
const idPrefix = '10'
export default {
  status,
  statusText,
  statusOptions,
  sourceOptions,
  sourceOptionsWithEmpty,
  sourceText,
  idPrefix
}
