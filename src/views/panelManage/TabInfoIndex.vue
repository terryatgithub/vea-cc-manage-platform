<template>
  <div>
    <TabInfoList v-show="isShow" ref="list" @open-add-page="openAddPage" @open-review-page="openAddPage"/>
    <TabInfoAdd v-if="!isShow"  :editId="editId" @open-list-page="openListPage" @go-back="goBack"/>
  </div>
</template>

<script>
import TabInfoList from './TabInfoList'
import TabInfoAdd from './TabInfoAdd'

export default {
  components: {
    TabInfoList,
    TabInfoAdd
  },

  data () {
    return {
      isShow: true,
      editId: ''
    };
  },

  methods: {
    openAddPage(editId) {
      this.editId = editId
      this.isShow = false
    },
    goBack() {
      this.isShow = true
    },
    openListPage() {
      this.isShow = true
      this.$refs.list.fetchData()
    }
  },
  created() {}

}
</script>

<style lang='stylus' scoped>
</style>