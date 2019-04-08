<template>
  <Upload
    ref="upload"
    :multiple="true"
    :min-height="100"
    :max-height="200"
    :accept="accept"
    @upload="handleUpload"
  >
    <div class="upload-pic-list" slot="preview" slot-scope="{fileList}">
      <el-button type="primary" @click="$refs.upload.handleSelectFile()">点击选择文件</el-button>
      <div class="upload-pic-list__item" v-for="file in fileList" :key="file.id">
        <div
            class="upload-pic-list__error"
            v-if="file.status === 'error'"
          >上传失败: {{ file.message }}</div>
        <div v-if="file.status === 'uploading'" class="upload-pic-list__progress">
          <el-progress :width="100" type="circle" :percentage="file.percentage"></el-progress>
        </div>
        <img v-else :src="file.dataUrl">
        <i
          v-if="file.status !== 'uploading'"
          class="upload-pic-list__remove el-icon el-icon-close"
          title="移除"
          @click="$refs.upload.handleRemove(file)"
        />
      </div>
    </div>
  </Upload>
</template>

<script>
import { Upload } from 'admin-toolkit'
export default {
  components: {
    Upload
  },

  props: {
    accept: {
      type: String
    }
  },

  data () {
    return {
    };
  },

  methods: {
    handleUpload (file, fileListItem) {
      function update () {
        if (fileListItem.percentage < 100) {
          fileListItem.percentage += 10
        } else {
          fileListItem.status = 'successs'
          clearInterval(fileListItem.interval)
        }
      }
      fileListItem.interval = setInterval(update, 200)
    }
  },
  created() {}

}
</script>

<style lang='stylus' scoped>
.upload-pic-list
  width 200px
  min-height 250px
  text-align center
  border 1px solid #ccc
</style>