<template>
<TabPage>
  <PageWrapper>
    <PageContentWrapper v-show="activePage === 'tab_info'">
      <ContentCard :title="title" @go-back="$emit('go-back')">
        <CommonContent
          ref="commonContent"
          :mode="mode"
          :resource-info="resourceInfo"
          @edit="mode = 'edit'"
          @copy="handleCopy"
          @replicate="mode = 'replicate'"
          @submit-audit="btnAudit"
          @save-draft="btnSave"
          @select-version="fetchData"
          @unaudit="$emit('upsert-end')"
          @shelves="fetchData"
          @audit="$emit('upsert-end')"
          @delete="$emit('upsert-end', $event)"
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
                <el-select :value="form.tabCategory" @input="handleInputTabCategory" :disabled="categoryEdit">
                  <el-option label="影视" :value="0"/>
                  <el-option label="教育" :value="1"/>
                </el-select>
              </el-form-item>
              <el-form-item label="内容源" v-if="form.tabCategory == 0">
                <el-radio-group :value="form.tabResource" @input="changeResource">
                  <el-radio label="qq">腾讯</el-radio>
                  <el-radio label="iqiyi">爱奇艺</el-radio>
                  <el-radio label="youku">优酷</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="配置方式">
                <CommonSelector type="radio" :value="form.matchType" @input="handleInputConfigWay" :options="configWayOptions" />
              </el-form-item>
              <el-form-item label="频道" v-if="form.matchType === 0">
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
              <el-form-item label="优先级" v-if="form.matchType === 0">
                <el-input-number v-model="form.priority" :min="1"/>
                <span class="remarks marginL">注：数值越大优先级越高，数值越小优先级越低</span>
              </el-form-item>
              <el-form-item label="选择版块" prop="tags">
                <cc-panel-selector-el
                  ref="panelSelector"
                  :source="panelSelectorSource"
                  @select-end="handleSelectPanelEnd"/>

                <el-dropdown>
                  <el-button type="primary" plain class="marginL">
                    添加版块
                    <i class="el-icon-caret-bottom el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="activePage = 'panel'">常规版块</el-dropdown-item>
                    <el-dropdown-item @click.native="activePage = 'album_panel'">业务专辑</el-dropdown-item>
                    <el-dropdown-item @click.native="activePage = 'private_panel'">专属影院</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <OrderableTable
                  v-model="form.panelInfoList"
                  :header="tabGroupTableHeader"
                  :hide-action="true"
                  class="orderableTable"
                />
              </el-form-item>
              <el-form-item v-if="form.matchType === 1" class="is-required" label="选择影片">
                <ResourceSelector
                  noVideoEpisode
                  noEduEpisode
                  ref="resourceSelector"
                  :selectors="['video', 'edu']"
                  :disable-partner="!!resourceSelectorSource"
                  selection-type="multiple"
                  :source="resourceSelectorSource"
                  @select-end="handleSelectResourceEnd">
                  <el-button type="primary" plain>选择影片</el-button>
                </ResourceSelector>
                <br />
                <el-tag
                  v-for="(video, index) in form.videoList"
                  :key="index"
                  closable
                  class="video-tag"
                  :disable-transitions="true"
                  @close="handleRemoveVideo(index)" >
                  {{`${video.title}（${video.videoId}）`}}
                </el-tag>
              </el-form-item>
            </el-form>
          </template>
          <!-- 预览 -->
          <template v-if="mode === 'read'">
            <el-form ref="form" :rules="rules" :model="form" label-width="90px" class="el-form-add">
              <el-form-item label="版面名称" prop="tabName">{{form.tabName}}</el-form-item>
              <el-form-item label="业务分类" prop="tabCategory">{{form.tabCategory == 0 ? '影视':'教育'}}</el-form-item>
              <el-form-item
                label="内容源"
                v-if="form.tabCategory == 0"
                prop="tabResource"
              >{{sourceText[form.tabResource]}}</el-form-item>
              <el-form-item label="配置方式">
                {{$consts.optionsToText(configWayOptions)[form.matchType]}}
              </el-form-item>
              <el-form-item label="频道" v-if="form.matchType === 0">
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
              <el-form-item label="优先级" prop="priority" v-if="form.matchType === 0">
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
              <el-form-item label="选择影片" v-if="form.matchType === 1">
                <el-tag v-for="(video, index) in form.videoList"
                  :key="index"
                  class="video-tag" >
                  {{`${video.title}（${video.videoId}）`}}
                </el-tag>
              </el-form-item>
            </el-form>
          </template>
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
</TabPage>
</template>
<script>
import PageWrapper from '@/components/PageWrapper'
import PageContentWrapper from '@/components/PageContentWrapper'
import CommonContent from '@/components/CommonContent.vue'
import OrderableTable from '@/components/OrderableTable'
import PanelSelector from '@/components/selectors/PanelSelector'
import PrivatePanelInfo from './../blockManage/PrivatePannelInfo'
import PanelInfo from './../panelInfo/PanelInfo'
import titleMixin from '@/mixins/title'
import CommonSelector from '@/components/CommonSelector'
import ResourceSelector from '@/components/ResourceSelector/ResourceSelector'
import TabPage from '@/components/TabPage'
import { cloneDeep } from 'lodash'

