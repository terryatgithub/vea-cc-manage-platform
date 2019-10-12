<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="版面" name="tab">
      <MySubmitTasksList
        resourceType="tab"
        ref="tabList"
        v-show="mode==='tabList'"
        @read="handleRead"
      ></MySubmitTasksList>
      <TabPreview
        :row="previewData"
        @go-back="goBack"
        @upsert-end="handleUpsertEnd"
        v-if="mode==='tabPreview'"
      ></TabPreview>
    </el-tab-pane>
    <el-tab-pane label="版块" name="pannel">
      <MySubmitTasksList
        resourceType="pannel"
        ref="pannelList"
        v-show="mode==='pannelList'"
        @read="handleRead"
      ></MySubmitTasksList>
      <PanelPreview
        :row="previewData"
        @go-back="goBack"
        @upsert-end="handleUpsertEnd"
        v-if="mode==='pannelPreview'"
      ></PanelPreview>
    </el-tab-pane>
    <el-tab-pane label="素材" name="material">
      <MySubmitTasksList 
        resourceType="material" 
        v-show="mode==='materialList'" 
        ref="materialList"
        @read="handleRead">
      </MySubmitTasksList>
      <GlobalPictureUpsert
        v-if="mode==='materialPreview'"
        :edit-id="previewData.resourceId"
        :initMode="'read'"
        @show-list="handleUpsertEnd"
        @go-back="goBack"
      />
    </el-tab-pane>
    <el-tab-pane label="布局" name="layout">
      <MySubmitTasksList 
        resourceType="layout" 
        v-show="mode==='layoutList'" 
        ref="layoutList"
        @read="handleRead">
      </MySubmitTasksList>
      <LayoutInfo
        v-if="mode==='layoutPreview'"
        class="el-tab-preview"
        :id="previewData.resourceId"
        init-mode='read'
        @upsert-end="handleUpsertEnd"
        @go-back="goBack"
      ></LayoutInfo>
    </el-tab-pane>
    <el-tab-pane label="首页" name="homepage">
      <MySubmitTasksList 
        resourceType="homepage" 
        v-show="mode==='homepageList'" 
        ref="homepageList"
        @read="handleRead">
      </MySubmitTasksList>
      <HomePageInfo
        v-if="mode==='homepagePreview'"
        class="el-tab-preview"
        :id="previewData.resourceId"
        :init-mode="'read'"
        :version="undefined"
        @upsert-end="handleUpsertEnd"
        @go-back="goBack"
      ></HomePageInfo>
    </el-tab-pane>
    <el-tab-pane label="策略" name="policy">
      <MySubmitTasksList 
        resourceType="policy" 
        v-show="mode==='policyList'" 
        ref="policyList"
        @read="handleRead">
      </MySubmitTasksList>
        <PolicyManageInfo
          v-if="mode==='policyPreview'"
          class="el-tab-preview"
          :id="previewData.resourceId"
          :init-mode="'read'"
          :version="undefined"
          @upsert-end="handleUpsertEnd"
          @go-back="goBack">
        </PolicyManageInfo>
    </el-tab-pane>
    <el-tab-pane label="主题" name="theme">
      <MySubmitTasksList 
        resourceType="theme" 
        v-show="mode==='themeList'" 
        ref="themeList"
        @read="handleRead">
      </MySubmitTasksList>
      <ThemeInfoAdd
        v-if="mode==='themePreview'"
        :editId="previewData.resourceId"
        :version="undefined"
        :initMode="'read'"
        @open-list-page="handleUpsertEnd"
        @go-back="goBack"
      />
    </el-tab-pane>
    <el-tab-pane label="角标" name="icon">
      <MySubmitTasksList 
        resourceType="icon" 
        v-show="mode==='iconList'" 
        ref="iconList"
        @read="handleRead">
      </MySubmitTasksList>
      <GlobalCornerIcon
        v-if="mode==='iconPreview'"
        :id="previewData.resourceId"
        init-mode="read"
        @upsert-end="handleUpsertEnd"
        @go-back="goBack">
      </GlobalCornerIcon>
    </el-tab-pane>
    <el-tab-pane label="系统功能" name="sysPlugin">
      <MySubmitTasksList 
        resourceType="sysPlugin" 
        v-show="mode==='sysPluginList'" 
        ref="sysPluginList"
        @read="handleRead">
      </MySubmitTasksList>
      <MultiFunctionBlockInfo
        v-if="mode ==='sysPluginPreview'"
        init-mode="read"
        class="el-tab-preview"
        :id="previewData.resourceId"
        :content-props="{
          menuElId: 'multiFunctionBlock'
        }"
        @upsert-end="handleUpsertEnd"
        @go-back="goBack">
      </MultiFunctionBlockInfo>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import MySubmitTasksList from './MySubmitTasksList'
import TabPreview from './TabPreview'
import PanelPreview from './PanelPreview'
import GlobalPictureUpsert from './../commonModule/GlobalPictureUpsert'
import LayoutInfo from './../commonModule/LayoutInfo'
import HomePageInfo from './../homePageManage/HomePageInfo.vue'
import PolicyManageInfo from './../homePageManage/PolicyManageInfo'
import ThemeInfoAdd from './../themeManage/ThemeInfoAdd'
import GlobalCornerIcon from './../commonModule/GlobalCornerIcon'
import MultiFunctionBlockInfo from './../blockInfo/SysPluginInfo'
export default {
  components: {
    MySubmitTasksList,
    PanelPreview,
    TabPreview,
    GlobalPictureUpsert,
    LayoutInfo,
    HomePageInfo,
    PolicyManageInfo,
    ThemeInfoAdd,
    GlobalCornerIcon,
    MultiFunctionBlockInfo
  },
  data() {
    return {
      activeName: 'tab',
      mode: 'tabList',
      preMode: 'tabList',
      previewData: undefined
    }
  },
  methods: {
    handleRead(row, mode) {
      this.previewData = row
      this.preMode = this.mode
      this.mode = mode
    },
    goBack() {
      this.mode = this.preMode
    },
    handleClick(tab) {
      this.mode = this.preMode = tab.name + 'List'
    },
    handleUpsertEnd() {
      this.goBack()
      this.$refs[this.preMode].fetchData()
    }
  }
}
</script>
<style lang="stylus" scoped>
.el-tab-preview >>> .page-content-wrapper {
    position: relative;
    width: 100%;
    top: 0;
}
</style>
