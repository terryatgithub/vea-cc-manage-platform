export function globalPictureUpsert (data) {
  return this.fetch({
    url: 'api/globalPicture/save.html',
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
