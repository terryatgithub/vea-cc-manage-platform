<template>
  <div>
    <el-row class="header">
      <el-col :span="4" class="video-index">影片{{index+1}}</el-col>
      <el-col :span="1">置顶值</el-col>
      <el-col :span="13"><InputPositiveInt v-model="value.priority" class="num-input" @blur="$emit('blur')"/></el-col>
      <el-col :span="2">
        <el-button type="text" @click="flagRec=!flagRec">{{flagRec? '未屏蔽' : '屏蔽'}}</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="text" @click="$emit('handle-delTab', index)">删除</el-button>
      </el-col>
    </el-row>
    <div class="container">
      <el-form label-width="150px">
        <el-form-item label="内容资源">
            <ResourceSelector
              ref="resourceSelector"
              :is-live="false"
              :selectors="['video']"
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
        <el-form-item label="主标题">
          <el-input v-model="value.title" class="title-input"/>
        </el-form-item>
        <!-- <el-form-item label="副标题">
          <el-input v-model="value.subTitle"/>
        </el-form-item> -->
        <el-form-item label="图片海报">
          <div class="poster--wrapper">
            <div v-for="(picPoster, index) in picPosters" class="poster--container">
              <div 
                :style="computePicStyle(picPoster.width, picPoster.height)" 
                class="poster--pic"
                @click="handlePicClick(index)"
              >
                <img
                  v-show="picPoster.pictureUrl"
                  :src="picPoster.pictureUrl"
                  class="poster-image"
                  referrerpolicy="no-referrer"
                />
                <i class="el-icon-close poster--del" @click.stop="handleDelPoster(index)"/>
              </div>
            </div>
          </div>
          <div>
            <el-checkbox v-model="value.isShowPeriod">不展示期数</el-checkbox>
            <el-checkbox v-model="value.showScore">备选项</el-checkbox>
          </div>
        </el-form-item>
        <el-form-item label="视频资源">
          选择资源
        </el-form-item>
      </el-form>
    </div>

    <!-- 海报弹框  -->
    <el-dialog :visible.sync="isVisiablePosterSelector" width="1200px">
      <DialogPicture
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

const resourceOptions = ['video', 'edu', 'live', 'rotate', 'app']
export default {
  components: {
    InputPositiveInt,
    ResourceSelector,
    DialogPicture
  },
  data() {
    return {
      picPosters: [],
      isVisiablePosterSelector: false,
      currentSelectPic: undefined,  // 当前选择的图片海报
      currentPicIndex: undefined,
      resourceOptions,
      thirdIdOrPackageName: undefined,
      flagRec: false
    }
  },
  props: {
    value: {
      type: Object,
      default() {
        return {
          priority: undefined,
          flagRec: false
        }
      }
    },
    index: Number,
    source: String,
    'input-tags': Array
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
        this.value.flagRec = val
      }
    }
  },
  methods: {
    handleSelectResourcesEnd(selectedResources) {
      console.log('selectedResources', selectedResources);
      const { resourceOptions, source } = this
      const tabName = resourceOptions.map(item=> {
        if(selectedResources[item]) {
          return item
        }
      }).join("")
      let data = this.callbackParam(tabName, selectedResources[tabName][0], source)
      this.thirdIdOrPackageName = data.thirdIdOrPackageName
      const { thirdIdOrPackageName, title } = data
      this.value.thirdIdOrPackageName = thirdIdOrPackageName
      this.value.title = title
      
      // Object.assign(this.value, {
      //   thirdIdOrPackageName: data.thirdIdOrPackageName,
      //   title: data.title,
      //   subTitle: data.subTitle
      // })
    },
    handleDelPoster(index) {
      this.picPosters.splice(index, 1)
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
    }
  },

  created() {
    this.value.flagRec = this.value.flagRec || false
    this.picPosters = JSON.parse(JSON.stringify(this.inputTags))  // 确定海报位置
    this.value.picList = []
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