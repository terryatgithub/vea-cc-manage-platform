<template>
  <div>
    <TabInfoList
      v-show="isShowList"
      ref="list"
      :list-props="listProps"
      @create="handleCreate"
      @read="handleRead"
      @edit="handleEdit"
      @copy="handleCopy"
      @delete="handleDelete"
    />
    <TabInfo
      v-if="!isShowList"
      :content-props="contentProps"
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
  props: ['listProps', 'contentProps'],
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
      }, '删除成功')
        .then(() => {
          this.$refs.list.fetchData()
        })
    },
    handleUpsertEnd (onlyRefreshList) {
      this.$refs.list.fetchData()// 更新页面
      if (!onlyRefreshList) {
        this.isShowList = true
        this.mode = 'list'
        this.version = undefined
      }
    },
    goBack() {
      this.isShowList = true
      this.mode = 'list'
    }
  }
}
</script>
