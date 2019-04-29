<template>
  <div>
    <TabInfoList 
      v-show='isShowList' 
      ref="list" 
      @create="handleCreate"
      @read="handleRead"
      @edit="handleEdit"
      @copy="handleCopy"
    />
    <TabInfo 
      v-if='!isShowList' 
      :id="id" 
      :init-mode="mode"
      @upsert-end="handleUpsertEnd" 
      @go-back="goBack">
    </TabInfo>
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
  data () {
    return {
      isShowList: true,
      id: null,
      mode: 'create'
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
    handleRead(item) {
      this.id = item.tabId
      this.mode = 'read'
      this.isShowList = false
    },
    handleCopy(item) {
      this.id = item.tabId
      this.mode = 'copy'
      this.isShowList = false
    },
    handleUpsertEnd () {
      this.isShowList = true
      this.$refs.list.fetchData();//更新页面
      this.mode = 'list'
    },
    goBack () {
     this.isShowList = true
     this.mode = 'list'
    }
  }
}
</script>