<template>
  <div>
    <PrivatePannelInfoList v-show="model === 'list'" ref="list" @open-add-page="openAddPage" @open-view-page="openViewPage"></PrivatePannelInfoList>
    <PrivatePannelInfoAdd v-if="model === 'add'" :editId="editId" :isCopy="isCopy" @open-list-page="openListPage" @go-back="goBack"></PrivatePannelInfoAdd>
    <PrivatePannelInfoView v-if="model === 'view'" :viewData="viewData" :version="version" @open-list-page="openListPage" @create-copy="createCopy" @go-back="goBack"></PrivatePannelInfoView>
  </div>
</template>
<script>
import PrivatePannelInfoList from './PrivatePannelInfoList'
import PrivatePannelInfoAdd from './PrivatePannelInfoAdd'
import PrivatePannelInfoView from './PrivatePannelInfoView'
export default {
  components: {
    PrivatePannelInfoList,
    PrivatePannelInfoAdd,
    PrivatePannelInfoView
  },
  data() {
    return {
      model: 'list',
      isCopy: false,
      editId: null,
      viewData: null,
      version: undefined
    }
  },
  methods: {
    createCopy(id){
      this.editId = id
      this.model = 'add'
      this.isCopy = true 
    },
    /**打开新增编辑页 */
    openAddPage(id) {
      this.editId = id
      this.model = 'add'
    },
    /**打开列表页 */
    openListPage() {
      this.model = 'list'
      this.$refs.list.fetchData() //更新页面
    },
    /**打开预览页 */
    openViewPage(data, version) {
      this.model = 'view'
      this.viewData = data
      this.version =version
    },
    /**返回事件 */
    goBack() {
      this.model = 'list'
    }
  }
}
</script>
<style lang="stylus" scoped></style>


