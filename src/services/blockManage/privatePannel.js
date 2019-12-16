// 专属影院
/** 列表 */
// export function privatePannelInfo(data) {
//     return this.fetch({
//         method: 'post',
//         url: 'api/v1/panel/pageList.html',
//         data
//     })
// }
/** 获取数据字典 */

/** 历史版本 */
export function getHistory (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/hvi/historyList.html',
    params
  })
}
/** 编辑 */
// export function getEditData(params) {
//     return this.fetch({
//         method: 'get',
//         url: 'api/privatePannelInfo/edit.html',
//         params
//     }).then(data => {
//         return JSON.parse(data.match(/initData = (\{.+\})/)[1])
//     })
// }
/** 保存 */
// export function privatePanelUpsert(data) {
//     return this.fetch({
//         method: 'post',
//         url: 'api/privatePannelInfo/save.html',
//         data
//     })
// }
/** 批量删除 */
export function privatePanelRemove (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/panel/remove.html',
    params
  })
}
// /**预览 */
// export function privatePannelInfoView(params) {
//     return this.fetch({
//         method: 'get',
//         url: 'api/privatePannelInfo/preview.html',
//         params
//     }).then(data => {
//         return JSON.parse(data.match(/initData = (\{.+\})/)[1])
//     })
// }
