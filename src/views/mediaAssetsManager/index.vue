<template>
  <el-tabs v-model="activeName"  @tab-click="handleClick">
    <el-tab-pane label="媒资库" name="first"><Warehouse class="el-tab-pane-preview"></Warehouse></el-tab-pane>
    <el-tab-pane label="媒资来源管理" name="second"><Manage class="el-tab-pane-preview"></Manage></el-tab-pane>
  </el-tabs>
</template>
<script>
import Warehouse from './warehouse'
import Manage from './manage'
export default {
  components: {
    Warehouse,
    Manage
  },
  data () {
    return {
      activeName: 'first'
    }
  },
  methods: {
    handleClick () {}
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
