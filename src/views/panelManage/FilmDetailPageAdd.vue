<template>
  <div>
    <div>
      <ContentCard :title="title" @go-back="$emit('go-back')" v-show="isShow">
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
           @delete="$emit('upsert-end')"
        >
          <div class="form-legend-header">
            <i class="el-icon-edit">基本信息</i>
          </div>
          <template v-if="mode !== 'read'">
            <el-form
              ref="form"
              :rules="rules"
              :model="form"
              label-width="120px"
              class="el-form-add"
            >
              <el-form-item label="版面名称" prop="tabName">
                <el-input v-model="form.tabName"/>
              </el-form-item>
              <el-form-item label="业务分类">
                <el-select v-model="form.tabCategory" :disabled="categoryEdit">
                  <el-option label="影视" :value="0"/>
                  <el-option label="教育" :value="1"/>
                </el-select>
              </el-form-item>
              <el-form-item label="内容源" v-if="form.tabCategory == 0">
                <el-radio-group v-model="form.tabResource" @change.native.prevent="changeResource">
                  <el-radio label="qq">腾讯</el-radio>
                  <el-radio label="iqiyi">爱奇艺</el-radio>
                  <el-radio label="youku">优酷</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="频道">
                <el-select v-model="pannel">
                  <el-option value="0" label="不限"/>
                  <el-option
                    v-for="(item, index) in pannelItems"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="产品包">
                <el-select v-model="product">
                  <el-option value="0" label="不限"/>
                  <el-option
                    v-for="(item, index) in productItems"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="优先级">
                <el-input-number v-model="form.priority" :min="1"/>
                <span class="remarks marginL">注：数值越大优先级越高，数值越小优先级越低</span>
              </el-form-item>
              <el-form-item label="选择版块" prop="tags">
                <el-button type="primary" plain @click="handleSlectPannelStart">选择版块</el-button>

                <el-dropdown>
                  <el-button type="primary" plain class="marginL">
                    添加版块
                    <i class="el-icon-caret-bottom el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="openCreatePage('pannelInfo', 1)">常规版块</el-dropdown-item>
                    <el-dropdown-item @click.native="openCreatePage('AlbumPannelInfo' ,3)">业务专辑</el-dropdown-item>
                    <el-dropdown-item @click.native="openCreatePage('PrivatePannelInfo')">专属影院</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <OrderableTable
                  v-model="form.panelInfoList"
                  :header="tabGroupTableHeader"
                  :hide-action="true"
                  class="orderableTable"
                />
              </el-form-item>
              <!-- <el-form-item>
                <el-button type="primary" @click="handleShowTimeShelf()">提交审核</el-button>
                <el-button type="warning" @click="handleSaveDraft()">保存草稿</el-button>
              </el-form-item>-->
            </el-form>
          </template>
          <template v-if="mode === 'read'">
            <el-form ref="form" :rules="rules" :model="form" label-width="90px" class="el-form-add">
              <el-form-item label="版面名称" prop="tabName">{{form.tabName}}</el-form-item>
              <el-form-item label="业务分类" prop="tabCategory">{{form.tabCategory == 0 ? '影视':'教育'}}</el-form-item>
              <el-form-item
                label="内容源"
                v-if="form.tabCategory == 0"
                prop="tabResource"
              >{{sourceText[form.tabResource]}}</el-form-item>
              <el-form-item label="频道">
                <el-select v-model="pannel" :disabled="true">
                  <el-option value="0" label="不限"/>
                  <el-option
                    v-for="(item, index) in pannelItems"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="产品包">
                <el-select v-model="product" :disabled="true">
                  <el-option value="0" label="不限"/>
                  <el-option
                    v-for="(item, index) in productItems"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="优先级" prop="priority">
              {{form.priority}}
            </el-form-item>
              <el-form-item label="选择的版块" prop="tags">
                <OrderableTable
                  v-model="form.panelInfoList"
                  :header="tabGroupTableHeader"
                  :hide-action="true"
                  class="orderableTable"
                  :readonly="true"
                />
              </el-form-item>
            </el-form>
          </template>
        </CommonContent>
      </ContentCard>
    </div>
    <AddBlockFilter
      :parentPannelResource="form.tabResource"
      v-show="mode==='selectBlockResource'"
      @go-back="goBack"
      @add-block="addBlock"
    />
    <PrivatePannelInfo
      @go-back="goBack"
      @upsert-end="goBack"
      :id="viewId"
      :version="duplicateVersion"
      :initMode="viewId!==undefined? 'read':'create'"
      v-if="mode==='PrivatePannelInfo'"
    ></PrivatePannelInfo>
    <PanelInfo
      @go-back="goBack"
      @upsert-end="goBack"
      :id="viewId"
      :version="duplicateVersion"
      :initMode="viewId!==undefined? 'read':'create'"
      :panel-data-type="panelDataType"
      v-if="mode==='pannelInfo' || mode==='AlbumPannelInfo'"
    ></PanelInfo>
  </div>
