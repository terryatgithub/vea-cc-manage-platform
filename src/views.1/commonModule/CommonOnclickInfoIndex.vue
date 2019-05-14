<template>
  <div>
    <CommonOnclickInfoList v-show='isShowList' ref="list" @open-add-page="openAddPage"></CommonOnclickInfoList>
    <CommonOnclickInfoAdd v-if='!isShowList' :editId="editId" @openListPage="openListPage" @go-back="goBack"></CommonOnclickInfoAdd>
  </div>
</template>
<script>
import CommonOnclickInfoAdd from './CommonOnclickInfoAdd'
import CommonOnclickInfoList from './CommonOnclickInfoList'
export default {
  components: {
    CommonOnclickInfoAdd,
    CommonOnclickInfoList
  },
  data () {
    return {
      isShowList: true,
      editId: null
    }
  },
  methods: {
    /** 
     * 打开新增编辑页面
    */
    openAddPage (commonOnclickId) {
       this.editId = commonOnclickId
       this.isShowList = false
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
  }
}
</script>
