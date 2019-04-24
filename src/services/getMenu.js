export function getMenu (data) {
  return this.fetch({
    method: 'post',
    url: 'api/getMenus.html',
    data
  }).then(data => {
    return data
  })
}
export function getButtonGroupForPageList (pageName) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/' + pageName + '/getMenuInfo.html',
    params: ''
  })
}
