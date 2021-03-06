<template>
    <ContentCard class="global-picture" :title="title" @go-back="$emit('go-back')">
      <CommonContent
        :mode="mode"
        :resource-info="resourceInfo"
        @edit="mode = 'edit'"
        @unaudit="$emit('upsert-end')"
        @shelves="fetchData"
        @audit="$emit('upsert-end')"
        @select-version="fetchData"
        @delete="$emit('upsert-end', $event)"
      >
        <div slot="auditAndDraft">
          <el-button type="primary" @click="handleSave">提交审核</el-button>
        </div>
        <div class="layout-upsert" v-if="mode !== 'read'">
          <div class="form-legend-header">
            <i class="el-icon-edit">基本信息</i>
          </div>

          <el-form ref="form" label-width="120px" :model="this">
            <div class="global-picture__label">角标图片</div>
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
                      :prop="'fileInfo.' + index + '.cornerIconName'"
                      :rules="rules.title"
                      label="角标标题"
                    >
                      <el-input v-model="file.cornerIconName"/>
                    </el-form-item>
                    <!--角标分类-->
                    <el-form-item
                      :prop="'fileInfo.' + index + '.typeRls.typeId'"
                      :rules="rules.type"
                      label="角标分类">
                      <el-select v-model="file.typeRls.typeId">
                        <el-option
                          v-for="(item, index) in attributes"
                          :key="index"
                          :value="item.typeId"
                          :label="item.typeName"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <!--角标类别-->
                    <el-form-item
                      :prop="'fileInfo.' + index + '.attributeCode'"
                      :rules="rules.code"
                      label="角标类别"
                    >
                      <el-radio-group v-model="file.attributeCode">
                        <el-radio :label="'0'">其他</el-radio>
                        <el-radio :label="'1'">VIP</el-radio>
                      </el-radio-group>
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
                  @click="$refs.upload.handleSelectFile()">
                  点击选择图片
                </el-button>
                <el-button @click="showPicTypeSelector=true"   type="primary" plain>批量设置分类</el-button>
              </template>
            </Upload>
          </el-form>
        </div>
        <div class="layout-read" v-if="mode === 'read'">
          <div class="form-legend-header">
            <i class="el-icon-edit">基本信息</i>
          </div>

          <el-form v-if="fileInfo.length > 0" ref="form" label-width="120px">
            <el-form-item label="角标标题" prop="cornerIconName">
              {{fileInfo[0].cornerIconName}}
            </el-form-item>
            <el-form-item label="角标图片" prop="imgUrl">
              <img :src="fileInfo[0].imgUrl" style="width:200px">
            </el-form-item>
            <!-- <el-form-item label="角标分类" prop="globalIconTypeId"></el-form-item> -->
            <el-form-item label="角标类别" prop="attributeName">
              {{fileInfo[0].attributeName}}
            </el-form-item>
            <el-form-item label="角标分类" prop="attributeName">
              {{fileInfo[0].cornerIconType.typeName}}
            </el-form-item>
          </el-form>
        </div>

        <el-dialog
          class="global-pic-type-selector"
          title="选择素材类型"
          size="tiny"
          :visible.sync="showPicTypeSelector">
          <el-tag
            v-for="(item, index) in  attributes"
            :key="index"
            @click.native="handleBatchSetPicType(item)">
            {{ item.typeName }}
          </el-tag>
        </el-dialog>
      </CommonContent>
    </ContentCard>
</template>

<script>
import CommonContent from '@/components/CommonContent.vue'
import { Upload } from 'admin-toolkit'
import titleMixin from '@/mixins/title'
export default {
  mixins: [titleMixin],
  components: {
    CommonContent,
    Upload
  },
  data () {
    return {
      mode: 'create',
      resourceName: '角标',
      showPicTypeSelector: false,
      fileInfo: [],
      attributes: [], // 角标分类
      attributesIndexed: [],
      form: {},
      rules: {
        title: [
          { required: true, message: '请填写素材标题' },
          { max: 45, message: '不超过 45 个字符', trigger: 'blur' }
        ],
        type: [{ required: true, message: '请选择角标类别' }],
        code: [{ required: true, message: '请选择角标分类' }]
      }
    }
  },
  props: ['initMode', 'id'],
  computed: {
    // eslint-disable-next-line
    resourceInfo() {
      const form = this.fileInfo[0]
      if (form && form.cornerIconId) {
        return {
          id: form.cornerIconId,
          type: 'icon',
          menuElId: 'globalCornerIcon',
          version: form.currentVersion,
          status: form.cornerStatus
        }
      }
    }
  },
  methods: {
    fetchData (version) {
      this.$service.globalCornerIconEdit({ id: this.id }).then(this.setFormData)
    },
    handleSave () {
      this.validateFormData(err => {
        if (!err) {
          const data = this.getFormData()
          this.$service.globalCornerIconSave(data, '保存成功').then(() => {
            this.$emit('upsert-end')
          })
        }
      })
    },
    getFormData () {
      const data = this.getUploadedFiles().map(item => {
        return {
          cornerIconId: this.id,
          cornerIconName: item.cornerIconName, // 标题
          imgUrl: item.imgUrl, // url
          attributeCode: item.attributeCode, // 分类
          typeRls: item.typeRls
        }
      })
      return data
    },
    setFormData (data) {
      this.fileInfo = [
        {
          upload: {
            status: 'success',
            dataUrl: data.imgUrl
          },
          typeRls: {
            typeId: data.cornerIconType.typeId
          },
          ...data
        }
      ]
    },
    validateFormData (cb) {
      this.$refs.form.validate(
        function (valid) {
          if (valid) {
            const uploadedFiles = this.getUploadedFiles()
            if (uploadedFiles.length === 0) {
              this.$message({
                type: 'error',
                message: '最少要上传一个角标素材，才能保存'
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
      return this.fileInfo.filter(item => item.imgUrl !== undefined)
    },
    getCornerTypes () {
      this.$service.getCornerTypes().then(data => {
        this.attributes = data || []
        this.attributesIndexed = this.attributes.reduce(function (result, item) {
          result[item.typeName] = item
          return result
        }, {})
      })
    },
    handleUpload (file, fileItem) {
      this.$refs.upload.getImageInfo(fileItem.dataUrl).then(
        function (imageInfo) {
          const fileInfo = {
            upload: fileItem,
            typeRls: {
              typeId: undefined
            },
            cornerIconName: undefined,
            attributeCode: '0', // 角标分类
            imgUrl: undefined,
            pictureType: undefined // 上传图片格式
          }
          this.fileInfo.push(fileInfo)
          fileItem.status = 'uploading'
          this.$service
            .uploadImage({
              file,
              onUploadProgress: evt => {
                if (evt.lengthComputable) {
                  fileItem.percentage = evt.loaded / evt.total
                }
              }
            })
            .then(data => {
              // eslint-disable-next-line
              if (data.code == 0) {
                const uploadResult = data.data[0]
                fileInfo.cornerIconName = uploadResult.originFileName
                fileInfo.pictureType = uploadResult.fileType
                fileInfo.imgUrl = uploadResult.url
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
    handleBatchSetPicType (type) {
      const typeId = type.typeId
      this.fileInfo.forEach(function (item) {
        item.typeRls.typeId = typeId
      })
      this.showPicTypeSelector = false
    }
  },
  created () {
    this.mode = this.initMode || 'create'
    if (this.id) {
      this.fetchData(this.version)
    }
    this.getCornerTypes() // 角标分类
  }
}
</script>

<style scoped>
.global_icon_actions {
  padding: 15px;
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
