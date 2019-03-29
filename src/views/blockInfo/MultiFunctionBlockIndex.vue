<template>
 <div>
    <MultiFunctionBlockList v-show="model === 'list'" ref="list" @openAddPage="openAddPage" @openViewPage="openViewPage"></MultiFunctionBlockList>
    <MultiFunctionBlockAdd v-if="model === 'add'" :editId="editId"  @openListPage="openListPage" @go-back="goBack"></MultiFunctionBlockAdd>
    <MultiFunctionBlockView v-if="model ==='view'" :viewId="viewId" @openListPage="openListPage" @go-back="goBack"></MultiFunctionBlockView>
 </div>
</template>
<script>
import MultiFunctionBlockList from './MultiFunctionBlockList'
import MultiFunctionBlockAdd from './MultiFunctionBlockAdd'
import MultiFunctionBlockView from './MultiFunctionBlockView'
export default {
    components: {
    MultiFunctionBlockList,
    MultiFunctionBlockAdd,
    MultiFunctionBlockView
  },
   data () {
    return {
      model: 'list',
      editId: null,
      viewId: null
    }
  },
methods: {
    /** 
     * 打开新增编辑页面
    */
    openAddPage (id) {
       this.editId = id
       this.model = 'add'
    },
    /**
     * 打开详情页面
     */
    openViewPage (id) {
      this.viewId = id
      this.model = 'view'
    },
     /** 
     * 打开列表页面
    */
    openListPage () {
      this.model = 'list'
      this.$refs.list.fetchData();//更新页面
    },
    /**  
     * 新增编辑里面的返回事件
    */
    goBack () {
     this.model = 'list'
    }
  }
}
</script>
<style scoped>

</style>


