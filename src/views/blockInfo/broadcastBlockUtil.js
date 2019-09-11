import { cloneDeep } from 'lodash'
export function getSelectedResource(resources) {
  const selectType = Object.keys(resources).find(key => resources[key].length > 0)
  return getSelectedResourceByType(resources, selectType)
}
export function getSelectedResourceByType(resources, selectedType) {
  const selected = resources[selectedType]
  const selectedEpisode = resources.episode || {}
  const partner = resources.videoSource
  selected.forEach((item) => {
    const episode = selectedEpisode[item.coocaaVId]
    if (episode) {
      item.selectedEpisode = episode
    }
  })
  return { partner, selectedType, selected }
}

export function setContentForm(contentForm, options) {
  contentForm.type = options.type
  contentForm.coverType = options.coverType
  contentForm.subchannelIs = options.contentType === 'rotate'
  contentForm.smallTopicsIs = options.contentType === 'bigTopic'
  contentForm.title = options.title
  contentForm.contentType = options.contentType
  contentForm.subTitle = options.subTitle
  contentForm.thirdIdOrPackageName = options.thirdIdOrPackageName
  if (options.pictureUrl) {
    const poster = cloneDeep(contentForm.poster)
    poster.pictureUrl = options.pictureUrl
    contentForm.poster = poster
  } else {
    contentForm.poster = { pictureUrl: '' }
  }
  const params = getParams(options)
  contentForm.params = params
  if (contentForm.sign === 'autoSet') {
    contentForm.clickParams = cloneDeep(params)
    contentForm.clickTemplateType = options.contentType
  }
}
export function getParams (selected) {
  let param
  // 封装保存的id
  if (selected.contentType === 'movie') {
    param = {
      id: selected.thirdIdOrPackageName
    }
    if (selected.vid) {
      param.vid = selected.vid
    }
    if (selected.sid) {
      param.sid = selected.sid
    }
  } else if (
    selected.contentType === 'app' ||
    selected.contentType === 'edu' ||
    selected.contentType === 'txLive'
  ) {
    param = {
      id: selected.thirdIdOrPackageName
    }
  } else if (selected.contentType === 'bigTopic') {
    param = {
      pTopicCode: selected.thirdIdOrPackageName
    }
  } else if (selected.contentType === 'topic') {
    // this.smallTopics = true;
    param = {
      topicCode: selected.thirdIdOrPackageName
    }
  } else if (selected.contentType === 'rotate') {
    param = {
      rotateId: selected.thirdIdOrPackageName
    }
  }
  return param
}

export function parseResourceContent(tabName, selected, sourceType) {
  let s = {
    type: '', // 面向客户端
    contentType: '', // 面向管理后台
    thirdIdOrPackageName: ''
  }
  const prefixMap = {
    tencent: '_otx_',
    o_tencent: '_otx_',
    yinhe: '_oqy_',
    o_iqiyi: '_oqy_',
    youku: '_oyk_'
  }
  switch (tabName) {
    case 'video': {
      const selectedEpisode = selected.selectedEpisode
      const prefix = (prefixMap[sourceType] || '')
      if (selectedEpisode) {
        if (selectedEpisode.urlIsTrailer === 6 && selectedEpisode.thirdVId) {
          // 如果是短视频, 并且 thirdVId 存在
          s.thirdIdOrPackageName = prefix + selectedEpisode.thirdVId
          s.sid = selectedEpisode.coocaaMId
        } else {
          s.thirdIdOrPackageName = prefix + selected.coocaaVId
          s.vid = selectedEpisode.coocaaMId
        }
        s.pictureUrl = selectedEpisode.thumb
        s.title = selectedEpisode.urlTitle
        s.subTitle = selectedEpisode.urlSubTitle
      } else {
        s.thirdIdOrPackageName = prefix + selected.coocaaVId
        s.pictureUrl = selected.thumb
        s.title = selected.title
        s.subTitle = selected.subTitle
      }
      s.contentType = 'movie'
      s.type = 'res'
      s.coverType = 'media'
      break
    }
    case 'app': {
      s.contentType = 'app'
      s.thirdIdOrPackageName = selected.appPackageName
      s.pictureUrl = selected.appImageUrl
      s.title = selected.appName
      s.type = 'app'
      s.coverType = 'app'
      break
    }
    case 'edu': {
      s.contentType = 'edu'
      s.coverType = 'media'
      s.thirdIdOrPackageName = '_otx_' + selected.coocaaVId
      s.platformId = selected.source
      s.pictureUrl = selected.thumb
      s.title = selected.title
      s.subTitle = selected.subTitle
      s.type = 'res'
      break
    }
    case 'pptv': {
      s.contentType = 'pptv'
      s.coverType = 'media'
      s.thirdIdOrPackageName =
        'pptv_tvsports://tvsports_detail?section_id=' +
        selected.pid +
        '&from_internal=1'
      s.title = selected.pTitle
      s.type = ''
      break
    }
    case 'live': {
      s.contentType = 'txLive'
      s.coverType = 'media'
      s.thirdIdOrPackageName = '_otx_' + selected.vId + ''
      s.platformId = selected.source
      s.pictureUrl = selected.thumb
      s.title = selected.title
      s.subTitle = selected.subTitle
      s.type = 'live'
      break
    }
    case 'topic': {
      selected.dataSign === 'parentTopic'
        ? (s.contentType = 'bigTopic')
        : (s.contentType = 'topic')
      s.thirdIdOrPackageName = selected.id + ''
      s.pictureUrl = selected.picture
      s.title = selected.title
      s.subTitle = selected.subTitle
      s.type = 'topic'
      s.coverType = 'media'
      break
    }
    case 'rotate': {
      s.contentType = 'rotate'
      s.coverType = 'media'
      s.thirdIdOrPackageName = selected.id + ''
      s.pictureUrl = selected.picture
      s.title = selected.title
      s.subTitle = selected.subTitle
      s.type = 'rotate'
      break
    }
    default:
      break
  }
  return s
}
