<template>
  <RemoteSelect
    ref="selector" 
    :title="title" 
    customClass="container" 
    @select-end="confirmClick"
    @select-cancel="selectCancel"
    :showSelection="false"
    :showClearSelectionBtn="false"
  >
    <el-tabs v-model="currentTab">
      <el-tab-pane v-if="resourceOptions.tabShow['video']" label="影视中心" name="video">
        <MovieFilter
          :multi="multi"
          v-model="selectAll.video"
          :partner="pannelResourceNew"
          :disable-partner="disablePartner"
          @partnerChange="pannelResourceNew=$event"
        ></MovieFilter>
      </el-tab-pane>
      <el-tab-pane v-if="resourceOptions.tabShow['edu']" label="教育中心" name="edu">
        <EduFilter 
           :multi="multi"
           v-model="selectAll.edu"
        ></EduFilter>
      </el-tab-pane>
      <el-tab-pane v-if="resourceOptions.tabShow['live']" label="直播资源" name="live">
        <LiveFilter 
           :multi="multi"
           v-model="selectAll.live"
        ></LiveFilter>
      </el-tab-pane>
      <el-tab-pane v-if="resourceOptions.tabShow['topics']" label="专题资源" name="topics">
        <TopicsFilter 
           :multi="multi"
           v-model="selectAll.topics"
        ></TopicsFilter>
      </el-tab-pane>
      <el-tab-pane v-if="resourceOptions.tabShow['broadcast']" label="轮播频道" name="broadcast">
        <BroadcastFilter 
          :multi="multi"
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
    resourceOptions: {
      type: Object,
      default: {
        multi: 'single',
        tabShow: {
          broadcast: true
        }
      }
    },
    title: String,
  },
  data() {
    return {
      currentTab: 'broadcast',
      disablePartner: true,
      selectAll: {},
      selected: null,
      pannelResourceNew: '',
      pannelResource: '' ,
     // filterItems: null,
      multi: null
    }
  },
  methods: {
     saveSelected: function () {
       debugger
            var _this = this;
            var selectAll = this.selectAll;
            var sortSelected = [];
            if (JSON.stringify(selectAll) !== "{}") {
                for (var type in selectAll) {
                    var selections;
                    if (selectAll[type].length) {
                        selections = selectAll[type];
                    } else {
                        selections = [selectAll[type]];
                    }
                    // console.log(selections);
                    for (var i = 0; i < selections.length; i++) {
                        var selected = selections[i];
                        var s = {
                            title: '',
                            subTitle: '',
                            type: '', // res：影视、教育资源；live：直播；topic：专题；rotate：轮播；url：播放串；
                            pictureUrl: '',
                            thirdIdOrPackageName: '',
                            coverType: 'media',
                            cornerList: [{}, {}, {}, {}]
                            // contentType 影视中心:0 系统功能:1 应用圈:2 教育中心:3 PPTV:4 腾讯直播:6,7:大专题，8:小专题
                            // 新 contentType
                            // movie-影视，custom-自定义，app-应用，edu-教育，pptv-PPTV,txLive-腾讯直播，topic-小专题，bigTopic-大专题，rotate-轮播，ad-广告
                        };
                        switch (type) {
                            case 'video': { //
                                if (_this.singleIdArr.length > 0) {
                                    for (var k = 0; k < _this.singleIdArr.length; k++) {
                                        if (_this.singleIdArr[k] === selected.coocaaVId) {
                                            var singleItem = _this.singleObj.data[k];
                                            s.contentType = 'movie';
                                            if (this.pannelResourceNew === 'o_tencent' || this.pannelResourceNew === 'tencent') {
                                                s.thirdIdOrPackageName = '_otx_' + selected.coocaaVId;
                                                s.extraValue5 = singleItem.coocaaMId;
                                            } else if (this.pannelResourceNew === 'o_iqiyi' || this.pannelResourceNew === 'yinhe') {
                                                s.thirdIdOrPackageName = '_oqy_' + selected.coocaaVId;
                                                s.extraValue5 = singleItem.coocaaMId;
                                            }
                                            s.singleId = singleItem.coocaaMId;
                                            s.platformId = _this.pannelResource;
                                            s.pictureUrl = singleItem.thumb;
                                            s.title = singleItem.urlTitle;
                                            s.subTitle = singleItem.urlSubTitle;
                                            break;
                                        } else {
                                            s.contentType = 'movie';
                                            s.extraValue5 = null;
                                            if (this.pannelResourceNew === 'o_tencent' || this.pannelResourceNew === 'tencent') {
                                                s.thirdIdOrPackageName = '_otx_' + selected.coocaaVId;
                                            } else if (this.pannelResourceNew === 'o_iqiyi' || this.pannelResourceNew === 'yinhe') {
                                                s.thirdIdOrPackageName = '_oqy_' + selected.coocaaVId;
                                            }
                                            s.singleId = '';
                                            s.platformId = selected.source;
                                            s.pictureUrl = selected.thumb;
                                            s.title = selected.title;
                                            s.subTitle = selected.subTitle;
                                            s.type = 'res';
                                        }
                                    }
                                } else {
                                    s.contentType = 'movie';
                                    if (this.pannelResourceNew === 'o_tencent' || this.pannelResourceNew === 'tencent') {
                                        s.thirdIdOrPackageName = '_otx_' + selected.coocaaVId;
                                    } else if (this.pannelResourceNew === 'o_iqiyi' || this.pannelResourceNew === 'yinhe') {
                                        s.thirdIdOrPackageName = '_oqy_' + selected.coocaaVId;
                                    } else {
                                        s.thirdIdOrPackageName = selected.coocaaVId;
                                    }
                                    s.singleId = '';
                                    s.extraValue5 = null;
                                    s.platformId = selected.source;
                                    s.pictureUrl = selected.thumb;
                                    s.title = selected.title;
                                    s.subTitle = selected.subTitle;
                                    s.type = 'res';
                                }
                                break;
                            }
                            case 'app': {
                                s.contentType = 'app';
                                s.coverType = 'app';
                                s.thirdIdOrPackageName = selected.appPackageName;
                                s.pictureUrl = selected.appImageUrl;
                                s.title = selected.appName;
                                s.type = 'app';
                                break;
                            }
                            case 'edu': {
                                s.contentType = 'edu';
                                s.thirdIdOrPackageName = '_otx_' + selected.coocaaVId;
                                s.platformId = selected.source;
                                s.pictureUrl = selected.thumb;
                                s.title = selected.title;
                                s.subTitle = selected.subTitle;
                                s.type = 'res';
                                break;
                            }
                            case 'pptv': {
                                s.contentType = 'pptv';
                                s.thirdIdOrPackageName = 'pptv_tvsports://tvsports_detail?section_id=' + selected.pid + '&from_internal=1';
                                s.title = selected.pTitle;
                                s.type = '';
                                break;
                            }
                            case 'live': {
                                s.contentType = 'txLive';
                                s.thirdIdOrPackageName = '_otx_' + selected.vId + '';
                                s.platformId = selected.source;
                                s.pictureUrl = selected.thumb;
                                s.title = selected.title;
                                s.subTitle = selected.subTitle;
                                s.type = 'live';
                                break;
                            }
                            case 'topics': {
                                selected.dataSign === 'parentTopic' ? s.contentType = 'bigTopic' : s.contentType = 'topic';
                                s.thirdIdOrPackageName = selected.id + '';
                                s.pictureUrl = selected.picture;
                                s.title = selected.title;
                                s.subTitle = selected.subTitle;
                                s.type = 'topic';
                                break;
                            }
                            case 'broadcast': {
                                s.contentType = 'rotate';
                                s.thirdIdOrPackageName = selected.id + '';
                                s.pictureUrl = selected.picture;
                                s.title = selected.title;
                                s.subTitle = selected.subTitle;
                                s.type = 'rotate';
                                break;
                            }
                            default:
                                break;
                        }
                        sortSelected.push(s);
                    }
                }

                if (this.resourceOptions.multi) {
                    this.$emit('save', sortSelected);
                    this.selectAll = {};
                } else { // 单选
                    var selected = {};
                    selected = sortSelected[0];
                    this.$emit('save', selected);
                    this.selectAll = {};
                }

                // console.log(sortSelected);
            } else if (JSON.stringify(this.singleData) !== '{}' && this.customDialog.singleVisible === true) {
                this.customDialog.singleVisible = false;

                this.singleObj.data.push(this.singleData);
                this.singleObj.titleArr.push(this.singleData.urlTitle);
                this.singleObj.singleIndexArr.push(this.singleObj.index);
                this.singleIdArr.push(this.singleObj.selectId);

                var idParam = [];
                var titleArr = [];
                for (var m = 0; m < 10; m++) {
                    idParam.push('');
                    titleArr.push('');
                }

                for (var n = 0; n < 10; n++) {
                    for (var j = 0; j < this.singleObj.singleIndexArr.length; j++) {
                        if (this.singleObj.singleIndexArr[j] === n) {
                            idParam[n] = this.singleIdArr[j];
                            titleArr[n] = this.singleObj.titleArr[j];
                        }
                    }
                }
                this.singleObj.singleIdArr = idParam;
                this.singleObj.titleArrData = titleArr;
            }
            else {
                this.$message('请选择一条记录');
            }

            this.$emit('resourceConfirm');
        },
    confirmClick: function() {
      debugger;
      if(!this.selectAll){
        this.$refs.selector.showDialog = true
        this.$message('请选择一条记录')
      }
      if(this.multi === 'single'){
        const { currentTab, selectAll } = this
        this.selected = selectAll[currentTab]
      //  this.$emit('input', this.selected)
        // selected:选中的行 currentTab:当前Tab
        let callbackParams = this.callbackParam(currentTab, this.selected)
        this.$emit('confirm-click', callbackParams)
      }else{
        let callbackParamsArr = []
         const key = Object.keys(this.selectAll)
          for (let i in key ) {
            callbackParamsArr.push(this.callbackParam( i, this.selectAll[i]))
          }
         this.$emit('confirm-click', callbackParamsArr)
      }
    },
    selectCancel() {
      this.$emit('select-cancel')
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
    debugger
    this.multi = this.resourceOptions.multi? 'multiple':'single'
    debugger 
  },
  mounted: function () {
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
  },
}
</script>

<style lang='stylus' scoped>
.container >>> .content-list .filter-form .el-form, .content-list
  justify-content center
</style>