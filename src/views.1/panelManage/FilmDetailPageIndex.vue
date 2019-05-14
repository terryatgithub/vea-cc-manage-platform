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
      :duplicateVersionVersion = "duplicateVersionVersion"
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
      mode: '',
      duplicateVersionVersion: ''
    }
  },

  methods: {
    openAddPage(editId, mode, version) {
      this.editId = editId
      this.isShow = false
      this.mode = mode
      this.duplicateVersionVersion = version
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
