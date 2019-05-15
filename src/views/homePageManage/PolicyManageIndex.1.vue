<template>
  <div>
    <PolicyManagePreview 
    v-if="mode==='preview'" 
    :editId="editId" 
    :version='version'
    @upsert-end="handleUpsertEnd" 
    @open-add-page="openAddPage"
    @go-back="goBack"> 
    </PolicyManagePreview>
    <PolicyManageList 
     v-show="mode==='list'" 
     ref="list" 
     @open-add-page="openAddPage"
     @open-preview-page="openPreviewPage">
     </PolicyManageList>
    <PolicyManageAdd 
      v-if="mode==='add'" 
      :isReplicate="isReplicate" 
      :editId="editId"
      @add-home-page="addHomePage" 
      @go-edit-Page="openListPage(editData, false)"  
      @open-list-page="openListPage" 
      @go-back="goBack">
    </PolicyManageAdd>
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
      editId: undefined,
      isReplicate: false,
      version: undefined
    };
  },
  methods: {
    addHomePage(){
      this.mode = 'addHomePage'
    },
    openPreviewPage(id, version){
      this.mode = 'preview'
      this.editId = id
      this.version = version
    },
    handleUpsertEnd () {
      this.$refs.list.fetchData();//更新页面
      this.mode = 'list'
    },
    /**
     * 打开新增编辑页面
    */
    openAddPage(id, isReplicate) {
      this.editId = id
      this.isReplicate = isReplicate
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
