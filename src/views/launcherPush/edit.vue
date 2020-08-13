<template>
    <ContentCard title="新增/编辑">
      <PushForm @regionSel = 'regionSel' ref = 'pushChild' :ctmDevCtrName = 'ctmDevCtrName' :risId = 'risId'></PushForm>
      <el-dialog
        :title='dialogTitle'
        :visible.sync = 'dialogFormVisible'
        :width = 'dialogWidth'
        :close-on-click-modal = 'false'
        :show-close = 'showClose'
      >
        <RegionEditPop v-if="dialogType === 'regionPop'" @regionDetail = 'regionDetail' @close = 'close' @getRegion = 'getRegion(arguments)'></RegionEditPop>
        <RegionDetail v-if="dialogType === 'regionDetail'" @goRegion = 'goRegion' :id = 'risId'></RegionDetail>
        <AppSelPop v-if="dialogType === 'appPop'" @appDetail = 'appDetail' @close = 'close'></AppSelPop>
        <AppDetail v-if="dialogType === 'appDetail'" @goApp = 'goApp' @close = 'close' :materialId = 'materialId' @appSure = 'appSure(arguments)'></AppDetail>
      </el-dialog>
      <div class="appBox">
        <div class="label">选择应用</div>
        <ul>
          <li v-for='(item, index) in appList' :key='index'>
            <i
              class="el-icon-error delIcon"
              v-if='index !== appList.length-1'
              @click='appDel(index)'
            ></i>
            <div class="grid-content">
              <i
                class="el-icon-plus avatar-uploader-icon"
                v-if="index === appList.length - 1"
                @click="appSel"
              ></i>
              <img :src='item.materialPic' v-if="index !== appList.length - 1 && item.materialPic !== ''" class='appLogo' />
            </div>
            <p class="materialName" v-if="index !== appList.length - 1">{{item.materialName}}</p>
          </li>
        </ul>
      </div>
      <FooterForm @create = 'create' @cancel = 'cancel' ref = 'footerChild'></FooterForm>
    </ContentCard>
</template>

