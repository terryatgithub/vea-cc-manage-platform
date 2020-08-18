<template>
    <div>
      <el-form
        ref="appForm"
        :model="appForm"
        class="appEdit"
        :rules="appRules"
        :inline="true"
        style="width: 500px;text-align: center;"
        v-if="dialogType === 'appCreate' || dialogType === 'appEdit'"
      >
        <el-form-item label="应用名" prop="materialName">
          <el-input
            placeholder="请输入应用名"
            v-model="appForm.materialName"
          />
        </el-form-item>
        <el-form-item label="应用横图" class="horizontalImg" prop="horizontal">
          <!-- <el-upload
            v-model="appForm.materialPics"
            class="app-uploader"
            list-type="picture-card"
            :action='getActionUrl()'
            :headers='getAuthHeader()'
            :http-request='imgUpload'
            :auto-upload='true'
            :on-remove="handleRemove"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :before-upload="beforeUpload"
            :file-list="appFileList">
            <i class="el-icon-plus app-uploader-icon"></i>
          </el-upload> -->
          <div class='picture-uploader' v-if='isInit'>
            <el-upload
              v-if='!appForm.horizontal'
              :show-file-list="false"
              :action='getActionUrl()'
              :http-request='imgUpload1'
              :auto-upload='true'
              :on-success="uploadSuccess"
              :on-error="uploadError"
              :before-upload="beforeUpload">
              <i class="el-icon-plus"></i>
            </el-upload>
            <div v-else class='el-upload thumbnail-wrap'>
              <el-dialog :visible.sync='dialogVisible'>
                <img width='100%' :src='appForm.horizontal' alt />
              </el-dialog>
              <img class='el-upload-list__item-thumbnail' :src='appForm.horizontal' alt />
              <div class='el-upload-list__item-actions'>
                <span class='el-upload-list__item-delete' @click="handleRemove('horizontal')">
                  <i class='el-icon-delete'></i>
                </span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="应用方图" class="squareImg" prop="square">
          <div class='picture-uploader' v-if='isInit'>
            <el-upload
              v-if='!appForm.square'
              :show-file-list="false"
              :action='getActionUrl()'
              :http-request='imgUpload2'
              :auto-upload='true'
              :on-success="uploadSuccess"
              :on-error="uploadError"
              :before-upload="beforeUpload">
              <i class="el-icon-plus"></i>
            </el-upload>
            <div v-else class='el-upload thumbnail-wrap'>
              <el-dialog :visible.sync='dialogVisible'>
                <img width='100%' :src='appForm.square' alt />
              </el-dialog>
              <img class='el-upload-list__item-thumbnail' :src='appForm.square' alt />
              <div class='el-upload-list__item-actions'>
                <span class='el-upload-list__item-delete' @click="handleRemove('square')">
                  <i class='el-icon-delete'></i>
                </span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item
          label="类型"
          prop="materialType"
        >
          <el-select
            class="filter-item"
            placeholder="请选择类型"
            v-model="appForm.materialType"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.key"
              :label="item.typeName"
              :value="item.typeName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="应用跳转url" prop="materialUrl">
          <el-input
            placeholder="请输入应用跳转url"
            v-model="appForm.materialUrl"
          />
        </el-form-item>
        <el-form-item label="api url" prop="apiUrl">
          <el-input
            placeholder="请输入api url"
            v-model="appForm.apiUrl"
          />
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth" prop="materialRemark">
          <el-input type="textarea" :rows="2" maxlength="200" show-word-limit placeholder="请输入备注" v-model="appForm.materialRemark"></el-input>
        </el-form-item>
        <el-form-item
          label="状态"
          prop="materialState"
        >
          <el-select
            class="filter-item"
            placeholder="请选择状态"
            v-model="appForm.materialState"
          >
            <el-option value="0" label="失效"/>
            <el-option value="1" label="有效"/>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form
        ref="posterForm"
        :model="posterForm"
        class="appEdit"
        :rules="posterRules"
        :inline="true"
        style="width: 500px;text-align: center;"
        v-if="dialogType === 'posterCreate' || dialogType === 'posterEdit'"
      >
        <el-form-item label="海报名" prop="materialName">
          <el-input
            placeholder="请输入海报名"
            v-model="posterForm.materialName"
          />
        </el-form-item>
        <el-form-item label="图标" class="imgUpload" prop="materialPosterPic">
          <div class='picture-uploader' v-if='isInit'>
            <el-upload
              v-if='!posterForm.materialPosterPic'
              :show-file-list="false"
              :action='getActionUrl()'
              :http-request='imgUpload1'
              :auto-upload='true'
              :on-success="uploadSuccess"
              :on-error="uploadError"
              :before-upload="beforeUpload">
              <!-- <img v-if="posterForm.materialPosterPic" :src="posterForm.materialPosterPic" class="avatar"> -->
              <i class="el-icon-plus"></i>
            </el-upload>
            <div v-else class='el-upload thumbnail-wrap'>
              <el-dialog :visible.sync='dialogVisible'>
                <img width='100%' :src='posterForm.materialPosterPic' alt />
              </el-dialog>
              <img class='el-upload-list__item-thumbnail' :src='posterForm.materialPosterPic' alt />
              <div class='el-upload-list__item-actions'>
                <span class='el-upload-list__item-delete' @click='handleRemove'>
                  <i class='el-icon-delete'></i>
                </span>
              </div>
            </div>
          </div>
        </el-form-item>
        <!-- <el-form-item
          label="尺寸类型"
          prop="sizeType"
        >
          <el-select
            class="filter-item"
            placeholder="请选择尺寸类型"
            v-model="posterForm.sizeType"
          >
            <el-option
              v-for="item in sizeOptions"
              :key="item.key"
              :label="item.sizeName"
              :value="item.key"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="关联url" prop="materialUrl">
          <el-input
            placeholder="请输入关联url"
            v-model="posterForm.materialUrl"
          />
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth" prop="materialRemark">
          <el-input type="textarea" :rows="2" maxlength="200" show-word-limit placeholder="请输入备注" v-model="posterForm.materialRemark"></el-input>
        </el-form-item>
        <el-form-item
          label="状态"
          prop="materialState"
        >
          <el-select
            class="filter-item"
            placeholder="请选择状态"
            v-model="posterForm.materialState"
          >
            <el-option value="0" label="失效"/>
            <el-option value="1" label="有效"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">
          取消
        </el-button>
        <el-button type="primary" @click="create">
          确定
        </el-button>
      </div>
    </div>
