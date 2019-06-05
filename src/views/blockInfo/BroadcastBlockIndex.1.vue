<template>
  <div>
    <BroadcastBlockList v-show="mode==='list'" ref="list" @open-add-page="openAddPage"></BroadcastBlockList>
    <BroadcastBlockAdd v-if="mode==='add'" :isReview="isReview" :editData="editData" @go-edit-Page="openListPage(editData, false)"  @open-list-page="openListPage" @go-back="goBack"></BroadcastBlockAdd>
  </div>
</template>
<script>
import BroadcastBlockList from  './BroadcastBlockList'
import BroadcastBlockAdd from './BroadcastBlockAdd'

export default {
  components: {
    BroadcastBlockList,
    BroadcastBlockAdd
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
};
</script>
<!--声明语言，并且添加scoped-->
<style lang="stylus" scoped>
</style>




