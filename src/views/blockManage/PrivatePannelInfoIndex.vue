<template>
  <div>
    <PrivatePannelInfoList
      v-show="model === 'list'"
      ref="list"
      @open-add-page="openAddPage"
      @open-view-page="openViewPage"
    ></PrivatePannelInfoList>
    <PrivatePannelInfoAdd
      v-if="model === 'add'"
      :editId="editId"
      @open-list-page="openListPage"
      @go-back="goBack"
    ></PrivatePannelInfoAdd>
    <PrivatePannelInfoView
      v-if="model === 'view'"
      :viewData="viewData"
      @open-list-page="openListPage"
       @open-add-page="openAddPage"
      @go-back="goBack"
    ></PrivatePannelInfoView>
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
      editId: null,
      viewData: null
    }
  },
  methods: {
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
    openViewPage(data) {
      this.model = 'view'
      this.viewData = data
    },
    /**返回事件 */
    goBack() {
      this.model = 'list'
    }
  }
}
</script>
<style lang="stylus" scoped></style>


