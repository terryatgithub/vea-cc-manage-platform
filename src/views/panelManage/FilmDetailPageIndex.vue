<template>
  <div>
    <FilmDetailPageList
      v-show="isShow"
      ref="list"
      @open-add-page="openAddPage"
    />
    <FilmDetailPageAdd
      v-if="!isShow"
      :editId="editId"
      :initMode="mode"
      @open-list-page="openListPage"
      @go-back="goBack"
    />
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
      editId: '',
      mode: ''
    }
  },

  methods: {
    openAddPage(editId, mode) {
      this.editId = editId
      this.isShow = false
      this.mode = mode
    },
    goBack() {
      this.isShow = true
    },
    openListPage() {
      this.isShow = true
      this.$refs.list.fetchData()
    }
  }
}
</script>

<style lang='stylus' scoped>
</style>
