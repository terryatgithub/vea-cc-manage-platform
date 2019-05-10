<template>
  <div>
    <ThemeInfoList
      v-show="isShowList"
      ref="list"
      @open-add-page="openAddPage"
    />
    <ThemeInfoAdd
      v-if="!isShowList"
      :editId="editId"
      :version="version"
      :initMode="mode"
      @open-list-page="openListPage"
      @go-back="goBack"
    />
  </div>
</template>

<script>
import ThemeInfoList from './ThemeInfoList'
import ThemeInfoAdd from './ThemeInfoAdd'

export default {
  components: {
    ThemeInfoList,
    ThemeInfoAdd
  },

  data() {
    return {
      isShowList: true,
      editId: null,
      version: null,
      mode: ''
    }
  },

  methods: {
    openAddPage(editId, mode, version) {
      this.editId = editId
      this.isShowList = false
      this.mode = mode
      this.version = version
    },
    goBack() {
      this.isShowList = true
    },
    openListPage() {
      this.isShowList = true
      this.$refs.list.fetchData()
    }
  }
}
</script>

<style lang='stylus' scoped></style>
