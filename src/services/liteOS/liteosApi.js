// 参数设置

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
    url: 'api/lite-os/admin/select/query-customer-list-all-contain-brands'
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
    url: '/api/lite-os/admin/select/query-chip-list-all'
  })
}

// 区域设置

// 获取全部有效机芯的列表(包含机型)
export function queryChipAllContainModels () {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/select/query-chip-all-contain-models'
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
export function uploadImg (data) {
  return this.fetch({
    method: 'post',
    url: 'api/lite-os/admin/upload/uploadImg',
    data,
    isUpload: true
  })
}
// 海报素材修改
export function updatePosterManage (params) {
  return this.fetch({
    method: 'post',
    url: 'api/lite-os/admin/poster-material-manage/update-material-manage',
    params
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
export function addPosterManage (params) {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/poster-material-manage/add-material-manage',
    params
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
export function updateAppManage (params) {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/app-material-manage/update-material-manage',
    params
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