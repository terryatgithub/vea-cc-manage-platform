<template>
  <div>
    <BroadcastBlockList v-show="isShowList" @openAddPage="openAddPage"></BroadcastBlockList>
    <BroadcastBlockAdd v-if="!isShowList"></BroadcastBlockAdd>
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
      isShowList: true
    };
  },
  methods: {
    /**
     * 打开新增编辑页面
    */
    openAddPage() {

    }
  }
};
</script>
<!--声明语言，并且添加scoped-->
<style lang="stylus" scoped>
</style>




