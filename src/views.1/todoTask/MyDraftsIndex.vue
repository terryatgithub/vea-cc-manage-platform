<template>
<el-tabs v-model="activeName"  @tab-click="handleClick">
    <el-tab-pane label="版面" name="first"><MyDraftsTabIndex class="el-tab-pane-preview"></MyDraftsTabIndex></el-tab-pane>
    <el-tab-pane label="版块" name="second"><MyDraftsPanelIndex class="el-tab-pane-preview"></MyDraftsPanelIndex></el-tab-pane>
    <el-tab-pane label="首页" name="third"><MyDraftsHomePageIndex class="el-tab-pane-preview"></MyDraftsHomePageIndex></el-tab-pane>
    <el-tab-pane label="策略" name="fourth"><MyDraftsPolicyIndex class="el-tab-pane-preview"></MyDraftsPolicyIndex></el-tab-pane>
  </el-tabs>
</template>
<script>
import MyDraftsTabIndex from './MyDraftsTabIndex'
import MyDraftsHomePageIndex from './MyDraftsHomePageIndex'
import MyDraftsPolicyIndex from './MyDraftsPolicyIndex'
import MyDraftsPanelIndex from './MyDraftsPanelIndex'
export default {
  components: {
    MyDraftsTabIndex,
    MyDraftsHomePageIndex,
    MyDraftsPolicyIndex,
    MyDraftsPanelIndex
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
.el-tab-pane-preview >>> .page-content-wrapper {
    position: relative;
    width: 100%;
    top: 0;
}
</style>


