<template>
  <div>
    <FilmDetailPageList v-show="isShow" ref="list" @open-add-page="openAddPage"/>
    <FilmDetailPageAdd v-if="!isShow" :editId="editId" @open-list-page="openListPage" @go-back="goBack"/>
  </div>
</template>

<script>
import FilmDetailPageList from './FilmDetailPageList'
import FilmDetailPageAdd from './FilmDetailPageAdd'
export default {
  components: {
    FilmDetailPageList,
    FilmDetailPageAdd
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