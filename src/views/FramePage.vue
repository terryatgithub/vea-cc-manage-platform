<template>
  <iframe class="frame-page" :src="src" />
</template>

<script>
export default {
  computed: {
    src() {
      const url = this.$route.query.url
      return /^http/.test(url) ? url : `${location.protocol}//${url}`
    }
  }
}
</script>

<style lang="stylus" scoped>
.frame-page
  width 100%
  height 100%
  border none

</style>
