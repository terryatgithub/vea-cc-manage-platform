<template>
  <ContentCard :title="title" @go-back="$emit('go-back')">
    <div class="global-picture" v-if="mode!=='read'">
      <el-button type="primary" @click="handleSubmit">保存</el-button>
      <!-- <el-button @click="handleCancel">关闭</el-button> -->
      <div class="form-legend-header">
        <i class="el-icon-edit">基本信息</i>
      </div>
      <el-form ref="form" label-width="120px" :model="this">
        <div class="global-picture__label">素材图片</div>
        <Upload
          :multiple="true"
          class="global-picture__uploader"
          ref="upload"
          @upload="handleUpload"
        >
          <template slot="preview">
            <div
              class="upload-pic-list__item-wrapper"
              v-for="(file, index) in fileInfo"
              :key="index"
            >
              <div class="upload-pic-list__item">
                <div
                  class="upload-pic-list__error"
                  v-if="file.upload.status === 'error'"
                >上传失败: {{ file.upload.message }}</div>
                <div v-if="file.upload.status === 'uploading'" class="upload-pic-list__progress">
                  <el-progress :width="180" type="circle" :percentage="file.upload.percentage"></el-progress>
                </div>
                <img v-else :src="file.upload.dataUrl">
              </div>
              <div class="pic-info">
                <el-form-item
                  :prop="'fileInfo.' + index + '.pictureName'"
                  :rules="rules.title"
                  label="素材标题"
                >
                  <el-input v-model="file.pictureName"/>
                </el-form-item>
                <el-form-item label="素材分辨率">{{ file.pictureResolution }}</el-form-item>
                <el-form-item
                  :prop="'fileInfo.' + index + '.materialTypeDictEnName'"
                  :rules="rules.type"
                  label="素材类型"
                >
                  <el-select v-model="fileInfo[index].materialTypeDictEnName">
                    <el-option
                      v-for="(item, index) in picTypeOptions"
                      :key="index"
                      :value="item.dictEnName"
                      :label="item.dictCnName"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <i
                v-if="file.status !== 'uploading'"
                class="upload-pic-list__remove el-icon el-icon-close"
                title="移除"
                @click="handleRemoveFile(file, index)"
              />
            </div>
            <el-button
              :disabled="mode === 'edit' && fileInfo.length >=1"
              type="primary"
              class="upload-pic-list__add"
              @click="$refs.upload.handleSelectFile()"
            >点击选择图片</el-button>
            <el-button @click="showPicTypeSelector = true"   type="primary" plain>批量设置类型</el-button>
          </template>
        </Upload>
      </el-form>
      <el-dialog
        class="global-pic-type-selector"
        title="选择素材类型"
        size="tiny"
        :visible.sync="showPicTypeSelector"
      >
        <el-tag
          v-for="(item, index) in picTypeOptions"
          :key="index"
          @click.native="handleBatchSetPicType(item)"
        >{{ item.dictCnName }}</el-tag>
      </el-dialog>
    </div>
    <div class="global-picture" v-if="mode==='read'">
      <div class="global-picture__actions">
        <el-button type="primary" @click="audit" v-if="status===3">审核</el-button>
        <el-button @click="handleCancel">关闭</el-button>
      </div>
      <el-form ref="form" label-width="120px" :model="this">
        <div class="global-picture__label">素材图片</div>
        <Upload
          :multiple="true"
          class="global-picture__uploader"
          ref="upload"
          @upload="handleUpload"
        >
          <template slot="preview">
            <div
              class="upload-pic-list__item-wrapper"
              v-for="(file, index) in fileInfo"
              :key="index"
            >
              <div class="upload-pic-list__item">
                <div
                  class="upload-pic-list__error"
                  v-if="file.upload.status === 'error'"
                >上传失败: {{ file.upload.message }}</div>
                <div v-if="file.upload.status === 'uploading'" class="upload-pic-list__progress">
                  <el-progress :width="180" type="circle" :percentage="file.upload.percentage"></el-progress>
                </div>
                <img v-else :src="file.upload.dataUrl">
              </div>
              <div class="pic-info">
                <el-form-item
                  :prop="'fileInfo.' + index + '.pictureName'"
                  :rules="rules.title"
                  label="素材标题"
                >{{file.pictureName}}</el-form-item>
                <el-form-item label="素材分辨率">{{ file.pictureResolution }}</el-form-item>
                <el-form-item
                  :prop="'fileInfo.' + index + '.materialTypeDictEnName'"
                  :rules="rules.type"
                  label="素材类型"
                >
                  <el-select v-model="fileInfo[index].materialTypeDictEnName" :disabled="true">
                    <el-option
                      v-for="(item, index) in picTypeOptions"
                      :key="index"
                      :value="item.dictEnName"
                      :label="item.dictCnName"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
          </template>
        </Upload>
      </el-form>
    </div>
    <el-dialog title="预览图片" :visible.sync="auditDialogVisible" width="30%">
      <span>
        <el-form ref="auditForm" :model="auditForm" :rules="auditFormRules" label-width="80px">
          <el-form-item label="审核意见" prop="auditFlag">
            <el-radio v-model="auditForm.auditFlag" label="4">通过</el-radio>
            <el-radio v-model="auditForm.auditFlag" label="5">打回</el-radio>
          </el-form-item>
          <el-form-item label="意见说明" prop="auditDesc">
            <el-input type="textarea" v-model="auditForm.auditDesc"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="auditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAudit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 审核 --->
  </ContentCard>
