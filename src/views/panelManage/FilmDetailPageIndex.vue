<template>
  <div class="resource-manager-wrapper">
    <FilmDetailPageList
      v-show="isShowList"
      ref="list"
      @create="handleCreate"
      @read="handleRead"
      @edit="handleEdit"
      @delete="handleDelete"
    />
    <FilmDetailPageAdd
      v-if="!isShowList"
      :id="id"
      :initMode="mode"
      :version = "version"
      @upsert-end="openListPage"
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
      isShowList: true,
      id: undefined,
      mode: '',
      version: ''
    }
  },

  methods: {
    handleCreate () {
      this.id = undefined
      this.mode = 'create'
      this.isShowList = false
    },
    handleEdit (item) {
      this.id = item.tabId
      this.mode = 'edit'
      this.isShowList = false
    },
    handleRead (item, version) {
      this.id = item.tabId
      this.mode = 'read'
      this.version = version
      this.isShowList = false
    },
    handleDelete (selected) {
      this.$service
        .businessTabDelete({
          id: selected.map(item => item.tabId).join(',')
        }, '删除成功')
        .then(data => {
          this.$refs.list.fetchData()
        })
    },
    goBack () {
      this.isShowList = true
    },
    openListPage () {
      this.isShowList = true
      this.$refs.list.fetchData()
    }
  }
}
</script>

<style lang="stylus" scoped>
.resource-manager-wrapper
  height 100%
  overflow auto
</style>
