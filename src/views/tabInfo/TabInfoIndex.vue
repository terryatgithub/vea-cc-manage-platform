<template>
  <div>
    <TabInfoList
      v-show="isShowList"
      ref="list"
      @create="handleCreate"
      @read="handleRead"
      @edit="handleEdit"
      @copy="handleCopy"
      @delete="handleDelete"
    />
    <TabInfo
      v-if="!isShowList"
      :id="id"
      :init-mode="mode"
      :version="version"
      @upsert-end="handleUpsertEnd"
      @go-back="goBack"
    ></TabInfo>
  </div>
</template>
<script>
import TabInfoList from './TabInfoList'
import TabInfo from './TabInfo'
export default {
  components: {
    TabInfoList,
    TabInfo
  },
  data() {
    return {
      isShowList: true,
      id: null,
      mode: 'create',
      version: undefined
    }
  },
  methods: {
    handleCreate() {
      this.id = undefined
      this.mode = 'create'
      this.isShowList = false
    },
    handleEdit(item) {
      this.id = item.tabId
      this.mode = 'edit'
      this.isShowList = false
    },
    handleRead(item, version) {
      this.id = item.tabId
      this.mode = 'read'
      this.version = version
      this.isShowList = false
    },
    handleCopy(item) {
      this.id = item.tabId
      this.mode = 'copy'
      this.isShowList = false
    },
    handleDelete(selected) {
      this.$service.tabInfoRemove({ 
        id: selected.map(item => item.tabId).join(',') 
      }, "删除成功")
      .then(() => {
        this.$refs.list.fetchData()
      })
    },
    handleUpsertEnd() {
      this.isShowList = true
      this.$refs.list.fetchData() //更新页面
      this.mode = 'list'
    },
    goBack() {
      this.isShowList = true
      this.mode = 'list'
    }
  }
}
</script>