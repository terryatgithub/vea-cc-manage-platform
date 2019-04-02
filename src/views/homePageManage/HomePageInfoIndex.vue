<template>
  <div>
    <HomePageInfoList v-show='isShowList' ref="list" @open-add-page="openAddPage"></HomePageInfoList>
    <HomePageInfoAdd v-if='!isShowList' :editId="editId" @openListPage="openListPage" @go-back="goBack"></HomePageInfoAdd>
  </div>
</template>
<script>
import HomePageInfoAdd from './HomePageInfoAdd'
import HomePageInfoList from './HomePageInfoList'
export default {
  components: {
    HomePageInfoAdd,
    HomePageInfoList
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
    openAddPage (homepageId) {
       this.editId = homepageId
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