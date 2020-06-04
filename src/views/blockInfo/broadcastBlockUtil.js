import { cloneDeep } from 'lodash'
export function getSelectedResource (resources) {
  const selectType = Object.keys(resources).find(key => resources[key].length > 0)
  return getSelectedResourceByType(resources, selectType)
}
export function getSelectedResourceByType (resources, selectedType) {
  const selected = resources[selectedType]
  const selectedEpisode = resources.episode || {}
  selected.forEach((item) => {
    const episode = selectedEpisode[item.coocaaVId]
    if (episode) {
      item.selectedEpisode = episode
    }
  })
  return { selectedType, selected }
}

export function setContentForm (contentForm, options) {
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

export function parseResourceContent (tabName, selected) {
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
  const partner = selected._partner
  switch (tabName) {
    case 'video': {
      const selectedEpisode = selected.selectedEpisodes
      const prefix = (prefixMap[partner] || '')
      if (selectedEpisode) {
        if (selectedEpisode.urlIsTrailer === 6 && selectedEpisode.thirdVId) {
          // 如果是短视频, 并且 thirdVId 存在
          s.thirdIdOrPackageName = prefix + selectedEpisode.thirdVId
          s.sid = selectedEpisode.coocaaMId
        } else {
          s.thirdIdOrPackageName = prefix + selected.coocaaVId
          s.vid = selectedEpisode.coocaaMId
        }
        // 集数
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

export const VIP_QRCODE_DEFAULT_PARAMS = [
  {
    label: '影片ID',
    key: 'movie_id',
    value: undefined,
    tip: '影片ID，类似：_oqy_84lrco980400，即内容源前缀加酷开ID',
    default: true
  },
  {
    label: '影片名称',
    key: 'movie_name',
    value: undefined,
    tip: '即影片名称',
    default: true
  },
  {
    label: '付费类型',
    key: 'movie_type',
    value: 0,
    valueType: 'number',
    // type: 'radio',
    // valueOptions: [{ label: '免费', value: 0 }, { label: '单点', value: 2 }, { label: '会员', value: 1 }],
    tip: '付费类型，免费0、单点2、会员1',
    default: true
  },
  {
    label: '权益类型',
    key: 'source_sign',
    value: 'yinhe',
    // type: 'radio',
    // valueOptions: [{ label: '奇异果VIP', value: 'yinhe' }, { label: '腾讯超级影视', value: '6' }],
    tip: '权益类型，即产品包后台的权益标识。奇异果VIP是yinhe，腾讯超级影视是6',
    default: true
  },
  {
    label: '业务类型',
    key: 'business_type',
    value: 0,
    // type: 'radio',
    // valueOptions: [{ label: '影视', value: 0 }, { label: '教育', value: 1 }],
    tip: '业务类型，影视=0，教育=1',
    default: true
  },
  {
    label: '轮播或者点播',
    key: 'live_or_online',
    value: 'online',
    hide: true
  },
  {
    label: '影片类型',
    key: 'node_type',
    value: 'res',
    hide: true
  },
  {
    label: '鉴权方式',
    key: 'auth_type',
    value: '0',
    hide: true
  }]
