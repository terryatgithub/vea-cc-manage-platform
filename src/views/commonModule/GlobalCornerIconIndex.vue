<template>
  <div>
    <GlobalCornerIconList v-show='isShowList' ref="list" @open-add-page="openAddPage"></GlobalCornerIconList>
    <GlobalCornerIconAdd v-if='!isShowList' :editId="editId" @open-list-page="openListPage" @go-back="goBack"></GlobalCornerIconAdd>
  </div>
</template>
<script>
import GlobalCornerIconList from './GlobalCornerIconList'
import GlobalCornerIconAdd from './GlobalCornerIconAdd'
export default {
  components: {
    GlobalCornerIconList,
    GlobalCornerIconAdd
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
    openAddPage (id) {
      this.editId = id
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

