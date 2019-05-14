<template>
<el-tabs v-model="activeName"  @tab-click="handleClick">
    <el-tab-pane label="版面" name="first"><MyReviewTasksList resourceType='tab'></MyReviewTasksList></el-tab-pane>
    <el-tab-pane label="版块" name="second"><MyReviewTasksList resourceType='pannel'></MyReviewTasksList></el-tab-pane>
    <el-tab-pane label="素材" name="third"><MyReviewTasksList resourceType='material'></MyReviewTasksList></el-tab-pane>
    <el-tab-pane label="布局" name="fourth"><MyReviewTasksList resourceType='layout'></MyReviewTasksList></el-tab-pane>
    <el-tab-pane label="首页" name="five"><MyReviewTasksList resourceType='homepage'></MyReviewTasksList></el-tab-pane>
    <el-tab-pane label="策略" name="six"><MyReviewTasksList resourceType='policy'></MyReviewTasksList></el-tab-pane>
    <el-tab-pane label="主题" name="seven"><MyReviewTasksList resourceType='theme'></MyReviewTasksList></el-tab-pane>
    <el-tab-pane label="角标" name="eight"><MyReviewTasksList resourceType='icon'></MyReviewTasksList></el-tab-pane>
    <el-tab-pane label="系统功能" name="night"><MyReviewTasksList resourceType='sysPlugin'></MyReviewTasksList></el-tab-pane>
  </el-tabs>
</template>
<script>
import MyReviewTasksList from './MyReviewTasksList'

export default {
  components: {
    MyReviewTasksList,
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


