<template>
<div>
  <ContentCard :title="title" @go-back="$emit('go-back')" v-show="filmPageShow">
    <div>
      <CommonContent
        ref="commonContent"
        :mode="mode"
        :resource-info="resourceInfo"
        @edit="mode = 'edit';title='编辑'"
        @replicate="mode = 'replicate'; title='创建副本'"
        @submit-audit="btnAudit"
        @save-draft="btnSave"
        @select-version="fetchData"
        @unaudit="$emit('upsert-end')"
        @shelves="fetchData"
        @audit="$emit('upsert-end')"
      >
        <div class="split-bar">
          <i class="el-icon-edit">基本信息</i>
        </div>
        <template v-if="mode !== 'read'" >
          <el-form ref="form" :rules="rules" :model="form" label-width="90px" class="el-form-add">
            <el-form-item label="版面名称" prop="tabName">
              <el-input v-model="form.tabName" />
            </el-form-item>
            <el-form-item label="业务分类">
              <el-select v-model="form.tabCategory" :disabled="categoryEdit">
                <el-option label="影视" :value="0"/>
                <el-option label="教育" :value="1"/>
              </el-select>
            </el-form-item>
            <el-form-item label="内容源" v-if="form.tabCategory == 0">
              <el-radio-group v-model="form.tabResource"  @change.native.prevent="changeResource">
                <el-radio label="qq">腾讯</el-radio>
                <el-radio label="iqiyi">爱奇艺</el-radio>
                <el-radio label="youku">优朋</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="频道">
              <el-select v-model="pannel">
                <el-option value="0" label="不限"/>
                <el-option v-for="(item, index) in pannelItems" :key="index" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="产品包">
              <el-select v-model="product">
                <el-option value="0" label="不限"/>
                <el-option v-for="(item, index) in productItems" :key="index" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="选择版块">
              <cc-panel-selector-el
                ref="panelSelector"
                :source="form.tabResource"
                @select-end="handleSelectPanelEnd"
              ></cc-panel-selector-el>
            </el-form-item>
            <el-form-item label="优先级">
              <el-input-number v-model="form.priority" :min="1"/><span>注：数值越大优先级越高，数值越小优先级越低</span>
            </el-form-item>
          </el-form>
        </template>
        <template v-if="mode === 'read'">
          <el-form ref="form" :rules="rules" :model="form" label-width="90px" class="el-form-add">
            <el-form-item label="版面名称" prop="tabName">
              {{form.tabName}}
            </el-form-item>
            <el-form-item label="业务分类" prop="tabCategory">
                {{form.tabCategory == 0 ? '影视':'教育'}}
            </el-form-item>
            <el-form-item label="内容源" v-if="form.tabCategory == 0" prop="tabResource">
              {{sourceText[form.tabResource]}}
            </el-form-item>
            <el-form-item label="频道">
              <el-select v-model="pannel" :disabled="true">
                <el-option value="0" label="不限"/>
                <el-option v-for="(item, index) in pannelItems" :key="index" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="产品包">
              <el-select v-model="product" :disabled="true">
                <el-option value="0" label="不限"/>
                <el-option v-for="(item, index) in productItems" :key="index" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="选择版块">
            </el-form-item>
            <el-form-item label="优先级" prop="priority">
              {{form.priority}}
            </el-form-item>
          </el-form>
        </template>
        <div class="table">
          <Table
            :props="table.props"
            :header="tableHeader"
            :data="table.data"
          />
        </div>
      </CommonContent>
    </div>
  </ContentCard>
  <panel-info
    v-if='isShowPanelList'
    :id="panelId"
    :panel-data-type="1"
    :init-mode="panelMode"
    :version="panelVersion"
    @upsert-end="handleUpsertEnd"
    @go-back="handleUpsertEnd">
  </panel-info>
</div>
</template>

