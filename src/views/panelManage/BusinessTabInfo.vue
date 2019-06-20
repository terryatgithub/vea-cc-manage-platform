<template>
  <PageWrapper class="tab-info-wrapper">
    <PageContentWrapper v-show="activePage === 'tab_info'">
      <ContentCard :title="title" @go-back="$emit('go-back')">
        <CommonContent
          ref="commonContent"
          :mode="mode"
          :resource-info="resourceInfo"
          @replicate="mode = 'replicate'"
          @edit="mode = 'edit'"
          @unaudit="$emit('upsert-end')"
          @shelves="fetchData"
          @submit-audit="handleSubmitAudit"
          @save-draft="handleSaveDraft"
          @audit="$emit('upsert-end')"
          @copy="handleCopy($event)"
          @select-version="fetchData"
          @delete="$emit('upsert-end', $event)"
        >
          <div class="form-legend-header">
            <i class="el-icon-edit">基本信息</i>
          </div>
          <div v-if="mode !== 'read'">
            <el-form
              ref="tabForm"
              :rules="rules"
              :model="tab"
              label-width="120px"
              class="el-form-add">
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
                <span class="hint remarks">设置范围:5分钟-6小时</span>
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
              <el-form-item label="选择版块" prop="tags">
                <cc-panel-selector-el
                  ref="panelSelector"
                  :source="tab.tabResource"
                  @select-end="handleSelectPanelEnd"/>
                <el-dropdown>
                  <el-button type="primary" plain >
                    新建
                    <i class="el-icon-caret-bottom el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="activePage = 'panel'">常规版块</el-dropdown-item>
                    <el-dropdown-item @click.native="activePage = 'album_panel'">业务专辑</el-dropdown-item>
                    <el-dropdown-item @click.native="activePage = 'private_panel'">专属影院</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>

                <OrderableTable
                  v-model="tab.pannelList"
                  :header="tabGroupTableHeader"
                  :hide-action="true"
                  class="orderableTable"
                />
              </el-form-item>

            </el-form>
          </div>
          <div v-if="mode === 'read'">
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
                  <el-form-item label="选择的版块" prop="tags">
                    <OrderableTable
                      v-model="tab.pannelList"
                      :header="tabGroupTableHeader"
                      :hide-action="true"
                      class="orderableTable"
                      :readonly="true"
                    />
                  </el-form-item>
                </el-form>
          </div>
        </CommonContent>
      </ContentCard>
    </PageContentWrapper>

    <PageContentWrapper v-if="activePage === 'panel_preview'">
      <PrivatePanelInfo
        v-if="[5, 9, 10].indexOf(panelPreview.dataType) > -1"
        :title-prefix="title"
        :init-mode="panelPreview.initMode"
        :id="panelPreview.id"
        :version="panelPreview.version"
        @upsert-end="handlePreviewPanelEnd"
        @go-back="handlePreviewPanelEnd"
      />
      <PanelInfo
        v-else
        :title-prefix="title"
        :init-mode="panelPreview.initMode"
        :id="panelPreview.id"
        :version="panelPreview.version"
        :panel-data-type="panelPreview.dataType"
        :init-group-index="panelPreview.initGroupIndex"
        :init-block-index="panelPreview.initBlockIndex"
        @upsert-end="handlePreviewPanelEnd"
        @go-back="handlePreviewPanelEnd"
      />
    </PageContentWrapper>

    <PageContentWrapper v-if="activePage === 'panel'">
      <PanelInfo
        :title-prefix="title"
        init-mode="create"
        :panel-data-type="1"
        @upsert-end="activePage = 'tab_info'"
        @go-back="activePage = 'tab_info'"
      />
    </PageContentWrapper>

    <PageContentWrapper v-if="activePage === 'album_panel'">
      <PanelInfo
        :title-prefix="title"
        init-mode="create"
        :panel-data-type="3"
        @upsert-end="activePage = 'tab_info'"
        @go-back="activePage = 'tab_info'"
      />
    </PageContentWrapper>

    <PageContentWrapper v-if="activePage === 'private_panel'">
      <PrivatePanelInfo
        :title-prefix="title"
        init-mode="create"
        @upsert-end="activePage = 'tab_info'"
        @go-back="activePage = 'tab_info'"
      />
    </PageContentWrapper>
  </PageWrapper>
