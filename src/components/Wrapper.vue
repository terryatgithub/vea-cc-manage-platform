<template>
<div>
  <keep-alive>
    <router-view v-if="isKeepAlive"/>
  </keep-alive>
  <router-view v-if="!isKeepAlive"/>
</div>
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

