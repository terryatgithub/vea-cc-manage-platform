export function collectionGetList (data) {
  return this.fetch({
    method: 'post',
    url: `api/v1/collect/${data.type}/pageList.html`,
    data: data.data
  }).then((result) => {
    if (result.rows) {
      // 返回的数据里缺少里收藏标识字段
      result.rows.forEach((item) => {
        item.collected = 1
      })
    }
    return result
  })
}
