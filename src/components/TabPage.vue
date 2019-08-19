<template>
  <div :class="{'tab-page': true, 'tab-page--lock-scroll': modals.size > 0 }">
    <slot></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      modals: new Set(),
      originScrollTop: undefined
    }
  },
  provide() {
    return {
      tabPage: this
    }
  },
  methods: {
    toggleLockScroll(val, id) {
      const modals = this.modals
      if (val) {
        if (modals.size <= 0) {
          this.originScrollTop = this.$el.scrollTop
        }
        modals.add(id)
        this.$el.scroll({top: 0})
      } else {
        modals.delete(id)
        if (modals.size <= 0 && this.originScrollTop !== undefined) {
          this.$el.scroll({top: this.originScrollTop})
        }
      }
    },
  }
}
</script>

<style lang="stylus" scoped>
.tab-page
  position relative
  height 100%
  overflow auto
.tab-page--lock-scroll
  overflow hidden
</style>
