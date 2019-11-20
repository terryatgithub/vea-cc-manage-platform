export function getMatchedPictureUrl (blockSize, imgList) {
  let maxMatchingValue = -99999
  let url
  if (blockSize && imgList) {
    imgList.forEach(item => {
      const matchingValue = getMatchingValue(blockSize, item.size.split('*'))
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
    partner,
    selectedType,
    selected,
    selectedEpisode,
    blockSize
  } = options

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
      contentForm[extraIdField] = selectedEpisode.coocaaMId
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
      contentForm.singleId = ''
      contentForm.contentType = 0
      contentForm.videoContentType = 'movie'
      contentForm.extraValue5 = undefined
      contentForm.platformId = selected.source
      contentForm.pictureUrl =
        getMatchedPictureUrl(blockSize, selected.imageInfoList) ||
        selected.thumb
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
    contentForm.videoContentType = 'edu'
    contentForm.extraValue1 = '_otx_' + selected.coocaaVId
    contentForm.platformId = selected.source
    contentForm.pictureUrl =
      getMatchedPictureUrl(blockSize, selected.imageInfoList) || selected.thumb
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

export function setSubscribeContent (contentForm, selected) {
  if (selected) {
    contentForm.coverType = 'media'
    contentForm.contentType = 0
    contentForm.videoContentType = 'movie'
    contentForm.extraValue1 = selected.trailerId
    contentForm.pictureUrl = selected.picture
    contentForm.title = selected.trailerTitle
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
  const partner = resources.videoSource
  return { partner, selectedType, selected, selectedEpisode }
}

export function chopSubTitle (title) {
  return (title || '').slice(0, 45)
}

export function genDefaultContentForm (preset) {
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
      partner: selectedResult.partner,
      selectedType,
      selected: item,
      selectedEpisode: selectedEpisode[item.coocaaVId]
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
    setSubscribeContent(content, item)
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
