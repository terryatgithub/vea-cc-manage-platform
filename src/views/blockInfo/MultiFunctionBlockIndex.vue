<template>
  <div>
    <MultiFunctionBlockList 
      v-show="isShowList" 
      ref="list" 
      @create="handleCreate"
      @read="handleRead"
      @edit="handleEdit"
      @delete="handleDelete"
     >
     </MultiFunctionBlockList>
    <MultiFunctionBlockInfo 
      v-if="!isShowList" 
       :id="id" 
      :init-mode="mode"
      :version="version"
      @upsert-end="handleUpsertEnd" 
      @go-back="goBack">
    </MultiFunctionBlockInfo>
  </div>
</template>
<script>
import MultiFunctionBlockList from  './MultiFunctionBlockList'
import MultiFunctionBlockInfo from './MultiFunctionBlockInfo'
export default {
  components: {
    MultiFunctionBlockInfo,
    MultiFunctionBlockList,
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
      this.id = item.pluginId
      this.mode = 'edit'
      this.isShowList = false
    },
    handleRead(item, version) {
      this.id = item.pluginId
      this.mode = 'read'
      this.version = version
      this.isShowList = false
    },
    handleDelete(selected) {
      this.$service
        .deleteBroadcastBlock({ 
          id: selected.map(item => item.pluginId).join(',') 
        }, '删除成功')
        .then(data => {
          this.$refs.list.fetchData()
        })
    },
    handleCopy(item) {
      this.id = item.pluginId
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
