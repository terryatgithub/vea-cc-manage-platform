export function globalPictureUpsert (data) {
  return this.fetch({
    url: 'api/v1/poster/save.html',
    method: 'post',
    data
  })
}

export function globalPictureGet (params) {
  return this.fetch({
    url: 'api/globalPicture/edit.html?id=' + params.id
  }).then(result => {
    return JSON.parse(result.match(/initData = (\{.+\})/)[1])
  })
}

export function globalPictureList (params) {
  return this.fetch({
    url: 'api/globalPicture/dataList.html',
    params
  })
}
