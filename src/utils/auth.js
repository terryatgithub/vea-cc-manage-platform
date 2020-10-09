import Vue from "vue";
function getInitData(app) {
  // return app.$service.getEnv().then((env) => {
  //   app.$consts.idPrefix = env.idPrefix
  //   if (env.userInfo) {
  //     const { loginName: name } = env.userInfo
  //     app.$appState.user = { name }
  //   }
  // }).catch(() => {
  // })
  return new Promise((resolve, reject) => {
    const env = {
      enableContentAuth: 0,
      idPrefix: "10",
      platformType: "COOCAA"
    };
    app.$consts.idPrefix = env.idPrefix;
    // debugger
    const user = app.$appState.$get("user");
    const token = app.$appState.$get("currDbSource");
    if (user && token) {
      const { name } = user;
      app.$appState.user = { name };
      app.$store.commit("saveCurrDbSource", token);
      resolve()
    } else {
      reject()
    }
  });
}
Vue.prototype.$isLoggedIn = async function() {
  const $appState = this.$appState;
  // memory
  // debugger
  if ($appState.user) {
    return;
  }
  return getInitData(this).then(() => {
    if (!$appState.user) {
      throw new Error("ERR_NOT_LOGIN");
    }
  });
};
Vue.prototype.$login = async function(data) {
  return this.$service.login(data).then(res => {
    console.log(res);
    const user = {
      name: data.username
    };
    this.$service.state = user;
    this.$appState.user = user;
    this.$appState.$set("user", user);
    const token = res.token_type + res.access_token;
    this.$store.commit("saveCurrDbSource", token);
    this.$appState.$set("currDbSource", token);
    return getInitData(this);
  });
};

Vue.prototype.$logout = async function() {
  this.$appState.user = undefined;
  this.$appState.$remove("user");
  return this.$service.logout();
};
