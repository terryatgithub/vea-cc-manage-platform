<template>
  <div id="app">
    <router-view v-if="isReady" />
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      isReady: false
    }
  },
  created() {
    this.$service.getEnv().then((env) => {
      this.$consts.idPrefix = env.idPrefix
      if (env.userInfo) {
        const { loginName: name } = env.userInfo
        this.$appState.$set('user', {
          name
        })
      } else {
        this.$router.push({name: 'login'})
      }
      this.isReady = true
    })
  }
}
</script>