</template>

<script>
export default {
  components: {},
  props: {
    dialogType: {
      type: String
    },
    materialId: {
      type: String
    }
  },
  watch: {
    dialogType: (newVal, oldVal) => {
      console.log(newVal)
    },
    materialId: function (newVal, oldVal) {
      if (newVal !== '0') {
        // this.getmaterialId()
      }
    }
  },
  data () {
    return {
      typeOptions: [
        { key: '1', typeName: '财务' },
        { key: '2', typeName: '儿童' },
        { key: '3', typeName: '参考' },
        { key: '4', typeName: '工具' },
        { key: '5', typeName: '购物' },
        { key: '6', typeName: '健康健美' },
        { key: '7', typeName: '教育' },
        { key: '8', typeName: '旅游' },
        { key: '9', typeName: '美食' },
        { key: '10', typeName: '商务' },
        { key: '11', typeName: '社交' },
        { key: '12', typeName: '生活' },
        { key: '13', typeName: '体育' },
        { key: '14', typeName: '天气' },
        { key: '15', typeName: '图书' },
        { key: '16', typeName: '新闻' },
        { key: '17', typeName: '音乐' },
        { key: '18', typeName: '娱乐' }
      ],
      // sizeOptions: [
      //   { key: '1', sizeName: '400*600' },
      //   { key: '2', sizeName: '400*600' },
      //   { key: '3', sizeName: '600*900' }
      // ],
      appForm: {
        materialName: '',
        // materialPics: '',
        horizontal: '',
        square: '',
        materialType: '',
        materialUrl: '',
        apiUrl: '',
        materialRemark: '',
        materialState: ''
      },
      appRules: {
        materialName: [
          { required: true, message: '请输入应用名', trigger: 'blur' }
        ],
        // materialPics: [
        //   { required: true, message: '请上传图标', trigger: 'change' }
        // ],
        horizontal: [
          { required: true, message: '请上传横图', trigger: 'change' }
        ],
        square: [
          { required: true, message: '请上传方图', trigger: 'change' }
        ],
        materialType: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        materialUrl: [
          { required: true, message: '请输入跳转url', trigger: 'blur' }
        ],
        apiUrl: [
          { required: true, message: '请输入api url', trigger: 'blur' }
        ],
        materialRemark: [
          { required: true, message: '请输入备注', trigger: 'blur' }
        ],
        materialState: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      },
      posterForm: {
        materialName: '',
        materialPosterPic: '',
        // sizeType: '',
        materialUrl: '',
        materialRemark: '',
        materialState: ''
      },
      posterRules: {
        materialName: [
          { required: true, message: '请输入海报名', trigger: 'blur' }
        ],
        materialPosterPic: [
          { required: true, message: '请上传海报图', trigger: 'change' }
        ],
        // sizeType: [
        //   { required: true, message: '请选择尺寸类型', trigger: 'change' }
        // ],
        materialUrl: [
          { required: true, message: '请输入关联url', trigger: 'blur' }
        ],
        materialRemark: [
          { required: true, message: '请输入备注', trigger: 'blur' }
        ],
        materialState: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      },
      appFileList: [],
      dialogVisible: false,
      isInit: true,
      imgType: ''
    }
  },
  methods: {
    getmaterialId () {
      const typeForm = this.dialogType === 'appCreate' || this.dialogType === 'appEdit' ? 'appForm' : 'posterForm'
      if (typeForm === 'appForm') {
        this.$service.getAppManageMaterialId({ materialId: this.materialId }).then(data => {
          if (data.code === 0) {
            const detail = data.data
            this.appForm = {
              materialName: detail.materialName,
              // materialPics: detail.materialPics,
              materialType: detail.materialType,
              materialUrl: detail.materialUrl,
              apiUrl: detail.apiUrl,
              materialRemark: detail.materialRemark,
              materialState: detail.materialState.toString()
            }
            const materialPics = JSON.parse(detail.materialPics)
            for (const i in materialPics) {
              if (materialPics[i].type === 'horizontal') {
                this.appForm.horizontal = materialPics[i].pic
              } else if (materialPics[i].type === 'square') {
                this.appForm.square = materialPics[i].pic
              }
            }
            // const fileList = detail.materialPics.split(',')
            // for (const i in fileList) {
            //   this.appFileList.push({
            //     'url': fileList[i]
            //   })
            // }
          } else {
            this.$message({
              type: 'error',
              message: data.msg
            })
          }
        })
      } else {
        this.$service.getPosterManageMaterialId({ materialId: this.materialId }).then(data => {
          if (data.code === 0) {
            const detail = data.data
            this.posterForm = {
              materialName: detail.materialName,
              materialPosterPic: detail.materialPosterPic,
              // sizeType: detail.sizeType,
              materialUrl: detail.materialUrl,
              materialRemark: detail.materialRemark,
              materialState: detail.materialState.toString()
            }
          } else {
            this.$message({
              type: 'error',
              message: data.msg
            })
          }
        })
      }
    },
    cancel () {
      const typeForm = this.dialogType === 'appCreate' || this.dialogType === 'appEdit' ? 'appForm' : 'posterForm'
      this.$refs[typeForm].clearValidate()
      this.$refs[typeForm].resetFields()
      this.$emit('close')
    },
    create () {
      const typeForm = this.dialogType === 'appCreate' || this.dialogType === 'appEdit' ? 'appForm' : 'posterForm'
      this.$refs[typeForm].validate((valid) => {
        if (valid) {
          const params = this.dialogType === 'appCreate' || this.dialogType === 'appEdit' ? this.appForm : this.posterForm
          params.creator = '管理员'
          if (typeForm === 'appForm') {
            params.materialPics = JSON.stringify([
              { pic: params.horizontal, type: 'horizontal' },
              { pic: params.square, type: 'square' },
            ])
            if (this.materialId !== '0') { // 判断是新增还是修改
              params.materialId = this.materialId
              this.$service.updateAppManage(params).then(data => {
                if (data.code === 0) {
                  this.$refs[typeForm].clearValidate()
                  this.$refs[typeForm].resetFields()
                  this.$emit('close')
                  this.$message({
                    type: 'success',
                    message: '修改成功！'
                  })
                  this.$emit('fetchData')
                } else {
                  this.$message({
                    type: 'error',
                    message: data.msg
                  })
                }
              })
            } else {
              this.$service.addAppManage(params).then(data => {
                if (data.code === 0) {
                  this.$refs[typeForm].clearValidate()
                  this.$refs[typeForm].resetFields()
                  this.$emit('close')
                  this.$message({
                    type: 'success',
                    message: '新增成功！'
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
          } else {
            if (this.materialId !== '0') { // 判断是新增还是修改
              params.materialId = this.materialId
              this.$service.updatePosterManage(params).then(data => {
                if (data.code === 0) {
                  this.$refs[typeForm].clearValidate()
                  this.$refs[typeForm].resetFields()
                  this.$emit('close')
                  this.$message({
                    type: 'success',
                    message: '修改成功！'
                  })
                  this.$emit('fetchData')
                } else {
                  this.$message({
                    type: 'error',
                    message: data.msg
                  })
                }
              })
            } else {
              this.$service.addPosterManage(params).then(data => {
                if (data.code === 0) {
                  this.$refs[typeForm].clearValidate()
                  this.$refs[typeForm].resetFields()
                  this.$emit('close')
                  this.$message({
                    type: 'success',
                    message: '新增成功！'
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
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 文件上传调用
    imgUpload1 (file) {
      const formData = new FormData()
      formData.append('file', file.file)
      formData.append('checkResolution', 'false')
      this.$service.uploadImg(formData).then(data => {
        if (data.code === 0) {
          this.imgType = 'horizontal'
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
    imgUpload2 (file) {
      const formData = new FormData()
      formData.append('file', file.file)
      formData.append('checkResolution', 'false')
      this.$service.uploadImg(formData).then(data => {
        if (data.code === 0) {
          this.imgType = 'square'
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
    // handleRemove (file, fileList) {
    //   if (this.dialogType === 'appCreate' || this.dialogType === 'appEdit') {
    //     const arr = []
    //     for (const i in fileList) {
    //       arr.push(fileList[i].response.data.url)
    //     }
    //     this.appForm.materialPics = arr
    //   } else {
    //     this.posterForm.materialPosterPic = ''
    //   }
    //   console.log(this.appForm)
    // },
    handleRemove (type) {
      if (this.dialogType === 'appCreate' || this.dialogType === 'appEdit') {
        if (type === 'horizontal') {
          this.appForm.horizontal = ''
          
          console.log(this.appForm)
        } else {
          this.appForm.square = ''
        }
      } else {
        this.posterForm.materialPosterPic = ''
      }
      // 解决编辑删除图片时v-if调用失效，页面不重新渲染问题
      this.$forceUpdate()
    },
    // uploadSuccess (res, file, fileList) {
    //   const arr = []
    //   for (const i in fileList) {
    //     if (fileList[i].response) {
    //       arr.push(fileList[i].response.data.url)
    //     } else {
    //       arr.push(fileList[i].url)
    //     }
    //   }
    //   if (this.dialogType === 'appCreate' || this.dialogType === 'appEdit') {
    //     this.appForm.materialPics = arr
    //   } else {
    //     this.posterForm.materialPosterPic = res.data.url
    //   }
    //   console.log(this.posterForm)
    // },
    uploadSuccess (res, file, fileList) {
      if (this.dialogType === 'appCreate' || this.dialogType === 'appEdit') {
        // 判断是横图还是方图，有点麻烦，后续优化
        if (this.imgType === 'horizontal') {
          this.appForm.horizontal = res.data.url
        } else {
          this.appForm.square = res.data.url
        }
      } else {
        this.posterForm.materialPosterPic = res.data.url
      }
      // 解决编辑删除图片时v-if调用失效，页面不重新渲染问题
      this.$forceUpdate()
    },
    uploadError (res, file) {
      console.log('上传失败')
    },
    // 上传文件之前的钩子
    beforeUpload (file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 PNG或JPG 格式!')
        this.setInit()
      }
      if (!isLt2M) {
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
    if (this.materialId !== '0') {
      this.getmaterialId()
    }
  }
}
</script>
<style lang='scss'>
.appEdit {
  .el-form-item {
    .el-form-item__label {
      width: 120px;
      text-align: left
    }
    .el-form-item__content {
      width: 240px!important;
      .el-select{
        margin: 0;
      }
    }
    // 上传
    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      &:hover {
        border-color: #409EFF;
      }
    }
    .app-uploader {
      .el-upload--picture-card {
        width: 80px;
        height: 80px;
        line-height: 88px;
      }
      .el-upload-list__item {
        width: 80px;
        height: 80px;
        line-height: 88px;
      }
    }
    .long-uploader {
      .long-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 90px;
        height: 80px;
        line-height: 80px;
        text-align: center;
      }
      .avatar {
        width: 90px;
        height: 80px;
        display: block;
      }
    }
  }
  .imgUpload {
    .el-form-item {
      text-align: left;
    }
    .el-form-item__content {
      text-align: left;
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
    cursor: default;
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
.horizontalImg {
  .picture-uploader {
    width: 110px;
    height: 85px;
    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      position: relative;
      overflow: hidden;
      width: 110px;
      height: 85px;
      line-height: 89px;
    }
  }
}
.squareImg {
  .picture-uploader {
    width: 85px;
    height: 85px;
    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      position: relative;
      overflow: hidden;
      width: 85px;
      height: 85px;
      line-height: 89px;
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
