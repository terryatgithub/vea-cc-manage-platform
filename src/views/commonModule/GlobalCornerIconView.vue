<template>
  <ContentCard :title="title" @go-back="$emit('go-back')">
    <div class="global-picture">
      <el-form :model="form" ref="form" label-width="120px">
        <div class="form-legend-header">
                <span>基本信息</span>
              </div>
        <el-form-item label="角标标题" prop="cornerIconName">
          <div>{{form.cornerIconName}}</div>
        </el-form-item>
        <el-form-item label="角标图片" prop="imgUrl">
          <div>
            <img :src="form.imgUrl" style="width:200px">
          </div>
        </el-form-item>
        <!-- <el-form-item label="角标分类" prop="globalIconTypeId"></el-form-item> -->
        <el-form-item label="角标类别" prop="attributeName">
          <div>{{form.attributeName}}</div>
        </el-form-item>
        <el-form-item label="角标分类" prop="attributeName">
          <div>{{form.cornerIconType.typeName}}</div>
        </el-form-item>
        <el-form-item label="审核状态" prop="cornerStatus">
          <div>{{form.cornerStatus}}</div>
        </el-form-item>
      
      <el-form-item>
        <AuditDetailButton
          v-if="status!==undefined"
          :id="id"
          :version="version"
          :type="type"
          :not-contain-btn="notContainBtn"
          :status="status"
          :hasHistory="hasHistory"
          :menuElId="menuElId"
          @go-edit-Page="goEditPage"
          @delete-item="deleteItem"
          @auditTask-end="$emit('open-list-page')"
        ></AuditDetailButton>
      </el-form-item>
      </el-form>
    </div>
  </ContentCard>
</template>

<script>
import { Upload } from 'admin-toolkit'
import GlobalIconAudit from './GlobalIconAudit'
import AuditDetailButton from './../../components/AuditDetailButton'
export default {
  components: {
    Upload,
    GlobalIconAudit,
    AuditDetailButton
  },
  data() {
    return {
      form: {},
      dialogPLVisible: false,
      hasHistory: false,
      id: null,
      version: undefined,
      type: 'icon',
      status: undefined,
      menuElId: 'globalCornerIcon',
      notContainBtn: ['claim', 'unclaim', 'copy', 'unaudit']
    }
  },
  props: {
    viewData: Object
  },
  methods: {
    getDetailInfo() {
      this.$service.getDetailInfo({ id: this.id }).then(data => {
        this.form = data
        this.status = data.cornerStatus
        this.form.cornerStatus = this.paraNumToNam(this.form.cornerStatus)
      })
    },
    paraNumToNam(status) {
      const statusMap = [
        '下架',
        '上架',
        '草稿',
        '待审核',
        '审核通过',
        '审核不通过'
      ]
      const cornerStatus = statusMap[status]
      return cornerStatus
    },
    goEditPage() {
      this.$emit('open-add-page', this.viewData.cornerIconId)
    },
    deleteItem() {
      if (window.confirm('确定要删除吗')) {
        this.$service
          .globalCornerIconRemove(
            { id: this.viewData.cornerIconId },
            '删除成功'
          )
          .then(data => {
            this.$emit('open-list-page')
          })
      }
    },
    handleSubmit() {
      this.dialogPLVisible = true
    },
    cancelSubmit() {
      if (window.confirm('确定撤销审核吗')) {
        this.$service
          .revokedAudit(
            { resourceId: this.viewId, resourceType: 'icon' },
            '撤销审核成功'
          )
          .then(data => {
            this.$emit('open-list-page')
          })
      }
    },
    submitForm(data) {
      const auditFlag = data.auditFlag
      const auditDesc = data.auditDesc
      this.$service
        .auditTask({
          resourceId: this.viewId,
          resourceType: 'icon',
          auditFlag: auditFlag,
          auditDesc: auditDesc
        })
        .then(data => {
          this.$emit('open-list-page')
          this.$refs.auditForm.cancle()
          this.dialogPLVisible = false
        })
    },
    //
    cancle(data) {
      this.dialogPLVisible = data
    },
    handleDialogClose() {
      this.$refs.auditForm.cancle()
    }
  },
  created() {
    this.title = '预览'
    let reviewData = this.viewData
    if (typeof reviewData.cornerIconId !== 'undefined') {
      this.id = reviewData.cornerIconId
    } else {
      this.id = reviewData.resourceId
    }
   this.getDetailInfo()
  }
}
</script>
<style scoped>
.global-picture__label {
  margin: 5px;
}
</style>