<script>
import ContentCard from '@/components/ContentCard'
import PushForm from '@/components/liteOS/pushForm'
import FooterForm from '@/components/liteOS/footerForm'
import RegionEditPop from '@/components/liteOS/regionEditPop'
import RegionDetail from '@/components/liteOS/regionDetail'
import AppSelPop from '@/components/liteOS/appSelPop'
import AppDetail from '@/components/liteOS/appDetail'
import liteOS from '@/assets/liteOS.js'
export default {
  components: {
    ContentCard,
    PushForm,
    FooterForm,
    RegionEditPop,
    RegionDetail,
    AppSelPop,
    AppDetail
  },
  watch: {
  },
  data () {
    return {
      dialogTitle: '',
      dialogFormVisible: false,
      dialogType: '',
      dialogWidth: '550px',
      showClose: true,
      appList: [
        {
          materialId: 0,
          materialName: 'xxx',
          detailSeq: '',
          materialPic: ''
        }
      ],
      ctmDevCtrName: '',
      risId: '',
      materialId: ''
    }
  },
  methods: {
    // 执行详情回显
    detailById () {
      if (this.$route.query.releaseConfId) {
        this.$service.getLauncherPushManageReleaseConfId({
          releaseConfId: this.$route.query.releaseConfId
        }).then(data => {
          if (data.code === 0) {
            const detail = data.data
            detail.supportVersion = detail.supportVersion.split(',')
            const date = (liteOS.parserDate(detail.releaseStartTime) + ',' + liteOS.parserDate(detail.releaseEndTime)).split(',')
            const pushForm = {
              releaseConfName: detail.releaseConfName,
              supportVersion: detail.supportVersion,
              ctmDevCtrId: detail.ctmDevCtrId,
              date: date,
              priority: detail.priority.toString()
            }
            this.$refs['pushChild'].pushForm = pushForm
            this.ctmDevCtrName = detail.ctmDevCtrName
            for (const i in detail.appList) {
              delete detail.appList[i].materialPics
            }
            this.appList = [...detail.appList, ...[{
              materialId: 0,
              materialName: 'xxx',
              detailSeq: '',
              materialPic: ''
            }]]
          } else {
            this.$message({
              type: 'error',
              message: data.msg
            })
          }
        })
      } else {
        // 新增前先初始化页面
        // debugger
        this.$nextTick(() => {
          this.$refs['pushChild'].$refs['pushForm'].clearValidate()
          this.$refs['pushChild'].$refs['pushForm'].resetFields()
          this.$refs['footerChild'].$refs['footerForm'].resetFields()
          this.ctmDevCtrName = ''
          this.appList = [{
            materialId: 0,
            materialName: 'xxx',
            detailSeq: '',
            materialPic: ''
          }]
        })
      }
    },
    // 获取区域选择传值
    getRegion (val) {
      this.risId = val[0]
      this.ctmDevCtrName = val[1]
    },
    // 弹窗选择区域
    regionSel () {
      this.dialogFormVisible = true
      this.dialogType = 'regionPop'
      this.dialogTitle = '选择区域'
      this.dialogWidth = '550px'
      this.showClose = true
    },
    // 显示区域详情
    regionDetail (val) {
      this.risId = val
      this.dialogType = 'regionDetail'
      this.dialogWidth = '550px'
      this.dialogTitle = ''
      this.showClose = false
    },
    // 返回选择区域
    goRegion () {
      this.dialogType = 'regionPop'
      this.dialogWidth = '550px'
      this.dialogTitle = '选择区域'
      this.showClose = true
    },
    // 弹窗选择应用
    appSel () {
      if (this.appList.length === 99) {
        this.$message({
          type: 'warning',
          message: '应用数量已达上限!'
        })
      } else {
        this.appList.splice(this.appList.length - 1, 0, {
          id: 0,
          materialName: 'xxx',
          appLogo: ''
        })
        this.dialogFormVisible = true
        this.dialogType = 'appPop'
        this.dialogWidth = '650px'
        this.dialogTitle = '选择应用'
        this.showClose = true
      }
    },
    // 显示应用详情
    appDetail (val) {
      this.materialId = val
      this.dialogType = 'appDetail'
      this.dialogWidth = '650px'
      this.dialogTitle = ''
      this.showClose = false
    },
    // 返回选择应用
    goApp () {
      this.dialogType = 'appPop'
      this.dialogWidth = '650px'
      this.dialogTitle = '选择应用'
      this.showClose = true
    },
    // 删除应用
    appDel (index) {
      this.appList.splice(index, 1)
    },
    // 应用海报选择确定
    appSure (data) {
      this.appList[this.appList.length - 2] = {
        materialId: data[0],
        materialName: data[1],
        detailSeq: this.appList.length - 2,
        materialPic: data[2]
      }
      this.dialogFormVisible = false
    },
    // 关闭弹窗
    close () {
      if (this.dialogType === 'appPop' || this.dialogType === 'appDetail') {
        this.appList.splice(this.appList.length - 2, 1)
      }
      this.dialogFormVisible = false
    },
    create (DeviceID) {
      let that = this
      this.$refs['pushChild'].$refs['pushForm'].validate((valid) => {
        if (valid) {
          if (this.appList.length === 1) {
            this.$message({
              type: 'error',
              message: '请选择应用！'
            })
          } else {
            const params = this.$refs['pushChild'].pushForm
            params.releaseStartTime = liteOS.date(params.date[0])
            params.releaseEndTime = liteOS.date(params.date[1])
            delete params.date
            params.supportVersion = params.supportVersion.join(',')
            params.creator = '管理员'
            params.releaseStatus = '0'
            params.tvActiveId = DeviceID
            params.appList = that.appList
            params.appList.pop()
            if (this.$route.query.releaseConfId && this.$route.query.handleType === 'edit') {
              params.releaseConfId = this.$route.query.releaseConfId
              this.$service.updateLauncherPushManage(params).then(data => {
                if (data.code === 0) {
                  this.$refs['pushChild'].$refs['pushForm'].clearValidate()
                  this.$refs['pushChild'].$refs['pushForm'].resetFields()
                  this.$message({
                    type: 'success',
                    message: '修改成功！'
                  })
                  this.$router.push({
                    path: 'launcherPush'
                  })
                } else {
                  this.$message({
                    type: 'error',
                    message: data.msg
                  })
                }
              })
            } else {
              this.$service.addLauncherPushManage(params).then(data => {
                if (data.code === 0) {
                  this.$refs['pushChild'].$refs['pushForm'].clearValidate()
                  this.$refs['pushChild'].$refs['pushForm'].resetFields()
                  const msg = this.$route.query.handleType === 'copy' ? '复制成功！' : '新增成功！'
                  this.$message({
                    type: 'success',
                    message: msg
                  })
                  this.$router.push({
                    path: 'launcherPush'
                  })
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
    cancel () {
      this.$router.push({
        path: 'launcherPush'
      })
    }
  },
  created () {
  },
  activated () {
    this.detailById()
  }
}
</script>
<style lang='scss' scoped>
.appBox {
  margin-bottom: 20px;
  .label {
    font-size: 14px;
    color: #606266;
    padding: 0 12px 0 0;
    box-sizing: border-box;
  }
  ul {
    overflow: hidden;
    padding: 0;
    &:last-child {
      margin-bottom: 0;
    }
    li {
      float: left;
      margin: 10px;
      position: relative;
      .delIcon {
        position: absolute;
        right: 0;
        top: 0;
        font-size: 20px;
        color: indianred;
        cursor: pointer;
      }
      .materialName {
        font-size: 16px;
        text-align: center;
        margin: 5px 0;
        line-height: 20px;
      }
      .grid-content {
        border-radius: 4px;
        border: 2px dashed #f4f4f5;
        width: 150px;
        height: 120px;
        .appLogo {
          width: 100%;
          height: 100%;
        }
        .avatar-uploader-icon {
          font-size: 28px;
          color: #8c939d;
          width: 150px;
          height: 120px;
          line-height: 120px;
          text-align: center;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
