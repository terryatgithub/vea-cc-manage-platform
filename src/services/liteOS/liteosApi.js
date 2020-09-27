import axios from 'axios'
// 参数设置

// 根据客户名称与品牌名称查询
export function queryCustomerBrandsList (params) {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/select/query-customer-brands-list',
    params
  })
}
// 获取全部有效客户
export function queryCustomerListAll () {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/select/query-customer-list-all'
  })
}
// 获取全部有效品牌
export function queryBrandListAll () {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/select/query-brand-list-all'
  })
}
// 获取全部有效客户的列表(包含品牌)
export function queryCustomerListAllContainBrands () {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/select/query-customer-list-all-contain-brands',
    useLoading: false
  })
}
// 根据客户名称与品牌名称查询
export function queryCustomerBrandList (params) {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/select/query-customer-brands-list',
    useLoading: false,
    params
  })
}
// 品牌修改
export function updateBrand (params) {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/add-param/update-brand',
    params
  })
}
// 分页获取品牌列表
export function queryBrandListPage (params) {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/add-param/query-brand-list-page',
    params
  })
}
// 品牌添加
export function addBrand (params) {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/add-param/add-brand',
    params
  })
}
// 品牌删除
export function deleteBrand (params) {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/add-param/delete-brand',
    params
  })
}

// 版本号
// 查询支持的版本
export function queryVersionList (params) {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/version/queryVersionList',
    useLoading: false,
    params
  })
}

// 分页获取机芯机型列表
export function queryChipModelListPage (params) {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/add-param/query-chip-model-list-page',
    params
  })
}
// 获取有效的机芯机型列表
export function queryModelChipList (params) {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/select/query-model-chip-list',
    useLoading: false,
    params
  })
}
// 机芯/机型添加
export function addChipModel (params) {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/add-param/add-chip-model',
    params
  })
}
// 获取机芯列表
export function queryChipListAll () {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/select/query-chip-list-all'
  })
}

// 区域设置

// 获取全部有效机芯的列表(包含机型)
export function queryChipAllContainModels () {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/select/query-chip-all-contain-models',
    useLoading: false
  })
}
// 获取有效的区域国家列表
export function queryAreaCountryListAll () {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/select/query-area-country-list-all'
  })
}
// 区域管理修改
export function updateAreaManage (data) {
  return this.fetch({
    method: 'post',
    url: 'api/lite-os/admin/area-manage/update-area-manage',
    data,
    isJSON: true,
    isHeaders: true
  })
}
// 分页获取区域管理列表
export function queryAreaManageListPage (params) {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/area-manage/query-area-manage-list-page',
    params
  })
}
// 区域管理添加
export function addAreaManage (data) {
  return this.fetch({
    method: 'post',
    url: 'api/lite-os/admin/area-manage/add-area-manage',
    data,
    isJSON: true,
    isHeaders: true
  })
}
// 根据区域管理id获取对应数据
export function getAreaManageRlsId (params) {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/area-manage/get-area-manage-rlsId',
    params
  })
}
// 区域管理删除
export function deleteAreaManage (params) {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/area-manage/delete-area-manage',
    params
  })
}

// 素材设置

// 公共图片上传接口
export function uploadImg (formData) {
//   return this.fetch({
//     method: 'post',
//     url: 'api/lite-os/admin/upload/uploadImg',
//     params,
//     isUpload: true
//   })
  let url = 'api/lite-os/admin/upload/uploadImg'
  if (process.env.NODE_ENV === 'production') {
    url = process.env.VUE_APP_BASEURL + url
  }
  return axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: formData
  }).then(({ data }) => {
    return data
  })
}
// 海报素材修改
export function updatePosterManage (data) {
  return this.fetch({
    method: 'post',
    url: 'api/lite-os/admin/poster-material-manage/update-material-manage',
    data,
    isJSON: true,
    isHeaders: true
  })
}
// 分页获取海报素材管理列表
export function queryPosterManageListPage (params) {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/poster-material-manage/query-material-manage-list-page',
    params
  })
}
// 海报添加
export function addPosterManage (data) {
  return this.fetch({
    method: 'post',
    url: 'api/lite-os/admin/poster-material-manage/add-material-manage',
    data,
    isJSON: true,
    isHeaders: true
  })
}
// 根据海报管理id获取对应数据
export function getPosterManageMaterialId (params) {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/poster-material-manage/get-material-manage-materialId',
    params
  })
}
// 海报管理删除
export function deletePosterManage (params) {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/poster-material-manage/delete-material-manage',
    params
  })
}
// 应用修改
export function updateAppManage (data) {
  return this.fetch({
    method: 'post',
    url: 'api/lite-os/admin/app-material-manage/update-material-manage',
    data,
    isJSON: true,
    isHeaders: true
  })
}
// 分页获取应用素材管理列表
export function queryAppManageListPage (params) {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/app-material-manage/query-material-manage-list-page',
    params
  })
}
// 应用添加
export function addAppManage (data) {
  return this.fetch({
    method: 'post',
    url: 'api/lite-os/admin/app-material-manage/add-material-manage',
    data,
    isJSON: true,
    isHeaders: true
  })
}
// 根据app管理id获取对应数据
export function getAppManageMaterialId (params) {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/app-material-manage/get-material-manage-materialId',
    params
  })
}
// 应用删除
export function deleteAppManage (params) {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/app-material-manage/delete-material-manage',
    params
  })
}

