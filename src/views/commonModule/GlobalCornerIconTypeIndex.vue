<template>
  <div>
    <GlobalCornerIconTypeList v-show="isShowList" ref="list" @openAddPage="openAddPage"></GlobalCornerIconTypeList>
    <GlobalCornerIconTypeAdd
      v-if="!isShowList"
      :editId="editId"
      @openListPage="openListPage"
      @go-back="goBack"
    ></GlobalCornerIconTypeAdd>
  </div>
</template>
<script>
import GlobalCornerIconTypeList from './GlobalCornerIconTypeList'
import GlobalCornerIconTypeAdd from './GlobalCornerIconTypeAdd'
export default {
  components: {
    GlobalCornerIconTypeAdd,
    GlobalCornerIconTypeList
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
    openAddPage(userId) {
      this.editId = userId
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