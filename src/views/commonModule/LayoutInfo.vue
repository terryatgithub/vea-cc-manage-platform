<template>
  <PageWrapper>
    <PageContentWrapper v-show="activePage === 'layout'">
      <ContentCard :title="title" @go-back="$emit('go-back')">
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
            <el-form
              ref="form"
              :model="form"
              :rules="formRules"
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
                  ref="upload"
                  @upload="handleUpload"
                >
                  <template slot="preview" slot-scope="{fileList}" >
                    <div
                      v-if="fileList && fileList.length > 0">
                      <div class="upload-pic-list__item">
                        <div
                          class="upload-pic-list__error"
                          v-if="fileList[0].status === 'error'">
                          上传失败: {{ fileList[0].message }}
                        </div>
                        <div
                          v-else-if="fileList[0].status === 'uploading'"
                          class="upload-pic-list__progress">
                          <el-progress style="width: 250px" :percentage="fileList[0].percentage"></el-progress>
                        </div>
                        <span v-else>{{ fileList[0].filename }}</span>
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
          </div>
          <div class="layout-read" v-if="mode === 'read'">
            <div class="form-legend-header">
              <i class="el-icon-edit">基本信息</i>
            </div>
            <el-form :model="form" ref="form" label-width="120px">
              <el-form-item label="布局名称(中文)" prop="layoutName">
                <div>{{form.layoutName}}</div>
              </el-form-item>
              <el-form-item label="布局类别" prop="layoutType">
                <div>{{ layoutTypeText[form.layoutType] }}</div>
              </el-form-item>
              <el-form-item label="布局">
                <LayoutBloack :content="content" class="layoutBloack"></LayoutBloack>
              </el-form-item>
            </el-form>
          </div>
        </CommonContent>
      </ContentCard>
    </PageContentWrapper>

    <PageContentWrapper v-if="activePage === 'layout-generate'">
      <LayoutInfoGenerator 
        @go-back="activePage = 'layout'" 
        @generator-layout="generatorLayout">
      </LayoutInfoGenerator>
    </PageContentWrapper>
  </PageWrapper>
</template>

<script>
import PageWrapper from '@/components/PageWrapper'
import PageContentWrapper from '@/components/PageContentWrapper'
import CommonContent from '@/components/CommonContent.vue'
import { Upload } from 'admin-toolkit'
import LayoutBloack from './../../components/LayoutBlock'
import LayoutInfoGenerator from './LayoutInfoGenerator'
import titleMixin from '@/mixins/title'
export default {
  mixins: [titleMixin],
  components: {
    PageWrapper,
    PageContentWrapper,
    CommonContent,
    Upload,
    LayoutBloack,
    LayoutInfoGenerator
  },
  data() {
    return {
      activePage: 'layout',
      mode: 'create',
      resourceName: '布局',
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
      layoutTypeText: {
        1: '主页6.0',
        2: '影视V2'
      },
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
      },
      content: []
    }
  },
  props: ['initMode', 'id'],
  computed: {
    resourceInfo() {
      const form = this.form
      if (form.layoutId) {
        return {
          id: form.layoutId,
          type: 'layout',
          menuElId: 'layoutInfo',
          version: form.currentVersion,
          status: form.layoutStatus
        }
      }
    }
  },
  methods: {
    fetchData(version) {
      this.$service.getLayoutInforById({id: this.id}).then(this.setLayoutInfo)
    },
    setLayoutInfo(data) {
      this.form = Object.assign({}, data)
      this.getLayoutJson({
        fileName: this.form.layoutName,
        content: this.form.layoutJson
      })
    },
    handleSave() {
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
              this.$emit('upsert-end')
            })
        }
      })
    },
    handleUpload(file, fileItem) {
      this.$service
        .uploadLayoutFile({
          file,
          onUploadProgress: evt => {
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
            fileItem.status = 'success'
            fileItem.fileName = data.data.fileName
          } else {
            fileItem.status = 'error'
            fileItem.message = '选择的文件不对，应该选择布局格式的文件'
          }
        })
    },
    generatorLayout(obj) {
      this.activePage = 'layout'
      this.getLayoutJson(obj)
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
      this.activePage = 'layout-generate'
    }
  },
  created() {
    this.mode = this.initMode || 'create'
    if (this.id) {
      this.fetchData(this.version)
    }
  }
}
</script>

<style>

</style>
