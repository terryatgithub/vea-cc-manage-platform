<template>
  <ContentCard :title="title" @go-back="$emit('go-back','list')">
    <!--新增编辑界面-->
    <AuditDetailButton
      v-if="id!==undefined"
      :id="id"
      :version="version"
      :type="type"
      :not-contain-btn="notContainBtn"
      :hasHistory="hasHistory"
      :status="status"
      :menuElId="menuElId"
      @go-edit-Page="goEditPage"
      @delete-item="deleteItem"
      @auditTask-end="$emit('open-list-page')"
    ></AuditDetailButton>
    <div class="form-legend-header">
      <i class="el-icon-edit">基本信息</i>
    </div>
    <el-form :model="form" ref="form" label-width="120px">
      <el-form-item label="布局名称(中文)" prop="layoutName">
        <div>{{form.layoutName}}</div>
      </el-form-item>
      <el-form-item label="布局类别" prop="layoutType">
        <div>{{form.layoutType}}</div>
      </el-form-item>
      <el-form-item label="状态">
        <div class="status">{{form.layoutStatus}}</div>
      </el-form-item>
      <el-form-item label="布局">
        <LayoutBloack :content="content" class="layoutBloack"></LayoutBloack>
      </el-form-item>
    </el-form>
  </ContentCard>
</template>
<script>
import { Upload } from 'admin-toolkit'
import LayoutBloack from './../../components/LayoutBlock'
import AuditDetailButton from './../../components/AuditDetailButton'
export default {
  components: {
    Upload,
    LayoutBloack,
    AuditDetailButton
  },
  props: {
    reviewData: Object
  },
  data() {
    return {
      title: null,
      fileInfo: [],
      content: [],
      id: undefined,
      hasHistory: false,
      version: '',
      type: 'layout',
      status: null,
      menuElId: 'layoutInfo',
      notContainBtn: ['claim', 'unclaim', 'copy'],
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
        layoutName: null,
        layoutType: null,
        layoutJson: {},
        layoutStatus: null,
        layoutModel: null, //布局类型
        layoutStatus: 2 //默认为草稿
      },
      actions: {}
    }
  },
  methods: {
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
    getlLayoutTypeName(id) {
      let layoutTypeName = this.layoutType.filter(e => {
        if (parseInt(e.id) === parseInt(id)) {
          return e
        }
      })
      return layoutTypeName.length > 0 ? layoutTypeName[0].name : ''
    },
    getEditData(reviewData) {
      Object.keys(this.form).forEach(v => {
        if (v === 'layoutType') {
          this.form[v] = this.getlLayoutTypeName(reviewData[v])
        } else if (v === 'layoutStatus') {
          this.form[v] = this.$numToAuditStatus(reviewData[v])
        } else {
          this.form[v] = reviewData[v]
        }
      })
      this.getLayoutJson({
        fileName: this.form.layoutName,
        content: this.form.layoutJson
      })
    },
    goEditPage() {
      this.$emit('go-edit-Page')
    },
    deleteItem() {
      this.$service.getLayoutInforBatchDel({ id: this.id }, '删除成功')
      this.$emit('open-list-page')
    },
    getLayoutJson(data) {
      let d = JSON.parse(data.content) //布局内容
      this.form.layoutModel = d.type
      this.form.layoutName = data.fileName.substr(0, 45)
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
    }
  },
  created() {
    if (JSON.stringify(this.reviewData) !== '{}') {
      this.title = '预览'
      let reviewData = this.reviewData
      if (typeof reviewData.layoutId !== 'undefined') {
        this.id = reviewData.layoutId
        this.status = this.reviewData.layoutStatus
        this.getEditData(reviewData)
      } else {
        this.id = reviewData.resourceId
        this.$service.getLayoutInforById({ id: this.id }).then(data => {
          //this.reviewData = data
          this.status = data.layoutStatus
          this.getEditData(data)
        })
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.layoutBloack
  >>> .close-block
    display: none
.status
  color: red
</style>

