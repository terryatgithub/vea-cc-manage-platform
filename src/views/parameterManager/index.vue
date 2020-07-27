<template>
<el-tabs v-model="activeName"  @tab-click="handleClick">
    <el-tab-pane label="客户&品牌" name="first"><CustomerBrand class="el-tab-pane-preview"></CustomerBrand></el-tab-pane>
    <el-tab-pane label="机芯&机型" name="second"><MovementModel class="el-tab-pane-preview"></MovementModel></el-tab-pane>
  </el-tabs>
</template>
<script>
import CustomerBrand from './customerBrand'
import MovementModel from './movementModel'
export default {
  components: {
    CustomerBrand,
    MovementModel
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
