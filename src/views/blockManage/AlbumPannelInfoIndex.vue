<template>
  <div>
    <AlbumPannelInfoList v-show='isShowList' ref="list" @open-add-page="openAddPage"/>
    <AlbumPannelInfoAdd v-if='!isShowList' :editId="editId" @open-list-page="openListPage" @go-back="goBack"/>
  </div>
</template>

<script>
import AlbumPannelInfoList from'./AlbumPannelInfoList'
import AlbumPannelInfoAdd  from './AlbumPannelInfoAdd'
export default {
  components: {
    AlbumPannelInfoList,
    AlbumPannelInfoAdd
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
  }

}
</script>

<style lang='stylus' scoped>
</style>