<template>
  <div>
    <BroadcastBlockList v-show="isShowList" ref="list" @openAddPage="openAddPage"></BroadcastBlockList>
    <BroadcastBlockAdd v-if="!isShowList" :editId="editId" :currentVersion="currentVersion" @openListPage="openListPage" @go-back="goBack"></BroadcastBlockAdd>
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
      isShowList: true,
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
      this.currentVersion = currentVersion
      this.isShowList = false
    },
    /**
     * 打开列表页面
    */
    openListPage () {
      this.isShowList = true
      this.$refs.list.fetchData()// 更新页面
    },
    /**
     * 新增编辑里面的返回事件
    */
    goBack () {
      this.isShowList = true
    }
  }
};
</script>
<!--声明语言，并且添加scoped-->
<style lang="stylus" scoped>
</style>




