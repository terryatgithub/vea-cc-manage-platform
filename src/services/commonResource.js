export function commonPannelUserList(data) {
  return this.fetch({
    method: 'post',
    url: 'api/collect/pannel/pageList.html',
    data
  })
}
