<template>
<el-tabs v-model="activeName"  @tab-click="handleClick">
    <el-tab-pane label="应用" name="first"><AppStore class="el-tab-pane-preview"></AppStore></el-tab-pane>
    <el-tab-pane label="海报" name="second"><Poster class="el-tab-pane-preview"></Poster></el-tab-pane>
  </el-tabs>
</template>
<script>
import AppStore from './appStore'
import Poster from './poster'
export default {
  components: {
    AppStore,
    Poster
  },
  data () {
    return {
      activeName: 'first'
    }
  },
  methods: {
    handleClick () {

    }
  }
}
</script>
<style lang="stylus" scoped>
.el-tab-pane-preview >>> .page-content-wrapper {
    position: relative;
    width: 100%;
    top: 0;
}
</style>
