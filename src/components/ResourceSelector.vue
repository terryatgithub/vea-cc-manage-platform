<template>
  <RemoteSelect
    ref="selector" 
    :title="title" 
    customClass="container" 
    @select-end="confirmClick"
    :showSelection="false"
    :showClearSelectionBtn="false"
  >
    <el-tabs v-model="currentTab">
      <el-tab-pane v-if="isShowItem('video')" label="影视中心" name="video">
        <MovieFilter
          :muti="muti"
          v-model="selectAll.video"
          :partner="pannelResourceNew"
          :disable-partner="disablePartner"
          @partnerChange="pannelResourceNew=$event"
        ></MovieFilter>
      </el-tab-pane>
      <el-tab-pane v-if="isShowItem('edu')" label="教育中心" name="edu">
        <EduFilter 
           :muti="muti"
           v-model="selectAll.edu"
        ></EduFilter>
      </el-tab-pane>
      <el-tab-pane v-if="isShowItem('live')" label="直播资源" name="live">
        <LiveFilter 
           :muti="muti"
           v-model="selectAll.live"
        ></LiveFilter>
      </el-tab-pane>
      <el-tab-pane v-if="isShowItem('topics')" label="专题资源" name="topics">
        <TopicsFilter 
           :muti="muti"
           v-model="selectAll.topics"
        ></TopicsFilter>
      </el-tab-pane>
      <el-tab-pane v-if="isShowItem('broadcast')" label="轮播频道" name="broadcast">
        <BroadcastFilter 
          :muti="muti"
          v-model="selectAll.broadcast"
        ></BroadcastFilter>
      </el-tab-pane>
    </el-tabs>
  </RemoteSelect>
</template>

<script>
import MovieFilter from './MovieFilter'
import BroadcastFilter from './BroadcastFilter'
import EduFilter from './EduFilter'
import LiveFilter from './LiveFilter'
import TopicsFilter from './TopicsFilter'
import _ from 'gateschema'
import { RemoteSelect, ContentWrapper, Table } from 'admin-toolkit'
import { filter } from 'minimatch'
export default {
  components: {
    RemoteSelect,
    ContentWrapper,
    Table,
    BroadcastFilter,
    MovieFilter,
    EduFilter,
    LiveFilter,
    TopicsFilter
  },

  props: {
    title: String,
    muti: {
      type: String,
      default() {
        return 'single'
      }
    },
    filterItems: {
      type: Array,
      default() {
        return ['video', 'edu', 'live', 'topics', 'broadcast']
      }
    }
  },

  watch: {
  },

  data() {
    return {
      currentTab: '',
      disablePartner: true,
      selectAll: {},
      selected: null,
      pannelResourceNew: ''
    }
  },

  methods: {
    isShowItem(item) {
      return this.filterItems.indexOf(item) > -1
    },
    confirmClick: function() {
      if(!this.selectAll){
        this.$refs.selector.showDialog = true
        this.$message('请选择一条记录')
      }
      if(this.muti === 'single'){
        const { currentTab, selectAll } = this
        this.selected = selectAll[currentTab]
        this.$emit('input', this.selected)
        // selected:选中的行 currentTab:当前Tab
        let callbackParams = this.callbackParam(currentTab, this.selected)
        this.$emit('confirm-click', callbackParams)
      }else{
        this.$emit('input', this.selectAll)
      }
    },
    
    callbackParam(tabName, selected) {
      let s = {
        type: '',// 面向客户端
        contentType: '',// 面向管理后台
        thirdIdOrPackageName: ''
      }
      switch(tabName) {
        case 'video': {
          s.contentType = 'movie'
          if (this.pannelResourceNew === 'o_tencent' || this.pannelResourceNew === 'tencent') {
              s.thirdIdOrPackageName = '_otx_' + selected.coocaaVId
          } else if (this.pannelResourceNew === 'o_iqiyi' || this.pannelResourceNew === 'yinhe') {
              s.thirdIdOrPackageName = '_oqy_' + selected.coocaaVId
          } else {
              s.thirdIdOrPackageName = selected.coocaaVId
          }
          // s.singleId = ''
          // s.extraValue5 = null
          // s.platformId = selected.source
          s.pictureUrl = selected.thumb
          s.title = selected.title
          s.subTitle = selected.subTitle
          s.type = 'res'
          break
        }
        case 'app': {
          s.contentType = 'app'
          s.coverType = 'app'
          s.thirdIdOrPackageName = selected.appPackageName
          s.pictureUrl = selected.appImageUrl
          s.title = selected.appName
          s.type = 'app'
          break
        }
        case 'edu': {
          s.contentType = 'edu'
          s.thirdIdOrPackageName = '_otx_' + selected.coocaaVId
          s.platformId = selected.source
          s.pictureUrl = selected.thumb
          s.title = selected.title
          s.subTitle = selected.subTitle
          s.type = 'res'
          break
        }
        case 'pptv': {
          s.contentType = 'pptv'
          s.thirdIdOrPackageName = 'pptv_tvsports://tvsports_detail?section_id=' + selected.pid + '&from_internal=1'
          s.title = selected.pTitle
          s.type = ''
          break
        }
        case 'live': {
          s.contentType = 'txLive'
          s.thirdIdOrPackageName = '_otx_' + selected.vId + ''
          s.platformId = selected.source
          s.pictureUrl = selected.thumb
          s.title = selected.title
          s.subTitle = selected.subTitle
          s.type = 'live'
          break
        }
        case 'topics': {
          selected.dataSign === 'parentTopic' ? s.contentType = 'bigTopic' : s.contentType = 'topic'
          s.thirdIdOrPackageName = selected.id + ''
          s.pictureUrl = selected.picture
          s.title = selected.title
          s.subTitle = selected.subTitle
          s.type = 'topic'
          break
        }
        case 'broadcast': {
          s.contentType = 'rotate'
          s.thirdIdOrPackageName = selected.id + ''
          s.pictureUrl = selected.picture
          s.title = selected.title
          s.subTitle = selected.subTitle
          s.type = 'rotate'
          break
        }
        default:
        break
      }
      return s
    }
  },
  created() {
    this.currentTab = this.filterItems[0]
  },
  mounted: function () {
    switch (this.pannelResource) {
        case 'o_tencent':
            this.pannelResourceNew = 'tencent'
            this.disablePartner = true
            break
        case 'o_iqiyi':
            this.pannelResourceNew = 'yinhe'
            this.disablePartner = true
            break
        case 'o_voole':
            this.pannelResourceNew = 'voole'
            this.disablePartner = true
            break
        default:
            this.pannelResourceNew = 'tencent'
            this.disablePartner = false
    }
  },
}
</script>

<style lang='stylus' scoped>
.container >>> .content-list .filter-form .el-form, .content-list
  justify-content center
</style>