import consts from '../utils/consts'
export function getVersionList (params = {}) {
  params.rows = params.rows || 100
  return this.fetch({
    method: 'get',
    url: 'api/v1/hvi/historyList.html',
    params
  }).then((data) => {
    const rows = data.rows || []
    return rows.map((item) => {
      const { version, createdDate, launchDate, modifierName, status } = item
      const createdDateFormat = typeof (createdDate) === 'string' ? '创建：' + createdDate.slice(createdDate.indexOf('-') + 1) : '创建：'
      const onlineTime = typeof (launchDate) === 'string' ? '上线：' + launchDate.slice(launchDate.indexOf('-') + 1) : '未上线'
      return {
        row: item,
        value: item.version,
        label: `${version}/${createdDateFormat}/${onlineTime}/${modifierName}/${consts.statusText[status]}`
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

export function secondAudit (data) {
  return this.fetch({
    method: 'post',
    url: 'api/secondAudit/audit.html',
    data
  })
}

export function getTimedTaskLimit () {
  return this.fetch({
    url: 'api/v1/timedTask/taskLimit.html'
  })
}

export function getTimedTaskInfo (params) {
  return this.fetch({
    url: 'api/v1/timedTask/getTimedInfo.html',
    params
  })
}

export function timedTaskCancel (params) {
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
  childPolicy: 'api/v1/childPolicyConf/delHistory.html',
  material: '', // 素材图片
  layout: '', // 布局
  block: 'api/v1/blockInfo/delHistory.html', // 轮播推荐位
  systemPlugin: 'api/v1/sysPlugin/delHistory.html', // 系统插件
  topic: 'api/v1/topic/delHistory.html',
  topicConfig: 'api/v1/topicConfig/delHistory.html',
  mediaAutomation: 'api/v1/mediaAutomation/delHistory.html',
  icon: 'api/v1/cornerIcon/remove.html',
  policyGroup: 'api/v1/policyGroup/delHistory.html'
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

const RESOURCE_DELETE_URL_MAP = {
  homepage: 'api/v1/homepage/remove.html',
  markPanel: 'api/v1/panel/remove.html',
  multiFunctionBlock: 'api/v1/sysPlugin/remove.html',
  sysPlugin: 'api/v1/sysPlugin/remove.html',
  crowdRel: 'api/v1/dmpMgr/remove.html',
  topic: 'api/v1/topic/remove.html',
  topicConfig: 'api/v1/topicConfig/remove.html',
  mediaAutomation: '/v1/mediaAutomation/remove.html',
  icon: 'api/v1/cornerIcon/remove.html',
  policyGroup: 'api/v1/policyGroup/remove.html'
}

export function deleteResource (data) {
  return this.fetch({
    url: RESOURCE_DELETE_URL_MAP[data.type],
    params: {
      id: data.id
    }
  })
}

export function getAuditHistoryList (params) {
  return this.fetch({
    url: 'api/v1/audit/historyList.html',
    params
  })
}

const DICT_TYPE_CACHE = {}
export function getDictType ({ type, isFilter }) {
  const key = isFilter ? `${type}_filtered` : type
  const cache = DICT_TYPE_CACHE[key]
  if (cache) {
    return Promise.resolve(cache)
  } else {
    return this.fetch({
      method: 'post',
      url: 'api/v1/dict/getTypes/' + type + '.html',
      data: { isFilter }
    }).then(data => {
      DICT_TYPE_CACHE[key] = data
      return data
    })
  }
}

export function getEnv () {
  return this.fetch({
    method: 'get',
    url: 'api/v1/getEnvironment.html'
  })
}

export function getRecommendStrategy () {
  return this.fetch({
    url: 'api/dict/recommendStrategy.html'
  })
}
