<template>
  <div>
    <CommonPannelUserList v-show='isShowList' ref="list" @open-add-page="openAddPage"/>
  </div>
</template>

<script>
import CommonPannelUserList from './CommonPannelUserList'
export default {
  components: {
    CommonPannelUserList
  },

  data () {
    return {
      isShowList: true,
      editId: null
    };
  },

  methods: {
    /** 
     * 打开新增编辑页面
    */
    openAddPage (editId) {
       this.editId = editId;
       this.isShowList = false;
    },
    /** 
     * 打开列表页面
    */
    openListPage () {
      this.isShowList = true
      this.$refs.list.fetchData();//更新页面
    },
    /**  
     * 新增编辑里面的返回事件
    */
    goBack () {
     this.isShowList = true
    }
  },
  created() {}

}
</script>

<style lang='stylus' scoped>
</style>