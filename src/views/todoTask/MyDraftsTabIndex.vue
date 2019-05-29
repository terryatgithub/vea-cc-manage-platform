<template>
  <div>
    <MyDraftsTab 
     v-show="isShowList" 
     ref="list" 
      @read="handleRead"
     >
     </MyDraftsTab>
    <FilmDetailPageAdd
      v-if="!isShowList&&tabParentType==='special'"
      :id="id"
      :initMode="mode"
      :version = "version"
      @go-back="goBack"
      @open-list-page="handleUpsertEnd"
    />
      <BusinessTabInfo 
      v-if="!isShowList&&tabParentType==='biz'"
       :id="id" 
      :init-mode="mode"
      :version="version"
       @upsert-end="handleUpsertEnd"
      @go-back="goBack">
    </BusinessTabInfo>
      <TabInfo
      v-if="!isShowList&&tabParentType==='home'"
      :id="id"
      :init-mode="mode"
      @upsert-end="handleUpsertEnd"
      @go-back="goBack"
    ></TabInfo>
  </div>
</template>
<script>
 import FilmDetailPageAdd from  './../panelManage/FilmDetailPageAdd'
 import BusinessTabInfo from './../panelManage/BusinessTabInfo'
 import TabInfo from './../tabInfo/TabInfo.vue'
 import MyDraftsTab from './MyDraftsTab'
export default {
  components: {
    FilmDetailPageAdd, //tabParentType = special
    MyDraftsTab,
    TabInfo, //tabParentType = home
    BusinessTabInfo // tabParentType = biz 
  },
  data() {
    return {
      isShowList: true,
      id: undefined,
      mode: 'create',
      version: undefined,
      tabParentType: undefined
    };
  },
  methods: {
    handleUpsertEnd () {
      this.isShowList = true
      this.$refs.list.fetchData();//更新页面
      this.mode = 'list'
      this.version = undefined
    },
    handleRead(row) {
      this.id = row.tabId
      this.mode = 'read'
      this.version = row.currentVersion
      this.isShowList = false
      this.tabParentType = row.tabParentType
      console.log(row.tabParentType)
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
