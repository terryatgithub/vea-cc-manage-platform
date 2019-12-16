export function login (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/userlogin.html',
    data
  }).then((user) => {
    this.state = user
    return user
  })
}

export function logout (data) {
  return this.fetch({
    method: 'get',
    url: 'api/logout.html'
  }).catch(() => {
    // 302
  })
}