</template>
<script>
import SelectHourAndMinute from './../../components/SelectHourAndMinute'
import AddBlockFilter from './AddBlockFilter'
import { Table } from 'admin-toolkit'
import CommonContent from '@/components/CommonContent.vue'
import OrderableTable from '@/components/OrderableTable'
import PrivatePannelInfo from './../blockManage/PrivatePannelInfo'
import PanelInfo from './../panelInfo/PanelInfo'
export default {
  components: {
    AddBlockFilter,
    Table,
    PrivatePannelInfo,
    PanelInfo,
    OrderableTable,
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
  watch: {
    'form.tabCategory': {
      deep: true,
      handler: function(newVal, oldVal) {
        if (newVal === 1) {
          this.pannelItems = this.eduProductItems.categoryList
          this.productItems = this.eduProductItems.productList
          if (this.eduProductItems.categoryList.length === 0) {
            this.pannel = '不限'
          }
          if (this.tabResourceFlag === 0) {
            this.tabResourceFlag = 1
          } else {
            this.pannel = ''
            this.product = ''
          }
        } else if (newVal === 0) {
          this.handleTabResourceChange(this.form.tabResource)
        }
      }
    },
    'form.tabResource': function(value, oldVal) {
      this.handleTabResourceChange(value)
    }
  },
  data() {
    return {
      title: '',
      panelDataType: 1, //1 为常规运营，3为业务专辑
      mode: 'create',
      preMode: 'create', //改变mode之前的状态
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
        tabResource: 'qq',
        priority: 1,
        currentVersion: '',
        currentStatus: '',
        panelInfoList: []
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
      mode: '',
      categoryEdit: false,
      isShowPanelList: false,
      panelId: undefined,
      panelMode: 'read',
      panelVersion: undefined,
      filmPageShow: true
    }
  },
  computed: {
    resourceInfo() {
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
        mode === 'create' ||
        mode === 'read'
      )
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
    goBack() {
      this.mode = this.preMode
    },
    handlePreviewPannel(row, version) {
      this.preMode = this.mode
      if (row.pannelGroupId < 0 ) {
        this.$message({
          type: 'error',
          message: '来自第三方数据'
        })
        return
      }
      this.viewId = row.pannelGroupId
      switch (row.pannelType) {
        case 1:
        case 7:
          this.mode = 'pannelInfo'
          break
        case 3:
          this.mode = 'AlbumPannelInfo'
          break
        case 5:
        case 9:
        case 10:
          this.mode = 'PrivatePannelInfo'
          break
      }
      this.duplicateVersion = version
    },
    openCreatePage(mode, panelDataType) {
      this.preMode = this.mode
      this.viewId = undefined
      this.mode = mode
      this.panelDataType = panelDataType
      this.duplicateVersion = undefined
    },
    addBlock(rows) {
      this.mode = this.preMode
      let panelInfoList = []
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
     panelInfoList = panelInfoList.concat(initial)
     panelInfoList = panelInfoList.concat(rows)
     this.form.panelInfoList = panelInfoList
    },
    handleSlectPannelStart() {
      this.preMode = this.mode
      this.mode = 'selectBlockResource'
    },
    btnAudit() {
      this.save(3)
    },
    btnSave() {
      this.save(2)
    },
    save(status) {
      if (this.form.panelInfoList.length === 0) {
        this.$message('请添加版块')
        return false
      }
      const form = this.form
      this.$refs.form.validate(valid => {
        if (valid) {
          if (form.panelInfoList) {
            form.panelInfoList = form.panelInfoList.map(function(item, index) {
              return {
                pannelGroupId: item.pannelGroupId,
                pannelSequence: index,
                isDmpPanel: false
              }
            })
          }
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
            panelInfoList: form.panelInfoList
          }
          console.log(jsonStr)
          this.$service.tabInfoUpsert(jsonStr, '保存成功').then(data => {
            this.$emit('upsert-end')
          })
        } else {
          this.$message('请将表单填写完整')
        }
      })
    },
    // 内容源改变
    changeResource(value) {
      this.$confirm(
        '是否要切换内容源，切换内容源之后所选择的版块数据将会清除掉！',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.$message({
            type: 'success',
            message: '内容源切换成功!'
          })
           this.form.panelInfoList = []
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消切换'
          })
        })
    },
    handleRemovePannel(index) {
      this.form.panelInfoList.splice(index, 1)
    },
    // 服务
    getMediaResourceInfos() {
      return this.$service.getMediaResourceInfo().then(data => {
        var movieData = JSON.parse(decodeURI(data.slice(5, -1)))
        var videoItemModels = movieData.videoItemModels
        // 内容源：iqiyi
        var iqiyiSource = {
          categoryList: [],
          productList: []
        }
        iqiyiSource.categoryList = this._arrayingOption(
          videoItemModels[0].categoryList,
          'category_name',
          'cc_category_id'
        )
        iqiyiSource.productList = this._arrayingOption(
          videoItemModels[0].productList,
          'source_name',
          'source_sign'
        )
        this.iqiyiSource = iqiyiSource

        // 内容源：tencent
        var qqSource = {
          categoryList: [],
          productList: []
        }
        qqSource.categoryList = this._arrayingOption(
          videoItemModels[1].categoryList,
          'category_name',
          'cc_category_id'
        )
        qqSource.productList = this._arrayingOption(
          videoItemModels[1].productList,
          'source_name',
          'source_sign'
        )
        this.qqSource = qqSource

        // 内容源：youku
        var youkuSource = {
          categoryList: [],
          productList: []
        }
        youkuSource.categoryList = this._arrayingOption(
          videoItemModels[2].categoryList,
          'category_name',
          'cc_category_id'
        )
        youkuSource.productList = this._arrayingOption(
          videoItemModels[2].productList,
          'source_name',
          'source_sign'
        )
        this.youkuSource = youkuSource

        // 教育->产品包
        var coocaaSource = {
          categoryList: [],
          productList: []
        }
        coocaaSource.categoryList = this._arrayingOption(
          videoItemModels[3].categoryList,
          'category_name',
          'cc_category_id'
        )
        coocaaSource.productList = this._arrayingOption(
          videoItemModels[3].productList,
          'source_name',
          'source_sign'
        )
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
      if (this.tabResourceFlag === 0 && this.globalTabResource === value) {
        this.tabResourceFlag = 1
      } else {
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
      // this.table.data = data.panelInfoList
      this.form.panelInfoList = data.panelInfoList.map(item => {
        item.pannelGroupRemark = item.pannelName
        return item
      })
      // let pannelNameList = []
      // data.panelInfoList.forEach(dataBack => {
      //   pannelNameList.push(dataBack.pannelName)
      // })
      // this.table.data.forEach((item, index) => {
      //   item.pannelGroupRemark = pannelNameList[index]
      //   item.pannelSequence = index + 1
      // })
      this.tabResourceFlag = 0
    },
    showPanelList(row) {
      console.log(row)
      this.filmPageShow = false
      this.isShowPanelList = true
      this.panelId = row.pannelGroupId
    },
    handleUpsertEnd() {
      this.isShowPanelList = false
      this.filmPageShow = true
    },
    fetchData(version) {
      // if (version !== undefined) { this.form.currentVersion = version }
      this.$service
        .tabInfoGet({ id: this.id, version, tabType: 3 })
        .then(data => {
          this.setFormInfo(data)
        })
    }
  },
  created() {
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
   
    this.getMediaResourceInfos().then(() => {
      this.handleTabResourceChange(this.form.tabResource) //给频道，产品包赋值
      if (this.id) {
        this.categoryEdit = true
        this.form.tabResource = ''
        this.fetchData(this.version)
      }
    })
  }
}
</script>

<style lang='stylus' scoped>
.el-form-add .orderableTable >>>.el-input, .el-form-add .selectHourAndMinute >>>.el-input
  width: 100%
.selectHourAndMinute
  width: 450px
</style>