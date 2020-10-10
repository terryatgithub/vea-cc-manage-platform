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
        <PosterSelPop v-show="dialogType === 'posterPop'" @posterSure = 'posterSure(arguments)' @close = 'close' :key = "isInit + '-poster'"></PosterSelPop>
        <InnerPageSortDialog
          ref = 'sortChild'
          v-show="dialogType === 'sort'"
          @done-sort-list = "doneSortList(arguments)"
          @close = 'close'
        ></InnerPageSortDialog>
      </el-dialog>
      <div class="handlePage">
        <el-button
          type="primary"
          size="small"
          @click="pageSort('')"
        >
          页面排序
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="addTab(editableTabsValue)"
        >
          新增页面
        </el-button>
      </div>
      <el-tabs v-model="editableTabsValue" type="border-card" class="tabBox">
        <el-tab-pane
          v-for="(itemTabs, indexTabs) in pageInfoList"
          :key="itemTabs.sort"
          :label="itemTabs.pageName"
          :name="itemTabs.sort"
        >
          <el-form :inline="true" class="pageForm">
            <el-form-item label="页面名称" prop="pageName">
              <span class="tag">*</span>
              <el-input placeholder="请输入页面名称" v-model="itemTabs.pageName" clearable maxlength="99" minlength="1" @change="pageNameAlter" @focus="pageNameOld(indexTabs)"></el-input>
            </el-form-item>
            <el-form-item label="页面说明">
              <el-input placeholder="请输入页面说明" v-model="itemTabs.pageDes" clearable maxlength="99"></el-input>
            </el-form-item>
            <el-form-item class="delPage" v-show="pageInfoList.length > 1">
              <el-button type="danger" size="small" @click="removeTab(editableTabsValue)">删除当前页</el-button>
            </el-form-item>
          </el-form>  
          <div class="appBox">
            <div class="label">栏目</div>
            <div class="item" v-for='(item, index) in itemTabs.itemList' :key='index'>
              <div class="handleItem">
                <el-button type="primary" @click="pageSort(indexTabs)">栏目排序</el-button>
                <el-button type="primary" @click="addItem(indexTabs)">新增栏目</el-button>
              </div>
              <el-form :inline="true">
                <!-- <el-form-item class="delItem" v-show="itemTabs.itemList.length > 1">
                  <el-button type="danger" size="small" @click="removeItem()">删除栏目</el-button>
                </el-form-item> -->
                <div class="itemTop">
                  <el-form-item label="栏目模板">
                    <span class="tag">*</span>
                    <el-select
                      placeholder="请选择栏目模板"
                      v-model="item.template"
                      @change="handleTemplateChange(indexTabs, index)"
                      @visible-change="handleTemplateVisibleChange($event, indexTabs, index)"
                    >
                      <el-option label="模板I:应用模板" value="I"></el-option>
                      <el-option label="模板H:普通一张图Banner" value="H"></el-option>
                      <el-option label="模板J:普通两张图Banner" value="J"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-button type="primary" @click="materialSel(indexTabs, index)" round>新增栏目资源</el-button>
                  <el-button class="delItem" type="danger" @click="delItem(indexTabs, index)" v-if="itemTabs.itemList.length > 1" round>删除栏目</el-button>
                </div>
                <el-form-item label="栏目名称">
                  <span class="tag">*</span>
                  <el-input placeholder="请输入栏目名称" v-model="item.itemName" clearable maxlength="99"></el-input>
                </el-form-item>
                <ul>
                  <li v-for='(itemApp, indexApp) in item.itemAppList' :key='indexApp'>
                    <i
                      class="el-icon-error delIcon"
                      @click='materialDel(indexTabs, index, indexApp)'
                    ></i>
                    <div class="grid-content">
                      <img :src='itemApp.materialPic' class='appLogo' />
                    </div>
                    <p class="materialName">{{itemApp.materialName}}</p>
                  </li>
                </ul>
              </el-form>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <FooterForm @create = 'create' @cancel = 'cancel' ref = 'footerChild'></FooterForm>
    </ContentCard>
</template>

