<template>
  <div>
    <BroadcastBlockList v-show="mode==='list'" ref="list" @open-add-page="openAddPage"></BroadcastBlockList>
    <BroadcastBlockAdd v-if="mode==='add'" :editId="editId" :currentVersion="currentVersion" @open-list-page="openListPage" @go-back="goBack"></BroadcastBlockAdd>
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
      editId: null,
      currentVersion: null
    };
  },
  methods: {
    /**
     * 打开新增编辑页面
    */
    openAddPage(id, currentVersion) {
      this.editId = id
      this.mode = 'add'
    },
    /**
     * 打开列表页面
    */
    openListPage () {
      this.mode = 'list'
      this.$refs.list.fetchData()// 更新页面
    },
    /**
     * 新增编辑里面的返回事件
    */
    goBack () {
      this.mode = 'list'
    }
  }
};
</script>
<!--声明语言，并且添加scoped-->
<style lang="stylus" scoped>
</style>




