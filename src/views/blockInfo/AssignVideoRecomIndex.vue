<template>
  <div>
    <AssignVideoRecomList
      v-show="isShowList"
      ref="list"
      @create="handleCreate"
      @read="handleRead"
      @edit="handleEdit"
      @delete="handleDelete"
     >
    </AssignVideoRecomList>
    <AssignVideoRecomInfo
      v-if="!isShowList"
      :id="id"
      :init-mode="mode"
      @upsert-end="handleUpsertEnd"
      @go-back="goBack">
    </AssignVideoRecomInfo>
  </div>
</template>
<script>
import AssignVideoRecomList from './AssignVideoRecomList'
import AssignVideoRecomInfo from './AssignVideoRecomInfo'
export default {
  components: {
    AssignVideoRecomInfo,
    AssignVideoRecomList
  },
  data() {
    return {
      isShowList: true,
      id: undefined,
      mode: 'create',
      version: undefined
    }
  },
  methods: {
    handleUpsertEnd (onlyRefreshList) {
      this.$refs.list.fetchData()// 更新页面
      if (!onlyRefreshList) {
        this.isShowList = true
        this.mode = 'list'
        this.version = undefined
      }
    },
    handleCreate() {
      this.id = undefined
      this.mode = 'create'
      this.isShowList = false
    },
    handleEdit(item) {
      this.id = item.id
      this.mode = 'edit'
      this.isShowList = false
    },
    handleRead(item, version) {
      this.id = item.id
      this.mode = 'read'
      this.version = version
      this.isShowList = false
    },
    handleDelete(selected) {
      this.$service
        .deleteBroadcastBlock({
          id: selected.map(item => item.id).join(',')
        }, '删除成功')
        .then(data => {
          this.$refs.list.fetchData()
        })
    },
    handleCopy(item) {
      this.id = item.id
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