<script>
import ContentCard from '@/components/ContentCard'
import PushForm from '@/components/liteOS/pushFormInnerPage'
import FooterForm from '@/components/liteOS/footerFormInnerPage'
import RegionEditPop from '@/components/liteOS/regionEditPop'
import RegionDetail from '@/components/liteOS/regionDetail'
import AppSelPop from '@/components/liteOS/appSelPop'
import AppDetail from '@/components/liteOS/appDetail'
import PosterSelPop from '@/components/liteOS/posterSelPop'
import InnerPageSortDialog from '@/components/liteOS/SortDialog'
import liteOS from '@/assets/liteOS.js'
export default {
  components: {
    ContentCard,
    PushForm,
    FooterForm,
    RegionEditPop,
    RegionDetail,
    AppSelPop,
    AppDetail,
    PosterSelPop,
    InnerPageSortDialog
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
      pageInfoList_index: '',
      itemList_index: '',
      itemAppList_index: '',
      ctmDevCtrName: '',
      risId: {},
      area: {},
      material: {},
      isInit: 0,
      isX: true,
      sortList: [],
      editableTabsValue: '1',
      pageInfoList: [{
        sort: '1',
        pageName: '新页面',
        pageDes: '',
        itemList: [
          {
            itemName: '',
            itemSeq: 1,
            template: 'I',
            itemAppList: []
          }
        ]
      }],
      tabIndex: 1,
      prevTemplateType: '',
      oldPageName: ''
    }
  },
  methods: {
    // 执行详情回显
    detailById () {
      if (this.$route.query.releaseConfId) {
        this.$service.getAppStoreInnerPagePushManageReleaseConfId({
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
            detail.tvActiveId === null || detail.tvActiveId === ''
              ? this.$refs['pushChild'].mac = '0'
              : this.$refs['pushChild'].mac = '1'
            let pushForm = Object.assign({}, {
              releaseConfName: detail.releaseConfName,
              supportVersion: detail.supportVersion,
              ctmDevCtrId: detail.ctmDevCtrId,
              date: date,
              priority: detail.priority.toString(),
              tvActiveId: detail.tvActiveId
            })
            this.$refs['pushChild'].pushForm = pushForm
            this.ctmDevCtrName = detail.ctmDevCtrName
            for (const i in detail.pageInfoList) {
              detail.pageInfoList[i].sort = detail.pageInfoList[i].sort.toString()
              for (const n in detail.pageInfoList[i].itemList) {
                if (detail.pageInfoList[i].itemList[n].template === 'H' || detail.pageInfoList[i].itemList[n].template === 'J') {
                  for (const z in detail.pageInfoList[i].itemList[n].itemAppList) {
                    detail.pageInfoList[i].itemList[n].itemAppList[z].materialName = detail.pageInfoList[i].itemList[n].itemAppList[z].posterName
                  }
                }
              }
            }
            this.pageInfoList = [...detail.pageInfoList]
            this.editableTabsValue = '1'
            this.tabIndex = detail.pageInfoList.length
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
          this.$refs['pushChild'].mac = '0'
          this.$refs['pushChild'].$refs['pushForm'].clearValidate()
          this.$refs['pushChild'].$refs['pushForm'].resetFields()
          this.ctmDevCtrName = ''
          this.pageInfoList = [{
            sort: '1',
            pageName: '新页面',
            pageDes: '',
            itemList: [{
              itemName: '',
              itemSeq: 1,
              template: 'I',
              itemAppList: []
            }]
          }]
          this.editableTabsValue = '1'
          this.tabIndex = 1
        })
      }
    },
    // 新增栏目
    addItem (indexTabs) {
      if (this.pageInfoList[indexTabs].itemList.length < 50) {
        this.pageInfoList[indexTabs].itemList.push({
          itemName: '',
          itemSeq: parseInt(this.pageInfoList[indexTabs].itemList.length + 1),
          template: 'I',
          itemAppList: []
        })
      } else {
        this.$message({
          type: 'error',
          message: '栏目数量已达上限!'
        })
      }
    },
    // 删除栏目
    delItem (indexTabs, index) {
      this.pageInfoList[indexTabs].itemList.splice(index, 1)
      for (const i in this.pageInfoList[indexTabs].itemList) {
        this.pageInfoList[indexTabs].itemList[i].itemSeq = parseInt(i) + 1
      }
      console.log(this.pageInfoList[indexTabs])
    },
    handleTemplateVisibleChange ($event, indexTabs, index) {
      // 保存切换前的值
      if ($event) {
        this.prevTemplateType = this.pageInfoList[indexTabs].itemList[index].template
      }
    },
    // 栏目模板切换
    handleTemplateChange (indexTabs, index) {
      if (!this.pageInfoList[indexTabs].itemList[index].itemAppList.length) {
        return
      }
      this.$confirm('更改模板将会清空所有图片，确认更改吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => {
          this.pageInfoList[indexTabs].itemList[index].itemAppList.splice(0)
          console.log(this.pageInfoList[indexTabs].itemList[index].itemAppList)
        })
        .catch(() => {
          this.pageInfoList[indexTabs].itemList[index].template = this.prevTemplateType
        })
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
    // 弹窗选择应用或者海报
    materialSel (indexTabs, index) {
      this.isX = true
      if (this.pageInfoList[indexTabs].itemList[index].template === 'I') {
        if (this.pageInfoList[indexTabs].itemList[index].itemAppList.length === 99) {
          this.$message({
            type: 'error',
            message: '应用数量已达上限!'
          })
        } else {
          this.pageInfoList[indexTabs].itemList[index].itemAppList.push({
            appMaterialId: 0,
            materialPic: '',
            materialPicType: '',
            materialName: 'xxx',
            detailSeq: '',
            posterId: 0
          })
          this.pageInfoList_index = indexTabs
          this.itemList_index = index
          this.itemAppList_index = this.pageInfoList[indexTabs].itemList[index].itemAppList.length - 1
          this.dialogFormVisible = true
          this.dialogType = 'appPop'
          this.dialogWidth = '700px'
          this.dialogTitle = '选择应用'
          this.showClose = true
          // 改变弹窗key值，使弹窗列表初始化
          this.isInit = Math.random()
        }
      } else if (this.pageInfoList[indexTabs].itemList[index].template === 'H') {
        this.pageInfoList[indexTabs].itemList[index].itemAppList.length === 1
          ? this.$message({ type: 'error', message: '海报数量已达上限!' })
          : this.posterAdd(indexTabs, index)
      } else if (this.pageInfoList[indexTabs].itemList[index].template === 'J') {
        this.pageInfoList[indexTabs].itemList[index].itemAppList.length === 2
          ? this.$message({ type: 'error', message: '海报数量已达上限!' })
          : this.posterAdd(indexTabs, index)
      }
    },
    posterAdd (indexTabs, index) {
      this.pageInfoList[indexTabs].itemList[index].itemAppList.push({
        appMaterialId: 0,
        materialPic: '',
        materialPicType: '',
        materialName: 'xxx',
        detailSeq: '',
        posterId: 0
      })
      this.pageInfoList_index = indexTabs
      this.itemList_index = index
      this.itemAppList_index = this.pageInfoList[indexTabs].itemList[index].itemAppList.length - 1
      this.dialogFormVisible = true
      this.dialogType = 'posterPop'
      this.dialogWidth = '650px'
      this.dialogTitle = '选择海报'
      this.showClose = true
      // 改变弹窗key值，使弹窗列表初始化
      this.isInit = Math.random()
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
    materialDel (indexTabs, itemIndex, appIndex) {
      let msg
      this.pageInfoList[indexTabs].itemList[itemIndex].template === 'I'
        ? msg = '至少保留一个应用!'
        : msg = '栏目' + (itemIndex + 1) + '中J模板下必须两张海报!'
      if (this.pageInfoList[indexTabs].itemList[itemIndex].itemAppList.length === 1) {
        if (this.pageInfoList[indexTabs].itemList[itemIndex].template !== 'H') {
          this.$message({
            type: 'error',
            message: msg
          })
        } else {
          this.pageInfoList[indexTabs].itemList[itemIndex].itemAppList.splice(appIndex, 1)
        }
      } else {
        this.pageInfoList[indexTabs].itemList[itemIndex].itemAppList.splice(appIndex, 1)
        for (const i in this.pageInfoList[indexTabs].itemList[itemIndex].itemAppList) {
          this.pageInfoList[indexTabs].itemList[itemIndex].itemAppList[i].detailSeq = parseInt(i)
        }
      }
    },
    // 应用海报选择确定
    appSure (data) {
      this.pageInfoList[this.pageInfoList_index].itemList[this.itemList_index].itemAppList[this.itemAppList_index] = Object.assign({}, this.pageInfoList[this.pageInfoList_index].itemList[this.itemList_index].itemAppList[this.itemAppList_index], {
        appMaterialId: data[0],
        materialName: data[1],
        detailSeq: this.itemAppList_index,
        materialPic: data[2],
        materialPicType: data[3]
      })
      this.dialogFormVisible = false
      this.isX = false
    },
    // 选择海报确认
    posterSure (data) {
      this.pageInfoList[this.pageInfoList_index].itemList[this.itemList_index].itemAppList[this.itemAppList_index] = Object.assign({}, this.pageInfoList[this.pageInfoList_index].itemList[this.itemList_index].itemAppList[this.itemAppList_index], {
        posterId: data[0],
        materialName: data[1],
        detailSeq: this.itemAppList_index,
        materialPic: data[2]
      })
      this.dialogFormVisible = false
      this.isX = false
    },
    // 关闭弹窗
    close () {
      if (this.dialogType === 'appPop' || this.dialogType === 'appDetail' || this.dialogType === 'posterPop') {
        this.pageInfoList[this.pageInfoList_index].itemList[this.itemList_index].itemAppList.pop()
      }
      this.dialogFormVisible = false
      this.isX = false
    },
    // 弹窗X事件
    closeX () {
      if (this.isX) {
        if (this.dialogType === 'appPop' || this.dialogType === 'appDetail' || this.dialogType === 'posterPop') {
          this.pageInfoList[this.pageInfoList_index].itemList[this.itemList_index].itemAppList.pop()
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
    create () {
      let that = this
      that.$refs['pushChild'].$refs['pushForm'].validate(async (valid) => {
        if (valid) {
          // 轮询校验栏目的必填项
          let isAdd = false
          for (const key in that.pageInfoList) {
            if (that.pageInfoList[key].pageName === '') {
              this.$message({
                type: 'error',
                message: '页面' + (parseInt(key) + 1) + '请输入页面名称！'
              })
              return false
            } else {
              for (const key2 in that.pageInfoList[key].itemList) {
                if (that.pageInfoList[key].itemList[key2].template === '') {
                  this.$message({
                    type: 'error',
                    message: '栏目' + (parseInt(key2) + 1) + '请选择模板！'
                  })
                  return false
                } else if (that.pageInfoList[key].itemList[key2].itemName === '') {
                  this.$message({
                    type: 'error',
                    message: '栏目' + (parseInt(key2) + 1) + '请输入栏目名称！'
                  })
                  return false
                } else if (that.pageInfoList[key].itemList[key2].itemSeq === '') {
                  this.$message({
                    type: 'error',
                    message: '栏目' + (parseInt(key2) + 1) + '请输入栏目序号！'
                  })
                  return false
                } else if (that.pageInfoList[key].itemList[key2].template === 'J') {
                  if (that.pageInfoList[key].itemList[key2].itemAppList.length !== 2) {
                    this.$message({
                      type: 'error',
                      message: '栏目' + (parseInt(key2) + 1) + '中J模板下必须两张海报！'
                    })
                    return false
                  } else {
                    isAdd = true
                  }
                } else if (that.pageInfoList[key].itemList[key2].itemAppList.length === 0) {
                  this.$message({
                    type: 'error',
                    message: '栏目' + (parseInt(key2) + 1) + '请至少新增一个栏目资源！'
                  })
                  return false
                } else {
                  isAdd = true
                }
              }
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
            params.pageInfoList = that.pageInfoList
            let data
            // 判断是编辑、复制、新增
            if (that.$route.query.releaseConfId && that.$route.query.handleType === 'edit') {
              params.releaseConfId = that.$route.query.releaseConfId
              data = await this.$service.updateAppStoreInnerPagePushManage(params)
            } else {
              data = await this.$service.addAppStoreInnerPagePushManage(params)
            }
            if (data.code === 0) {
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
                path: 'appStorePush',
                query: {
                  tabType: 'innerPage'
                }
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
      this.$router.back()
    },
    goBack () {
      this.$confirm('退出后修改内容会全部丢失，确认退出吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => this.$router.back())
        .catch(() => {})
    },
    // 弹窗排序
    pageSort (indexTabs) {
      this.dialogFormVisible = true
      this.dialogType = 'sort'
      this.dialogWidth = '500px'
      this.showClose = true
      if (indexTabs !== '') {
        this.pageInfoList_index = indexTabs
        this.dialogTitle = '栏目排序'
        this.$nextTick(() => {
          this.$refs['sortChild'].sortType = 'item'
          this.$refs['sortChild'].sortListInUse = [...this.pageInfoList[indexTabs].itemList]
        })
      } else {
        this.dialogTitle = '页面排序'
        this.$nextTick(() => {
          this.$refs['sortChild'].sortType = 'page'
          this.$refs['sortChild'].sortListInUse = [...this.pageInfoList]
        })
      }
    },
    // 排序完成
    doneSortList (data) {
      let list = data[0]
      if (data[1] === 'page') {
        for (const p in list) {
          list[p].sort = parseInt(p) + 1 + ''
        }
        this.pageInfoList = list
      } else {
        for (const i in list) {
          list[i].itemSeq = parseInt(i) + 1
        }
        this.pageInfoList[this.pageInfoList_index].itemList = list
      }
      this.dialogFormVisible = false
      this.isX = false
    },
    // 增加页面
    addTab (targetName) {
      let newTabName = ++this.tabIndex + ''
      this.pageInfoList.push({
        sort: newTabName,
        pageName: '新页面',
        pageDes: '',
        itemList: [
          {
            itemName: '',
            itemSeq: 1,
            template: 'I',
            itemAppList: []
          }
        ]
      })
      this.editableTabsValue = newTabName
    },
    // 删除当前页
    removeTab (targetName) {
      let tabs = this.pageInfoList
      let activeName = this.editableTabsValue
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.sort === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.sort
            }
          }
        })
      }
      this.editableTabsValue = activeName
      this.pageInfoList = tabs.filter(tab => tab.sort !== targetName)
      for (const i in this.pageInfoList) {
        this.pageInfoList[i].sort = parseInt(i) + 1 + ''
      }
    },
    pageNameOld (val) {
      this.pageInfoList_index = val
      this.oldPageName = this.pageInfoList[val].pageName
    },
    pageNameAlter (val) {
      if (val === '') {
        this.pageInfoList[this.pageInfoList_index].pageName = this.oldPageName
        this.$message({
          type: 'error',
          message: '页面名称不可为空！'
        })
      }
    }
  },
  activated () {
    this.detailById()
  }
}
</script>
<style lang="stylus" scoped>
.tabBox >>> .el-tabs__header
  padding-right: 200px;
.tabBox >>> .el-tabs__item
  max-width: 140px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
.appBox >>> .el-form-item
  margin-left: 20px;
.pageForm >>> .el-form-item
  display: block;
  margin-left: 20px;
.pageForm >>> .tag
  position: absolute;
  color: #F56C6C;
  left: -80px
</style>
<style lang='scss' scoped>
.handlePage {
  display: inline-block;
  position: absolute;
  right: 0;
  right: 36px;
  z-index: 999;
  .el-button {
    margin-top: 5px;
  }
}
.pageForm {
  position: relative;
  .delPage {
    position: absolute;
    top: 0;
    right: 0;
  }
}
.appBox {
  position: relative;
  margin-bottom: 20px;
  .tag {
    position: absolute;
    color: #F56C6C;
    left: -80px;
  }
  .handleItem {
    display: inline-block;
    position: absolute;
    right: 0;
    top: 0;
  }
  .label {
    font-size: 14px;
    line-height: 32px;
    color: #606266;
    padding: 0 12px 0 0;
    box-sizing: border-box;
  }
  .item {
    border: 1px solid #909399;
    padding: 20px;
    box-sizing: border-box;
    background: #F2F6FC;
    margin-bottom: 5px;
    .delItem {
      float: right;
    }
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
