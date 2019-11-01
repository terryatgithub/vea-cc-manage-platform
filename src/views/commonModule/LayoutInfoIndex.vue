<template>
  <div class="resource-manager-wrapper">
    <LayoutInfoList
      v-show="isShowList"
      ref="list"
      @create="handleCreate"
      @edit="handleEdit"
      @read="handleRead"
      @delete="handleDelete"
    >
    </LayoutInfoList>
    <LayoutInfo
      v-if="!isShowList"
      :id="id"
      :init-mode="mode"
      :version="version"
      @upsert-end="handleUpsertEnd"
      @go-back="goBack">
    </LayoutInfo>

  </div>
</template>
<script>
import LayoutInfoList from './LayoutInfoList'
import LayoutInfo from './LayoutInfo'
export default {
  components: {
    LayoutInfoList,
    LayoutInfo
  },
  data() {
    return {
      mode: 'list',
      isShowList: true,
      id: undefined,
      version: undefined,
      editData: {},
      reviewData: {}
    }
  },
  methods: {
    handleCreate() {
      this.mode = 'create'
      this.id = undefined
      this.isShowList = false
    },
    handleEdit(row) {
      this.id = row.layoutId
      this.mode = 'edit'
      this.isShowList = false
    },
    handleRead(row) {
      this.id = row.layoutId
      this.mode = 'read'
      this.isShowList = false
    },
    handleDelete(selected) {
      this.$service
        .getLayoutInforBatchDel({
          id: selected.map(item => item.layoutId).join(',')
        }, '删除成功')
        .then(_ => {
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
      this.version = undefined
    }
  }
}
</script>
<style lang="stylus" scoped>
.resource-manager-wrapper
  height 100%
  overflow auto
</style>
