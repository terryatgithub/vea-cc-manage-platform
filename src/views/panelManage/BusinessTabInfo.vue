<template>
  <div>
    <div class="hompage-upsert" v-if="mode!== 'read'">
      <ContentCard :title="title" @go-back="$emit('go-back')" v-show="isShow">
        <el-row :gutter="40">
          <el-col :span="24">
             <div class="form-legend-header">
                <span>基本信息</span>
              </div>
            <el-form
              ref="tabForm"
              :rules="rules"
              :model="tab"
              label-width="120px"
              class="el-form-add"
            >
              <el-form-item label="版面名称" prop="tabName">
                <el-input v-model.trim="tab.tabName"></el-input>
              </el-form-item>
              <el-form-item label="标题(中文)" prop="tabCnTitle">
                <el-input v-model.trim="tab.tabCnTitle"></el-input>
              </el-form-item>
              <el-form-item label="标题(英文)" prop="tabEnTitle">
                <el-input v-model.trim="tab.tabEnTitle"></el-input>
              </el-form-item>
              <el-form-item label="内容源" prop="tabResource">
                <el-radio-group :value="tab.tabResource" @input="handleChangeTabResource">
                  <el-radio label>不限</el-radio>
                  <el-radio label="o_tencent">腾讯</el-radio>
                  <el-radio label="o_iqiyi">爱奇艺</el-radio>
                  <el-radio label="o_youku">优酷</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="刷新时间间隔" prop="interval">
                <SelectHourAndMinute
                  v-model="tab.timeCycle"
                  :hour-option="hourOption"
                  :minute-option="minuteOption"
                  :initSumTime="initSumTime"
                  min="5"
                  max="360"
                  class="selectHourAndMinute"
                >{{initSumTime}}</SelectHourAndMinute>
                <span class="hint">设置范围:5分钟-6小时</span>
              </el-form-item>

              <el-form-item label="类型" prop="tabType">
                <el-select v-model="tab.tabType" placeholder="请选择类型" :disabled="isDisableTabType">
                  <el-option
                    v-for="(item, index) in tabTypes"
                    :key="'tabTypes'+index"
                    :value="item.value"
                    :label="item.label"
                    :disabled="item.disabled"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="选择板块" prop="tags">
                <el-button type="primary" plain @click="handleSlectPannelStart">选择板块</el-button>
               
                <el-dropdown>
          <el-button type="primary" plain class="marginL">
            添加板块<i class="el-icon-caret-bottom el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="openCreatePage('pannelInfo')">常规版块</el-dropdown-item>
            <el-dropdown-item @click.native="openCreatePage('AlbumPannelInfo')">业务专辑</el-dropdown-item>
            <el-dropdown-item @click.native="openCreatePage('PrivatePannelInfo')">专属影院</el-dropdown-item>
          </el-dropdown-menu>
                </el-dropdown>
                 <OrderableTable
                  v-model="tab.pannelList"
                  :header="tabGroupTableHeader"
                  :hide-action="true"
                  class="orderableTable"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleShowTimeShelf()">提交审核</el-button>
                <el-button type="warning" @click="handleSaveDraft()">保存草稿</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </ContentCard>
      <AddBlockFilter
        :parentPannelResource="tab.tabResource"
        v-if="mode==='selectBlockResource'"
        @go-back="isShowPannelInfoList=false"
        @add-block="addBlock"
      />
    </div>
    <div v-if="mode === 'read'">
      <ContentCard :title="title" @go-back="$emit('go-back')">
        <CommonContent
          :mode="mode"
          :resource-info="resourceInfo"
          @replicate="mode = 'replicate'; title='创建副本'"
          @edit="mode = 'edit'; title='编辑'"
          @unaudit="$emit('upsert-end')"
          @shelves="fetchData"
          @audit="$emit('upsert-end')"
          @copy="handleCopy"
          @select-version="fetchData"
        >
         <div class="form-legend-header">
                <span>基本信息</span>
              </div>
          <el-row :gutter="40">
            <el-col :span="24">
              <el-form
                ref="tabForm"
                :rules="rules"
                :model="tab"
                label-width="120px"
                class="el-form-add"
              >
                <el-form-item label="版面名称" prop="tabName">{{tab.tabName}}</el-form-item>
                <el-form-item label="标题(中文)" prop="tabCnTitle">{{tab.tabCnTitle}}</el-form-item>
                <el-form-item label="标题(英文)" prop="tabEnTitle">{{tab.tabEnTitle}}</el-form-item>
                <el-form-item label="内容源" prop="tabResource">
                  <el-radio-group :value="tab.tabResource" :disabed="true">
                    <el-radio label>不限</el-radio>
                    <el-radio label="o_tencent">腾讯</el-radio>
                    <el-radio label="o_iqiyi">爱奇艺</el-radio>
                    <el-radio label="o_youku">优酷</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="刷新时间间隔" prop="interval">
                  <SelectHourAndMinute
                    v-model="tab.timeCycle"
                    :hour-option="hourOption"
                    :minute-option="minuteOption"
                    :initSumTime="initSumTime"
                    :disabled="true"
                    :min="5"
                    :max="360"
                    class="selectHourAndMinute"
                  ></SelectHourAndMinute>
                </el-form-item>
                <el-form-item label="类型" prop="tabType">
                  <el-select
                    v-model="tab.tabType"
                    placeholder="请选择类型"
                    :disabled="!isDisableTabType"
                  >
                    <el-option
                      v-for="(item, index) in tabTypes"
                      :key="'tabTypes'+index"
                      :value="item.value"
                      :label="item.label"
                      :disabled="item.disabled"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="选择的板块" prop="tags">
                  <OrderableTable
                    v-model="tab.pannelList"
                    :header="tabGroupTableHeader"
                    :hide-action="true"
                    class="orderableTable"
                    :readonly="true"
                  />
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </CommonContent>
      </ContentCard>
    </div>
    <PrivatePannelInfo
      @go-back="goBack"
      @upsert-end="goBack"
      :id="viewId"
      :version="duplicateVersion"
      :initMode="viewId!==undefined? 'read':'create'"
      v-if="mode==='PrivatePannelInfo'"
    >
    </PrivatePannelInfo>
    <PanelInfo
      @go-back="goBack"
      @upsert-end="goBack"
      :id="viewId"
      :version="duplicateVersion"
      :initMode="viewId!==undefined? 'read':'create'"
      :panel-data-type="1"
      v-if="mode==='pannelInfo'"
    >
    </PanelInfo>
    <ReleaseTimeSetter
      v-if="showTimeShelf"
      @cancel="showTimeShelf = false"
      @submit="handleSubmitAudit"
    />
  </div>
