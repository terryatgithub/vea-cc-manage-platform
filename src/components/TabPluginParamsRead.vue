<template>
  <div>
    <el-form-item label="插件包名">{{ value.packagename }}</el-form-item>
    <el-form-item label="插件分类名">{{ value.category }}</el-form-item>
    <el-form-item label="插件主页最低版本">{{ value.minHomepageVersion }}</el-form-item>
    <el-form-item label="扩展参数">
      <div class="app-extend-params" v-for="(param, index) in value.params" :key="index">
        <el-form-item label label-width="0px">
          <el-tag>key</el-tag>&nbsp;
          <el-tooltip class="item" effect="dark" :content="param.key" placement="top">
            <span>{{ param.key }}</span>
          </el-tooltip>
        </el-form-item>
        <el-form-item label label-width="0px">
          <el-tag>value</el-tag>&nbsp;
          <el-tooltip class="item" effect="dark" :content="param.value" placement="top">
            <span>{{ param.value }}</span>
          </el-tooltip>
        </el-form-item>
      </div>
    </el-form-item>
  </div>
</template>

<script>
export default {
  template: '#cc-app-params-read',
  data () {
    return {
      defaultArr: []
    }
  },
  props: ['value'],
  created () {},
  mounted () {
    // this.defaultArr = JSON.parse(this.value.params)
    console.log(this.value, '----fff-')
  }
}
</script>

<style scoped>
.app-extend-params .el-form-item,
.app-extend-params .el-form-item__label,
.app-extend-params .el-form-item__content {
  display: inline-block;
}
.app-extend-params .el-form-item {
  min-width: 150px;
  margin-bottom: 24px;
}
.app-extend-params .el-form-item + .el-form-item {
    margin-left: 10px;
}
.app-extend-params .el-form-item .el-form-item__content {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 300px;
}
</style>
