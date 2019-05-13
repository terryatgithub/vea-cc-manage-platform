/**
 * 版块管理 -> 常规运营
 */
export function panelPageList(data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/panel/pageList.html',
    data
  })
}

export function panelDataList(data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/panel/dataList.html',
    data
  })
}

export function panelGetDetail(params) {
  return this.fetch({
    url: 'api/v1/panel/getDetailInfo.html',
    params
  })
}

export function panelUpsert(data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/panel/save.html',
    data: { jsonStr: JSON.stringify(data) }
  })
}
export function panelRemove(data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/panel/remove.html',
    data
  })
}
