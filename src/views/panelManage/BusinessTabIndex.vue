<template>
  <div>
    <BusinessTabList 
     v-show="isShowList" 
     ref="list" 
      @create="handleCreate"
      @read="handleRead"
      @edit="handleEdit"
      @copy="handleCopy"
      @delete="handleDelete"
     >
     </BusinessTabList>
    <BusinessTabInfo 
      v-if="!isShowList" 
       :id="id" 
      :init-mode="mode"
      :version="version"
      @upsert-end="handleUpsertEnd" 
      @go-back="goBack">
    </BusinessTabInfo>
  </div>
</template>
<script>
import BusinessTabList from  './BusinessTabList'
import BusinessTabInfo from './BusinessTabInfo'
export default {
  components: {
    BusinessTabList,
    BusinessTabInfo,
  },
  data() {
    return {
      isShowList: true,
      id: undefined,
      mode: 'create',
      version: undefined
    };
  },
  methods: {
    handleUpsertEnd () {
      this.isShowList = true
      this.$refs.list.fetchData();//更新页面
      this.mode = 'list'
      this.version = undefined
    },
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
    handleDelete(selected) {
      this.$service
        .businessTabDelete({ 
          id: selected.map(item => item.tabId).join(',') 
        }, '删除成功')
        .then(data => {
          this.$refs.list.fetchData()
        })
    },
    handleCopy(item) {
      this.id = item.tabId
      this.mode = 'copy'
      this.isShowList = false
    },
    /**
     * 新增编辑里面的返回事件
    */
    goBack () {
     this.isShowList = true
     this.mode = 'list'
     this.version = undefined
    }
  }
}
</script>
<!--声明语言，并且添加scoped-->
<style lang="stylus" scoped>
</style>
