<template>
  <div class="page-content-wrapper">
    <slot></slot>
  </div>
</template>

<script>
export default {
  mounted () {
    this.$bus.$emit('scroll-top')
  }
}
</script>

<style lang="stylus" scoped>
.page-content-wrapper
  position absolute
  width 100%
  height 100%
  overflow-y auto
  top 0
.page-content-wrapper
    >>> .el-input,
    >>> .el-select,
    >>> .el-textarea
        max-width 450px
    >>> .el-input + .el-checkbox
    >>> .el-select + .el-checkbox
    >>> .el-tag + .el-button
    >>> .el-select + .remote-selector-wrapper
      margin-left 10px
</style>
