<template>
  <RemoteSelect
    ref="selector"
    :title="title"
    customClass="container"
    @select-end="multipleSelect"
    @select-cancel="selectCancel"
    :showSelection="false"
    :showClearSelectionBtn="false"
  >
    <el-tabs v-model="currentTab" v-show= "mode==='list'">
      <el-tab-pane v-if="resourceOptions.tabShow['video']" label="影视中心" name="video">
        <MovieFilter
          :multi="multi"
          v-model="selectAll.video"
          :partner="pannelResourceNew"
          :disable-partner="disablePartner"
          :movie-select="movieSelect"
          @partnerChange="pannelResourceNew=$event"
          @row-click="rowClick($event,'video')"
          @select-single="selectSingle"
        ></MovieFilter>
      </el-tab-pane>
      <el-tab-pane v-if="resourceOptions.tabShow['edu']" label="教育中心" name="edu">
        <EduFilter :multi="multi" 
        v-model="selectAll.edu"
         @row-click="rowClick($event,'edu')"
        ></EduFilter>
      </el-tab-pane>
      <el-tab-pane v-if="resourceOptions.tabShow['live']" label="直播资源" name="live">
        <LiveFilter :multi="multi"
         v-model="selectAll.live"
        @row-click="rowClick($event,'live')"
         ></LiveFilter>
      </el-tab-pane>
      <el-tab-pane v-if="resourceOptions.tabShow['topics']" label="专题资源" name="topics">
        <TopicsFilter 
        :multi="multi" 
        v-model="selectAll.topics"
        @row-click="rowClick($event,'topics')"
        ></TopicsFilter>
      </el-tab-pane>
      <el-tab-pane v-if="resourceOptions.tabShow['broadcast']" label="轮播频道" name="broadcast">
        <BroadcastFilter :multi="multi" 
        @row-click="rowClick($event,'broadcast')"
        v-model="selectAll.broadcast"
        >
        </BroadcastFilter>
      </el-tab-pane>
       <el-tab-pane v-if="resourceOptions.tabShow['app']" label="应用圈" name="app">
        <AppFilter 
        :multi="multi" 
        @row-click="rowClick($event,'app')"
        v-model="selectAll.app"
        >
        </AppFilter>
      </el-tab-pane>
    </el-tabs>
    <MovieSingleFilter v-if="mode==='movieSingleFilter'"
      multi='single'
     @single-select='movieSelectComfirm'
     :params='movieParams'
    ></MovieSingleFilter>
  </RemoteSelect>
</template>

<script>
import MovieFilter from './MovieFilter'
import BroadcastFilter from './BroadcastFilter'
import EduFilter from './EduFilter'
import LiveFilter from './LiveFilter'
import TopicsFilter from './TopicsFilter'
import AppFilter from './AppFilter'
import _ from 'gateschema'
import { RemoteSelect, ContentWrapper, Table } from 'admin-toolkit'
import { filter } from 'minimatch'
import MovieSingleFilter from './MovieSingleFilter'
export default {
  components: {
    RemoteSelect,
    ContentWrapper,
    Table,
    BroadcastFilter,
    MovieFilter,
    EduFilter,
    LiveFilter,
    TopicsFilter,
    MovieSingleFilter,
    AppFilter
  },
  props: {
    resourceOptions: {
      type: Object,
      default: {
        multi: 'single',
        tabShow: {
          broadcast: true
        }
      }
    },
    title: String
  },
  data() {
    return {
      mode: 'list',
      currentTab: 'broadcast',
      movieSelect: null,
      disablePartner: true,
      selectAll: {},
      selected: null,
      pannelResourceNew: '',
      pannelResource: '',
      // filterItems: null,
      multi: null,
      movieParams: null //选择单集打开页面需要传单参数
    }
  },
  methods: {
    /** 
     * 影视选择
    */
    movieSelectComfirm(row) {
      this.mode = 'list'
      this.movieSelect = row
      this.$refs.selector.showDialog = true
    },
    multipleSelect: function() {
      if (!this.selectAll) {
        this.$refs.selector.showDialog = true
        this.$message('请选择一条记录')
      }
      let callbackParamsArr = []
      const keys= Object.keys(this.selectAll)
      for (let i in keys) {
        let k = keys[i]
        this.selectAll[k].forEach(element => {
            callbackParamsArr.push(this.callbackParam(k, element))
        });
      }
      this.$emit('confirm-click', callbackParamsArr)
    },
    selectCancel() {
      if ( this.mode !=='list') {
        this.mode = 'list'
      } else {
        this.$emit('select-cancel')
      }
    },
    selectSingle(params) {
      this.mode = 'movieSingleFilter'
      this.movieParams = params
    },
    /*
    单选时回调函数
     */
    rowClick(row, type) {
      let callbackParams = this.callbackParam(type, row)
      this.$emit('confirm-click', callbackParams)
    },
    callbackParam(tabName, selected) {
      let s = {
        type: '', // 面向客户端
        contentType: '', // 面向管理后台
        thirdIdOrPackageName: ''
      }
      switch (tabName) {
        case 'video': {
          s.contentType = 'movie'
          if (
            this.pannelResourceNew === 'o_tencent' ||
            this.pannelResourceNew === 'tencent'
          ) {
            s.thirdIdOrPackageName = '_otx_' + selected.coocaaVId
          } else if (
            this.pannelResourceNew === 'o_iqiyi' ||
            this.pannelResourceNew === 'yinhe'
          ) {
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
          s.thirdIdOrPackageName =
            'pptv_tvsports://tvsports_detail?section_id=' +
            selected.pid +
            '&from_internal=1'
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
          selected.dataSign === 'parentTopic'
            ? (s.contentType = 'bigTopic')
            : (s.contentType = 'topic')
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
    this.multi = this.resourceOptions.multi ? 'multiple' : 'single'
    let tabShowKeys = Object.keys(this.resourceOptions.tabShow)
    this.currentTab = tabShowKeys[0]
  },
  mounted: function() {
    this.$refs.selector.showDialog = true
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
  }
}
</script>

<style lang='stylus' scoped>
.container >>> .content-list .filter-form .el-form, .content-list
  justify-content: center
</style>