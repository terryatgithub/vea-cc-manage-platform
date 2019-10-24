<template>
  <TabPage>
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
    <component
      v-if="!isShowList"
      :is="tabInfoComponent"
      :content-props="contentProps"
      :id="id"
      :init-mode="mode"
      :version="version"
      @upsert-end="handleUpsertEnd"
      @go-back="goBack"/>
  </TabPage>
</template>
<script>
import TabPage from '@/components/TabPage'
import TabInfoList from './TabInfoList'
import TabInfo from './TabInfo'
import JDTabInfo from './JDTabInfo'
export default {
  components: {
    TabPage,
    TabInfoList,
    TabInfo,
    JDTabInfo
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
  computed: {
    tabInfoComponent () {
      const id = this.id
      return id
        ? id.toString().indexOf('JD') === 0
          ? 'JDTabInfo' 
          : 'TabInfo'
        : 'TabInfo'
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
      if (item.tabType === 4) {
        this.id = item.tabRemark
      }
    },
    handleRead(item, version) {
      this.id = item.tabId
      this.mode = 'read'
      this.version = version
      this.isShowList = false
      if (item.tabType === 4) {
        this.id = item.tabRemark
      }
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
