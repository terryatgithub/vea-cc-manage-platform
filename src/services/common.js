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

export function getAppIdType(data) {
  return this.fetch({
    method: 'post',
    url: 'api/globalDictInfo/getTypes/appIdType.html',
    data
  })
}

// 获取业务分类
export function getBusinessType (data) {
  return this.fetch({
    method: 'post',
    url: 'api/globalDictInfo/getTypes/businessType.html',
    data
  })
}

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

export function putOnShelves (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/audit/putShelves.html',
    data
  })
}

const deleteUrlMap = {
  homepage: 'api/homepageInfo/delHistory.html'
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


