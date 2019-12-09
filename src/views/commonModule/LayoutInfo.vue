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
                    v-for="item in layoutTypeOptions"
                    :key="item.id"
                    :label="item.dictCnName"
                    :value="item.dictId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="布局" prop="layoutJson8">
                <el-button type="primary" plain @click="$refs.upload.handleSelectFile()">上传布局文件</el-button>
                <el-button type="primary" plain @click="activePage = 'layout-generate'">生成布局</el-button>
                <el-button type="primary" plain :disabled="!form.layoutJson8" @click="handleDownloadLayout(form.layoutJson8)">下载</el-button>
                <Upload
                  ref="upload"
                  @upload="handleUpload(arguments[0], arguments[1], 'v8')">
                  <template slot="preview" slot-scope="{fileList}" >
                    <div
                      v-if="fileList && fileList.length > 0">
                      <div
                        class="upload-pic-list__item">
                        <div
                          v-if="getLastFile(fileList).status === 'uploading'"
                          class="upload-pic-list__progress">
                          <el-progress style="width: 250px" :percentage="getLastFile(fileList).percentage"></el-progress>
                        </div>
                      </div>
                    </div>
                  </template>
                </Upload>
                <LayoutPreview
                  v-if="form.layoutJson8"
                  class="layout-preview"
                  :content="form.layoutJson8.contents">
                </LayoutPreview>
              </el-form-item>
              <el-form-item label="6.0布局生成方式" prop="layout6GenMode">
                <el-radio-group :value="form.layout6GenMode" @input="handleInputLayout6GenMode">
                  <el-radio label="auto">自动</el-radio>
                  <el-radio label="manual">手动</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="布局6.0" prop="layoutJson">
                <el-button type="primary" :disabled="form.layout6GenMode === 'auto'" plain @click="$refs.uploadV6.handleSelectFile()">上传布局文件</el-button>
                <el-button type="primary" :disabled="form.layout6GenMode === 'auto'" plain @click="activePage = 'layout-generate-v6'">生成布局</el-button>
                <el-button type="primary" plain :disabled="!form.layoutJson" @click="handleDownloadLayout(form.layoutJson)">下载</el-button>
                <Upload
                  ref="uploadV6"
                  @upload="handleUpload(arguments[0], arguments[1], 'v6')">
                  <template slot="preview" slot-scope="{fileList}" >
                    <div
                      v-if="fileList && fileList.length > 0">
                      <div
                        class="upload-pic-list__item">
                        <div
                          v-if="getLastFile(fileList).status === 'uploading'"
                          class="upload-pic-list__progress">
                          <el-progress style="width: 250px" :percentage="getLastFile(fileList).percentage"></el-progress>
                        </div>
                      </div>
                    </div>
                  </template>
                </Upload>
                <LayoutPreview
                  v-if="form.layoutJson"
                  class="layout-preview"
                  :content="form.layoutJson.contents">
                </LayoutPreview>
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
                <el-button type="primary" plain :disabled="!form.layoutJson8" @click="handleDownloadLayout(form.layoutJson8)">下载</el-button>
                <LayoutPreview
                  v-if="form.layoutJson8"
                  class="layout-preview"
                  :content="form.layoutJson8.contents">
                </LayoutPreview>
              </el-form-item>
              <el-form-item label="6.0布局生成方式" prop="layout6GenMode">
                {{ form.layout6GenMode === 'manual' ? '手动' : '自动' }}
              </el-form-item>
              <el-form-item label="布局6.0" prop="layoutJson">
                <el-button type="primary" plain :disabled="!form.layoutJson" @click="handleDownloadLayout(form.layoutJson)">下载</el-button>
                <LayoutPreview
                  v-if="form.layoutJson"
                  class="layout-preview"
                  :content="form.layoutJson.contents">
                </LayoutPreview>
              </el-form-item>
            </el-form>
          </div>
        </CommonContent>
      </ContentCard>
    </PageContentWrapper>

    <PageContentWrapper v-if="activePage === 'layout-generate'">
      <LayoutInfoGenerator
        layout-version="v8"
        :layout-spacing="40"
        :layout-width="1760"
        @go-back="activePage = 'layout'"
        @gen-end="handleGenLayoutEnd($event, 'v8')">
      </LayoutInfoGenerator>
    </PageContentWrapper>
    <PageContentWrapper v-if="activePage === 'layout-generate-v6'">
      <LayoutInfoGenerator
        layout-version="v6"
        :layout-spacing="28"
        :layout-width="1622"
        @go-back="activePage = 'layout'"
        @gen-end="handleGenLayoutEnd($event, 'v6')">
      </LayoutInfoGenerator>
    </PageContentWrapper>
  </PageWrapper>
</template>