</template>
<script>
import SelectHourAndMinute from './../../components/SelectHourAndMinute'
import PageWrapper from '@/components/PageWrapper'
import PageContentWrapper from '@/components/PageContentWrapper'
import { Table } from 'admin-toolkit'
import CommonContent from '@/components/CommonContent.vue'
import OrderableTable from '@/components/OrderableTable'
import ReleaseTimeSetter from './../../components/ReleaseTimeSetter'
import PrivatePannelInfo from './../blockManage/PrivatePannelInfo'
import PanelSelector from '@/components/selectors/PanelSelector'
import PanelInfo from '../panelInfo/PanelInfo'
import PrivatePanelInfo from '../blockManage/PrivatePannelInfo'
import titleMixin from '@/mixins/title'
export default {
  mixins: [titleMixin],
  components: {
    PageWrapper,
    PageContentWrapper,
    PanelInfo,
    PrivatePanelInfo,
    'cc-panel-selector-el': PanelSelector,
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
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      resourceName: '业务版面',
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
      activePage: 'tab_info',
      panelPreview: {
        panel: null,
        id: undefined,
        version: undefined,
        initMode: undefined,
        initGroupIndex: undefined,
        initBlockIndex: undefined
      },
      initSumTime: 120,
      showTimeShelf: false,
      tabTypes: [],
      status: undefined,
      mode: 'create',
      isReplica: false, //是否创建副本
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
    tabGroupTableHeader() {
      const header = [
        {
          label: '版块ID',
          prop: 'pannelGroupId'
        },
        {
          label: '版块名称',
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
                    this.handlePreviewPanel(row)
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
                    this.handlePreviewPanel(row, row.duplicateVersion)
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
    },
    couldSetReleaseTime() {
      const mode = this.mode
      const currentVersion = this.tab.currentVersion
      const isCreatingOrCopying = mode === 'create' || mode === 'copy'
      const isEditingV1 = mode === 'edit' && currentVersion === 'V1'
      const isCoocaa = this.$consts.idPrefix == '10'
      return isCoocaa && !(isCreatingOrCopying || isEditingV1)
    }
  },
  methods: {
    handleCopy(status) {
      const data = this.getFormData()
      data.tabStatus = status
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
      const tabStatus = data.tabStatus
      const showError = function(message) {
        this.$message({
          type: 'error',
          message: message
        })
      }.bind(this)
      let error
      if (tabStatus === this.$consts.draft) {
        if (!data.tabName) {
          error = '请填写版面名称'
        }
        if (error) {
          showError(error)
        } else {
          cb()
        }
      } else {
        this.$refs.tabForm.validate((valid) => {
          if (!valid) {
            showError('请把表单填写完整')
          } else {
            if (data.pannelList.length === 0) {
              error = '请选择版块'
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
    handleSubmitAudit(timing) {
      const data = this.getFormData()
      data.tabStatus = this.$consts.status.waiting
      this.validateFormData(data, () => {
        if (this.couldSetReleaseTime) {
          if (timing) {
            data.isTiming = timing.isTiming
            data.releaseTime = timing.releaseTime
            this.submit(data)
          } else {
            this.$refs.commonContent.showReleaseTimeSetter = true
          }
        } else {
          this.submit(data)
        }
      })
    },
    handleSaveDraft() {
      const data = this.getFormData()
      data.isTiming = undefined
      data.releaseTime = undefined
      data.tabStatus = this.$consts.status.draft
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
    handlePreviewPanel(panel, targetVersion) {
      const row = panel
      const version = targetVersion || row.currentVersion
      this.activePage = 'panel_preview'
      this.panelPreview = {
        panel: row,
        initMode: 'read',
        id: row.pannelGroupId,
        dataType: row.pannelType,
        version
      }
    },
    handlePreviewPanelEnd() {
      const panel = this.panelPreview.panel
      this.updatePanelVersion(panel)
      this.panelPreview = null
      this.activePage = 'tab_info'
    },
    handleSelectPanelEnd(selected) {
      const selectedPanelList = selected || []
      const originSelectPanelList = this.tab.pannelList || []
      const originSelectedPanelListIndexed = originSelectPanelList.reduce(function(result, item, index) {
        result[item.pannelGroupId] = index
        return result
      }, {})

      let panelList = []
      selectedPanelList.forEach(function(item) {
        const index = originSelectedPanelListIndexed[item.pannelGroupId]
        // 把之前没选中都添加到列表里
        if (index === undefined) {
          panelList.push(item)
        }
      })
      // 把新添加都加到后面
      this.tab.pannelList = originSelectPanelList.concat(panelList)
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
    updatePanelVersion(panel, cb) {
      this.$service.panelPageList({
        pannelType: panel.pannelType,
        pannelId: panel.pannelGroupId
      }).then(data => {
        const result = data.rows[0]
        Object.assign(panel, result)
        cb && cb()
      })
    },
    getTabType() {
      return this.$service.getTabType({ tabParentType: 'biz' }).then(data => {
        this.tabTypes = data.reduce((result, current) => {
          result.push({
            label: current.dictCnName,
            value: current.dictEnName,
            disabled: current.dictEnName !== '6'
          })
          return result
        }, [])
      })
    },
    fetchData(version) {
      this.$service
        .businessTabEdit({ id: this.id, version: version })
        .then(data => {
          this.tab.pannelList = data.panelInfoList.map(e => {
            e.pannelGroupRemark = e.pannelName
            return e
          })
          this.status ? data.currentVersion : this.status
          data.tabType = data.tabType.toString()
          this.initSumTime = data.timeCycle
          this.tab = Object.assign({}, this.tab, data)
        })
    }
  },
  created() {
    this.getTabType()
    this.mode = this.initMode || 'create'
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