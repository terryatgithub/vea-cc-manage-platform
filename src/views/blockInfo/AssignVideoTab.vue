<template>
  <div>
    <el-row class="header">
      <el-col :span="4" class="video-index">影片{{index+1}}</el-col>
      <el-col :span="14">置顶值<InputPositiveInt v-model="value.priority" class="num-input" @blur="$emit('blur')"/></el-col>
      <el-col :span="2">
        <el-button type="text" @click="flagRec=!flagRec">{{flagRec? '未屏蔽' : '屏蔽'}}</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="text" @click="$emit('handle-delTab', index)">删除</el-button>
      </el-col>
    </el-row>
    <div class="container">
      <el-form label-width="150px">
        <el-form-item label="视频海报">
          <GlobalPictureSelector 
            title="选择资源" 
            @select-end="handleSelectPostEnd"
          >
          </GlobalPictureSelector>
          <el-tag
            type="success"
            class="marginL"
            v-show="videoId"
          >已选择：{{videoId}}</el-tag>
        </el-form-item>
        <el-form-item label="主标题" :rules="rules.title">
          <el-input v-model="value.title" class="title-input"/>
        </el-form-item>
        <el-form-item label="副标题">
          <el-input v-model="value.subTitle" class="title-input"/>
        </el-form-item>
        <el-form-item label="图片海报" :rules="rules.picList">
          <div class="poster--wrapper">
            <div v-for="(picPoster, index) in picPosters" class="poster--container">
              <div 
                :style="computePicStyle(picPoster.width, picPoster.height)" 
                class="poster--pic"
                @click="handlePicClick(index)"
              >
                <img
                  ref="img"
                  v-show="picPoster.pictureUrl"
                  :src="picPoster.pictureUrl"
                  class="poster-image"
                  referrerpolicy="no-referrer"
                />
                <i class="el-icon-close poster--del" @click.stop="handleDelPoster(index)"/>
              </div>
            </div>
          </div>
          <div v-if="picPosters.length!==0">
            <el-checkbox v-model="notShowSeries">不展示期数</el-checkbox>
            <el-checkbox v-model="notShowScore">不展示评分</el-checkbox>
          </div>
        </el-form-item>
        <el-form-item label="点击类型" :rules="rules.required">
          <el-radio-group v-model="clickType">
            <el-radio label="detail">点击进详情页</el-radio>
            <el-radio label="play-fullscreen">点击全屏播放</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="内容资源" :rules="rules.thirdIdOrPackageName">
          <ResourceSelector
            ref="resourceSelector"
            :is-live="false"
            :selectors="resourceOptions"
            selection-type="single"
            :source="source"
            @select-end="handleSelectResourcesEnd"
          >
            <el-button type="primary" plain>选择资源</el-button>
          </ResourceSelector>
          <el-tag
            type="success"
            class="marginL"
            v-show="thirdIdOrPackageName"
            >已选择：{{thirdIdOrPackageName}}</el-tag>
        </el-form-item>
        
      </el-form>
    </div>

    <!-- 海报弹框  -->
    <el-dialog :visible.sync="isVisiablePosterSelector" width="1200px">
      <DialogPicture
        :pictureResolution="computeResolution()"
        v-if="isVisiablePosterSelector"
        v-model="currentSelectPic"
      ></DialogPicture>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isVisiablePosterSelector = false">取 消</el-button>
        <el-button type="primary" @click="savePicture">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 海报弹框 end -->
  </div>
</template>
  
<script>
import InputPositiveInt from '@/components/InputPositiveInt'
import ResourceSelector from '@/components/ResourceSelector/ResourceSelector'
import DialogPicture from '@/components/DialogPicture'
import GlobalPictureSelector from '@/components/selectors/GlobalPictureSelector'
import { cloneDeep } from 'lodash'

