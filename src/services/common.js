import consts from '../utlis/consts'
export function getVersionList(params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/hvi/historyList.html',
    params
  }).then((data) => {
    const rows = data.rows || []
    return rows.map((item) => {
      const { version, lastUpdateDate, modifierName, status } = item
      return {
        row: item,
        value: item.version,
        label: `${version}/${lastUpdateDate}/${modifierName}/${consts.statusText[status]}`
      }
    })
  })
}

// // 获取业务分类
// export function getBusinessType (data) {
//   return this.fetch({
//     method: 'post',
//     url: 'api/globalDictInfo/getTypes/businessType.html',
//     data
//   })
// }

export function revokeAudit (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/audit/revokedAudit.html',
    data: data
  })
}

export function getTimedTaskLimit() {
  return this.fetch({
    url: 'api/v1/timedTask/taskLimit.html'
  })
}

export function getTimedTaskInfo(params) {
  return this.fetch({
    url: 'api/v1/timedTask/getTimedInfo.html',
    params
  })
}

export function timedTaskCancel(params) {
  return this.fetch({
    url: 'api/v1/timedTask/cancelTimedTask.html',
    params
  })
}

export function putOnShelves (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/audit/putShelves.html',
    data
  })
}

const deleteUrlMap = {
  homepage: 'api/v1/homepage/delHistory.html',
  pannel: 'api/v1/panel/delHistory.html',
  tab: 'api/v1/tab/delHistory.html',
  theme: 'api/v1/theme/delHistory.html', // 所有版块
  policy: 'api/v1/policyConf/delHistory.html',
  testPolicy: 'api/v1/testPolicyConf/delHistory.html',
  systemPlugin: '', // 系统功能-所有系统功能
  icon: '',
  material: '', // 素材图片
  layout: '', // 布局
  block: ''  // 轮播推荐位
}
export function deleteVersion (data) {
  return this.fetch({
    url: deleteUrlMap[data.type],
    params: {
      id: data.id,
      version: data.version
    }
  })
}
export function getAuditHistoryList (params) {
  return this.fetch({
    url: 'api/v1/audit/historyList.html',
    params
  })
}

export function getDictType(data) {
  return this.fetch({
    method: 'post',
    //  url: 'api/dict/businessType.html',
    url: 'api/v1/dict/getTypes/' + data.type + '.html',
    data: data.data
  })
}
