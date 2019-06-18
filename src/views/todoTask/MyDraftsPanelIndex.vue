<template>
  <div>
    <MyDraftsPanel 
      v-show="isShowList" 
      ref="list" 
      @read="handleRead"
     >
     </MyDraftsPanel>
     <MarkPanelInfo 
      v-if="!isShowList&&pannelType===8"
       :id="id" 
      :init-mode="mode"
      :version="version"
      @upsert-end="handleUpsertEnd" 
      @go-back="goBack">
    </MarkPanelInfo>
    <PanelInfo 
       v-if="!isShowList&&pannelType===1"
      :id="id" 
      :panel-data-type="1"
      :init-mode="mode"
      :version="version"
      @upsert-end="handleUpsertEnd" 
      @go-back="goBack">
    </PanelInfo>
        <PanelInfo 
       v-if="!isShowList&&pannelType===3"
      :id="id" 
      :panel-data-type="3"
      :init-mode="mode"
      :version="version"
      @upsert-end="handleUpsertEnd" 
      @go-back="goBack">
    </PanelInfo>
    <PrivatePannelInfo 
    v-if="!isShowList&&pannelType===9"
       :id="id" 
      :init-mode="mode"
      :version="version"
      @upsert-end="handleUpsertEnd" 
      @go-back="goBack">
    </PrivatePannelInfo>
  </div>
</template>
<script>
 import PanelInfo from  './../panelInfo/PanelInfo.vue' //常规运营
 import MarkPanelInfo from './../blockManage/MarkPanelInfo' //为功能版块
 import PrivatePannelInfo from './../blockManage/PrivatePannelInfo.vue' // 专属影院
 import MyDraftsPanel from './MyDraftsPanel.vue'
 // pannelType 1 为 常规运营 8 为功能版块 3 为业务专辑 9 专属影院
export default {
  components: {
    PanelInfo,
    MarkPanelInfo,
    PrivatePannelInfo, 
    MyDraftsPanel 
  },
  data() {
    return {
      isShowList: true,
      id: undefined,
      mode: 'create',
      version: undefined,
      pannelType: undefined
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
      this.id = row.pannelGroupId
      this.mode = 'read'
      this.version = row.currentVersion
      this.isShowList = false
      this.pannelType = parseInt(row.pannelType)
      console.log(row.pannelType)
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
