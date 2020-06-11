<template>
    <TabPage>
        <StreamABTestList
        v-show="isShowList"
        ref="list"
        @create="handleCreate"></StreamABTestList>
        <StreamABTestInfo
        v-if="!isShowList"
        :id="id"
        :version="version"
        :init-mode="mode"
        :status="status"
        @upsert-end="handleUpsertEnd"
        @go-back="goBack"></StreamABTestInfo>
    </TabPage>
</template>
<script>
import TabPage from '@/components/TabPage'
import StreamABTestInfo from './StreamABTestInfo'
import StreamABTestList from './StreamABTestList'
export default {
  components: {
    TabPage,
    StreamABTestList,
    StreamABTestInfo
  },
  data () {
    return {
      isShowList: true,
      id: undefined,
      mode: 'create',
      version: undefined,
      status: undefined
    }
  },
  methods: {
    handleCreate () {
      this.isShowList = false
      this.id = undefined
      this.mode = 'create'
    },
    handleUpsertEnd (onlyRefreshList) {
      this.$refs.list.fetchData()// 更新页面
      if (!onlyRefreshList) {
        this.isShowList = true
        this.mode = 'list'
        this.version = undefined
      }
    },
    goBack () {
      this.isShowList = true
      this.mode = 'list'
      this.version = undefined
    }
  }
}
</script>
