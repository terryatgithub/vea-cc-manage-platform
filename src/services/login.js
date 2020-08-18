export function login (params) {
  return this.fetch({
    method: 'get',
    url: 'ums/oauth/token',
    params
  }).then((user) => {
    this.state = user
    return user
  }).catch((data) => {
    // 联调接口用
    // const user = {
    //   code: '0',
    //   data: { platformType: 'COOCAA', userInfo: { loginName: 'yuanjunnan', userId: 80 }, enableContentAuth: 0 },
    //   enableContentAuth: 0,
    //   platformType: 'COOCAA',
    //   userInfo: { loginName: 'yuanjunnan', userId: 80 },
    //   loginName: 'yuanjunnan',
    //   userId: 80,
    //   success: true
    // }
    // this.state = user
    // return user
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
