<template>
<el-tabs v-model="activeName"  @tab-click="handleClick">
    <el-tab-pane label="版面" name="first"><MySubmitTasksList resourceType='tab'></MySubmitTasksList></el-tab-pane>
    <el-tab-pane label="版块" name="second"><MySubmitTasksList resourceType='pannel'></MySubmitTasksList></el-tab-pane>
    <el-tab-pane label="素材" name="third"><MySubmitTasksList resourceType='material'></MySubmitTasksList></el-tab-pane>
    <el-tab-pane label="布局" name="fourth"><MySubmitTasksList resourceType='layout'></MySubmitTasksList></el-tab-pane>
    <el-tab-pane label="首页" name="five"><MySubmitTasksList resourceType='homepage'></MySubmitTasksList></el-tab-pane>
    <el-tab-pane label="策略" name="six"><MySubmitTasksList resourceType='policy'></MySubmitTasksList></el-tab-pane>
    <el-tab-pane label="主题" name="seven"><MySubmitTasksList resourceType='theme'></MySubmitTasksList></el-tab-pane>
    <el-tab-pane label="角标" name="eight"><MySubmitTasksList resourceType='icon'></MySubmitTasksList></el-tab-pane>
    <el-tab-pane label="系统功能" name="night"><MySubmitTasksList resourceType='sysPlugin'></MySubmitTasksList></el-tab-pane>
  </el-tabs>
</template>
<script>
import MySubmitTasksList from './MySubmitTasksList'

export default {
  components: {
    MySubmitTasksList,
  },
   data(){
     return {
       activeName: 'first'
     }
   },
   methods: {
     handleClick(){

     }
   }
}
</script>
<style lang="stylus" scoped>

</style>


