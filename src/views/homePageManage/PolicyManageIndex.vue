<template>
  <div>
    <PolicyManagePreview v-if="mode==='preview'" :editId="editId" @go-back="goBack"> </PolicyManagePreview>
    <PolicyManageList v-show="mode==='list'" ref="list" @open-add-page="openAddPage" @open-preview-page="openPreviewPage"></PolicyManageList>
    <PolicyManageAdd v-if="mode==='add'" :isReview="isReview" :editId="editId"  @add-home-page="addHomePage" @go-edit-Page="openListPage(editData, false)"  @open-list-page="openListPage" @go-back="goBack"></PolicyManageAdd>
    <!-- <PolicyManageAddHomePage v-if="mode==='addHomePage'"></PolicyManageAddHomePage> -->
  </div>
</template>
<script>
import PolicyManageList from  './PolicyManageList'
import PolicyManageAdd from './PolicyManageAdd'
import PolicyManagePreview from './PolicyManagePreview'
// import PolicyManageAddHomePage from './PolicyManageAddHomePage'
export default {
  components: {
    PolicyManageList,
    PolicyManageAdd,
    PolicyManagePreview
  },
  data() {
    return {
      mode: 'list',
      editId: null,
      isReview: false,
      currentVersion: null
    };
  },
  methods: {
    addHomePage(){
      this.mode = 'addHomePage'
    },
    openPreviewPage(id){
      this.mode = 'preview'
      this.editId = id
    },
    /**
     * 打开新增编辑页面
    */
    openAddPage(id, isReview) {
      this.editId = id
      this.isReview = isReview
      this.mode = 'add'
    },
    /**
     * 打开列表页面
    */
    openListPage () {
      this.mode = 'list'
      this.editId = null
      this.$refs.list.fetchData()// 更新页面
    },
    /**
     * 新增编辑里面的返回事件
    */
    goBack () {
      this.mode = 'list'
      this.editId = null
    }
  }
}
</script>
<!--声明语言，并且添加scoped-->
<style lang="stylus" scoped>
</style>
