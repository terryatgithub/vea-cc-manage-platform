<template>
  <div>
    <PrivatePannelInfoList  v-show="model === 'list'" ref="list" @open-add-page="openAddPage"></PrivatePannelInfoList>
    <PrivatePannelInfoAdd v-if="model === 'add'" :editId="editId" @open-list-page="openListPage" @go-back="goBack"></PrivatePannelInfoAdd>
  </div>
</template>
<script>
import PrivatePannelInfoList from './PrivatePannelInfoList'
import PrivatePannelInfoAdd from './PrivatePannelInfoAdd'
export default {
  components: {
    PrivatePannelInfoList,
    PrivatePannelInfoAdd
  },
  data() {
    return {
         model: 'list',
      editId: null,
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
    /**返回事件 */
    goBack() {
      this.model = 'list'
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>


