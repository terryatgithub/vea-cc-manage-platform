// 资源管理——影片资源
export function getMediaVideoInfos(params) {
  return this.fetch({
    methods: 'get',
    url: '/api/tvos/getMediaVideoInfos.html',
    params
  }).then(data => {
    return JSON.parse(data.substring(7, data.length - 1))
  })
}

// 影片内容源获取
export function getPartnerSource(params) {
  return this.fetch({
    methods: 'get',
    url: '/api/tvos/getPartnerSource.html',
    params
  })
}
// 频道类型
export function getCondition() {
  return this.fetch({
    methods: 'get',
    url: '/api/tvos/getCondition.html'
  }).then(data => {
    return JSON.parse(data.replace('result(', '').replace(/\)*$/, ''))
  })

}
// 影片单集资源
export function getSegmentList(params) {
  return this.fetch({
    methods: 'get',
    url: '/api/tvos/getSegmentList.html',
    params
  }).then(data => {
    return JSON.parse(data.replace('result(', '').replace(/\)*$/, ''))
  })
}
