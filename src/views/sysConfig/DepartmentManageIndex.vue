<template>
  <div>
    <DepartmentManageList v-show='isShowList' ref="list" @open-add-page="openAddPage"></DepartmentManageList>
    <DepartmentManageAdd v-if='!isShowList' :editId="editId" @open-list-page="openListPage" @go-back="goBack"></DepartmentManageAdd>
  </div>
</template>

<script>
import DepartmentManageList from './DepartmentManageList.vue'
import DepartmentManageAdd from './DepartmentManageAdd.vue'
export default {
  components: {
    DepartmentManageList,
    DepartmentManageAdd
  },

  data () {
    return {
      isShowList: true,
      editId: null
    }
  },

  methods: {
    /**
     * 打开新增编辑页面
    */
    openAddPage (deptId) {
      this.editId = deptId
      this.isShowList = false
    },
    /**
     * 打开列表页面
    */
    openListPage () {
      this.isShowList = true
      this.$refs.list.fetchData()// 更新页面
    },
    /**
     * 新增编辑里面的返回事件
    */
    goBack () {
      this.isShowList = true
    }
  }
}
</script>

<style lang='stylus' scoped>
</style>
