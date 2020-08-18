import Vue from 'vue'
function getInitData (app) {
  // return app.$service.getEnv().then((env) => {
  //   app.$consts.idPrefix = env.idPrefix
  //   if (env.userInfo) {
  //     const { loginName: name } = env.userInfo
  //     app.$appState.user = { name }
  //   }
  // }).catch(() => {
  const env = {
    enableContentAuth: 0,
    idPrefix: '10',
    platformType: 'COOCAA'
  }
  app.$consts.idPrefix = env.idPrefix
  if (env.userInfo) {
    const { loginName: name } = env.userInfo
    app.$appState.user = { name }
  }
  // })
}
Vue.prototype.$isLoggedIn = async function () {
  const $appState = this.$appState
  // memory
  if ($appState.user) {
    return
  }
  return getInitData(this).then(() => {
    if (!$appState.user) {
      throw new Error('ERR_NOT_LOGIN')
    }
  })
}
Vue.prototype.$login = async function (data) {
  return this.$service.login(data).then(res => {
    console.log(res)
    const user = {
      name: data.username
    }
    this.$service.state = user
    this.$appState.user = user
    this.$appState.$set('user', user)
    const token = res.token_type + res.access_token
    this.$store.commit('saveCurrDbSource', token)
    return getInitData(this)
  })
}

Vue.prototype.$logout = async function () {
  this.$appState.user = undefined
  this.$appState.$remove('user')
  return this.$service.logout()
}
