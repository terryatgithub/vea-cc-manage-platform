<template>
    <ContentCard title="新增/编辑" @go-back="goBack">
      <PushForm @regionSel = 'regionSel' @clearRegion = 'clearRegion' ref = 'pushChild' :ctmDevCtrName = 'ctmDevCtrName' :risId = 'risId'></PushForm>
      <el-dialog
        :title='dialogTitle'
        :visible.sync = 'dialogFormVisible'
        :width = 'dialogWidth'
        :close-on-click-modal = 'false'
        :show-close = 'showClose'
        @close = 'closeX'
      >
        <RegionEditPop v-show="dialogType === 'regionPop'" @regionDetail = 'regionDetail' @close = 'close' @getRegion = 'getRegion(arguments)' :key = "isInit + '-region'"></RegionEditPop>
        <RegionDetail v-show="dialogType === 'regionDetail'" @goRegion = 'goRegion' :area = 'area'></RegionDetail>
        <AppSelPop v-show="dialogType === 'appPop'" @appDetail = 'appDetail' @close = 'close' :key = "isInit + '-app'"></AppSelPop>
        <AppDetail v-show="dialogType === 'appDetail'" @goApp = 'goApp' @close = 'close' :material = 'material' @appSure = 'appSure(arguments)'></AppDetail>
      </el-dialog>
      <div class="appBox">
        <div class="label">栏目   <span>栏目数：{{itemList.length}}</span></div>
        <div class="item" v-for='(item, index) in itemList' :key='index'>
          <el-form
            :inline="true"
          >
            <div class="itemTop">
              <el-form-item label="栏目模板">
                <el-select placeholder="请选择栏目模板" v-model="itemList[index].template">
                  <el-option label="模板I:应用模板" value="I"></el-option>
                  <!-- <el-option label="模板B:媒资竖图" value="B"></el-option>
                  <el-option label="模板C:媒资横图" value="C"></el-option>
                  <el-option label="模板D:媒资方图" value="D"></el-option> -->
                </el-select>
              </el-form-item>
              <el-button type="primary" @click="appSel(index)" round>新增栏目资源</el-button>
              <el-button type="danger" @click="deleteItem(index)" v-if="itemList.length > 1" round>删除栏目</el-button>
            </div>
            <el-form-item label="栏目序号">
              <el-input
                placeholder="请输入栏目序号"
                type="number"
                v-model="itemList[index].itemSeq"
                clearable
                @input.native="itemSeqMsg(index)"
                onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
              ></el-input>
            </el-form-item>
            <el-form-item label="栏目名称">
              <el-input placeholder="请输入栏目名称" v-model="itemList[index].itemName" clearable maxlength="99"></el-input>
            </el-form-item>
            <ul>
              <li v-for='(itemApp, indexApp) in item.itemAppList' :key='indexApp'>
                <i
                  class="el-icon-error delIcon"
                  @click='appDel(index, indexApp)'
                ></i>
                <div class="grid-content">
                  <img :src='itemApp.materialPic' class='appLogo' />
                </div>
                <p class="materialName">{{itemApp.materialName}}</p>
              </li>
            </ul>
          </el-form>
        </div>
        <div class="addItem"><el-button type="primary" icon="el-icon-plus" @click="addItem">添加栏目</el-button></div>
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
      itemList: [
        {
          itemName: '',
          itemSeq: '',
          template: '',
          itemAppList: [],
        }
      ],
      itemList_index: '',
      itemAppList_index: '',
      ctmDevCtrName: '',
      risId: {},
      area: {},
      material: {},
      isInit: 0,
      isX: true
    }
  },
  methods: {
    // 执行详情回显
    detailById () {
      if (this.$route.query.releaseConfId) {
        this.$service.getAppStorePushManageReleaseConfId({
          releaseConfId: this.$route.query.releaseConfId
        }).then(data => {
          if (data.code === 0) {
            const detail = data.data
            // 判断是否回显全部版本
            if (detail.supportVersion === 'all') {
              detail.supportVersion = 'All'
              this.$refs['pushChild'].versionOptions.map((item) => {
                detail.supportVersion += (',' + item.supportVersion)
              })
            }
            detail.supportVersion = detail.supportVersion.split(',')
            const date = (liteOS.parserDate(detail.releaseStartTime) + ',' + liteOS.parserDate(detail.releaseEndTime)).split(',')
            let pushForm
            pushForm = Object.assign({}, pushForm, {
              releaseConfName: detail.releaseConfName,
              supportVersion: detail.supportVersion,
              ctmDevCtrId: detail.ctmDevCtrId,
              date: date,
              priority: detail.priority.toString()
            })
            this.$refs['pushChild'].pushForm = pushForm
            this.$refs['footerChild'].footerForm.DeviceID = detail.tvActiveId
            this.ctmDevCtrName = detail.ctmDevCtrName
            for (const i in detail.itemList) {
              delete detail.itemList[i].itemId
              for (const n in detail.itemList[i].itemAppList) {
                delete detail.itemList[i].itemAppList[n].materialPics
              }
            }
            this.itemList = [...detail.itemList]
          } else {
            this.$message({
              type: 'error',
              message: data.msg
            })
          }
        })
      } else {
        // 新增前先初始化页面
        this.$nextTick(() => {
          this.$refs['pushChild'].$refs['pushForm'].clearValidate()
          this.$refs['pushChild'].$refs['pushForm'].resetFields()
          this.$refs['footerChild'].footerForm.DeviceID = ''
          this.ctmDevCtrName = ''
          this.itemList = [{
            itemName: '',
            itemSeq: '',
            template: '',
            itemAppList: []
          }]
        })
      }
    },
    // 新增栏目
    addItem () {
      if (this.itemList.length < 50) {
        this.itemList.push({
          itemName: '',
          itemSeq: '',
          template: '',
          itemAppList: []
        })
      } else {
        this.$message({
          type: 'error',
          message: '栏目数量已达上限!'
        })
      }
    },
    itemSeqMsg (index) {
      let itemSeqArr = []
      for (const i in this.itemList) {
        if (index !== parseInt(i)) {
          itemSeqArr.push(parseInt(this.itemList[i].itemSeq))
        }
      }
      if (parseInt(this.itemList[index].itemSeq) > 99 || parseInt(this.itemList[index].itemSeq) <= 0) {
        this.itemList[index].itemSeq = ''
        this.$message({
          type: 'error',
          message: '栏目序号仅限1~99!'
        })
      } else if (itemSeqArr.includes(parseInt(this.itemList[index].itemSeq))) {
        this.itemList[index].itemSeq = ''
        this.$message({
          type: 'error',
          message: '栏目序号不能相同!'
        })
      }
    },
    deleteItem (index) {
      this.itemList.splice(index, 1)
    },
    // 获取区域选择传值
    getRegion (val) {
      // this.risId = val[0]
      this.risId = {
        id: val[0],
        random: Math.random()
      }
      this.ctmDevCtrName = val[1]
    },
    // 删除选择区域
    clearRegion () {
      this.ctmDevCtrName = ''
      // this.risId = ''
      this.risId = {
        id: '',
        random: Math.random()
      }
    },
    // 弹窗选择区域
    regionSel () {
      this.isX = true
      this.dialogFormVisible = true
      this.dialogType = 'regionPop'
      this.dialogTitle = '选择区域'
      this.dialogWidth = '550px'
      this.showClose = true
      // 改变弹窗key值，使弹窗列表初始化
      this.isInit = Math.random()
    },
    // 显示区域详情
    regionDetail (val) {
      this.area = {
        risId: val,
        random: Math.random()
      }
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
    appSel (index) {
      this.isX = true
      if (this.itemList[index].itemAppList.length === 99) {
        this.$message({
          type: 'error',
          message: '应用数量已达上限!'
        })
      } else {
        this.itemList[index].itemAppList.push({
          appMaterialId: 0,
          materialPic: '',
          materialPicType: '',
          materialName: 'xxx',
          detailSeq: ''
        })
        this.itemList_index = index
        this.itemAppList_index = this.itemList[index].itemAppList.length - 1
        this.dialogFormVisible = true
        this.dialogType = 'appPop'
        this.dialogWidth = '700px'
        this.dialogTitle = '选择应用'
        this.showClose = true
        // 改变弹窗key值，使弹窗列表初始化
        this.isInit = Math.random()
      }
    },
    // 显示应用详情
    appDetail (val) {
      this.material = {
        materialId: val,
        random: Math.random()
      }
      this.dialogType = 'appDetail'
      this.dialogWidth = '700px'
      this.dialogTitle = ''
      this.showClose = false
    },
    // 返回选择应用
    goApp () {
      this.dialogType = 'appPop'
      this.dialogWidth = '700px'
      this.dialogTitle = '选择应用'
      this.showClose = true
    },
    // 删除应用
    appDel (itemIndex, appIndex) {
      if (this.itemList[itemIndex].itemAppList.length === 1) {
        this.$message({
          type: 'error',
          message: '至少保留一个应用!'
        })
      } else {
        this.itemList[itemIndex].itemAppList.splice(appIndex, 1)
        for (const i in this.itemList[itemIndex].itemAppList) {
          this.itemList[itemIndex].itemAppList[i].detailSeq = parseInt(i)
        }
      }
    },
    // 应用海报选择确定
    appSure (data) {
      this.itemList[this.itemList_index].itemAppList[this.itemAppList_index] = Object.assign({}, this.itemList[this.itemList_index].itemAppList[this.itemAppList_index], {
        appMaterialId: data[0],
        materialName: data[1],
        detailSeq: this.itemAppList_index,
        materialPic: data[2],
        materialPicType: data[3]
      })
      console.log(this.itemList)
      this.dialogFormVisible = false
      this.isX = false
    },
    // 关闭弹窗
    close () {
      if (this.dialogType === 'appPop' || this.dialogType === 'appDetail') {
        this.itemList[this.itemList_index].itemAppList.pop()
      }
      this.dialogFormVisible = false
      this.isX = false
    },
    // 弹窗X事件
    closeX () {
      if (this.isX) {
        if (this.dialogType === 'appPop' || this.dialogType === 'appDetail') {
          this.itemList[this.itemList_index].itemAppList.pop()
        } else if (this.dialogType === 'regionPop' || this.dialogType === 'regionDetail') {
          this.ctmDevCtrName = ''
          // this.risId = ''
          this.risId = {
            id: '',
            random: Math.random()
          }
        }
      }
    },
    create (DeviceID) {
      let that = this
      that.$refs['pushChild'].$refs['pushForm'].validate(async (valid) => {
        if (valid) {
          // 轮询校验栏目的必填项
          let isAdd = false
          for (const key in that.itemList) {
            if (that.itemList[key].template === '') {
              this.$message({
                type: 'error',
                message: '栏目' + (parseInt(key) + 1) + '请选择模板！'
              })
              return false
            } else if (that.itemList[key].itemName === '') {
              this.$message({
                type: 'error',
                message: '栏目' + (parseInt(key) + 1) + '请输入栏目名称！'
              })
              return false
            } else if (that.itemList[key].itemSeq === '') {
              this.$message({
                type: 'error',
                message: '栏目' + (parseInt(key) + 1) + '请输入栏目序号！'
              })
              return false
            } else if (that.itemList[key].itemAppList.length === 0) {
              this.$message({
                type: 'error',
                message: '栏目' + (parseInt(key) + 1) + '请至少新增一个栏目资源！'
              })
              return false
            } else {
              isAdd = true
            }
          }
          if (isAdd) {
            const params = JSON.parse(JSON.stringify(that.$refs['pushChild'].pushForm))
            params.releaseStartTime = liteOS.date(params.date[0])
            params.releaseEndTime = liteOS.date(params.date[1])
            delete params.date
            // 判断是否全选版本
            if (params.supportVersion.includes('All')) {
              params.supportVersion = 'all'
            } else {
              params.supportVersion = params.supportVersion.join(',')
            }
            params.creator = that.$appState.user.name
            params.releaseStatus = '0'
            params.tvActiveId = DeviceID
            params.itemList = that.itemList
            let data
            // 判断是编辑、复制、新增
            if (that.$route.query.releaseConfId && that.$route.query.handleType === 'edit') {
              params.releaseConfId = that.$route.query.releaseConfId
              data = await this.$service.updateAppStorePushManage(params)
            } else {
              data = await this.$service.addAppStorePushManage(params)
            }
            if (data.code === 0) {
              that.$refs['pushChild'].$refs['pushForm'].clearValidate()
              that.$refs['pushChild'].$refs['pushForm'].resetFields()
              const msg = that.$route.query.handleType === 'edit'
                ? '修改成功！'
                : that.$route.query.handleType === 'copy'
                ? '复制成功！'
                : '新增成功！'
              that.$message({
                type: 'success',
                message: msg
              })
              that.$router.push({
                path: 'appStorePush'
              })
            } else {
              that.$message({
                type: 'error',
                message: data.msg
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
        path: 'appStorePush'
      })
    },
    goBack () {
      this.$confirm('退出后修改内容会全部丢失，确认退出吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => this.$router.back())
        .catch(() => {})
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
  position: relative;
  margin-bottom: 20px;
  .addItem {
    display: inline-block;
    position: absolute;
    right: 0;
    bottom: -53px;
  }
  .label {
    font-size: 14px;
    color: #606266;
    padding: 0 12px 0 0;
    box-sizing: border-box;
  }
  .item {
    border: 1px solid #909399;
    padding: 20px;
    box-sizing: border-box;
    background: #F2F6FC;
  }
  ul {
    overflow: hidden;
    padding: 0;
    margin-top: 0;
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
        width: 150px;
        font-size: 16px;
        text-align: center;
        margin: 5px 0;
        line-height: 20px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
      .grid-content {
        border-radius: 4px;
        border: 2px dashed #E4E7ED;
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
