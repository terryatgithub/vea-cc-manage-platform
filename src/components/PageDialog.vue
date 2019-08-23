<template>
  <transition>
    <div 
      v-show="visible"
      class="page-dialog__wrapper"> 
      <!-- backdrop  -->
      <div class="backdrop"></div>
      <div :class="{'page-dialog': true, fullscreen: fullscreen}">
        <div class="page-dialog__header">
          <slot name="title">
            <span class="page-dialog__title"> {{ title }}</span>
          </slot>
        </div>
        <div class="page-dialog__body">
          <slot></slot>
        </div>
        <div class="page-dialog__footer">
          <slot name="footer">
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      id: undefined,
      closed: true
    }
  },
  props: ['title', 'visible', 'fullscreen'],
  inject: ['tabPage'],
  watch: {
    visible(val) {
      if (val) {
        this.openDialog()
      } else {
        this.closeDialog()
      }
    }
  },
  methods: {
    openDialog() {
      this.$emit('open')
      this.closed = false
      this.tabPage.$el.append(this.$el)
      this.toggleLockScroll()
    },
    closeDialog() {
      this.$emit('close')
      this.closed = true
      this.toggleLockScroll()
    },
    toggleLockScroll() {
      this.tabPage.toggleLockScroll(this.visible, this.id)
    }
  },
  created() {
    this.id = '' + this._uid + Math.random()
  },
  mounted() {
    if (this.visible) {
      this.closed = false
      this.tabPage.$el.append(this.$el)
      this.toggleLockScroll()
    }
  },
  destroyed() {
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
    if (!this.closed) {
      this.toggleLockScroll()
    }
  }
}
</script>

<style lang="stylus">
.page-dialog__wrapper
  position absolute
  width 100%
  height 100%
  z-index 3000
.page-dialog
  position relative
  display flex
  flex-direction column
  width 600px
  height 600px
  margin -300px auto
  top 50%
  background #fff
  z-index 1
.page-dialog__header
  padding 10px 20px 10px
.page-dialog__body
  padding 0 20px
  flex 1
  overflow hidden
.fullscreen,
.backdrop
  position absolute
  top 0
  left 0
  width 100%
  height 100%
  margin 0
  z-index -1
.backdrop
  background #000
  opacity 0.6
</style>
