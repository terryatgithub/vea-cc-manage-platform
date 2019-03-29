<template>
  <div>
    <SysPluginList v-show="model === 'list'" ref="list" @open-add-page="openAddPage" @open-view-page="openViewPage"></SysPluginList>
    <SysPluginAdd v-if="model === 'add'" :editId="editId"  @open-list-page="openListPage" @go-back="goBack"></SysPluginAdd>
    <SysPluginView v-if="model === 'view' "  :viewId ="viewId" @open-list-page="openListPage" @go-back="goBack"></SysPluginView>
  </div>
</template>
<script>
import SysPluginList from './SysPluginList'
import SysPluginAdd from './SysPluginAdd'
import SysPluginView from './SysPluginView'
export default {
  components: {
    SysPluginList,
    SysPluginAdd,
    SysPluginView
  },
  data () {
    return {
      editId: null,
      viewId: null,
      model: 'list'
    }
  },
  methods: {
    /** 
     * 打开新增编辑页面
    */
    openAddPage (id) {
       this.editId = id
       this.model = 'add'
      console.log(this.mode)
    },
     /** 
     * 打开列表页面
    */
    openListPage () {
      this.mode = 'list'
      this.$refs.list.fetchData();//更新页面
    },
    //打开详情页
    openViewPage (id) {
      console.log(this.mode)
      this.viewId = id
      this.model = 'view'
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
