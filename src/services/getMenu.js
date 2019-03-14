export default function getMenu (data) {
  return this.fetch({
    method: 'post',
    url: '/api/getMenus.html',
    data
  }).then(data => {
    return data
  })
}
