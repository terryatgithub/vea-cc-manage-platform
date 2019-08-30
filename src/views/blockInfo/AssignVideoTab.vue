<template>
  <div>
    <el-row class="header">
      <el-col :span="4" class="video-index">影片{{index+1}}</el-col>
      <el-col :span="1">置顶值</el-col>
      <el-col :span="13"><InputPositiveInt v-model="value.topVal" class="num-input"/></el-col>
      <el-col :span="2">
        <el-button type="text" @click="value.disabled=!value.disabled">{{value.disable? '未屏蔽' : '屏蔽'}}</el-button>
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
            <!-- <span v-show="thirdIdOrPackageNameForClick">已选择: {{ 1 }}</span> -->
        </el-form-item>
        <el-form-item label="主标题">
          <el-input/>
        </el-form-item>
        <el-form-item label="副标题">
          <el-input/>
        </el-form-item>
        <el-form-item label="图片海报">
            <el-checkbox v-model="value.isShowPeriod">不展示期数</el-checkbox>
            <el-checkbox v-model="value.isShowScore">备选项</el-checkbox>
        </el-form-item>
        <el-form-item label="视频资源">
          选择资源
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
  
<script>
import InputPositiveInt from '@/components/InputPositiveInt'
import ResourceSelector from '@/components/ResourceSelector/ResourceSelector'
export default {
  components: {
    InputPositiveInt,
    ResourceSelector
  },
  data() {
    return {

    }
  },
  props: {
    value: {
      type: Object,
      default() {
        return {
          topVal: undefined,
          disabled: false
        }
      }
    },
    index: Number,
    source: String
  },

  watch: {
    value: {
      handler: function(val) {
        this.$emit('input', val)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleSelectResourcesEnd() {

    }
  },

  created() {
    this.value.disabled = this.value.disabled || false
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
</style>