<template>
  <div>
    <LayoutInfoList v-show="isShowList" ref="list" @openAddPage="openAddPage"></LayoutInfoList>
    <LayoutInfoAdd
      v-if="!isShowList"
      :editId="editId"
      @openListPage="openListPage"
      @go-back="goBack"
    ></LayoutInfoAdd>
  </div>
</template>
<script>
import LayoutInfoAdd from './LayoutInfoAdd'
import LayoutInfoList from './LayoutInfoList'
export default {
  components: {
    LayoutInfoAdd,
    LayoutInfoList
  },
  data() {
    return {
      isShowList: true,
      editId: null
    }
  },
  methods: {
    /**
     * 打开新增编辑页面
     */
    openAddPage(id) {
      this.editId = id
      this.isShowList = false
    },
    /**
     * 打开列表页面
     */
    openListPage() {
      this.isShowList = true
      this.$refs.list.fetchData() // 更新页面
    },
    /**
     * 新增编辑里面的返回事件
     */
    goBack() {
      this.isShowList = true
    }
  }
}
</script>