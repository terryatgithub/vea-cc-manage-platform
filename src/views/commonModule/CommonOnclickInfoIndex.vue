<template>
  <div>
    <CommonOnclickInfoList
      v-show='isShowList'
      ref="list"
      @create="handleCreate"
      @edit="handleEdit"
      @delete="handleDelete"/>

    <CommonOnclickInfo
      v-if='!isShowList'
      :editId="id"
      @openListPage="handleUpsertEnd"
      @go-back="goBack"/>
  </div>
</template>
<script>
import CommonOnclickInfo from './CommonOnclickInfo'
import CommonOnclickInfoList from './CommonOnclickInfoList'
export default {
  components: {
    CommonOnclickInfo,
    CommonOnclickInfoList
  },
  data () {
    return {
      isShowList: true,
      mode: 'list',
      id: null
    }
  },
  methods: {
    handleCreate() {
      this.mode = 'create'
      this.id = undefined
      this.isShowList = false
    },
    handleEdit(row) {
      this.id = row.commonOnclickId
      this.mode = 'edit'
      this.isShowList = false
    },
    handleRead(row) {
      this.id = row.commonOnclickId
      this.mode = 'read'
      this.isShowList = false
    },
    handleDelete(selected) {
      this.$service
        .commonOnclickInfoDelete({
          id: selected.map(item => item.commonOnclickId).join(',')
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
