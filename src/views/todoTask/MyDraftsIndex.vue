<template>
<el-tabs v-model="activeName"  @tab-click="handleClick">
    <el-tab-pane label="版面" name="first"><MyDraftsTab></MyDraftsTab></el-tab-pane>
    <el-tab-pane label="版块" name="second"><MyDraftsPanel></MyDraftsPanel></el-tab-pane>
    <el-tab-pane label="首页" name="third"><MyDraftsHomePage></MyDraftsHomePage></el-tab-pane>
    <el-tab-pane label="策略" name="fourth"><MyDraftsPolicy></MyDraftsPolicy></el-tab-pane>
  </el-tabs>
</template>
<script>
import MyDraftsIndex from './MyDraftsIndex'
import MyDraftsHomePage from './MyDraftsHomePage'
import MyDraftsPolicy from './MyDraftsPolicy'
import MyDraftsPanel from './MyDraftsPanel'
export default {
  components: {
    MyDraftsIndex,
    MyDraftsHomePage,
    MyDraftsPolicy,
    MyDraftsPanel
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


