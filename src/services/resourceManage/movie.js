// 资源管理——影片资源
export function getMovieList (params) {
  return this.fetch({
    methods: 'get',
    url: '/api/tvos/getMediaVideoInfos.html',
    params
  })
}

//影片内容源获取
export function getSources() {
  return this.fetch({
    methods: '/api/tvos/getPartnerSource.html',
    data
  })
}
export function getList(data) {
  return this.fetch({
    methods: 'post',
    url: '/api/tvos/getCondition.html',
    data
  })
}