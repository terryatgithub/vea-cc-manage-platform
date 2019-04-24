<template>
  <div>
    <PolicyManageList v-show="mode==='list'" ref="list" @open-add-page="openAddPage"></PolicyManageList>
    <PolicyManageAdd v-if="mode==='add'" :isReview="isReview" :editData="editData"  @add-home-page="addHomePage" @go-edit-Page="openListPage(editData, false)"  @open-list-page="openListPage" @go-back="goBack"></PolicyManageAdd>
    <PolicyManageAddHomePage v-if="mode==='addHomePage'"></PolicyManageAddHomePage>
  </div>
</template>
<script>
import PolicyManageList from  './PolicyManageList'
import PolicyManageAdd from './PolicyManageAdd'
import PolicyManageAddHomePage from './PolicyManageAddHomePage'
export default {
  components: {
    PolicyManageList,
    PolicyManageAdd,
    PolicyManageAddHomePage
  },
  data() {
    return {
      mode: 'list',
      editData: {},
      isReview: false,
      currentVersion: null
    };
  },
  methods: {
    addHomePage(){
      this.mode = 'addHomePage'
    },
    /**
     * 打开新增编辑页面
    */
    openAddPage(row, isReview) {
      this.editData = row
      this.isReview = isReview
      this.mode = 'add'
    },
    /**
     * 打开列表页面
    */
    openListPage () {
      this.mode = 'list'
      this.editData = {}
      this.$refs.list.fetchData()// 更新页面
    },
    /**
     * 新增编辑里面的返回事件
    */
    goBack () {
      this.mode = 'list'
      this.editData = {}
    }
  }
}
</script>
<!--声明语言，并且添加scoped-->
<style lang="stylus" scoped>
</style>