<script>
import PageWrapper from '@/components/PageWrapper'
import PageContentWrapper from '@/components/PageContentWrapper'
import CommonContent from '@/components/CommonContent.vue'
import { Upload } from 'admin-toolkit'
import LayoutPreview from './../../components/LayoutBlock'
import LayoutInfoGenerator from './LayoutInfoGenerator'
import titleMixin from '@/mixins/title'
import { cloneDeep } from 'lodash'
export default {
  mixins: [titleMixin],
  components: {
    PageWrapper,
    PageContentWrapper,
    CommonContent,
    Upload,
    LayoutPreview,
    LayoutInfoGenerator
  },
  data() {
    return {
      activePage: 'layout',
      mode: 'create',
      resourceName: '布局',
      layoutTypeOptions: [],
      layoutTypeText: {},
      form: {
        layoutId: undefined,
        layoutName: null,
        layoutType: null,
        layout6GenMode: 'auto',
        layoutJson: null,
        layoutJson8: null,
        layoutModel: null, // 布局类型
        layoutStatus: 2 // 默认为草稿
      },
      formRules: {
        // 表单规则
        layoutName: [
          { required: true, message: '请输入布局名称', trigger: 'blur' },
          { max: 45, message: '不超过 45 个字符' }
        ],
        layoutType: [
          { required: true, message: '请输入布局类别', trigger: 'blur' }
        ],
        layoutJson8: [
          { required: true, message: '请设置布局', trigger: 'blur' }
        ],
        layoutJson: [
          { required: true, message: '请设置布局6.0', trigger: 'blur' }
        ]
      },
      content: []
    }
  },
  props: ['initMode', 'id'],
  computed: {
    // eslint-disable-next-line
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
    handleDownloadLayout (layout) {
      const urlObject = window.URL || window.webkitURL || window
      const blobData = new Blob([JSON.stringify(layout)])
      const aElement = document.createElement('a')
      aElement.href = urlObject.createObjectURL(blobData)
      aElement.download = this.form.layoutName || 'layout'
      aElement.click()
    },
    handleInputLayout6GenMode (val) {
      const form = this.form
      form.layout6GenMode = val
      if (val === 'manual') {
        form.layoutJson = null
      } else {
        this.setLayout6()
      }
    },
    fetchData(version) {
      this.$service.getLayoutInforById({ id: this.id }).then(this.setLayoutInfo)
    },
    setLayoutInfo(data) {
      this.form = Object.assign({}, data, {
        layoutJson: JSON.parse(data.layoutJson),
        layoutJson8: JSON.parse(data.layoutJson8)
      })
    },
    handleSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const data = cloneDeep(this.form)
          // 校验
          const layoutJson = data.layoutJson
          const layoutJson8 = data.layoutJson8
          const isAutoGenV6 = data.layout6GenMode === 'auto'
          if (!isAutoGenV6) {
            // 验证 6.0 和 8.0 布局的推荐位数量和比例是否一致
            const v6Contents = layoutJson.contents
            const v8Contents = layoutJson8.contents
            const isValidRatio = v6Contents.every((v6Block, index) => {
              const v8Block = v8Contents[index]
              const v8Ratio = v8Block.width / v8Block.height
              const v6Ratio = v6Block.width / v6Block.height
              const ratioDiff = Math.abs(v8Ratio - v6Ratio)
              const rationDiffRatio = ratioDiff / v8Ratio
              return rationDiffRatio < 0.005
            })
            const isValidCount = v6Contents.length === v8Contents.length
            if (!isValidRatio || !isValidCount) {
              return this.$message({
                type: 'error',
                message: '6.0布局和8.0布局推荐位数量必须相同，相同位置的推荐位长宽比例必须相同',
                duration: 5000
              })
            }
          }

          // 转换数据结构
          data.layoutModel = layoutJson.type
          data.layoutJson = JSON.stringify(layoutJson)
          data.layoutJson8 = JSON.stringify(layoutJson8)

          // 发送请求
          this.$service
            .getLayoutInforSave(
              { jsonStr: JSON.stringify(data) },
              '保存成功'
            )
            .then(data => {
              this.$emit('upsert-end')
            })
        }
      })
    },
    getLastFile (fileList) {
      return fileList[fileList.length - 1]
    },
    handleUpload(file, fileItem, version) {
      this.$service
        .uploadLayoutFile({
          file,
          onUploadProgress: evt => {
            if (evt.lengthComputable) {
              fileItem.percentage = evt.loaded / evt.total * 100
            }
          }
        })
        .then(data => {
          this.handleUploadEnd(data, version)
          fileItem.status = 'success'
          fileItem.percentage = 0
        }).catch((e) => {
          fileItem.status = 'error'
          fileItem.message = e.message
        })
    },
    handleGenLayoutEnd(layoutInfo, version) {
      const form = this.form
      let { fileName, content } = layoutInfo
      content = JSON.parse(content) // 布局内容
      if (version === 'v8') {
        form.layoutName = fileName.replace('.txt', '')
        this.form.layoutJson8 = content
        this.setLayout6()
      }
      if (version === 'v6') {
        this.form.layoutJson = content
      }
      this.activePage = 'layout'
    },
    handleUploadEnd (data, version) {
      const fileName = data.fileName
      const layoutJson = data.content
      const form = this.form
      if (version === 'v6') {
        form.layoutJson = layoutJson
      } else {
        form.layoutName = fileName
        form.layoutJson8 = layoutJson
        this.setLayout6()
      }
    },
    setLayout6 () {
      const form = this.form
      const layoutJson8 = form.layoutJson8
      if (layoutJson8 && form.layout6GenMode === 'auto') {
        return this.$service.getLayoutVersion6({
          layoutJson8: JSON.stringify(layoutJson8)
        }).then(layoutJson => {
          form.layoutJson = layoutJson
        })
      }
    },
    fetchLayoutTypeOptions () {
      this.$service.getDictType({ type: 'layoutType' }).then(layoutTypeOptions => {
        this.layoutTypeOptions = layoutTypeOptions
        this.layoutTypeText = layoutTypeOptions.reduce((result, item) => {
          result[item.dictId] = item.dictCnName
          return result
        }, {})
      })
    }
  },
  created() {
    this.mode = this.initMode || 'create'
    if (this.id) {
      this.fetchData(this.version)
    }
    this.fetchLayoutTypeOptions()
  }
}
</script>

<style lang="stylus" scoped>
.layout-preview
  margin-top 10px
</style>
