<template>
  <div>
    <div v-show="mode!=='generator'">
      <ContentCard :title="title" @go-back="$emit('go-back','list')">
        <el-button type="primary" @click="submitBtn">保存</el-button>
        <div class="form-legend-header">
          <i class="el-icon-edit">基本信息</i>
        </div>
        <!--新增编辑界面-->
        <el-form
          :model="form"
          :rules="formRules"
          ref="form"
          label-width="120px"
          class="el-form-add">
          <el-form-item label="布局名称(中文)" prop="layoutName">
            <el-input v-model="form.layoutName" placeholder="布局名称"></el-input>
          </el-form-item>
          <el-form-item label="布局类别" prop="layoutType">
            <el-select v-model="form.layoutType" placeholder="布局类别">
              <el-option
                v-for="item in layoutType"
                :key="item.name+''"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上传文件">
            <el-button type="primary" plain @click="$refs.upload.handleSelectFile()">上传布局文件</el-button>
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
                    <div
                      v-if="file.upload.status === 'uploading'"
                      class="upload-pic-list__progress"
                    >
                      <el-progress :width="180" type="circle" :percentage="file.upload.percentage"></el-progress>
                    </div>
                    <img v-else :src="file.upload.dataUrl">
                  </div>
                </div>
              </template>
            </Upload>
          </el-form-item>
          <el-form-item label="布局">
            <el-button type="primary" plain @click="productLayout">生成布局</el-button>
          </el-form-item>
          <el-form-item>
            <LayoutBloack :content="content" class="layoutBloack"></LayoutBloack>
          </el-form-item>
        </el-form>
      </ContentCard>
    </div>
    <div v-if="mode==='generator'">
      <LayoutInfoGenerator @go-back="goBack" @generator-layout="generatorLayout"></LayoutInfoGenerator>
    </div>
  </div>
</template>
<script>
import { Upload } from 'admin-toolkit'
import LayoutBloack from './../../components/LayoutBlock'
import LayoutInfoGenerator from './LayoutInfoGenerator'
export default {
  components: {
    Upload,
    LayoutBloack,
    LayoutInfoGenerator
  },
  props: {
    editData: Object
  },
  data() {
    return {
      mode: 'create',
      title: null,
      fileInfo: [],
      content: [],
      layoutType: [
        {
          name: '主页6.0',
          id: 1
        },
        {
          name: '影视V2',
          id: 2
        }
      ],
      form: {
        layoutId: undefined,
        layoutName: null,
        layoutType: null,
        layoutJson: {},
        layoutModel: null, //布局类型
        layoutStatus: 2 //默认为草稿
      },
      formRules: {
        // 表单规则
        layoutName: [
          { required: true, message: '请输入布局名称', trigger: 'blur' }
        ],
        layoutType: [
          { required: true, message: '请输入布局类别', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    goBack() {
      this.mode = 'create'
    },
    submitBtn() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.content.length === 0) {
            this.$message({
              type: 'error',
              message: '请上传布局文件或者生成布局'
            })
            return
          }
          this.$service
            .getLayoutInforSave(
              { jsonStr: JSON.stringify(this.form) },
              '保存成功'
            )
            .then(data => {
              this.$emit('open-list-page')
            })
        }
      })
    },
    generatorLayout(obj) {
      this.getLayoutJson(obj)
      this.mode = 'create'
    },
    getEditData() {
      Object.keys(this.form).forEach(v => {
        this.form[v] = this.editData[v]
      })
      this.getLayoutJson({
        fileName: this.form.layoutName,
        content: this.form.layoutJson
      })
    },
    handleUpload(file, fileItem) {
      this.$service
        .uploadLayoutFile({
          file,
          onUploadProgerss: evt => {
            if (evt.lengthComputable) {
              fileItem.percentage = evt.loaded / evt.total
            }
          }
        })
        .then(data => {
          let d = JSON.parse(data.data.content) //布局内容
          if (
            typeof d.type !== 'undefined' &&
            (d.type === 'Panel' ||
              d.type === 'Lengthwise' ||
              d.type === 'Expander')
          ) {
            this.getLayoutJson(data.data)
          } else {
            this.$message({
              type: 'error',
              message: '选择的文件不对，应该选择布局格式的文件'
            })
          }
        })
    },
    getLayoutJson(data) {
      let d = JSON.parse(data.content) //布局内容
      this.form.layoutModel = d.type
      this.form.layoutName = data.fileName.replace('.txt', '')
      let layoutjson = {}
      this.content = d.contents
      if (d.type === 'Expander') {
        layoutjson = {
          type: d.type,
          extra: d.extra,
          contents: d.contents
        }
        if (d.extra.orientation == 0) {
          this.form.layoutRemark = '支持横向扩展'
        }
        if (d.extra.orientation == 1) {
          this.form.layoutRemark = '支持纵向扩展'
        }
        this.form.space = d.extra.space
        this.form.layoutFlag = d.extra.orientation
        this.form.width = d.extra.width
        this.form.height = d.extra.height
      } else {
        layoutjson = {
          type: d.type,
          contents: d.contents
        }
      }
      this.form.layoutJson = JSON.stringify(layoutjson)
    },
    productLayout() {
      this.mode = 'generator'
    }
  },
  created() {
    if (this.editData) {
      this.title = '编辑'
      this.getEditData()
    } else {
      this.title = '新增'
    }
  }
}
</script>
<style lang="stylus" scoped>
.layoutBloack
  >>> .close-block
    display: none
</style>