</template>

<script>
import { Upload } from 'admin-toolkit'
export default {
  components: {
    Upload
  },
  data () {
    return {
      mode: 'create',
      status: undefined,
      showPicTypeSelector: false,
      pictureId: undefined,
      fileInfo: [],
      title: '',
      auditDialogVisible: false,
      picTypeOptions: [],
      picTypeOptionsIndexed: [],
      rules: {
        title: [
          { required: true, message: '请填写素材标题' },
          { max: 45, message: '不超过 45 个字符', trigger: 'blur' }
        ],
        type: [{ required: true, message: '请选择素材类型' }]
      },
      auditForm: {
        idStr: null,
        auditFlag: '4',
        auditDesc: ''
      },
      auditFormRules: {
        auditDesc: [
          { required: true, message: '请输入意见说明', trigger: 'blur' }
        ],
        auditFlag: [
          { required: true, message: '请输入审核意见', trigger: 'blur' }
        ]
      }
    }
  },
  props: ['editId', 'initMode'],
  methods: {
    audit () {
      this.auditDialogVisible = true
    },
    submitAudit () {
      this.$refs.auditForm.validate(valid => {
        if (valid) {
          this.auditForm.idStr = this.editId
          this.$service
            .materialBatchAudit(this.auditForm, '审批成功')
            .then(data => {
              this.auditDialogVisible = false
              this.$emit('show-list')
            })
        }
      })
    },
    handleUpload (file, fileItem) {
      this.$refs.upload.getImageInfo(fileItem.dataUrl).then(
        function (imageInfo) {
          const fileInfo = {
            upload: fileItem,
            materialTypeDictEnName: undefined,
            pictureId: undefined,
            pictureName: undefined,
            pictureResolution: imageInfo.width + '*' + imageInfo.height,
            pictureStatus: undefined,
            pictureType: undefined,
            pictureUrl: undefined
          }
          this.fileInfo.push(fileInfo)
          fileItem.status = 'uploading'
          this.$service
            .uploadImage({
              file,
              onUploadProgerss: evt => {
                if (evt.lengthComputable) {
                  fileItem.percentage = evt.loaded / evt.total
                }
              }
            })
            .then(data => {
              // eslint-disable-next-line
              if (data.code == 0) {
                const uploadResult = data.data[0]
                fileInfo.pictureName = uploadResult.originFileName
                fileInfo.pictureType = uploadResult.fileType
                fileInfo.pictureUrl = uploadResult.url
                fileItem.status = 'success'
              } else {
                fileItem.status = 'error'
                fileItem.message = data.msg
              }
            })
            .catch(() => {
              fileItem.status = 'error'
              fileItem.message = '网络错误'
            })
        }.bind(this)
      )
    },
    handleRemoveFile (file, index) {
      this.$refs.upload.handleRemove(file.upload)
      this.fileInfo = this.fileInfo.filter(function (item, i) {
        return i !== index
      })
    },
    handleSelectPicTypeStart () {
      this.showPicTypeSelector = true
    },
    handleBatchSetPicType (type) {
      this.fileInfo.forEach(function (item) {
        item.materialTypeDictEnName = type.dictEnName
      })
      this.showPicTypeSelector = false
    },
    getFormData () {
      const pictureId = this.pictureId
      const picTypeOptionsIndexed = this.picTypeOptionsIndexed
      const jsonStr = this.getUploadedFiles().map(item => {
        return {
          pictureId: pictureId,
          pictureType: item.pictureType,
          pictureResolution: item.pictureResolution,
          pictureUrl: item.pictureUrl,
          pictureStatus: item.pictureStatus,
          pictureName: item.pictureName,
          materialTypes: this.parseMaterialType(
            picTypeOptionsIndexed[item.materialTypeDictEnName]
          )
        }
      })
      const data = { jsonStr: JSON.stringify(jsonStr) }
      return data
    },
    setFormData (data) {
      this.status = data.pictureStatus
      data = JSON.parse(JSON.stringify(data))
      const materialTypes = data.materialTypes
      data.materialTypeDictEnName = materialTypes[0].dictEnName
      data.upload = {
        status: 'success',
        dataUrl: data.pictureUrl
      }
      this.pictureId = data.pictureId
      this.fileInfo.push(data)
    },
    parseMaterialType (item) {
      return {
        dictId: item.dictId,
        dictEnName: item.dictEnName,
        dictCnName: item.dictCnName
      }
    },
    validateFormData (cb) {
      this.$refs.form.validate(
        function (valid) {
          if (valid) {
            const uploadedFiles = this.getUploadedFiles()
            if (uploadedFiles.length === 0) {
              this.$message({
                type: 'error',
                message: '最少要上传一个素材，才能保存'
              })
              cb(Error())
            } else {
              cb()
            }
          } else {
            this.$message({
              type: 'error',
              message: '请把表单填写完整'
            })
            cb(Error())
          }
        }.bind(this)
      )
    },
    getUploadedFiles () {
      return this.fileInfo.filter(item => item.pictureUrl !== undefined)
    },
    handleSubmit () {
      this.validateFormData(err => {
        if (!err) {
          const data = this.getFormData()
          this.$service.globalPictureUpsert(data, '保存成功').then(() => {
            this.$emit('show-list')
          })
        }
      })
    },
    handleCancel () {
      this.$emit('go-back')
    },
    getMaterialTypes () {
      this.$service.getDictType({ type: 'materialType' }).then(data => {
        this.picTypeOptions = data || []
        this.picTypeOptionsIndexed = this.picTypeOptions.reduce(function (
          result,
          item
        ) {
          result[item.dictEnName] = item
          return result
        },
        {})
      })
    }
  },
  created () {
    if (this.editId) {
      this.title = '编辑'
      this.$service.globalPictureGet({ id: this.editId }).then(this.setFormData)
    } else {
      this.title = '新增'
    }
    this.mode = this.initMode
    this.getMaterialTypes()
  }
}
</script>
<style>
.global-picture__actions {
  padding: 15px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 20px;
}
.global-picture .upload-pic-list__item,
.global-picture .pic-info {
  display: inline-block;
  vertical-align: top;
}
.global-picture__label,
.global-picture__uploader {
  display: inline-block;
  vertical-align: top;
}
.global-picture__label {
  width: 80px;
  text-align: right;
  margin-right: 20px;
}
.global-picture .upload-pic-list__item {
  width: 180px;
  height: 180px;
}
.global-picture .upload-pic-list__item-wrapper {
  width: 600px;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  position: relative;
}

.global-picture .upload-pic-list__item {
  position: relative;
}
.global-picture .upload-pic-list__item img {
  max-width: 100%;
  max-height: 100%;
}
.global-picture .upload-pic-list__error {
  position: absolute;
  background: #000;
  opacity: 0.7;
  color: #fff;
  width: 100%;
  font-size: 12px;
  padding: 5px;
  display: block;
  box-sizing: border-box;
}

.global-picture .upload-pic-list__remove {
  position: absolute;
  color: red;
  cursor: pointer;
  top: 10px;
  right: 10px;
}
.global-pic-type-selector .el-tag {
  margin: 10px;
  cursor: pointer;
}
</style>
