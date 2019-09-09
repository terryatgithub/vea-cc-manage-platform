<template>
  <div>
    <el-row class="header">
      <el-col :span="4" class="video-index">影片{{index+1}}</el-col>
      <el-col :span="14">置顶值
        <InputPositiveInt v-model="value.priority" class="num-input" @blur="$emit('blur')" :disabled="disabled"/>
      </el-col>
      <el-col :span="2">
        <el-button type="text" :disabled="disabled" @click="value.flagRec=!value.flagRec">{{value.flagRec? '未屏蔽' : '屏蔽'}}</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="text" :disabled="disabled" @click="$emit('handle-delTab', index)">删除</el-button>
      </el-col>
    </el-row>
    <div class="container">
      <el-form label-width="150px">
        <el-form-item label="视频资源">
          <ResourceSelector
            :style="{display: disabled ? 'none' : 'block'}"
            :is-live="false"
            :selectors="resourceOptions"
            selection-type="single"
            :source="source"
            @select-end="$emit('select-normal-source', $event)"
          >
            <el-button type="primary" plain>选择资源</el-button>
          </ResourceSelector>
          <el-tag
            type="success"
            class="marginL"
            v-if="value.videoId"
          >已选择：{{value.videoId}}</el-tag>
        </el-form-item>
        <el-form-item label="主标题" :rules="rules.title">
          <el-input v-model="value.title" class="title-input" :disabled="disabled"/>
        </el-form-item>
        <el-form-item label="副标题">
          <el-input v-model="value.subTitle" class="title-input" :disabled="disabled"/>
        </el-form-item>
        <el-form-item label="图片海报" :rules="rules.required">
          <div class="poster--wrapper">
            <div v-for="(picPoster, index) in picPosters" class="poster--container">
              <div 
                :style="computePicStyle(picPoster.width, picPoster.height)" 
                class="poster--pic"
                @click="handlePicClick(index)"
              >
                <img
                  ref="img"
                  v-show="value.picList[index]"
                  :src="value.picList[index]"
                  class="poster-image"
                  referrerpolicy="no-referrer"
                />
                <i class="el-icon-close poster--del" @click.stop="handleDelPoster(index)"/>
              </div>
            </div>
          </div>
          <div v-if="picPosters.length!==0">
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
        <el-form-item label="点击类型" :rules="rules.required">
          <el-radio-group v-model="value.clickType" :disabled="disabled">
            <el-radio label="detail">点击进详情页</el-radio>
            <el-radio label="play-fullscreen">点击全屏播放</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="内容资源" :rules="rules.required">
          <ResourceSelector
            :style="{display: disabled ? 'none' : 'block'}"
            ref="resourceSelector"
            :is-live="false"
            :selectors="resourceOptions"
            selection-type="single"
            :source="source"
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
    }
  },
  methods: {
    handleDelPoster(index) {
      if(this.disabled) {
        return
      }
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
      if(this.disabled) {
        return 
      }
      this.isVisiablePosterSelector = true
      this.currentPicIndex = index
    },
    computeResolution() {
      const { currentPicIndex, picPosters } = this
      return picPosters[currentPicIndex].width + "*" + picPosters[currentPicIndex].height
    }
  },

  created() {
    this.picPosters = cloneDeep(this.inputTags).map(({width, height}) => ({height, width, pictureUrl: undefined}))  // 确定海报位置
    if(!this.value.picList) {
      this.$set(this.value, 'picList', [])
    }
    if(this.value.picInfoList && this.value.picInfoList.length !== 0) {
      this.value.picInfoList.forEach(item => {
        let picRS = item.pictureResolution.split('*')
        this.picPosters.map(picContainer => {
          if(picRS[0] === picContainer.width && picRS[1] === picContainer.height) {
            picContainer.pictureUrl = item.pictureUrl
            this.value.picList.push(picContainer.pictureUrl)
          }
        })
      })
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