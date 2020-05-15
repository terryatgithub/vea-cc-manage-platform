export const MASK_LIFE_TYPE_OPTIONS = [
  {
    label: '跳转到视频列表页',
    value: 'video'
  },
  {
    label: '拉起到作者主页',
    value: 'authorMain'
  },
  {
    label: '拉起到作者分类页',
    value: 'authorCategory'
  },
  {
    label: '正常启动',
    value: 'launch'
  }
]
export const MASK_LIFE_TYPES = {
  video: 'video',
  authorMain: 'authorMain',
  authorCategory: 'authorCategory',
  launch: 'launch'
}
export const MASK_LIFE_RECOMMEND_TYPE_OPTIONS = [
  {
    label: '随心看视频流',
    value: 'recommend'
  },
  {
    label: '知识视频流',
    value: 'category'
  },
  {
    label: '作者视频流',
    value: 'author'
  }
]

export const MASK_LIFE_RECOMMEND_TYPES = {
  recommend: 'recommend',
  category: 'category',
  author: 'author'
}

export const GD_LIVE_CLICK_TYPE_OPTIONS = [
  {
    label: '启动到频道',
    value: 'channel'
  },
  {
    label: '正常启动',
    value: 'normal'
  }
]

export const GD_LIVE_CLICK_TYPES = {
  channel: 'channel',
  normal: 'normal'
}

export function getVideoInfo (video) {
  let { category = '', categoryName = '', filterValue = '' } = video
  category = category.split(',')
  categoryName = categoryName.split(',')
  filterValue = filterValue.split(',')
  const categoryOptions = category.map((value, index) => {
    return {
      label: categoryName[index],
      filterValue: filterValue[index],
      value
    }
  })
  return {
    categoryOptions,
    authorId: video.userId,
    authorName: video.userName
  }
}

export function getMatchedPictureUrlByRotation (blockSize, imgList) {
  let targetImg = imgList[0] || {}
  if (imgList.length > 1) {
    const [w, h] = blockSize
    const rotation = w > h ? 'h' : 'v'
    targetImg = imgList.find(item => item.style === rotation) || targetImg
  }
  return targetImg.url
}

export function getMatchedPictureUrl (blockSize, imgList) {
  let maxMatchingValue = -99999
  let url
  if (blockSize && imgList) {
    imgList.forEach(item => {
      const matchingValue = getMatchingValue(blockSize, item.size.split(/[*|x]/))
      if (matchingValue > maxMatchingValue) {
        maxMatchingValue = matchingValue
        url = item.url
      }
    })
  }
  return url
}

function getMatchingValue (blockSize, imgSize) {
  const [w, h] = blockSize
  const [imgW, imgH] = imgSize

  const ratio = w / h
  const imgRatio = imgW / imgH
  const isSameOrient = (w >= h && imgW >= imgH) || (w <= h && imgW <= imgH)
  const baseMatchingValue = isSameOrient ? 100 : 0
  const ratioMatchingValue = 70 - 45 * Math.abs(ratio - imgRatio)

  let scale
  if (ratio > imgRatio) {
    scale = w > imgW ? w / imgW : imgW / w
  } else {
    scale = h > imgH ? h / imgH : imgH / h
  }
  const sizeMatchingValue = Math.max(38 - 8 * scale, 0)

  return baseMatchingValue + ratioMatchingValue + sizeMatchingValue
}

