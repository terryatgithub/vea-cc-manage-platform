<template>
  <div>
    <SysMenuList v-show='isShowList' ref="list" @open-add-page="openAddPage"></SysMenuList>
    <SysMenuAdd v-if='!isShowList' :editId="editId" @open-list-page="openListPage" @go-back="goBack"></SysMenuAdd>
  </div>
</template>
<script>
import SysMenuAdd from './SysMenuAdd'
import SysMenuList from './SysMenuList'
export default {
  components: {
    SysMenuAdd,
    SysMenuList
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
    openAddPage (menuId) {
      this.editId = menuId
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