const configWayOptions = [{ label: '根据分类配置', value: 0 }, { label: '根据影片配置', value: 1 }]
export default {
  mixins: [titleMixin],
  components: {
    PageWrapper,
    PageContentWrapper,
    'cc-panel-selector-el': PanelSelector,
    PrivatePanelInfo,
    PanelInfo,
    OrderableTable,
    CommonContent,
    CommonSelector,
    ResourceSelector,
    TabPage
  },
  props: {
    id: Number,
    initMode: String,
    version: {
      type: String,
      default () {
        return ''
      }
    }
  },
  data () {
    return {
      activePage: 'tab_info',
      panelPreview: {
        panel: null,
        id: undefined,
        version: undefined,
        initMode: undefined,
        initGroupIndex: undefined,
        initBlockIndex: undefined
      },
      resourceName: '影片详情页',
      mode: 'create',
      rules: {
        tabName: [
          { required: true, message: '请输入主题名称', trigger: 'blur' }
        ]
      },
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
        panelInfoList: [],
        matchType: 0,
        videoList: [] // 已选影片
      },
      configWayOptions,
      globalTabResource: '',
      parentResource: '',
      pannel: '0',
      product: '0',
      // 数据字典
      videoDictItems: {
        qq: { categoryList: [], productList: [] },
        iqiyi: {},
        youku: {}
      },
      eduDictItems: {
        categoryList: [],
        productList: []
      },
      blockTable: [], // 版块列表
      categoryEdit: false
    }
  },
  computed: {
    panelSelectorSource () {
      const { form } = this
      if (form.tabCategory === 1) {
        return undefined
      }
      return form.tabResource
    },
    resourceSelectorSource () {
      const { form, $consts } = this
      if (form.tabCategory === 1) {
        return undefined
      }
      return $consts.partnerAliasToSource[form.tabResource]
    },
    pannelItems () {
      const { form, videoDictItems, eduDictItems } = this
      if (form.tabCategory === 0) {
        const tabResource = form.tabResource
        return (videoDictItems[tabResource] || {}).categoryList || []
      } else {
        return eduDictItems.categoryList || []
      }
    },
    productItems () {
      const { form, videoDictItems, eduDictItems } = this
      if (form.tabCategory === 0) {
        const tabResource = form.tabResource
        return (videoDictItems[tabResource] || {}).productList || []
      } else {
        return eduDictItems.productList || []
      }
    },
    // eslint-disable-next-line
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
    isDisableTabType () {
      const mode = this.mode
      return mode === 'edit' || mode === 'replicate' || mode === 'copy'
    },
    tabGroupTableHeader () {
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
                    this.handleRemovePanel($index)
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
    handlePreviewPanel (panel, targetVersion) {
      const row = panel
      const version = targetVersion || row.currentVersion
      if (row.pannelGroupId > 0) {
        this.activePage = 'panel_preview'
        this.panelPreview = {
          panel: row,
          initMode: 'read',
          id: row.pannelGroupId,
          dataType: row.pannelType,
          version
        }
      } else {
        this.$message({
          type: 'error',
          message: '版块来自第三方数据，无法预览'
        })
      }
    },
    handlePreviewPanelEnd () {
      const panel = this.panelPreview.panel
      this.updatePanelVersion(panel)
      this.panelPreview = null
      this.activePage = 'tab_info'
    },
    handleSelectPanelEnd (selected) {
      let originSelectPanelList = this.form.panelInfoList || []
      if (originSelectPanelList.length === 0) {
        originSelectPanelList = [
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
          },
          {
            pannelGroupId: '-1004',
            pannelGroupRemark: '系列剧'
          }
        ]
      }
      const selectedPanelList = selected || []
      const originSelectedPanelListIndexed = originSelectPanelList.reduce(function (result, item, index) {
        result[item.pannelGroupId] = index
        return result
      }, {})

      let panelList = []
      selectedPanelList.forEach(function (item) {
        const index = originSelectedPanelListIndexed[item.pannelGroupId]
        // 把之前没选中都添加到列表里
        if (index === undefined) {
          panelList.push(item)
        }
      })
      // 把新添加都加到后面
      this.form.panelInfoList = originSelectPanelList.concat(panelList)
    },
    updatePanelVersion (panel, cb) {
      this.$service.panelPageList({
        pannelType: panel.pannelType,
        pannelId: panel.pannelGroupId
      }).then(data => {
        const result = data.rows[0]
        Object.assign(panel, result)
        cb && cb()
      })
    },
    btnAudit () {
      this.save(3)
    },
    btnSave () {
      this.save(2)
    },
    validate (form, callback) {
      const cb = (err) => {
        if (!err) {
          callback()
        } else {
          this.$message({
            type: 'error',
            message: err.message || err
          })
        }
      }
      let valid = true
      this.$refs.form.validate(v => {
        valid = v
      })
      if (!valid) {
        return cb(Error('请将表单填写完整'))
      }
      if (form.panelInfoList.length === 0) {
        return cb(Error('请添加版块'))
      }
      const matchType = form.matchType
      if (matchType === 1 && form.videoList.length === 0) {
        return cb(Error('影片不可为空'))
      }
      cb()
    },
    save (status) {
      const mode = this.mode
      const form = cloneDeep(this.form)
      this.validate(form, () => {
        if (form.panelInfoList) {
          form.panelInfoList = form.panelInfoList.map(function (item, index) {
            return {
              pannelGroupId: item.pannelGroupId,
              pannelSequence: index,
              isDmpPanel: false
            }
          })
        }
        const isCatelogConfig = form.matchType === 0
        const filmDetailPageInfo = {
          category: form.tabCategory,
          source: form.tabCategory === 0 ? form.tabResource : '',
          matchType: form.matchType,
          product: this.product || '0'
        }
        if (isCatelogConfig) {
          filmDetailPageInfo.channel = this.pannel || '0'
          filmDetailPageInfo.priority = form.priority
        } else {
          filmDetailPageInfo.videoList = form.videoList
        }
        var jsonStr = {
          tabParentType: 'special',
          tabId: mode === 'copy' ? undefined : form.tabId,
          tabName: form.tabName,
          tabCnTitle: form.tabName,
          tabType: 3,
          tabStatus: status,
          tabResource: form.tabCategory === 0 ? form.tabResource : '',
          currentVersion: (mode === 'replicate' || mode === 'copy') ? '' : form.currentVersion,
          tabCategory: form.tabCategory,
          panelInfoList: form.panelInfoList,
          // 分类配置与影片配置
          hasSubTab: isCatelogConfig ? 0 : undefined,
          filmDetailPageInfo
        }
        this.$service.tabInfoUpsert(jsonStr, '保存成功').then(data => {
          this.$emit('upsert-end')
        })
      })
    },
    // 内容源改变
    changeResource (value) {
      this.$confirm(
        '是否要切换内容源，切换内容源之后所选择的版块和影片的数据将会清除掉！',
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
          this.pannel = '0'
          this.product = '0'
          this.form.tabResource = value
          this.form.panelInfoList = []
          this.form.videoList = []
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消切换'
          })
        })
    },
    handleRemovePanel (index) {
      this.form.panelInfoList.splice(index, 1)
    },
    // 服务
    getMediaResourceInfos () {
      const toOptions = (arr, labelKey, valueKey) => {
        return arr.map((item) => ({ label: item[labelKey], value: item[valueKey] }))
      }
      return this.$service.getMediaResourceInfo().then(data => {
        var movieData = JSON.parse(decodeURI(data.slice(5, -1)))
        var videoItemModels = movieData.videoItemModels
        // 内容源：iqiyi
        const iqiyiSource = {
          categoryList: [],
          productList: []
        }
        iqiyiSource.categoryList = toOptions(
          videoItemModels[0].categoryList,
          'category_name',
          'cc_category_id'
        )
        iqiyiSource.productList = toOptions(
          videoItemModels[0].productList,
          'source_name',
          'source_sign'
        )
        this.videoDictItems.iqiyi = iqiyiSource

        // 内容源：tencent
        const qqSource = {
          categoryList: [],
          productList: []
        }
        qqSource.categoryList = toOptions(
          videoItemModels[1].categoryList,
          'category_name',
          'cc_category_id'
        )
        qqSource.productList = toOptions(
          videoItemModels[1].productList,
          'source_name',
          'source_sign'
        )
        this.videoDictItems.qq = qqSource

        // 内容源：youku
        const youkuSource = {
          categoryList: [],
          productList: []
        }
        youkuSource.categoryList = toOptions(
          videoItemModels[2].categoryList,
          'category_name',
          'cc_category_id'
        )
        youkuSource.productList = toOptions(
          videoItemModels[2].productList,
          'source_name',
          'source_sign'
        )
        this.videoDictItems.youku = youkuSource

        // 教育->产品包
        var coocaaSource = {
          categoryList: [],
          productList: []
        }
        coocaaSource.categoryList = toOptions(
          videoItemModels[3].categoryList,
          'category_name',
          'cc_category_id'
        )
        coocaaSource.productList = toOptions(
          videoItemModels[3].productList,
          'source_name',
          'source_sign'
        )
        this.eduDictItems = coocaaSource
      })
    },
    setFormInfo (data) {
      const form = this.form
      form.tabId = data.tabId
      form.tabName = data.tabName
      form.tabCategory = data.tabCategory
      const filmDetailPageInfo = data.filmDetailPageInfo || {}
      form.priority = filmDetailPageInfo.priority || 1
      form.tabResource = data.tabResource
      form.currentVersion = data.currentVersion
      form.currentStatus = data.tabStatus
      form.matchType = filmDetailPageInfo.matchType || 0
      form.videoList = filmDetailPageInfo.videoList || []
      this.globalTabResource = data.tabResource
      this.pannel = data.filmDetailPageInfo.channel || '0'
      this.product = data.filmDetailPageInfo.product || '0'
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
    },
    handleInputTabCategory (val) {
      this.form.tabCategory = val
      this.form.tabResource = 'qq'
      this.clearConfig()
    },
    handleCopy (status) {
      const STATUS = this.$consts.status
      if (status === STATUS.waiting) {
        this.btnAudit()
      } else {
        this.btnSave()
      }
    },
    handleInputConfigWay (val) {
      this.form.matchType = val
      this.clearConfig()
    },
    // 清空配置的内容
    clearConfig () {
      this.pannel = '0'
      this.product = '0'
      this.form.priority = 1
      this.form.panelInfoList = []
      this.form.videoList = []
    },
    handleSelectResourceEnd (selectedResources) {
      const { video: videoResources, edu: eduResources } = selectedResources
      const insertVideoList = (resources, selectedType) => {
        resources.forEach(item => {
          const prefix = this.getVideoPrefix(selectedType)
          const videoId = prefix + item.coocaaVId
          const isExist = this.form.videoList.some(v => v.videoId === videoId)
          !isExist && this.form.videoList.push({ videoId, title: item.title })
        })
      }
      insertVideoList(videoResources, 'video')
      insertVideoList(eduResources, 'edu')
    },
    getVideoPrefix (selectedType) {
      const form = this.form
      const { tabResource } = form
      const prefixMap = {
        qq: '_otx_',
        iqiyi: '_oqy_',
        youku: '_oyk_'
      }
      const prefix = selectedType === 'video' ? prefixMap[tabResource] : '_otx_'
      return prefix
    },
    handleRemoveVideo (index) {
      this.form.videoList.splice(index, 1)
    },
    fetchData (version) {
      // if (version !== undefined) { this.form.currentVersion = version }
      return this.$service
        .tabInfoGet({ id: this.id, version, tabType: 3 })
        .then(data => {
          this.setFormInfo(data)
        })
    }
  },
  created () {
    this.mode = this.initMode || 'create'
    this.getMediaResourceInfos()
    if (this.id) {
      this.categoryEdit = true
      this.form.tabResource = ''
      this.fetchData(this.version)
    }
  }
}
</script>

<style lang='stylus' scoped>
.el-form-add .orderableTable >>>.el-input, .el-form-add .selectHourAndMinute >>>.el-input
  width 100%
.selectHourAndMinute
  width 450px
.video-tag
  margin 5px 10px 5px 0
</style>
