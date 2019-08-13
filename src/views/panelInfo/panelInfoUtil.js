export function setMediaContent(contentForm, options) {
  const { partner, selectedType, selected, selectedEpisode } = options

  // 清空由app可能引起的遗留数据
  Object.assign(contentForm, {
    vContentId: '',
    blockResourceType: '',
    platformId: '',
    versionCode: ''
  })
  if (selectedType === 'video') {
    // 影视中心
    if (selectedEpisode) {
      const fieldMap = {
        0: 'extraValue5',
        1: 'extraValue5',
        6: 'extraValue4'
      }
      const extraIdField = fieldMap[selectedEpisode.urlIsTrailer] || 'extraValue5'
      contentForm.contentType = 0
      contentForm.videoContentType = 'movie'
      if (partner === 'tencent') {
        contentForm.extraValue1 = '_otx_' + selected.coocaaVId
        contentForm[extraIdField] = selectedEpisode.coocaaMId
      } else if (partner === 'yinhe') {
        contentForm.extraValue1 = '_oqy_' + selected.coocaaVId
        contentForm[extraIdField] = selectedEpisode.coocaaMId
      } else if (partner === 'youku') {
        contentForm.extraValue1 = '_oyk_' + selected.coocaaVId
        contentForm[extraIdField] = selectedEpisode.coocaaMId
      }
      contentForm.singleId = selectedEpisode.coocaaMId
      contentForm.platformId = this.source
      contentForm.pictureUrl = selectedEpisode.thumb
      contentForm.title = selectedEpisode.urlTitle
      contentForm.subTitle = chopSubTitle(selectedEpisode.urlSubTitle)
      contentForm.singleSubTitle = ''
      contentForm.blockResourceType = 1
    } else {
      if (partner === 'tencent') {
        contentForm.extraValue1 = '_otx_' + selected.coocaaVId
      } else if (partner === 'yinhe') {
        contentForm.extraValue1 = '_oqy_' + selected.coocaaVId
      } else if (partner === 'youku') {
        contentForm.extraValue1 = '_oyk_' + selected.coocaaVId
      }
      contentForm.singleId = ''
      contentForm.singleId = ''
      contentForm.contentType = 0
      contentForm.videoContentType = 'movie'
      contentForm.extraValue5 = undefined
      contentForm.platformId = selected.source
      contentForm.pictureUrl = selected.thumb
      contentForm.title = selected.title
      contentForm.subTitle = chopSubTitle(selected.subTitle)
      contentForm.singleSubTitle = ''
      contentForm.blockResourceType = 1
    }

    const entity = selected.ccVideoSourceEntities[0]
    const score = entity.score
    const updatedSegment = entity.updatedSegment
    const publishSegment = entity.publishSegment
    const isUnknown = publishSegment == 0
    const publishStatus = isUnknown
      ? 'unknown'
      : updatedSegment == publishSegment
        ? 'ended'
        : 'updating'
    contentForm.publishStatus = publishStatus
    contentForm.score = score
    contentForm.series = isUnknown ? null : updatedSegment
    contentForm.variety = entity.lastCollection
  } else if (selectedType === 'edu') {
    // 教育中心
    contentForm.contentType = 3
    contentForm.videoContentType = 'edu'
    contentForm.extraValue1 = '_otx_' + selected.coocaaVId
    contentForm.platformId = selected.source
    contentForm.pictureUrl = selected.thumb
    contentForm.title = selected.title
    contentForm.subTitle = chopSubTitle(selected.subTitle)
    contentForm.singleSubTitle = ''
    contentForm.blockResourceType = 1
    const ccVideoSourceEntities = selected.ccVideoSourceEntities
    if (
      ccVideoSourceEntities &&
      ccVideoSourceEntities[0] &&
      ccVideoSourceEntities[0].isTvod === 1
    ) {
      // Sprint2.2 教育中心单点付费预置版本号
      contentForm.versionCode = 3420000
    }
  } else if (selectedType === 'pptv') {
    // pptv
    contentForm.contentType = 4
    contentForm.videoContentType = 'pptv'
    contentForm.extraValue1 =
      'pptv_tvsports://tvsports_detail?section_id=' +
      selected.pid +
      '&from_internal=1'
    contentForm.title = selected.pTitle
    contentForm.subTitle = chopSubTitle(selected.pTitle)
    contentForm.singleSubTitle = ''
    contentForm.blockResourceType = 1
  } else if (selectedType === 'live') {
    // 直播资源
    contentForm.contentType = 6
    contentForm.videoContentType = 'txLive'
    contentForm.extraValue1 = '_otx_' + selected.vId + ''
    contentForm.platformId = selected.source
    contentForm.pictureUrl = selected.thumb
    contentForm.title = selected.title
    contentForm.subTitle = chopSubTitle(selected.subTitle)
    contentForm.singleSubTitle = ''
    contentForm.blockResourceType = 1
  } else if (selectedType === 'topic') {
    // 专题资源
    selected.dataSign === 'parentTopic'
      ? (contentForm.contentType = 8)
      : (contentForm.contentType = 7)
    selected.dataSign === 'parentTopic'
      ? (contentForm.videoContentType = 'bigTopic')
      : (contentForm.videoContentType = 'topic')
    contentForm.extraValue1 = selected.id + ''
    contentForm.pictureUrl = selected.picture
    contentForm.title = selected.title
    contentForm.subTitle = chopSubTitle(selected.subTitle)
    contentForm.singleSubTitle = ''
    contentForm.blockResourceType = 1
  } else if (selectedType === 'rotate') {
    // 轮播资源
    contentForm.extraValue1 = selected.id + ''
    contentForm.pictureUrl = selected.picture
    contentForm.title = selected.title
    contentForm.subTitle = chopSubTitle(selected.subTitle)
    contentForm.singleSubTitle = ''
    contentForm.blockResourceType = 1
    contentForm.videoContentType = 'rotate'
  }
  contentForm.categoryId = selected.categoryId
}

export function setAppContent(contentForm, selected) {
  if (selected) {
    contentForm.contentType = 2
    contentForm.videoContentType = 'app'
    contentForm.extraValue1 = selected.appPackageName
    contentForm.pictureUrl = selected.appImageUrl
    contentForm.title = selected.appName
    contentForm.subTitle = chopSubTitle(selected.appName)
    contentForm.singleSubTitle = ''
    contentForm.blockResourceType = 3
  }
}

export function setGoodContent(contentForm, selected) {
  if (selected) {
    contentForm.contentType = 13
    contentForm.videoContentType = 'mall'
    contentForm.extraValue1 = selected.resourceId
    contentForm.pictureUrl = selected.resourceImgUrl
    contentForm.title = selected.resourceName
    contentForm.subTitle = chopSubTitle(selected.resourceName)
    contentForm.singleSubTitle = ''
    contentForm.blockResourceType = -1
  }
}

export function getSelectedResource(resources) {
  const selectedType = Object.keys(resources).find(key => resources[key] && resources[key].length > 0)
  const selected = resources[selectedType]
  const selectedEpisode = resources.episode || {}
  const partner = resources.videoSource
  return { partner, selectedType, selected, selectedEpisode }
}

export function chopSubTitle(title) {
  return (title || '').slice(0, 50)
}
