/** 参数设置 */
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
