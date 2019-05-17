export function globalPictureUpsert (data) {
  return this.fetch({
    url: 'api/v1/poster/save.html',
    method: 'post',
    data
  })
}

export function globalPictureGet (params) {
  return this.fetch({
    url: 'api/v1/poster/getDetailInfo.html',
    method: 'get',
    params
  })
}
// export function globalPictureList (params) {
//   return this.fetch({
//     url: 'api/globalPicture/dataList.html',
//     params
//   })
// }
