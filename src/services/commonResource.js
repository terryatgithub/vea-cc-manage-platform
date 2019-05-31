export function commonPannelUserList(data) {
  return this.fetch({
    method: 'post',
    url: `api/v1/collect/${data.type}/pageList.html`,
    data: data.data
  })
}