const resourceOptions = ['video', 'edu', 'pptv', 'live', 'topic', 'rotate']
export default {
  components: {
    InputPositiveInt,
    ResourceSelector,
    DialogPicture,
    GlobalPictureSelector
  },
  data() {
    return {
      picPosters: [],
      clickType: 'detail',
      isVisiablePosterSelector: false,
      currentSelectPic: undefined,  // 当前选择的图片海报
      currentPicIndex: undefined,
      resourceOptions,
      thirdIdOrPackageName: undefined,
      videoId: undefined,
      flagRec: false,
      rules: {
        thirdIdOrPackageName: [
          { required: true }
        ],
        title: [
          { required: true, message: '请输入主标题', trigger: 'blur' }
        ],
        picList: [
          { required: true }
        ],
        required: [
          { required: true }
        ]
      },
      notShowSeries: false,
      notShowScore: false
    }
  },
  props: {
    value: {
      type: Object,
      default() {
        return {
          id: undefined,
          mediaResourceId: undefined,
          title: undefined,
          subTitle: undefined,
          priority: undefined,
          picInfoList: undefined,
          flagRec: undefined,
          coverType: 'media',
          clickType: 'detail'
        }
      }
    },
    index: Number,
    source: String,
    'input-tags': {
      type: Array,
      default() {
        return []
      }
    }
  },

  watch: {
    value: {
      handler: function(val) {
        this.$emit('input', val)
      },
      deep: true,
      immediate: true
    },
    flagRec: {
      handler: function(val) {
        this.value.flagRec = val ? 1 : 0
      },
      immediate: true
    },
    clickType: {
      handler: function(val) {
        this.value.clickType = val
      },
      immediate: true
    },
    'inputTags.length': {
      handler: function(val, old) {
        let inputTags = this.inputTags
        let picPosters = this.picPosters
        if(val > old) { // 增加尺寸
          let newPic = {...cloneDeep(inputTags[old]), pictureUrl: undefined}
          picPosters.push(newPic)
        }
        if(val < old) { // 删除尺寸
          let delIndex = -1
          picPosters.some((item, index) => {
            if(item !== inputTags[index]) {
              delIndex = index
              return true
            }
          })
          picPosters.splice(delIndex, 1)
        }
      },
      immediate: true
    },
    notShowSeries: {
      handler: function(val) {
        this.value.showSeries = val ? 0 : 1
      },
      immediate: true
    },
    notShowScore: {
      handler: function(val) {
        this.value.showScore = val ? 0 : 1
      },
      immediate: true
    },
    videoId(val) {
      this.value.videoId = val
    }
  },
  methods: {
    handleSelectResourcesEnd(selectedResources) {
      console.log('selectedResources', selectedResources);
      const { resourceOptions, source } = this
      const tabName = resourceOptions.map(item=> {
        if(selectedResources[item].length === 1) {
          return item
        }
      }).join("")
      let data = this.callbackParam(tabName, selectedResources[tabName][0], source)
      this.thirdIdOrPackageName = data.thirdIdOrPackageName
      let selected = Object.assign({}, data)
      selected.vid = data.vid
      selected.sid = data.sid
      const clickParams = JSON.stringify(this.paramIdFun(selected))
      const { thirdIdOrPackageName, title, subTitle } = data
      this.value.mediaResourceId = thirdIdOrPackageName
      this.value.title = title
      this.value.subTitle = subTitle
      this.value.clickParams = clickParams
      this.value.coverType = 'media'
      let anotherName = tabName
      switch(tabName){
        case 'video': 
          anotherName = 'movie'
          break
        case 'live':
          anotherName = 'txLive'
          break
      }
      this.value.clickTemplateType = anotherName,
      this.value.videoContentType = anotherName
    },
    handleDelPoster(index) {
      let delUrl = this.picPosters[index].pictureUrl
      let delndex = this.value.picList.indexOf(delUrl)
      this.picPosters[index].pictureUrl = undefined
      this.value.picList.splice(delndex, 1)
    },
    computePicStyle(width, height) {
      return {
        width: width + 'px',
        height: height +'px'
      }
    },
    savePicture() {
      const { currentPicIndex, currentSelectPic } = this
      this.picPosters[currentPicIndex].pictureUrl = currentSelectPic.pictureUrl
      this.value.picList.push(currentSelectPic.pictureUrl)
      this.currentPicIndex = undefined
      this.currentSelectPic = undefined
      this.isVisiablePosterSelector = false
    },
    handlePicClick(index) {
      this.isVisiablePosterSelector = true
      this.currentPicIndex = index
    },
    /**
     * 资源转换
     */
    callbackParam(tabName, selected, sourceType) {
      let s = {
        type: '', // 面向客户端
        contentType: '', // 面向管理后台
        thirdIdOrPackageName: ''
      }
      const prefixMap = {
        tencent: '_otx_',
        o_tencent: '_otx_',
        yinhe: '_oqy_',
        o_iqiyi: '_oqy_',
        youku: '_oyk_'
      }
      switch (tabName) {
        case 'video': {
          const selectedEpisode = selected.selectedEpisodes
          const prefix = (prefixMap[sourceType] || '')
          if (selectedEpisode) {
            if (selectedEpisode.urlIsTrailer === 6 && selectedEpisode.thirdVId) {
              // 如果是短视频, 并且 thirdVId 存在
              s.thirdIdOrPackageName = prefix + selectedEpisode.thirdVId
              s.sid = selectedEpisode.coocaaMId
            } else {
              s.thirdIdOrPackageName = prefix + selected.coocaaVId
              s.vid = selectedEpisode.coocaaMId
            }
            s.thumb = selectedEpisode.thumb
            s.title = selectedEpisode.urlTitle
            s.subTitle = selectedEpisode.urlSubTitle
          } else {
            s.thirdIdOrPackageName = prefix + selected.coocaaVId
            s.pictureUrl = selected.thumb
            s.title = selected.title
            s.subTitle = selected.subTitle
          }
          s.contentType = 'movie'
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
        case 'topic': {
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
        case 'rotate': {
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
    },
    paramIdFun: function(selected) {
      // 封装保存的id
      if (selected.contentType === 'movie') {
        var param = {
          id: selected.thirdIdOrPackageName
        }
        if (selected.vid) {
          param.vid = selected.vid
        } 
        if (selected.sid) {
          param.sid = selected.sid
        }
      } else if (
        selected.contentType === 'app' ||
        selected.contentType === 'edu' ||
        selected.contentType === 'txLive'
      ) {
        var param = {
          id: selected.thirdIdOrPackageName
        }
      } else if (selected.contentType === 'bigTopic') {
        var param = {
          pTopicCode: selected.thirdIdOrPackageName
        }
      } else if (selected.contentType === 'topic') {
        // this.smallTopics = true;
        var param = {
          topicCode: selected.thirdIdOrPackageName
        }
      } else if (selected.contentType === 'rotate') {
        var param = {
          rotateId: selected.thirdIdOrPackageName
        }
      }

      return param
    },
    handleSelectPostEnd(post) {
      console.log('post', post);
      this.videoId = post.pictureId
    },
    computeResolution() {
      const { currentPicIndex, picPosters } = this
      return picPosters[currentPicIndex].width + "*" + picPosters[currentPicIndex].height
    }
  },

  created() {
    this.picPosters = cloneDeep(this.inputTags).map(({width, height}) => ({height, width, pictureUrl: undefined}))  // 确定海报位置
    this.value.picList = []
    if(this.value.mediaResourceId) {
      this.thirdIdOrPackageName = this.value.mediaResourceId
    }
    this.clickType = this.value.clickType || 'detail'
    // if(this.value.picInfoList) {
    //   this.value.picInfoList
    // }
  }
}
</script>

<style  type="stylus" scoped>
.header {
  display: flex;
  align-items: center;
  margin: 10px;
}
.container {
  padding: 10px 0;
  border: 1px dashed gray;
  border-radius: 20px;
}
.video-index {
  color:	#00BBFF;
  font-size: 23px;
}
.num-input {
  width: 100px;
  margin: 0 20px;
}
.poster--wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.poster--container {
  margin: 15px;
}
.poster--pic {
  position: relative;
  border: 1px solid grey;
}
.poster--del {
  position: absolute;
  top: 0px;
  right: -15px;
}
.poster-image {
  width: 100%;
  height: 100%;
}
.title-input {
  width: 357px;
}
</style>