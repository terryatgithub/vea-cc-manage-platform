// 资源管理——影片资源
export function getMediaVideoInfos (params) {
  const tagCodes = params.tagCodes || []
  let tagCodeParam
  if (tagCodes.length > 0) {
    delete params.tagCodes
    tagCodeParam = tagCodes.map(item => `tagCodes=${item}`).join('&')
  }

  // 如果是获取排行榜
  if (params.dataType === 'coocaaRanking') {
    // 对业务类型进行映射
    const businessType = params.businessType
    const businessTypeMap = {
      60: 1,
      61: 2,
      32: 3
    }
    if ([60, 61, 32].includes(businessType)) {
      params.businessType = businessTypeMap[businessType]
    }

    // 教育的，既要传 业务类型，又要传 渠道
    // 其他的，只需要传渠道
    if (params.businessType === 1) {
      // 如果业务类型是 教育, 固定渠道为 腾讯
      params.partner = 'tencent'
    } else {
      // 否则, 不需要传业务类型
      delete params.businessType
    }
  }
  return this.fetch({
    methods: 'get',
    url: `api/tvos/getMediaVideoInfos.html${tagCodeParam ? ('?' + tagCodeParam) : ''}`,
    params
  }).then(data => {
    if (typeof (data) === 'string') {
      return JSON.parse(data.replace('result(', '').replace(/\)*$/, ''))
    } else {
      return data
    }
  })
}

// 影片内容源获取
export function getPartnerSource (params) {
  return this.fetch({
    methods: 'get',
    url: 'api/tvos/getPartnerSource.html',
    params
  })
}
// 频道类型
export function getCondition () {
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
export function getSegmentList (params) {
  return this.fetch({
    methods: 'get',
    url: 'api/tvos/getSegmentList.html',
    params
  }).then(data => {
    if (typeof (data) === 'string') {
      return JSON.parse(data.replace('result(', '').replace(/\)*$/, ''))
    } else {
      return data
    }
  })
}

export function getAppManagementList (params) {
  return this.fetch({
    methods: 'get',
    url: 'api/v1/appManagement/pageList.html',
    params
  })
  // .then(data => {
  //   return JSON.parse(data.replace('result(', '').replace(/\)*$/, ''))
  // })
}