// 媒资管理

// 媒资库分页列表
export function queryResourceListPage (params) {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/media-resources/query-resource-list-page',
    params
  })
}
// 媒资库信息--根据ID查询
export function getMediaResourcesId (params) {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/media-resources/get-mediaResourcesId',
    params
  })
}
// 媒资类别--查询所有
export function queryCategoryAll () {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/media-resources/query-category-all',
    useLoading: false
  })
}
// 媒资来源--分页查询
export function querySourceListPage (params) {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/media-resources/query-source-list-page',
    params
  })
}
// 媒资来源--所有名字查询
export function querySourceAll (params) {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/media-resources/query-source-all',
    useLoading: false,
    params
  })
}
// 媒资来源--更新
export function updateSource (data) {
  return this.fetch({
    method: 'post',
    url: 'api/lite-os/admin/media-resources/update-source',
    data,
    isJSON: true,
    isHeaders: true
  })
}

// Launcher推送策略

// 分页获取推送管理列表
export function queryLauncherPushListPage (params) {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/launcher-push-manage/query-push-manage-list-page',
    params
  })
}
// 推送状态变更
export function updateLauncherPushStatus (params) {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/launcher-push-manage/update-push-status',
    params
  })
}
// 推送管理修改
export function updateLauncherPushManage (data) {
  return this.fetch({
    method: 'post',
    url: 'api/lite-os/admin/launcher-push-manage/update-push-manage',
    data,
    isJSON: true,
    isHeaders: true
  })
}
// 推送管理删除
export function deleteLauncherPushManage (params) {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/launcher-push-manage/delete-push-manage',
    params
  })
}
// 推送管理添加
export function addLauncherPushManage (data) {
  return this.fetch({
    method: 'post',
    url: 'api/lite-os/admin/launcher-push-manage/add-push-manage',
    data,
    isJSON: true,
    isHeaders: true
  })
}
// 根据推送管理id获取对应数据
export function getLauncherPushManageReleaseConfId (params) {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/launcher-push-manage/get-push-manage-releaseConfId',
    params
  })
}

// appStore推送管理

// 分页获取AppStore推送管理列表
export function queryAppStorePushListPage (params) {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/app-store-push-manage/query-push-manage-list-page',
    params
  })
}
// AppStore推送状态变更
export function updateAppStorePushStatus (params) {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/app-store-push-manage/update-push-status',
    params
  })
}
// AppStore推送管理修改
export function updateAppStorePushManage (data) {
  return this.fetch({
    method: 'post',
    url: 'api/lite-os/admin/app-store-push-manage/update-push-manage',
    data,
    isJSON: true,
    isHeaders: true
  })
}
// AppStore推送管理删除
export function deleteAppStorePushManage (params) {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/app-store-push-manage/delete-push-manage',
    params
  })
}
// AppStore推送管理添加
export function addAppStorePushManage (data) {
  return this.fetch({
    method: 'post',
    url: 'api/lite-os/admin/app-store-push-manage/add-push-manage',
    data,
    isJSON: true,
    isHeaders: true
  })
}
// AppStore根据推送管理id获取对应数据
export function getAppStorePushManageReleaseConfId (params) {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/app-store-push-manage/get-push-manage-releaseConfId',
    params
  })
}

// appStore 内页管理

// 分页获取AppStore推送管理列表
export function queryAppStoreInnerPagePushListPage (params) {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/app-store-inside-page-push/query-push-list-page',
    params
  })
}
// AppStore推送状态变更
export function updateAppStoreInnerPagePushStatus (data) {
  return this.fetch({
    method: 'post',
    url: 'api/lite-os/admin/app-store-inside-page-push/update-push-status',
    data,
    isJSON: true,
    isHeaders: true
  })
}
// AppStore推送管理修改
export function updateAppStoreInnerPagePushManage (data) {
  return this.fetch({
    method: 'post',
    url: 'api/lite-os/admin/app-store-inside-page-push/update-push',
    data,
    isJSON: true,
    isHeaders: true
  })
}
// AppStore推送管理删除
export function deleteAppStoreInnerPagePushManage (data) {
  return this.fetch({
    method: 'post',
    url: 'api/lite-os/admin/app-store-inside-page-push/delete-push',
    data,
    isJSON: true,
    isHeaders: true
  })
}
// AppStore推送管理添加
export function addAppStoreInnerPagePushManage (data) {
  return this.fetch({
    method: 'post',
    url: 'api/lite-os/admin/app-store-inside-page-push/add-push',
    data,
    isJSON: true,
    isHeaders: true
  })
}
// AppStore根据推送管理id获取对应数据
export function getAppStoreInnerPagePushManageReleaseConfId (params) {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/app-store-inside-page-push/query-push-by-releaseConfId',
    params
  })
}
// 登录接口
export function loginToken (params) {
  let url = 'ums/oauth/token'
  if (process.env.NODE_ENV === 'production') {
    url = process.env.VUE_APP_BASEURL + url
  }
  return axios({
    method: 'get',
    url: url,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: params
  }).then(({ data }) => {
    return data
  })
  // return this.fetch({
  //   method: 'get',
  //   url: 'ums/oauth/token',
  //   params
  // })
}