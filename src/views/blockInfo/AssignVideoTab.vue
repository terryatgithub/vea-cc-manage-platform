<template>
  <div>
    <el-row class="header">
      <el-col :span="4" class="video-index">影片{{index+1}}</el-col>
      <el-col :span="14">置顶值
        <InputPositiveInt v-model="value.priority" class="num-input" @blur="$emit('blur')" :disabled="disabled"/>
      </el-col>
      <el-col :span="2">
        <el-button type="text" :disabled="disabled" @click="value.flagRec=!value.flagRec">{{value.flagRec? '取消屏蔽' : '屏蔽'}}</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="text" :disabled="disabled" @click="$emit('handle-delTab', index)">删除</el-button>
      </el-col>
    </el-row>
    <div class="container">
      <el-form label-width="150px">
        
          <el-form-item label="点击类型" :rules="rules.required">
            <el-radio-group v-model="value.clickType" :disabled="disabled">
              <el-radio label="detail">点击进详情页</el-radio>
              <el-radio label="play-fullscreen">点击全屏播放</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="内容资源" :rules="rules.required">
            <ResourceSelector
              :style="{display: disabled ? 'none' : 'inline-block'}"
              ref="resourceSelector"
              :is-live="false"
              :selectors="resourceOptions"
              selection-type="single"
              :source="source"
              :disable-partner="true"
              @select-end="$emit('select-clicked-source', $event)"
            >
              <el-button type="primary" plain>选择资源</el-button>
            </ResourceSelector>
            <el-tag
              type="success"
              class="marginL"
              v-show="value.mediaResourceId"
              >已选择：{{value.mediaResourceId}}</el-tag>
          </el-form-item>
        <el-form-item label="主标题" :rules="rules.title">
          <el-input v-model="value.title" class="title-input" :disabled="disabled"/>
        </el-form-item>
        <el-form-item label="副标题">
          <el-input v-model="value.subTitle" class="title-input" :disabled="disabled"/>
        </el-form-item>
        <el-form-item label="图片海报" :rules="rules.required">
          <div class="poster--wrapper">
            <div v-for="(picPoster, index) in inputTags" class="poster--container">
              <GlobalPictureSelector
                :disabled="disabled"
                :picture-resolution="formatPicResolution(picPoster.width, picPoster.height)"
                @select-end="handleSelectPostEnd($event, index)">
                <div 
                  :style="computePicStyle(picPoster.width, picPoster.height)" 
                  class="poster--pic"
                >
                  <img
                    ref="img"
                    v-if="value.picInfoList[index] && value.picInfoList[index].pictureUrl"
                    class="poster-image"
                    referrerpolicy="no-referrer"
                    :src="value.picInfoList[index].pictureUrl"
                  />
                  <i class="el-icon-close poster--del" @click.stop="handleDelPoster(index)"/>
                </div>
              </GlobalPictureSelector>
            </div>
          </div>
          <div v-if="inputTags.length!==0">
            <el-checkbox 
              :value="!value.showSeries" 
              @input="value.showSeries = $event ? 0 : 1" 
              :disabled="disabled"
            >不展示期数</el-checkbox>
            <el-checkbox 
              :value="!value.showScore" 
              @input="value.showScore = $event ? 0 : 1" 
              :disabled="disabled"
            >不展示评分</el-checkbox>
          </div>
        </el-form-item>
        
        <el-form-item label="视频资源">
          <ResourceSelector
            :style="{display: disabled ? 'none' : 'inline-block'}"
            :is-live="false"
            :selectors="resourceOptions"
            selection-type="single"
            :source="source"
            :disable-partner="true"
            @select-end="$emit('select-normal-source', $event)"
          >
            <el-button type="primary" plain>选择资源</el-button>
          </ResourceSelector>
          <el-tag
            v-if="value.videoId"
            type="success"
            class="video-tag"
            closable
            @close="$emit('del-normal-source')"
          >
            {{value.videoId}}
          </el-tag>
        </el-form-item>
      </el-form>
    </div>

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
      isVisiablePosterSelector: false,
      currentSelectPic: undefined,  // 当前选择的图片海报
      currentPicIndex: undefined,
      resourceOptions,
      rules: {
        title: [
          { required: true, message: '请输入主标题', trigger: 'blur' }
        ],
        required: [
          { required: true }
        ]
      }
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
          clickType: 'detail',
          showSeries: 1,
          showScore: 1,
          videoId: undefined,
          picList: []
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
    },
    disabled: {
      type: Boolean,
      default() {
        return false
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
    // 'inputTags.length': {
    //   handler: function(val, old) {
    //     let inputTags = this.inputTags
    //     if(val > old) { // 增加尺寸
    //       this.value.picInfoList.push(this.genPicInfoList())
    //     }
    //     if(val < old) { // 删除尺寸
    //       this.value.picInfoList.splice(this.delInputTagIndex, 1)
    //     }
    //   }
    // }
  },
  methods: {
    genPicInfoList() {
      return {
        pictureResolution: '',
        pictureUrl: '',
        pictureId: undefined,
        pictureStatus: undefined
      }
    },
    handleDelPoster(index) {
      if(this.disabled) {
        return
      }
      this.value.picInfoList[index].pictureUrl = undefined
    },
    computePicStyle(width, height) {
      return {
        width: width/2 + 'px',
        height: height/2 +'px'
      }
    },
    formatPicResolution (width, height) {
      return width + '*' + height
    },
    handleSelectPostEnd (selected, index) {
      this.value.picInfoList[index].pictureUrl = selected.pictureUrl
    },
    handlePicClick(index) {
      if(this.disabled) {
        return 
      }
      this.isVisiablePosterSelector = true
      this.currentPicIndex = index
    },
    computeResolution() {
      const { currentPicIndex, inputTags } = this
      return inputTags[currentPicIndex].width + "*" + inputTags[currentPicIndex].height
    }
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
  overflow: auto;
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
.video-tag {
  margin: 0 5px;
}
</style>