<template>
  <keep-alive v-if="isKeepAlive">
    <router-view v-if="isKeepAlive"/>
  </keep-alive>
  <router-view v-else />
</template>
<script>
export default {
  computed: {
    isKeepAlive() {
      const meta = this.$route.meta
      return meta && meta.isCache !== false
    }
  }
}
</script>
