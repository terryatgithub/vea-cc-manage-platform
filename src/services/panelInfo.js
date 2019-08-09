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

export function collectCancel(data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/collect/' + data.type + '/cancel.html',
    data: data.data
  })
}
export function collect(data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/collect/' + data.type + '/collect.html',
    data: data.data
  })
}

export function getSharedTags(params) {
  return this.fetch({
    method: 'get',
    url: 'api/tvos/getMediaCommonTags.html',
    params
  })
}

export function panelTagUpsert(data) {
  return this.fetch({
    method: 'post',
    url: 'api/tvos/updateTagWeight.html',
    data
  })
}

export function panelRecommendList(data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/panelRecommend/dataList.html',
    data
  })
}

export function panelRecommendGetDetail(params) {
  return this.fetch({
    url: 'api/v1/panelRecommend/getDetailInfo.html',
    params
  })
}

export function panelRecommendUpsert(data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/panelRecommend/save.html',
    data: { jsonStr: JSON.stringify(data) }
  })
}

export function panelRecommendFlagUpsert(data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/panelRecommend/switchRecommend.html',
    data: { jsonStr: JSON.stringify(data) }
  })
}
