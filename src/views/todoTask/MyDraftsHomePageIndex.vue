<template>
  <div>
    <MyDraftsHomePage
      v-show="isShowList"
      ref="list"
      @read="handleRead"
     >
     </MyDraftsHomePage>
      <HomePageInfo
      v-if='!isShowList'
      :id="id"
      :init-mode="mode"
      :version="version"
      @upsert-end="handleUpsertEnd"
      @go-back="goBack">
    </HomePageInfo>
  </div>
</template>
<script>
import HomePageInfo from './../homePageManage/HomePageInfo.vue' // 常规运营
import MyDraftsHomePage from './MyDraftsHomePage.vue'
// pannelType 1 为 常规运营 8 为功能版块 3 为业务专辑 9 专属影院
export default {
  components: {
    MyDraftsHomePage,
    HomePageInfo
  },
  data() {
    return {
      isShowList: true,
      id: undefined,
      mode: 'create',
      version: undefined,
      pannelType: undefined
    }
  },
  methods: {
    handleUpsertEnd (onlyRefreshList) {
      this.$refs.list.fetchData()// 更新页面
      this.isShowList = true
      this.mode = 'list'
      this.version = undefined
    },
    handleRead(row) {
      this.id = row.homepageId
      this.mode = 'read'
      this.version = row.currentVersion
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