export function setMediaContent (contentForm, options) {
  const {
    selectedType,
    selected,
    selectedEpisode,
    blockSize
  } = options
  const partner = selected._partner

  const getPictureUrl = function () {
    return getMatchedPictureUrl.apply(null, arguments)
  }

  // 清空由app可能引起的遗留数据
  Object.assign(contentForm, {
    coverType: 'media',
    vContentId: '',
    blockResourceType: '',
    platformId: '',
    versionCode: '',
    extraValue1: '',
    extraValue4: '',
    extraValue5: ''
  })
  if (selectedType === 'video') {
    // 影视中心
    if (selectedEpisode) {
      const fieldMap = {
        0: 'extraValue5',
        1: 'extraValue5',
        6: 'extraValue4'
      }
      const prefixMap = {
        tencent: '_otx_',
        yinhe: '_oqy_',
        youku: '_oyk_'
      }
      const extraIdField =
        fieldMap[selectedEpisode.urlIsTrailer] || 'extraValue5'
      const prefix = prefixMap[partner]
      contentForm.contentType = 0
      contentForm.videoContentType = 'movie'
      if (selectedEpisode.urlIsTrailer === 6 && selectedEpisode.thirdVId) {
        // 如果是短视频, 并且 thirdVId 存在
        contentForm.extraValue1 = prefix + selectedEpisode.thirdVId
      } else {
        contentForm.extraValue1 = prefix + selected.coocaaVId
      }
      const { thirdVuId = '' } = selectedEpisode
      const isBilibili = thirdVuId.indexOf('bili') === 0
      if (isBilibili) {
        contentForm[extraIdField] = thirdVuId
      } else {
        contentForm[extraIdField] = selectedEpisode.coocaaMId
      }
      contentForm.singleId = selectedEpisode.coocaaMId
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
      contentForm.contentType = 0
      contentForm.videoContentType = 'movie'
      contentForm.extraValue5 = undefined
      contentForm.platformId = selected.source
      contentForm.pictureUrl = getPictureUrl(blockSize, selected.imageInfoList) || selected.thumb
      contentForm.picturePreset = selected.imageInfoList
      contentForm.title = selected.title
      contentForm.subTitle = chopSubTitle(selected.subTitle)
      contentForm.singleSubTitle = ''
      contentForm.blockResourceType = 1
    }

    const entity = selected.ccVideoSourceEntities[0]
    const score = entity.score
    const updatedSegment = entity.updatedSegment
    const publishSegment = entity.publishSegment
    // eslint-disable-next-line
    const isUnknown = publishSegment == 0
    const publishStatus = isUnknown
      ? 'unknown'
      : updatedSegment === publishSegment
        ? 'ended'
        : 'updating'
    contentForm.publishStatus = publishStatus
    contentForm.score = score
    contentForm.series = isUnknown ? null : updatedSegment
    contentForm.variety = entity.lastCollection
  } else if (selectedType === 'edu') {
    // 教育中心
    contentForm.contentType = 3
    const videoContentTypeMap = {
      // 绘本
      2: 'eduPicBook',
      // 故事
      3: 'eduListenStory'
    }
    contentForm.videoContentType = videoContentTypeMap[selected.contentForm] || 'edu'
    contentForm.extraValue1 = '_otx_' + selected.coocaaVId
    contentForm.platformId = selected.source
    contentForm.pictureUrl = getPictureUrl(blockSize, selected.imageInfoList) || selected.thumb
    contentForm.picturePreset = selected.imageInfoList
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
    contentForm.extraValue1 = '_otx_' + selected.vId + '' // 直播资源给到客户端前缀otx会被去掉
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
    contentForm.extraValue1 = selected.code + ''
    contentForm.pictureUrl = getPictureUrl(blockSize, selected.imageInfoList) || selected.picture
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

export function setAppContent (contentForm, selected) {
  if (selected) {
    contentForm.coverType = 'app'
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

export function setGoodContent (contentForm, selected) {
  if (selected) {
    contentForm.coverType = 'mall'
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

export function setRankingContent (contentForm, selected) {
  if (selected) {
    contentForm.coverType = 'media'
    contentForm.contentType = 0
    contentForm.videoContentType = 'movie'
    contentForm.extraValue1 = selected.id
    contentForm.pictureUrl = selected.images
    contentForm.title = selected.title
    contentForm.subTitle = chopSubTitle(selected.title)
    contentForm.singleSubTitle = ''
    contentForm.blockResourceType = -1
  }
}

export function setSubscribeContent (contentForm, options) {
  const {
    selected
  } = options
  const partner = selected._partner
  const prefixMap = {
    tencent: '_otx_',
    yinhe: '_oqy_',
    youku: '_oyk_'
  }
  if (selected) {
    contentForm.coverType = 'media'
    contentForm.contentType = 0
    contentForm.videoContentType = 'movie'
    contentForm.extraValue1 = prefixMap[partner] + selected.trailerId
    contentForm.pictureUrl = selected.picture
    contentForm.title = selected.trailerTitle
    contentForm.thirdSource = selected.thirdSource
    contentForm.subTitle = selected.positiveTitle
    contentForm.singleSubTitle = ''
    contentForm.blockResourceType = -1
    contentForm.subscribeOnlineTime = selected.onlineTime || ''
  }
}

export function getSelectedResource (resources, selectedType) {
  const selectType = Object.keys(resources).find(
    key => resources[key].length > 0
  )
  return getSelectedResourceByType(resources, selectType)
}
export function getSelectedResourceByType (resources, selectedType) {
  const selected = resources[selectedType]
  const selectedEpisode = resources.episode || {}
  return { selectedType, selected, selectedEpisode }
}

export function chopSubTitle (title) {
  return (title || '').slice(0, 45)
}

export function getIdByCoverType (coverType, content) {
  switch (coverType) {
    case 'media':
      return content.extraValue1
    case 'block':
      return content.vContentId
    case 'mall':
      return content.extraValue1
  }
}

export function genDefaultContentForm (preset) {
  preset = preset || {}

  const initMaskLifeInfo = preset.maskLifeInfo
  delete preset.maskLifeInfo

  return {
    coverType: 'media',
    title: '',
    showTitle: 0,
    subTitle: '',
    showSubTitle: 0,
    singleSubTitle: '',
    pictureUrl: '',
    showSeries: 1,
    showScore: 1,
    alternativePictureUrl: '',
    extraValue1: '',
    extraValue5: '',
    singleId: '',
    vContentId: '',
    resourceType: 0,
    cornerList: [{}, {}],
    blockResourceType: -1,
    moviePercent: 100,
    // 推荐位点击跳转
    jumpType: 'detail',
    versionCode: '',
    price: '',
    secKillPrice: '',
    flagIsSetad: 0,
    redundantParams: getDefaultParams(),
    // Sprint2.8.2 背景图片和视频
    bgImgUrl: '',
    flagSetRec: 0,
    flagTagVector: 0, // 标签引导
    mediaAutomationBlockRls: {
      refreshCal: 1,
      mediaAutomationId: '',
      blockType: 'normal'
    },
    bgParams: {
      id: '',
      title: ''
    },
    bgType: '',
    // 应用参数
    appParams: [],
    // 生活方式
    maskLifeInfo: genDefaultMaskLifeInfo(initMaskLifeInfo),
    // 广电APK
    tvLiveInfo: undefined,
    ...preset
  }
}

export function genDefaultTvLiveInfo (preset) {
  return {
    clickType: GD_LIVE_CLICK_TYPES.channel,
    categoryId: undefined,
    channelId: undefined,
    ...preset
  }
}

export function genDefaultMaskLifeInfo (preset) {
  return {
    /**
    video-跳转视频列表页
    authorMain-跳转作者主页
    authorCategory-作者分类
    launch-正常启动
    */
    lifeType: 'launch',
    videoId: '', // 视频资源id
    authorId: '', // 作者id
    authorName: '', // 作者名称，用于前端显示
    categoryId: '', // 知识id
    categoryName: '', // 知识名称，用于前端显示
    recommendType: 'recommend', // category, author
    filterValue: '',
    videoInfo: null,
    ...preset
  }
}

export function getDefaultParams () {
  return {
    openMode: 'app',
    webpageUrl: '',
    webpageType: '2',
    videoName: '',
    videoUrl: '',
    pictureUrl: '',
    tabId: '',
    packagename: '',
    versioncode: '-1',
    dowhat: 'startActivity',
    bywhat: 'action',
    byvalue: '',
    data: undefined,
    params: [{ key: '', value: '' }]
  }
}

export function genResourceContentList (resources, contentPreset) {
  const contentList = [].concat(
    genMediaContentList(resources, contentPreset, 'video'),
    genAppContentList(resources, contentPreset),
    genMediaContentList(resources, contentPreset, 'edu'),
    genMediaContentList(resources, contentPreset, 'pptv'),
    genMediaContentList(resources, contentPreset, 'live'),
    genMediaContentList(resources, contentPreset, 'topic'),
    genMediaContentList(resources, contentPreset, 'rotate'),
    genGoodContentList(resources, contentPreset)
  )
  return contentList
}

export function genMediaContentList (resources, contentPreset, selectType) {
  const selectedResult = getSelectedResourceByType(resources, selectType)
  const selectedType = selectedResult.selectedType
  const selected = selectedResult.selected || []
  const selectedEpisode = selectedResult.selectedEpisode
  const contentList = selected.map(item => {
    const content = genDefaultContentForm(contentPreset)
    setMediaContent(content, {
      selectedType,
      selected: item,
      selectedEpisode: selectedEpisode[item.coocaaVId]
    })
    return content
  })
  return contentList
}
export function genMediaRuleContentList (resourcesList, contentPreset) {
  const contentList = resourcesList.map(item => {
    const content = genDefaultContentForm(contentPreset)
    setMediaContent(content, {
      selectedType: item.businessType === 0 ? 'video' : 'edu',
      selected: item
    })
    return content
  })
  return contentList
}
export function genAppContentList (resources, contentPreset) {
  const selected = resources.app || []
  const contentList = selected.map(item => {
    const content = genDefaultContentForm(contentPreset)
    setAppContent(content, item)
    return content
  })
  return contentList
}

export function genGoodContentList (resources, contentPreset) {
  const selected = resources.good || []
  const contentList = selected.map(item => {
    const content = genDefaultContentForm(contentPreset)
    setGoodContent(content, item)
    return content
  })
  return contentList
}

const rankingCorners = [
  {
    cornerIconId: 10334,
    position: 0,
    imgUrl:
      'http://img.sky.fs.skysrt.com/tvos6_imgs_master/20191029/20191029110042310136_46*50.png'
  },
  {
    cornerIconId: 10335,
    position: 0,
    imgUrl:
      'http://img.sky.fs.skysrt.com/tvos6_imgs_master/20191029/20191029110130504587_46*50.png'
  },
  {
    cornerIconId: 10336,
    position: 0,
    imgUrl:
      'http://img.sky.fs.skysrt.com/tvos6_imgs_master/20191029/20191029110130914436_46*50.png'
  },
  {
    cornerIconId: 10337,
    position: 0,
    imgUrl:
      'http://img.sky.fs.skysrt.com/tvos6_imgs_master/20191029/20191029110130735921_46*50.png'
  },
  {
    cornerIconId: 10338,
    position: 0,
    imgUrl:
      'http://img.sky.fs.skysrt.com/tvos6_imgs_master/20191029/20191029110130455987_46*50.png'
  },
  {
    cornerIconId: 10339,
    position: 0,
    imgUrl:
      'http://img.sky.fs.skysrt.com/tvos6_imgs_master/20191029/20191029110131328570_46*50.png'
  },
  {
    cornerIconId: 10340,
    position: 0,
    imgUrl:
      'http://img.sky.fs.skysrt.com/tvos6_imgs_master/20191029/20191029110131373933_46*50.png'
  },
  {
    cornerIconId: 10341,
    position: 0,
    imgUrl:
      'http://img.sky.fs.skysrt.com/tvos6_imgs_master/20191029/20191029110131101494_46*50.png'
  },
  {
    cornerIconId: 10342,
    position: 0,
    imgUrl:
      'http://img.sky.fs.skysrt.com/tvos6_imgs_master/20191029/20191029110131545215_46*50.png'
  },
  {
    cornerIconId: 10343,
    position: 0,
    imgUrl:
      'http://img.sky.fs.skysrt.com/tvos6_imgs_master/20191029/20191029110131525588_46*50.png'
  }
]
export function genRankingContentList (resources, contentPreset) {
  const rankingCode = resources.rankingCode
  const selected = resources.ranking || []
  const contentList = selected.map((item, index) => {
    const content = genDefaultContentForm()
    const rankingCorner = rankingCorners[index]
    content.cornerList = [
      {
        ...rankingCorner
      },
      {}
    ]
    setRankingContent(content, item)
    return content
  })
  // 最后一个为查看更多
  const readMore = genDefaultContentForm({
    title: '查看更多',
    coverType: 'custom',
    pictureUrl:
      'http://img.sky.fs.skysrt.com/tvos6_imgs_master/20191029/20191029110257831374_260*364.jpg',
    onclick: JSON.stringify({
      packagename: 'com.tianci.movieplatform',
      versioncode: 7100001,
      dowhat: 'startActivity',
      bywhat: 'action',
      byvalue: 'coocaa.intent.movie.ranking',
      params: {
        rankingCode: rankingCode
      },
      exception: {}
    })
  })
  return contentList.concat(readMore)
}

export function genSubscribeContentList (resources, contentPreset) {
  const selected = resources.subscribe || []
  const contentList = selected.map(item => {
    const content = genDefaultContentForm(contentPreset)
    setSubscribeContent(content, { selected: item })
    return content
  })
  return contentList
}

export function isValidLayoutForRanking (contentList = []) {
  // 检查布局
  // 采用排行榜，布局必须满足：标题布局、只有一行、每个推荐位都是247*346、推荐位数量6~11个
  const blockCount = contentList.length
  const hasTitleAndOnlyOneRowAndMatchSize = contentList.every(item => {
    // eslint-disable-next-line
    const { width, height, y, title_info, mall_resize } = item.contentPosition
    // eslint-disable-next-line
    return y === 0 && width === 260 && height === 364 && title_info && !mall_resize
  })
  const hasSuitableBlocks = blockCount >= 6 && blockCount <= 11

  return hasTitleAndOnlyOneRowAndMatchSize && hasSuitableBlocks
}
