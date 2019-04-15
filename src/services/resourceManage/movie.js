// 资源管理——影片资源
export function getMediaVideoInfos(params) {
  return this.fetch({
    methods: 'get',
    url: 'api/tvos/getMediaVideoInfos.html',
    params
  }).then(data => {
    debugger
    if (typeof (data) === 'string') {
      return JSON.parse(data.replace('result(', '').replace(/\)*$/, ''))
    } else {
      return data
    }
  })
}

// 影片内容源获取
export function getPartnerSource(params) {
  return this.fetch({
    methods: 'get',
    url: 'api/tvos/getPartnerSource.html',
    params
  })
}
// 频道类型
export function getCondition() {
  return this.fetch({
    methods: 'get',
    url: 'api/tvos/getCondition.html'
  }).then(data => {
    if (typeof (data) === 'string') {
      return JSON.parse(data.replace('result(', '').replace(/\)*$/, ''))
    } else {
      return data
    }
  })

}
// 影片单集资源
export function getSegmentList(data) {
  return this.fetch({
    methods: 'POST',
    url: 'api/tvos/getSegmentList.html',
    data
  }).then(data => {
    if (typeof (data) === 'string') {
      return JSON.parse(data.replace('result(', '').replace(/\)*$/, ''))
    } else {
      return data
    }
  })
}

export function getAppManagementList(params) {
  return this.fetch({
    methods: 'get',
    url: 'api/appManagement/pageList.html',
    params
  })
  // .then(data => {
  //   return JSON.parse(data.replace('result(', '').replace(/\)*$/, ''))
  // })
}
