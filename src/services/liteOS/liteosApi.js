/** 参数设置 */
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

/** 区域设置 */
// 区域管理修改
export function updateAreaManage (params) {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/area-manage/update-area-manage',
    params
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
export function addAreaManage (params) {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/area-manage/add-area-manage',
    params
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
