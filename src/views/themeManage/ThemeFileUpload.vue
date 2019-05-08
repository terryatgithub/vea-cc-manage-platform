<template>
  <Upload
    ref="upload"
    :multiple="true"
    :accept="accept"
    @upload="handleUpload"
  >
    <div class="upload-pic-list" slot="preview" slot-scope="{fileList}">
      <el-button type="info" plain @click="$refs.upload.handleSelectFile()">点击选择文件</el-button>
      <div class="upload-pic-list__item" v-for="file in fileList" :key="file.id">
        <div
            class="upload-pic-list__error"
            v-if="file.status === 'error'"
          >上传失败: {{ file.message }}</div>
        <div v-if="file.status === 'uploading'" class="upload-pic-list__progress">
          <el-progress :width="100" type="circle" :percentage="file.percentage"></el-progress>
        </div>
        <div v-else class="upload-pic-list__success">
          <img :src="file.dataUrl" class="upload-pic-list__success__img">
          <i
            v-if="file.status !== 'uploading'"
            class="upload-pic-list__remove el-icon el-icon-error"
            title="移除"
            @click="handleRemove(file)"
          />
          <div class="diy-file-name">{{file.name}}</div>
          <div v-if="file.status === 'success'" class="diy-bar">
            <span class="diy-bar__text">上传完成</span>
          </div>
        </div>

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
    },
    fileCount: {
      type: String
    },
    zipType: {
      type: String,
      default() {
        return 'none'
      }
    }
  },

  data () {
    return {
      fileNum: 0, // 记录上传文件数
      picData: {} // 回调的数据
    }
  },

  methods: {
    handleUpload (file, fileListItem) {
      // console.log('file',file);
      // console.log('fileListItem',fileListItem);
      let fileList = this.$refs.upload.fileList
      let repeatName = false
      fileList.map(item => {
        if (item.name === file.name) {
          repeatName = true
        }
      })
      if (repeatName) {
        this.$message('该资源已存在')
        fileList.pop()
        return
      }
      fileList[fileList.length - 1].name = file.name
      if (this.fileNum >= parseInt(this.fileCount)) {
        this.$message('上传文件数量超过限制,最大上传文件个数为' + this.fileCount)
        fileList.pop()
        return
      }
      this.fileNum++
      this.fileName = file.name
      const accept = this.accept

      // 上传图片
      if (/image/.test(accept)) {
        this.$service.uploadImage({
          file,
          onUploadProgerss: (evt) => {
            if (evt.lengthComputable) {
              fileListItem.percentage = evt.loaded / evt.total
            }
          }
        }).then(dataAll => {
          if (dataAll.code == 0) {
            fileListItem.status = 'success'
            this.picData.url = dataAll.data[0].url
            this.$emit('pic-data', this.picData)
          } else {
            fileListItem.status = 'error'
            fileListItem.message = dataAll.msg
          }
        }).catch(() => {
          fileListItem.status = 'error'
          fileListItem.message = '网络错误'
        })
      }
      // 上传APK
      else if (/vnd.android.package-archive/.test(accept)) {
        this.$service.uploadApk({
          file,
          onUploadProgerss: (evt) => {
            if (evt.lengthComputable) {
              fileListItem.percentage = evt.loaded / evt.total
            }
          }
        }).then(dataAll => {
          if (dataAll.code == 0) {
            fileListItem.status = 'success'
            this.picData.url = dataAll.data.url
            this.picData.fileMd5 = dataAll.data.fileMd5
            this.$emit('pic-data', this.picData)
          } else {
            fileListItem.status = 'error'
            fileListItem.message = dataAll.msg
          }
        }).catch(() => {
          fileListItem.status = 'error'
          fileListItem.message = '网络错误'
        })
      }
      // 上传Zip
      else if (/zip/.test(accept)) {
        const zipType = this.zipType
        this.$service.uploadZip({
          file,
          type: zipType,
          onUploadProgerss: (evt) => {
            if (evt.lengthComputable) {
              fileListItem.percentage = evt.loaded / evt.total
            }
          }
        }).then(dataAll => {
          if (dataAll.code == 0) {
            fileListItem.status = 'success'
            this.picData = dataAll.data
            this.$emit('pic-data', this.picData)
          } else {
            fileListItem.status = 'error'
            fileListItem.message = dataAll.msg
          }
        }).catch(() => {
          fileListItem.status = 'error'
          fileListItem.message = '网络错误'
        })
      }
    },

    handleRemove(file) {
      this.$refs.upload.handleRemove(file)
      this.fileNum--
      this.$emit('handleRemove')
    }
  },
  created() {}

}
</script>

<style lang='stylus' scoped>
.upload-pic-list
  width 200px
  min-height 280px
  text-align center
  border 1px solid #ccc
.upload-pic-list__progress
  display flex
  align-items center
  justify-content center
  width 192px
  height 192px
.upload-pic-list__success
  position relative
  width 192px
  height 192px
.upload-pic-list__success:hover
  .diy-file-name,
  .upload-pic-list__remove
    display block
.upload-pic-list__success__img
  width 100%
  height 100%
.diy-file-name
  display none
  position absolute
  bottom 0px
  left 0px
  width 100%
  height 20px
  line-height 20px
  text-align center
  color #fff
  background-color black
.upload-pic-list__remove
  display none
  position absolute
  top 0
  right 0
  z-index 2
.diy-bar
  position absolute
  top 0
  bottom 0
  z-index 1
  display flex
  justify-content center
  align-items center
  width 100%
  opacity: 0.7
  background-color #ccc
.diy-bar__text
  height 24px
  width 100%
  font-size 14px
  color #FFF
  background-color #09F
.el-icon
  font-size 35px
  color red
</style>