<script>
import PanelSelector from '@/components/selectors/PanelSelector'
import CommonContent from '@/components/CommonContent'
import { Table } from 'admin-toolkit'
import { Button } from 'element-ui'
import panelInfo from '../blockManage/PanelInfo'
export default {
  components: {
    Table,
    CommonContent,
    'cc-panel-selector-el': PanelSelector,
    'panel-info': panelInfo
  },

  props: [
    'editId', 'initMode', 'duplicateVersionVersion'
  ],

  watch: {
    'form.tabCategory': {
      deep: true,
      handler: function(newVal, oldVal) {
        if (newVal === 1) {
          this.pannelItems = this.eduProductItems.categoryList
          this.productItems = this.eduProductItems.productList
          if (this.eduProductItems.categoryList.length === 0) { this.pannel = '不限' }
          if (this.tabResourceFlag === 0) { this.tabResourceFlag = 1 } else {
            this.pannel = ''
            this.product = ''
          }
        } else if (newVal === 0) {
          this.handleTabResourceChange(this.form.tabResource)
        }
      }
    },
    'form.tabResource': function (value, oldVal) {
      this.handleTabResourceChange(value)
    }
  },
  computed: {
    tableHeader () {
      const header = this.table.header
      const previewHeader = [
        {
          label: '状态',
          prop: 'pannelStatus',
          formatter: row => {
            if (row.pannelGroupId > 0) {
              switch (row.pannelStatus) {
                case 0:
                  return '下架'
                case 1:
                  return '上架'
                case 2:
                  return '草稿'
                case 3:
                  return '待审核'
                case 4:
                  return '审核通过'
                case 5:
                  return '审核不通过'
                case 6:
                  return '审核中'
                case 7:
                  return '审核通过未上线'
                case 9:
                  return '待二次审核'
              }
            } else {
              return ''
            }
          }
        },
        {
          label: '审核人',
          prop: 'auditor'
        }
      ]
      const delButton = {
        label: '操作',
        render: (h, { row }) => {
          return h(Button, {
            props: {
              type: 'warning'
            },
            on: {
              click: () => {
                const index = this.table.data.indexOf(row)
                this.table.data.splice(index, 1)
                this.table.data.forEach((item, index) => { item.pannelSequence = index + 1 })
              }
            }
          }, '删除')
        }
      }
      let HeaderResult = []
      if (this.mode === 'read') {
        HeaderResult = header.concat(previewHeader)
      } else {
        HeaderResult = header.concat(delButton)
      }
      return HeaderResult
    },
    resourceInfo () {
      const form = this.form
      if (form.tabId) {
        return {
          id: form.tabId,
          version: form.currentVersion,
          status: form.currentStatus,
          type: 'tab',
          menuElId: 'tabInfo'
        }
      }
    }
  },

  data () {
    return {
      title: '',
      rules: {
        tabName: [
          { required: true, message: '请输入主题名称', trigger: 'blur' }
        ]
      },
      tabStatusOption: [
        { label: '下架', value: '0' },
        { label: '上架', value: '1' },
        { label: '草稿', value: '2' },
        { label: '待审核', value: '3' },
        { label: '审核通过', value: '4' },
        { label: '审核不通过', value: '5' }
      ],
      sourceText: {
        qq: '腾讯',
        iqiyi: '爱奇艺',
        youku: '优酷'
      },
      form: {
        tabId: undefined,
        tabName: '',
        tabParentType: 'special',
        tabCategory: 0,
        tabResource: '',
        priority: 1,
        currentVersion: '',
        currentStatus: ''
      },
      globalTabResource: '',
      parentResource: '',
      tabResourceFlag: 1,
      iqiyiSource: [],
      qqSource: [],
      youkuSource: [],
      pannel: '',
      pannelItems: [],
      product: '',
      productItems: [],
      eduProductItems: [],
      blockTable: [], // 版块列表
      table: {
        props: {},
        data: [],
        header: [
          {
            label: '排序',
            prop: 'pannelSequence',
            render: (h, { row }) => {
              return h('el-input', {
                props: {
                  value: row.pannelSequence
                },
                on: {
                  input: (value) => {
                    row.pannelSequence = value
                  },
                  blur: () => {
                    let array = this.table.data
                    let indexLength = array.length
                    let newValue = parseInt(row.pannelSequence)
                    let flag = Number.isInteger(newValue)
                    let oldValue = array.indexOf(row) + 1
                    if (flag && newValue > 0 && newValue < indexLength) {
                      row.pannelSequence = newValue
                      if (newValue !== oldValue) {
                        let oldArray = array[oldValue - 1]
                        array[newValue - 1].pannelSequence = oldValue
                        array[oldValue - 1] = array[newValue - 1]
                        array[newValue - 1] = oldArray
                      }
                    } else (row.pannelSequence = this.table.data.indexOf(row) + 1)
                  }
                }
              })
            }
          },
          {
            label: '版块ID',
            prop: 'pannelGroupId'
          },
          {
            label: '版块名称',
            prop: 'pannelGroupRemark',
            render: (createElement, { row }) => {
              return createElement('el-button', {
                attrs: {
                  type: 'text'
                },
                on: {
                  click: () => {
                    this.showPanelList(row)
                  }
                }
              }, row.pannelGroupRemark)
            }
          },
          {
            label: '待审核副本',
            prop: 'duplicateVersion'
          }
        //   {
        //     label: '操作',
        //     render: (h, { row }) => {
        //       return h(Button, {
        //         props: {
        //           type: 'warning'
        //         },
        //         on: {
        //           click: () => {
        //             const index = this.table.data.indexOf(row)
        //             this.table.data.splice(index, 1)
        //             this.table.data.forEach((item, index) => { item.pannelSequence = index + 1 })
        //           }
        //         }
        //       }, '删除')
        //     }
        //   }
        ],
        selected: [],
        selectionType: 'single'
      },
      mode: '',
      categoryEdit: false,
      isShowPanelList: false,
      panelId: undefined,
      panelMode: 'read',
      panelVersion: undefined,
      filmPageShow: true
    }
  },

  methods: {
    // 头部按钮
    btnAudit() {
      this.save(3)
    },
    btnSave() {
      this.save(2)
    },
    save(status) {
      if (this.table.data.length === 0) {
        this.$message('请添加版块')
        return false
      }
      const form = this.form
      this.$refs.form.validate(valid => {
        if (valid) {
          var jsonStr = {
            // tabInfo: {
            tabParentType: 'special',
            tabId: form.tabId,
            tabName: form.tabName,
            tabType: 3,
            tabStatus: status,
            tabResource: form.tabCategory === 0 ? form.tabResource : '',
            currentVersion: form.currentVersion,
            tabCategory: form.tabCategory,
            hasSubTab: 0,
            tabCnTitle: form.tabName,
            // },
            filmDetailPageInfo: {
              source: form.tabCategory === 0 ? form.tabResource : '',
              product: this.product || '0',
              channel: this.pannel || '0',
              category: form.tabCategory,
              priority: form.priority
            },
            panelInfoList: this.table.data
          }
          console.log(jsonStr)
          this.$service.tabInfoUpsert(jsonStr, '保存成功').then((data) => {
            this.$emit('open-list-page')
          })
        } else {
          this.$message('请将表单填写完整')
        }
      })
    },
    // 内容源改变
    changeResource(value) {
      this.$confirm('是否要切换内容源，切换内容源之后所选择的版块数据将会清除掉！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '内容源切换成功!'
          })
          // this.form.tabResource = this.tabResource
          this.clearResource()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消切换'
          })
          // this.form.tabResource = 'qq'
        })
    },
    clearResource() {
      this.table.data = []
    },
    // 服务
    getMediaResourceInfos() {
      return this.$service.getMediaResourceInfo().then(data => {
       // var movieData = JSON.parse(decodeURI(data.slice(5, -1)))
        var videoItemModels = data.videoItemModels
        // 内容源：iqiyi
        var iqiyiSource = {
          categoryList: [],
          productList: []
        }
        iqiyiSource.categoryList = this._arrayingOption(videoItemModels[0].categoryList, 'category_name', 'cc_category_id')
        iqiyiSource.productList = this._arrayingOption(videoItemModels[0].productList, 'source_name', 'source_sign')
        this.iqiyiSource = iqiyiSource

        // 内容源：tencent
        var qqSource = {
          categoryList: [],
          productList: []
        }
        qqSource.categoryList = this._arrayingOption(videoItemModels[1].categoryList, 'category_name', 'cc_category_id')
        qqSource.productList = this._arrayingOption(videoItemModels[1].productList, 'source_name', 'source_sign')
        this.qqSource = qqSource

        // 内容源：youku
        var youkuSource = {
          categoryList: [],
          productList: []
        }
        youkuSource.categoryList = this._arrayingOption(videoItemModels[2].categoryList, 'category_name', 'cc_category_id')
        youkuSource.productList = this._arrayingOption(videoItemModels[2].productList, 'source_name', 'source_sign')
        this.youkuSource = youkuSource

        // 教育->产品包
        var coocaaSource = {
          categoryList: [],
          productList: []
        }
        coocaaSource.categoryList = this._arrayingOption(videoItemModels[3].categoryList, 'category_name', 'cc_category_id')
        coocaaSource.productList = this._arrayingOption(videoItemModels[3].productList, 'source_name', 'source_sign')
        this.eduProductItems = coocaaSource
      })
    },
    // 数组化[{label, value}]
    _arrayingOption(arr, label, value) {
      return arr.reduce((result, item) => {
        return result.concat({ label: item[label], value: item[value] })
      }, [])
    },
    handleTabResourceChange(value) {
      const { qqSource, iqiyiSource, youkuSource } = this
      if (this.tabResourceFlag === 0 && this.globalTabResource === value) { this.tabResourceFlag = 1 } else {
        this.pannel = ''
        this.product = ''
      }
      switch (value) {
        case 'qq': {
          this.pannelItems = qqSource.categoryList
          this.productItems = qqSource.productList
          break
        }
        case 'iqiyi': {
          this.pannelItems = iqiyiSource.categoryList
          this.productItems = iqiyiSource.productList
          break
        }
        case 'youku': {
          this.pannelItems = youkuSource.categoryList
          this.productItems = youkuSource.productList
          break
        }
        default: {
          this.pannelItems = []
          this.productItems = []
        }
      }
    },
    handleSelectPanelEnd(blockData) {
      debugger
      const table = this.table
      table.data = []
      const initial = [
        {
          pannelGroupId: '-1002',
          pannelGroupRemark: '花絮'
        },
        {
          pannelGroupId: '-1001',
          pannelGroupRemark: '相关推荐'
        },
        {
          pannelGroupId: '-1003',
          pannelGroupRemark: '相关明星'
        }
      ]
      table.data = table.data.concat(initial)
      blockData.forEach((item, index) => {
        table.data.push(item.data)
      })
      table.data.forEach((item, index) => {
        this.$set(item, 'pannelSequence', index + 1)
        this.$set(item, 'isDmpPanel', 0)
      })
    },
    setFormInfo(data) {
      this.form.tabId = data.tabId
      this.form.tabName = data.tabName
      this.form.tabCategory = data.tabCategory
      this.form.priority = data.filmDetailPageInfo.priority
      this.form.tabResource = data.tabResource
      this.form.currentVersion = data.currentVersion
      this.form.currentStatus = data.tabStatus
      this.globalTabResource = data.tabResource
      this.pannel = data.filmDetailPageInfo.channel
      this.product = data.filmDetailPageInfo.product
      this.table.data = data.panelInfoList
      let pannelNameList = []
      data.panelInfoList.forEach((dataBack) => {
        pannelNameList.push(dataBack.pannelName)
      })
      this.table.data.forEach((item, index) => {
        item.pannelGroupRemark = pannelNameList[ index ]
        item.pannelSequence = index + 1
      })
      this.tabResourceFlag = 0
    },
    showPanelList (row) {
      console.log(row)
      this.filmPageShow = false
      this.isShowPanelList = true
      this.panelId = row.pannelGroupId
    },
    handleUpsertEnd () {
      this.isShowPanelList = false
      this.filmPageShow = true
    },
    fetchData(version) {
      if (version !== undefined) { this.form.currentVersion = version }
      this.$service.tabInfoGet({ id: this.editId, version }).then((data) => {
        this.setFormInfo(data)
      })
    }
  },
  created() {
    this.getMediaResourceInfos().then(() => {
      this.mode = this.initMode
      if (this.editId) {
        this.form.tabResource = ''
        if (this.mode === 'edit') {
          this.title = '编辑页面'
          this.$service.tabInfoGet({ id: this.editId, tabType: 3 })
            .then((data) => {
              this.setFormInfo(data)
              this.categoryEdit = true
            })
        } else if (this.mode === 'read') {
          this.title = '预览页面'
          this.fetchData(this.duplicateVersionVersion)
        }
      } else {
        this.title = '新增页面'
        this.form.tabResource = 'qq'
      }
    })
  }

}
</script>

<style lang='stylus' scoped>
.split-bar
  width 96%
  height 36px
  margin 8px 0px
  padding 0px 6px
  font-size 17px
  line-height 36px
  background #e5e9f2
  border-radius 4px
.table
  width 550px
  margin-left 40px
</style>
