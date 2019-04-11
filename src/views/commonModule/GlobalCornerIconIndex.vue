<template>
  <div>
    <GlobalCornerIconList v-show="model === 'list'" ref="list" @open-add-page="openAddPage" @open-view-page="openViewPage"></GlobalCornerIconList>
    <GlobalCornerIconAdd v-if="model === 'add'" :editId="editId"  @open-list-page="openListPage" @go-back="goBack"></GlobalCornerIconAdd>
    <GlobalCornerIconView v-if="model ==='view'" :viewId="viewId" @open-list-page="openListPage" @open-add-page="openAddPage" @go-back="goBack"></GlobalCornerIconView>
  </div>
</template>
<script>
import GlobalCornerIconList from './GlobalCornerIconList'
import GlobalCornerIconAdd from './GlobalCornerIconAdd'
import GlobalCornerIconView from './GlobalCornerIconView'
export default {
  components: {
    GlobalCornerIconList,
    GlobalCornerIconAdd,
    GlobalCornerIconView
  },
  data() {
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
    openAddPage(id) {
      this.editId = id
      this.model = 'add'
    },
    /**
     * 打开列表页面
     */
    openListPage() {
      this.model = 'list'
      this.$refs.list.fetchData() // 更新页面
    },
    /**
     * 打开预览页面
     */
    openViewPage(id) {
      this.model = 'view'
      this.viewId = id
    },
    /**
     * 新增编辑里面的返回事件
     */
    goBack() {
      this.model = 'list'
    }
  }
}
</script>