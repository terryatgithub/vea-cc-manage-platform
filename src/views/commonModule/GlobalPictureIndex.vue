<template>
  <div>
    <GlobalPictureList
      v-show="isShowList"
      ref="list"
      @create="handleCreate"
      @edit="handleEdit"
      @read="handleRead"
      @delete="handleDelete"
    />
    <GlobalPictureUpsert
      v-if="!isShowList"
      :edit-id="editId"
      :initMode="mode"
      @show-list="openListPage"
      @go-back="goBack"
    />
  </div>
</template>
<script>
import GlobalPictureUpsert from './GlobalPictureUpsert'
import GlobalPictureList from './GlobalPictureList'
export default {
  components: {
    GlobalPictureUpsert,
    GlobalPictureList
  },
  data() {
    return {
      isShowList: true,
      editId: null,
      mode: undefined
    }
  },
  methods: {
    goBack() {
      this.isShowList = true
    },
    handleCreate(item) {
      this.editId = undefined
      this.isShowList = false
      this.mode = 'create'
    },
    handleEdit(item) {
      this.editId = item.pictureId
      this.isShowList = false
      this.mode = 'edit'
    },
    handleRead(item) {
      this.editId = item.pictureId
      this.mode = 'read'
      this.isShowList = false
    },
    handleDelete(selected) {
      this.$service
        .materialBatchDelete({
          id: selected.map(item => item.pictureId).join(',')
        }, '删除成功')
        .then(data => {
          this.$refs.list.fetchData()
        })
    },
    /**
     * 打开列表页面
     */
    openListPage() {
      this.isShowList = true
      this.$refs.list.fetchData() // 更新页面
    }
  }
}
</script>
