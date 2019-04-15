<template>
  <ContentCard :title="title" @go-back="$emit('go-back')">
    <div class="global-picture">
      <el-form :model="form" ref="form" label-width="120px">
        <div class="global-picture__label">角标图片</div>
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
        <el-form-item label="审核状态" prop="cornerStatus">
          <div>{{form.cornerStatus}}</div>
        </el-form-item>
      </el-form>
      <div class="global_icon_actions">
        <el-button type="primary" @click="toEdit" v-if="form.cornerStatus == '审核不通过'">编辑</el-button>
        <el-button type="primary" @click="toDelete" v-if="form.cornerStatus == '审核不通过'">删除</el-button>
        <el-button type="primary" @click="handleSubmit" v-if="form.cornerStatus == '待审核'" >审核</el-button>
         <el-button type="primary" @click="cancelSubmit" v-if="form.cornerStatus == '待审核'" >撤销审核</el-button>
      </div>
      <!-- <AuditDetailButton
        :id="id"
        :version="version"
        :type="type"
        :not-contain-btn="notContainBtn"
        :status="status"
        :menuElId="menuElId"
        @go-edit-Page="goEditPage"
        @delete-item="deleteItem"
      ></AuditDetailButton> -->
      <el-dialog title="审核" :visible.sync="dialogPLVisible" :before-close="handleDialogClose">
        <GlobalIconAudit @auditForm="submitForm" @cancle="cancle" ref="auditForm"></GlobalIconAudit>
      </el-dialog>
    </div>
  </ContentCard>
</template>

<script>
import { Upload } from 'admin-toolkit'
import GlobalIconAudit from './GlobalIconAudit'
export default {
  components: {
    Upload,
    GlobalIconAudit,
  },
  data() {
    return {
      form: {},
      dialogPLVisible: false,
      // id: null,
      // version: '',
      // type: 'icon',
      // status: null,
      // menuElId: 'globalCornerIcon',
      // notContainBtn: ['claim', 'unclaim', 'copy']
    }
  },
  // props: {
  //   viewData: Object
  // },
  props: {
    viewId: Number
  },
  methods: {
    getDetailInfo() {
      this.$service.getDetailInfo({ id: this.viewId }).then(data => {
        console.log(data)
        this.form = data
        this.form.cornerStatus = this.paraNumToNam(this.form.cornerStatus)
      })
    },
    paraNumToNam(status) {
      const statusMap = ['无效', '审核通过', '待审核', '审核不通过']
      const cornerStatus = statusMap[status]
      return cornerStatus
    },
    //跳转到编辑
    toEdit() {
      this.$emit('open-add-page', this.viewId)
    },
    // goEditPage() {
    //   this.$emit('open-add-page', this.viewData.cornerIconId)
    // },
    //删除
    toDelete() {
      if (window.confirm('确定要删除吗')) {
          this.$service
            .globalCornerIconRemove({ id: this.viewId }, '删除成功')
            .then(data => {
              this.$emit('open-list-page')
            })
        }
    },
    // deleteItem() {
    //   if (window.confirm('确定要删除吗')) {
    //     this.$service
    //       .globalCornerIconRemove(
    //         { id: this.viewData.cornerIconId },
    //         '删除成功'
    //       )
    //       .then(data => {
    //         this.$emit('open-list-page')
    //       })
    //   }
    // },
    handleSubmit() {
      this.dialogPLVisible = true
    },
    cancelSubmit(){
      if(window.confirm('确定撤销审核吗')) {
        this.$service.revokedAudit({resourceId: this.viewId,resourceType:'icon'}, '撤销审核成功').then(data =>{
          this.$emit('open-list-page')
        })
      }
    },
    submitForm(data) {
      const auditFlag = data.auditFlag
      const auditDesc = data.auditDesc
      this.$service.executionTask(
        {
          resourceId: this.viewId,
          resourceType: 'icon',
          auditFlag: auditFlag,
          auditDesc: auditDesc
        }
      )

        // .batchAudit(
        //   {
        //     idStr: this.viewId,
        //     auditFlag: data.auditFlag,
        //     auditDesc: data.auditDesc
        //   },
        //   '审核成功'
        // )
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
    this.getDetailInfo()
  }
}
</script>
<style scoped>
.global-picture__label {
  margin: 5px;
}
</style>