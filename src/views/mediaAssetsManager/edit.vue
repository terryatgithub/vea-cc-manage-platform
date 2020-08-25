<template>
  <div>
    <el-form
      class="sourceEdit"
      ref="formInline"
      :model="formInline"
      :rules="rules"
      :inline="true"
      style="width: 400px;text-align: center;"
    >
      <el-form-item label="当前来源:" prop="mediaSourceId">
        <div>{{mediaSourceName}}</div>
      </el-form-item>
      <el-form-item label="关联图片:" class="imgUpload" prop="picture">
        <div class='picture-uploader' v-if='isInit'>
          <el-upload
            v-if='!formInline.picture'
            :show-file-list="false"
            :action='getActionUrl()'
            :http-request='imgUpload'
            :auto-upload='true'
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :before-upload="beforeUpload">
            <!-- <img v-if="posterForm.materialPosterPic" :src="posterForm.materialPosterPic" class="avatar"> -->
            <i class="el-icon-plus"></i>
          </el-upload>
          <div v-else class='el-upload thumbnail-wrap'>
            <el-dialog :visible.sync='dialogVisible'>
              <img width='100%' :src='formInline.picture' alt />
            </el-dialog>
            <img class='el-upload-list__item-thumbnail' :src='formInline.picture' alt />
            <div class='el-upload-list__item-actions'>
              <span class='el-upload-list__item-delete' @click='handleRemove'>
                <i class='el-icon-delete'></i>
              </span>
            </div>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="create">
        确认
      </el-button>
      <el-button @click="cancel">
        取消
      </el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    mediaSourceId: {
      type: Number
    },
    mediaSourceName: {
      type: String
    },
    mediaSourcePic: {
      type: String
    }
  },
  data () {
    return {
      formInline: {
        mediaSourceId: 1,
        picture: ''
      },
      rules: {
        mediaSourceId: [
          { required: true, message: '', trigger: 'change' }
        ],
        picture: [
          { required: true, message: '请上传关联图片', trigger: 'change' }
        ]
      },
      isInit: true
    }
  },
  methods: {
    cancel () {
      this.$refs['formInline'].clearValidate()
      this.$refs['formInline'].resetFields()
      this.$emit('close')
    },
    create () {
      this.$refs['formInline'].validate((valid) => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.formInline))
          params.mediaSourceId = this.mediaSourceId
          params.creator = this.$appState.user.name
          this.$service.updateSource(params).then(data => {
            if (data.code === 0) {
              this.$refs['formInline'].clearValidate()
              this.$refs['formInline'].resetFields()
              this.$emit('close')
              this.$message({
                type: 'success',
                message: '关联成功！'
              })
              this.$emit('fetchData')
            } else {
              this.$message({
                type: 'error',
                message: data.msg
              })
            }
          })
        }
      })
    },
    // 文件上传调用
    imgUpload (file) {
      const formData = new FormData()
      formData.append('file', file.file)
      formData.append('checkResolution', 'false')
      this.$service.uploadImg(formData).then(data => {
        if (data.code === 0) {
          file.onSuccess(data)
        } else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
      }).catch(({ err }) => {
          file.onError(err)
      })
    },
    getActionUrl () {
      const actionUrl = ''
      return actionUrl
    },
    handleRemove (file, fileList) {
      this.formInline.picture = ''
    },
    uploadSuccess (res, file, fileList) {
      this.formInline.picture = res.data.url
    },
    uploadError (res, file) {
      console.log('上传失败')
    },
    // 上传文件之前的钩子
    beforeUpload (file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/webp'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('异常错误：图片必须为.jpg.jpeg.png.webp格式!')
        this.setInit()
      } else if (!isLt2M) {
        this.$message.error('上传图标图片大小不能超过 2MB!')
        this.setInit()
      }
      return isJPG && isLt2M
    },
    setInit () {
      this.isInit = false
      this.$nextTick(() => {
        this.isInit = true
      })
    }
  },
  created () {
    if (this.mediaSourcePic) {
      this.formInline.picture = this.mediaSourcePic
    }
  }
}
</script>
<style lang="scss">
.sourceEdit {
  .el-form-item {
    .el-form-item__label {
      text-align: left
    }
    .el-form-item__content {
      width: 240px!important;
      text-align: left;
      .el-select{
        margin: 0;
      }
    }
  }
}
.picture-uploader {
  position: relative;
  width: 85px;
  height: 85px;
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    width: 85px;
    height: 85px;
    line-height: 89px;
  }
  .enabled {
    .el-upload {
      cursor: pointer;
      &:hover {
        border-color: #409eff;
      }
    }
  }
  &:hover .el-upload-list__item-actions {
    opacity: 1;
    & > span {
      display: block;
      right: 5px;
      top: -35px;
    }
  }
}
.thumbnail-wrap {
  width: 100%;
  height: 100%;
  z-index: 10;
  .el-upload-list__item-thumbnail {
    width: 100%;
    height: 100%;
  }
  .el-upload-list__item-actions {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    cursor: pointer;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0, 0, 0, 0.5);
    transition: opacity 0.3s;
    &:after {
      display: inline-block;
      content: '';
      height: 100%;
      vertical-align: middle;
    }
    & > span {
      cursor: pointer;
      color: #fff;
    }
  }
}
</style>
