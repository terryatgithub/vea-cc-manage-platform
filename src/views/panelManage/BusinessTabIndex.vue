<template>
  <div>
    <BusinessTabList v-show="isShow" ref="list" @open-add-page="openAddPage"/>
    <BusinessTabAdd v-if="!isShow" :editId="editId" @open-list-page="openListPage" @go-back="goBack"/>
  </div>
</template>

<script>
import BusinessTabList from './BusinessTabList'
import BusinessTabAdd from './BusinessTabAdd'
export default {
  components: {
    BusinessTabList,
    BusinessTabAdd
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