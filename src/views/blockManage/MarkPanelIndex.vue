<template>
  <div>
    <MarkPanelList
      v-show="model === 'list'"
      ref="list"
      @open-add-page="openAddPage"
      @open-view-page="openViewPage"
    ></MarkPanelList>
    <MarkPanelAdd
      v-if="model === 'add'"
      :editId="editId"
      @open-list-page="openListPage"
      @go-back="goBack"
    ></MarkPanelAdd>
    <MarkPanelView
      v-if="model === 'view'"
      :viewId="viewId"
      @pen-list-page="openListPage"
      @go-back="goBack"
    ></MarkPanelView>
  </div>
</template>
<script>
import MarkPanelList from './MarkPanelList'
import MarkPanelAdd from './MarkPanelAdd'
import MarkPanelView from './MarkPanelView'
export default {
  components: {
    MarkPanelList,
    MarkPanelAdd,
    MarkPanelView
  },
  data() {
    return {
      model: 'list',
      editId: null,
      viewId: null
    }
  },
  methods: {
    /**打开新增编辑页 */
    openAddPage(id) {
      this.editId = id
      this.model = 'add'
    },
    /**打开详情页 */
    openViewPage(id) {
      this.viewId = id
      this.model = 'view'
    },
    /**打开列表页 */
    openListPage() {
      this.model = 'list'
      this.$refs.list.fetchData() //更新页面
    },
    /**返回事件 */
    goBack() {
      this.model = 'list'
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>