</template>
<script>
import SelectHourAndMinute from './../../components/SelectHourAndMinute'
import AddBlockFilter from './AddBlockFilter'
import { Table } from 'admin-toolkit'
import CommonContent from '@/components/CommonContent.vue'
import OrderableTable from '@/components/OrderableTable'
import ReleaseTimeSetter from './../../components/ReleaseTimeSetter'
import PrivatePannelInfo from './../blockManage/PrivatePannelInfo'
import PanelInfo from './../blockManage/PanelInfo'
// import AlbumPannelInfo from './../blockManage/AlbumPannelInfo'
export default {
  components: {
    AddBlockFilter,
    Table,
    PrivatePannelInfo,
    PanelInfo,
    OrderableTable,
    ReleaseTimeSetter,
    SelectHourAndMinute,
    CommonContent
  },
  props: {
    id: Number,
    initMode: String,
    version: {
      type: String,
      default(){
        return ''
      }
    }
  },
  data() {
    const STATUS = {
      draft: 2,
      waiting: 3,
      accepted: 4,
      reject: 5,
      processing: 7
    }
    const STATUS_TEXT = {
      '0': '下架',
      '2': '草稿',
      '3': '待审核',
      '4': '审核通过',
      '5': '审核不通过',
      '7': '审核通过未上线'
    }
    return {
      hourOption: {
        start: '00:00',
        step: '1:00',
        end: '06:00'
      },
      minuteOption: {
        start: '00:00',
        step: '00:01',
        end: '00:59'
      },
      initSumTime: 120,
      STATUS: STATUS,
      STATUS_TEXT: STATUS_TEXT,
      showTimeShelf: false,
      title: '',
      tabTypes: [],
      status: undefined,
      mode: 'create',
      preMode: 'create', //改变mode之前的状态
      //  editID: undefined,
      isReplica: false, //是否创建副本
      // viewData: undefined,
      // version: undefined,
      // isShowPannelInfoList: false, // 添加板块弹窗
      tab: {
        tabId: undefined,
        currentVersion: undefined,
        tabParentType: 'biz',
        tabType: '6',
        hasSubTab: 0,
        tabName: undefined,
        tabCnTitle: undefined,
        tabEnTitle: undefined,
        // 预设值
        tabCategory: 67,
        // 预设值
        tabAppid: -1,
        tabResource: '',
        pictureName: undefined,
        tabTitleIcons: undefined,
        tabParams: {},
        tabStatus: undefined,
        tabOnclick: undefined,
        systemDefault: 0,
        timeCycle: 120,
        cornerIconName: undefined,
        flagIsRecord: 0,
        isTiming: 0,
        releaseTime: undefined,
        tabExtArr: undefined,
        pannelList: [],
        specificPannelList: undefined,
        tabList: undefined
      },
      rules: {
        tabName: [
          { required: true, message: '请输入版面名称', trigger: 'blur' }
        ],
        tabCnTitle: [
          { required: true, message: '请输入中文标题', trigger: 'blur' }
        ],
        tabEnTitle: [
          { required: true, message: '请输入英文标题', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
     resourceInfo() {
      const tab = this.tab
      if (tab.tabId) {
        return {
          id: tab.tabId,
          type: 'tab',
          menuElId: 'tabInfo',
          version: tab.currentVersion,
          status: tab.tabStatus
        }
      }
    },
    isDisableTabType() {
      const mode = this.mode
      return mode === 'edit' || mode === 'replicate' || mode === 'copy'
    },
    isShow() {
      const mode = this.mode
      return (
        mode === 'edit' ||
        mode === 'replicate' ||
        mode === 'copy' ||
        mode === 'create'
      )
    },
    tabGroupTableHeader() {
      const header = [
        {
          label: '板块ID',
          prop: 'pannelGroupId'
        },
        {
          label: '板块名称',
          width: 180,
          render: (h, { $index, row }) => {
            return h(
              'el-button',
              {
                props: {
                  type: 'text'
                },
                on: {
                  click: () => {
                    this.handlePreviewPannel(row)
                  }
                }
              },
              row.pannelGroupRemark
            )
          }
        },
        {
          prop: 'duplicateVersion',
          label: '待审核副本',
          width: 180,
          render: (h, { $index, row }) => {
            return h(
              'el-button',
              {
                props: {
                  type: 'text'
                },
                on: {
                  click: () => {
                    this.handlePreviewPannel(row, row.duplicateVersion)
                  }
                }
              },
              row.duplicateVersion
            )
          }
        }
      ]
      if (this.mode !== 'read') {
        header.push({
          label: '操作',
          width: 80,
          render: (h, { $index, row }) => {
            return h(
              'el-button',
              {
                props: {
                  type: 'text'
                },
                on: {
                  click: () => {
                    this.handleRemovePannel($index)
                  }
                }
              },
              '删除'
            )
          }
        })
      }
      return header
    }
  },
  methods: {
    handleCopy(){
      const data = this.getFormData()
      data.tabStatus = this.STATUS.waiting
      data.tabId = undefined
      data.currentVersion = ''
      this.validateFormData(
        data,
        function() {
          this.showTimeShelf = true
        }.bind(this)
      )
    },
    validateFormData(data, cb) {
      const STATUS = this.STATUS
      const tabStatus = data.tabStatus
      const showError = function(message) {
        this.$message({
          type: 'error',
          message: message
        })
      }.bind(this)
      let error
      if (tabStatus === STATUS.draft) {
        if (!data.tabName) {
          error = '请填写版面名称'
        }
        if (error) {
          showError(error)
        } else {
          cb()
        }
      } else {
        this.$refs.tabForm.validate(function(valid) {
          if (!valid) {
            // showError('请把表单填写完整')
          } else {
            if (data.pannelList.length === 0) {
              error = '请选择板块'
            }
            if (error) {
              showError(error)
            } else {
              cb()
            }
          }
        })
      }
    },
    handleShowTimeShelf() {
      const data = this.getFormData()
      data.tabStatus = this.STATUS.waiting
      this.validateFormData(
        data,
        function() {
          this.showTimeShelf = true
        }.bind(this)
      )
    },
    handleSubmitAudit(timing) {
      const data = this.getFormData()
      data.isTiming = timing.isTiming
      data.releaseTime = timing.releaseTime
      data.tabStatus = this.STATUS.waiting
      this.showTimeShelf = true
      this.submit(data)
    },
    handleSaveDraft() {
      const data = this.getFormData()
      data.isTiming = undefined
      data.releaseTime = undefined
      data.tabStatus = this.STATUS.draft
      this.validateFormData(
        data,
        function() {
          this.submit(data)
        }.bind(this)
      )
    },
    submit(formData) {
      formData = this.parseFormData(formData)
      this.$service
        .businessTabSave({ jsonStr: JSON.stringify(formData) }, '保存成功')
        .then(data => {
          this.showTimeShelf = false
          this.$emit('upsert-end')
        })
    },
    parseFormData(data) {
      if (data.tabParams) {
        data.tabParams = JSON.stringify(data.tabParams)
      }
      if (data.pannelList) {
        data.panelInfoList = data.pannelList.map(function(item, index) {
          return {
            pannelGroupId: item.pannelGroupId,
            pannelSequence: index,
            isDmpPanel: false
          }
        })
        data.pannelList = undefined
      }
      if (data.tabList) {
        data.tabJson = JSON.stringify(data.tabList)
        data.tabList = undefined
      }
      return data
    },
    getFormData() {
      const data = JSON.parse(JSON.stringify(this.tab))
      const mode = this.mode
      if (mode === 'replicate') {
        data.currentVersion = ''
      }
      if (mode === 'copy') {
        data.tabId = undefined
        data.currentVersion = ''
      }
      return data
    },
    goBack() {
      this.mode = this.preMode
    },
    addBlock(rows) {
      this.mode = this.preMode
      this.tab.pannelList = rows
    },
    handlePreviewPannel(row, version) {
      this.preMode = this.mode
      this.viewId = row.pannelGroupId
      this.mode = row.type
      this.duplicateVersion = version
    },
    openCreatePage(mode){
      this.preMode = this.mode
      this.viewId = undefined
      this.mode = mode
      this.duplicateVersion = undefined
    },
    handleSlectPannelStart() {
      this.preMode = this.mode
      this.mode = 'selectBlockResource'
    },
    handleRemovePannel(index) {
      this.tab.pannelList.splice(index, 1)
    },
    handleChangeTabResource(val) {
      this.$confirm(
        '是否要切换内容源，切换内容源之后所选择的版块数据将会清除掉！',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(
          function() {
            this.tab.tabResource = val
            this.tab.pannelList = []
          }.bind(this)
        )
        .catch(function() {})
    },
    getTabType() {
      return this.$service.getTabType().then(data => {
        this.tabTypes = data.reduce((result, current) => {
          result.push({
            label: current.label,
            value: current.value,
            disabled: current.value !== '6'
          })
          return result
        }, [])
      })
    },
    handleChangePannelOrderStart(currentPannelIndex, order) {
      console.log('order=' + order)
      // return
      if (order !== '') {
        order = parseInt(order)
        const pannelList = this.tab.pannelList
        if (isNaN(order) || order > pannelList.length || order <= 0) {
          this.currentPannelIndex = undefined
          this.$message({
            type: 'error',
            message: '序号必须大于0且不能大于总数量'
          })
          this.tab.pannelList = pannelList.slice()
        } else {
          this.currentPannelIndex = currentPannelIndex
          this.currentPannelOrder = order
        }
      }
    },
    handleChangePannelOrderEnd(pannelIndex) {
      if (this.currentPannelIndex === pannelIndex) {
        const newIndex = this.currentPannelOrder - 1
        const oldIndex = pannelIndex
        const pannelList = this.tab.pannelList
        const item = pannelList[oldIndex]
        pannelList.splice(oldIndex, 1)
        this.tab.pannelList = [].concat(
          pannelList.slice(0, newIndex),
          item,
          pannelList.slice(newIndex)
        )
        this.currentPannelIndex = undefined
        this.currentPannelOrder = undefined
      }
    },
    fetchData(version) {
      this.$service
        .businessTabEdit({ id: this.id, version: this.version })
        .then(data => {
          this.tab.pannelList = data.panelInfoList.map(e => {
            e.pannelGroupRemark = e.pannelName
            return e
          })
          this.status ? data.currentVersion: this.status
          data.tabType = data.tabType.toString()
          this.initSumTime = data.timeCycle
          this.tab = Object.assign({}, this.tab, data)
        })
    }
  },
  created() {
    this.getTabType()
    this.mode = this.initMode || 'create'
    switch (this.mode) {
      case 'create':
        this.title = '新增'
        break
      case 'copy':
        this.title = '复制'
        break
      case 'edit':
        this.title = '编辑'
        break
      case 'replica':
        this.title = '创建副本'
      case 'read':
        this.title = '预览'
        break
    }
    if (this.id) {
      this.fetchData(this.version)
    }
  }
}
</script>

<style lang='stylus' scoped>
.el-form-add .orderableTable >>>.el-input, .el-form-add .selectHourAndMinute >>>.el-input
  width: 100%
.selectHourAndMinute
  width: 450px
</style>