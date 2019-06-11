/** 功能版块*/
<template>
  <div>
    <MarkPanelList 
     v-show="isShowList" 
     ref="list" 
      @create="handleCreate"
      @read="handleRead"
      @edit="handleEdit"
      @copy="handleCopy"
     >
     </MarkPanelList>
    <MarkPanelInfo 
      v-if="!isShowList" 
       :id="id" 
      :init-mode="mode"
      :version="version"
      @upsert-end="handleUpsertEnd" 
      @go-back="goBack">
    </MarkPanelInfo>
  </div>
</template>
<script>
import MarkPanelList from  './MarkPanelList'
import MarkPanelInfo from './MarkPanelInfo'
export default {
  components: {
    MarkPanelList,
    MarkPanelInfo,
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
      this.id = item.pannelGroupId
      this.mode = 'edit'
      this.isShowList = false
    },
    handleRead(item, version) {
      this.id = item.pannelGroupId
      this.mode = 'read'
      this.version = version
      this.isShowList = false
    },
    handleDelete(selected) {
      this.$service
        .deleteMarkPanel({ 
          id: this.selected.map(item => item.pannelGroupId).join(',')
        }, '删除成功')
        .then(data => {
          this.fetchData()
        })
    },
    handleCopy(item) {
      this.id = item.pannelGroupId
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
