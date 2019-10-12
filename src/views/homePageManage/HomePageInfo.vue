<template>
  <PageWrapper>
    <PageContentWrapper v-show="activePage == 'homepage'">
      <ContentCard :title="title" @go-back="$emit('go-back')">
        <CommonContent
          :mode="mode"
          :resource-info="resourceInfo"
          @replicate="mode = 'replicate'"
          @edit="mode = 'edit'"
          @unaudit="$emit('upsert-end')"
          @shelves="fetchData"
          @audit="$emit('upsert-end')"
          @copy="handleCopy($event)"
          @submit-audit="handleSubmitAudit"
          @save-draft="handleSaveDraft"
          @select-version="fetchData"
          @delete="$emit('upsert-end', $event)"
        >
          <div class="hompage-upsert" v-if="mode !== 'read'">
            <el-form ref="homepageForm" :model="homepage" :rules="rules" label-width="140px" class="el-form-add">
              <div class="form-legend-header">
                <i class="el-icon-edit">基本信息</i>
              </div>
              <el-form-item label="首页名称" prop="homepageName">
                <el-input v-model="homepage.homepageName" placeholder="首页名称"/>
              </el-form-item>
              <el-form-item label="首页模式" prop="homepageModel">
                <el-radio-group v-model="homepage.homepageModel">
                  <el-radio label="normal">标准模式</el-radio>
                  <el-radio label="child">儿童模式</el-radio>
                  <el-radio label="old">老人模式</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="首页版本号" prop="homepageVersion">
                <el-input v-model="homepage.homepageVersion" placeholder="首页版本号"></el-input>
              </el-form-item>

              <div class="form-legend-header">
                <span>数据列表配置</span>
              </div>
              <el-form-item label="首页版面">
                <TabSelector @select-end="handleSelectTabEnd"/>
                <el-button type="primary" plain @click="handleCreateTab">新建版面</el-button>
                <span class="cc-form-annotation marginL remarks margin-right-20">至少选择1个版面</span>
                <el-form :inline="true" class="tab-group-filter">
                  <el-form-item label="是否固定位置">
                    <el-select v-model="tabGroupFilter.tabIsFix" placeholder="请选择">
                      <el-option
                        v-for="item in tabGroupFilterOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="初始化是否在首页分类">
                    <el-select v-model="tabGroupFilter.tabIsInitInCategory" placeholder="请选择">
                      <el-option
                        v-for="item in tabGroupFilterOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
                <OrderableTable
                  v-model="tabGroupList"
                  :header="tabGroupTableHeader"
                  :filter-fn="tabGroupFilterFn"
                  :hide-action="true"
                  class="orderableTable"
                />
                <div></div>
              </el-form-item>
            </el-form>
          </div>

          <div class="homepage-read" v-if="mode === 'read'">
            <el-form label-width="140px" class="el-form-add">
              <div class="form-legend-header">
                <i class="el-icon-edit">基本信息</i>
              </div>
              <el-form-item label="首页名称" prop="homepageName">{{ homepage.homepageName }}</el-form-item>
              <el-form-item
                label="首页模式"
                prop="homepageModel"
              >{{ HOME_MODE_MAP[homepage.homepageModel] }}</el-form-item>
              <el-form-item label="首页版本号" prop="homepageVersion">{{ homepage.homepageVersion }}</el-form-item>

              <div class="form-legend-header">
                <span>数据列表配置</span>
              </div>
              <el-form-item label="首页版面">
                <el-form :inline="true" class="tab-group-filter">
                  <el-form-item label="是否固定位置">
                    <el-select v-model="tabGroupFilter.tabIsFix" placeholder="请选择">
                      <el-option
                        v-for="item in tabGroupFilterOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="初始化是否在首页分类">
                    <el-select v-model="tabGroupFilter.tabIsInitInCategory" placeholder="请选择">
                      <el-option
                        v-for="item in tabGroupFilterOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
                <OrderableTable
                  v-model="tabGroupList"
                  :header="tabGroupTableHeader"
                  :filter-fn="tabGroupFilterFn"
                  :readonly="true"
                  :hide-action="true"
                  class="orderableTable"
                />
              </el-form-item>
            </el-form>
          </div>
        </CommonContent>
      </ContentCard>
    </PageContentWrapper>

    <PageContentWrapper v-if="activePage === 'tab_group_setter'">
      <HomePageTabGroupSetter
        :title-prefix="title"
        :tab-info="homepage.tabInfos[activeTabGroupIndex]"
        :readonly="mode === 'read'"
        @set-end="handleSetTabGroupEnd"
        @go-back="activePage = 'homepage'"
      />
    </PageContentWrapper>

    <PageContentWrapper v-if="activePage === 'tab'">
      <TabInfo
        :title-prefix="title"
        :id="embedTab.id"
        :version="embedTab.version"
        :init-mode="embedTab.mode"
        @upsert-end="handleTabEmbedBack"
        @go-back="handleTabEmbedBack"
      />
    </PageContentWrapper>
  </PageWrapper>
</template>

<script>
import PageWrapper from '@/components/PageWrapper'
import PageContentWrapper from '@/components/PageContentWrapper'
import CommonContent from '@/components/CommonContent.vue'
import TabSelector from '@/components/selectors/TabSelector'
import InputOrder from '@/components/InputOrder'
import titleMixin from '@/mixins/title'
import HomePageTabGroupSetter from './HomePageTabGroupSetter'
import OrderableTable from '@/components/OrderableTable'
import TabInfo from '@/views/tabInfo/TabInfo'
import { cloneDeep } from 'lodash'
export default {
  mixins: [titleMixin],
  components: {
    PageWrapper,
    PageContentWrapper,
    CommonContent,
    TabSelector,
    InputOrder,
    HomePageTabGroupSetter,
    OrderableTable,
    TabInfo
  },
  data() {
    return {
      mode: 'create',
      resourceName: '首页方案',
      activePage: 'homepage',
      showTabGroupSetter: false,
      showCrowdSelector: false,
      showAuditDialog: false,
      embedTab: undefined,
      selectedTabList: [],
      selectedTabListIndexed: {},
      activeTabGroupIndex: undefined,
      auditHistories: [],
      auditForm: {
        auditFlag: 4,
        auditDesc: ''
      },
      versionList: [],
      homepage: {
        homepageId: undefined,
        homepageName: undefined,
        homepageModel: 'normal',
        homepageVersion: undefined,
        homepageStatus: undefined,
        currentVersion: undefined,
        defaultFocusIndex: undefined,
        tabInfos: []
      },
      HOME_MODE_MAP: {
        normal: '普通模式',
        child: '儿童模式',
        old: '老人模式'
      },
      rules: {
        homepageName: [{ required: true, message: '请输入首页名称' }],
        homepageModel: [{ required: true, message: '请选择首页模式' }],
        homepageVersion: [{ required: true, message: '请输入首页版本号' }]
      },
      tabGroupFilter: {
        tabIsFix: -1,
        tabIsInitInCategory: -1
      },
      tabGroupFilterOptions: [
        {
          label: '全部',
          value: -1
        },
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ]
    }
  },
  computed: {
    resourceInfo() {
      const homepage = this.homepage
      if (homepage.homepageId) {
        return {
          id: homepage.homepageId,
          type: 'homepage',
          menuElId: 'homepageInfo',
          version: homepage.currentVersion,
          status: homepage.homepageStatus
        }
      }
    },
    tabGroupList: {
      get() {
        const homepage = this.homepage
        const tabInfos = homepage.tabInfos || []
        const tabGroupList = []
        tabInfos.forEach(function(tabInfoItem) {
          const tabList = tabInfoItem.tabList
          const defaultTabIndex = tabList.findIndex(item => item.isDefaultTab)
          const tabItemToShow = tabList[defaultTabIndex > -1 ? defaultTabIndex : 0]
          const hasDefaultTab = defaultTabIndex > -1
          const isNormalTab = tabList.length === 1 && tabItemToShow.dmpInfo === undefined
          const tabIsFix = tabInfoItem.tabIsFix
          // 只有普通版面和已经设了默认版面的版面组可以默认落焦
          const canBeDefaultFocusTab = tabIsFix && (hasDefaultTab || isNormalTab)

          // 如果当前默认落焦不能被设为默认落焦, 则取消当前默认落焦
          if (tabInfoItem.tabIsFocus && !canBeDefaultFocusTab) {
            tabInfoItem.tabIsFocus = 0
          }

          const tabItem = {
            tabIsFocus: tabInfoItem.tabIsFocus,
            tabIsFix: tabInfoItem.tabIsFix,
            tabIsForeverLast: tabInfoItem.tabIsForeverLast,
            tabIsInitInCategory: tabInfoItem.tabIsInitInCategory,
            tabList,
            canBeDefaultFocusTab,
            tabCount: tabList.length,
            ...tabItemToShow
          }
          tabGroupList.push(tabItem)
        })
        return tabGroupList
      },
      set(val) {
        const tabInfos = val.map(item => {
          return {
            tabIsFix: item.tabIsFix,
            tabIsInitInCategory: item.tabIsInitInCategory,
            tabIsForeverLast: item.tabIsForeverLast,
            tabIsFocus: item.tabIsFocus,
            tabList: item.tabList
          }
        })
        this.homepage.tabInfos = tabInfos
      }
    },
    tabGroupTableHeader() {
      const header = [
        {
          label: '置底',
          align: 'center',
          render: (h, { $index, row }) => {
            if (this.mode === 'read') {
              return row.tabIsForeverLast ? '是' : ''
            }
            return h(
              'el-checkbox',
              {
                props: {
                  value: !!row.tabIsForeverLast,
                },
                on: {
                  input: val => {
                    this.handleSetTabAlwaysLast($index, val)
                  }
                }
              },
              ''
            )
          }
        },
        {
          label: '版面ID',
          prop: 'tabId'
        },
        {
          label: '版面名称',
          render: (h, { $index, row }) => {
            return h(
              'el-button',
              {
                props: {
                  type: 'text'
                },
                on: {
                  click: () => {
                    this.handleShowTabGroup($index)
                  }
                }
              },
              row.tabName
            )
          }
        },
        {
          prop: 'tabCnTitle',
          label: 'TAB标题(中文)'
        },
        {
          prop: 'tabEnTitle',
          label: 'TAB标题(英文)'
        },
        {
          label: '默认落焦',
          align: 'center',
          render: (h, { $index, row }) => {
            if (this.mode === 'read') {
              return row.tabIsFocus ? '是' : ''
            }
            const canBeDefaultFocusTab = row.canBeDefaultFocusTab
            return h(
              'el-radio',
              {
                attrs: {
                  title: canBeDefaultFocusTab
                    ? ''
                    : '只有固定位置，并且是普通版面或设了默认版面的定向版面组才能设为默认落焦'
                },
                props: {
                  disabled: !canBeDefaultFocusTab,
                  value: row.tabIsFocus,
                  label: 1
                },
                on: {
                  input: val => {
                    this.handleSetDefaultFocusTab($index)
                  }
                }
              },
              ''
            )
          }
        },
        {
          label: '固定位置',
          align: 'center',
          render: (h, { $index, row }) => {
            const val = row.tabIsFix
            return val ? '是' : ''
          }
        },
        {
          label: '初始化在首页分类',
          align: 'center',
          render: (h, { $index, row }) => {
            const val = row.tabIsInitInCategory
            return val ? '是' : ''
          }
        },
        {
          label: '版面数',
          prop: 'tabCount',
          width: 80
        },
        {
          label: '默认版面',
          render: (h, { $index, row }) => {
            return row.isDefaultTab ? '有' : ''
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
                    this.handleRemoveTab($index)
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
  props: ['id', 'initMode', 'version'],
  methods: {
    tabGroupFilterFn(item) {
      const { tabIsFix, tabIsInitInCategory } = this.tabGroupFilter 
      const isMatchTabIsFix = tabIsFix === -1 ? true : (item.tabIsFix === tabIsFix)
      const isMatchTabIsInitCategory = tabIsInitInCategory === -1 ? true : (item.tabIsInitInCategory === tabIsInitInCategory)
      return isMatchTabIsFix && isMatchTabIsInitCategory
    },
    handleSetDefaultFocusTab (defaultFocusIndex) {
      const tabInfos = this.homepage.tabInfos
      tabInfos.forEach((item, index) => {
        item.tabIsFocus = index === defaultFocusIndex ? 1 : 0
      })
    },
    handleSetTabAlwaysLast (theIndex, flag) {
      const tabInfos = this.homepage.tabInfos
      flag = flag ? 1 : 0
      if (flag) {
        tabInfos.forEach((item, index) => {
          item.tabIsForeverLast = 0
        })
      }
      tabInfos[theIndex].tabIsForeverLast = flag
    },
    handleShowTabGroup(index) {
      this.activeTabGroupIndex = index
      this.activePage = 'tab_group_setter'
    },
    handleSetTabGroupEnd(tabInfo) {
      this.activePage = 'homepage'
      const activeTabGroupIndex = this.activeTabGroupIndex
      const homepage = this.homepage
      const tabInfos = homepage.tabInfos 
      const newTabInfoItem = {
        ...tabInfos[activeTabGroupIndex],
        ...tabInfo,
      }
      this.$set(tabInfos, activeTabGroupIndex, newTabInfoItem)
    },
    handleSaveDraft() {
      const data = JSON.parse(JSON.stringify(this.homepage))
      data.homepageStatus = 2
      if (this.mode === 'replicate') {
        data.currentVersion = undefined
      }
      this.submit(data)
    },
    handleSubmitAudit() {
      const data = JSON.parse(JSON.stringify(this.homepage))
      data.homepageStatus = 3
      if (this.mode === 'replicate') {
        data.currentVersion = undefined
      }
      this.submit(data)
    },
    validate(data, cb) {
      this.$refs.homepageForm.validate(function(valid) {
        if (valid) {
          const tabInfos = data.tabInfos
          let error = ''
          if (data.homepageStatus === 3) {
            if (data.tabInfos.length === 0) {
              return cb('请至少选择一个版面')
            }

            // 检查重复版面
            // 默认版面与普通版面之间不能重复
            // 定向版面不能与默认版面和普通版面重复
            // 定向版面之间不能重复
            let defaultFocusIndex
            const normalTabListIndexed = {}
            const specTabListIndexed = {}
            // 普通版面重复检查
            for (let i = 0, length = tabInfos.length; i < length; i++) {
              const tabGroup = tabInfos[i].tabList
              let tab
              let isNormalTab
              if (tabInfos[i].tabIsFocus) {
                defaultFocusIndex = i
              }
              if (tabGroup.length === 1 && tabGroup[0].dmpInfo === undefined) {
                // 普通版面
                isNormalTab = true
                tab = tabGroup[0]
              } else {
                // 含有2个或以上版面，不是普通版面, 找出默认版面
                isNormalTab = false
                tab = tabGroup.find(function(item) {
                  return item.isDefaultTab
                })
              }
              if (tab) {
                const duplicateIndex = normalTabListIndexed[tab.tabId]
                if (duplicateIndex !== undefined) {
                  return cb(
                    '第 ' +
                      (i + 1) +
                      ' 个版面与第 ' +
                      (duplicateIndex + 1) +
                      ' 个版面或默认版面重复'
                  )
                } else {
                  normalTabListIndexed[tab.tabId] = i
                }
              }
            }

            if (defaultFocusIndex === undefined) {
              return cb('请选择默认落焦版面')
            }

            checkDmp: for (
              let i = 0, length = tabInfos.length;
              i < length;
              i++
            ) {
              const tabGroup = tabInfos[i].tabList
              // 定向版面之间不能重复
              // 也不能与其他的默认版面和普通版面重复
              if (tabGroup.length === 1 && tabGroup[0].dmpInfo === undefined) {
                // 普通版面，跳过
                continue
              }
              for (let j = 0, lengthJ = tabGroup.length; j < lengthJ; j++) {
                // 不需要再检测同组的版面是否重复，因为在设定组内版面的时候保证了唯一
                // 下面只需要判断定向的有没有与普通版面和默认版面重复
                const duplicateIndex = normalTabListIndexed[tabGroup[j].tabId]
                const dmpInfo = tabGroup[j].dmpInfo || {}
                if (!tabGroup[j].isDefaultTab) {
                  if (dmpInfo.dmpCrowdId === undefined) {
                    return cb(
                      '请设置第 ' +
                        (i + 1) +
                        ' 个组第 ' +
                        (j + 1) +
                        ' 个版面的人群'
                    )
                  } else if (duplicateIndex !== undefined) {
                    return cb(
                      '第 ' +
                        (i + 1) +
                        ' 个版面组里的第' +
                        (j + 1) +
                        '个版面与第 ' +
                        (duplicateIndex + 1) +
                        ' 个版面组的版面重复'
                    )
                  }
                }
              }
            }
          }
          cb()
        } else {
          cb('请把表单填写完整')
        }
      })
    },
    submit(data) {
      this.validate(
        data,
        function(err) {
          if (!err) {
            this.$service
              .homePageInfoSave(this.parseDataToApi(data), '保存成功')
              .then(result => {
                this.$emit('upsert-end')
              })
          } else {
            this.$message({
              type: 'error',
              message: err
            })
          }
        }.bind(this)
      )
    },
    parseApiToData(data) {
      const finalData = cloneDeep(data)
      finalData.tabInfos = (finalData.tabInfos || []).map(function(item, index) {
        let tabList = []
        if (item.tabId) {
          // 那是一个普通的版面
          tabList.push({
            tabId: item.tabId,
            tabName: item.tabName,
            tabCnTitle: item.tabCnTitle,
            tabEnTitle: item.tabEnTitle,
            currentVersion: item.currentVersion,
            isDefaultTab: false
          })
        }
        if (item.dmpTabList) {
          item.dmpTabList.forEach(function(dItem) {
            // 人群为 -1 的是默认版面
            const currentItem = {
              isDefaultTab: false,
              tabId: dItem.tabId,
              tabName: dItem.tabName,
              tabCnTitle: dItem.tabCnTitle,
              tabEnTitle: dItem.tabEnTitle,
              currentVersion: dItem.currentVersion
            }
            if (dItem.dmpCrowdId === -1) {
              currentItem.isDefaultTab = true
            } else if (dItem.dmpCrowdId !== undefined) {
              currentItem.dmpInfo = {
                dmpPolicyId: dItem.dmpPolicyId,
                dmpPolicyName: dItem.dmpPolicyName,
                dmpCrowdName: dItem.dmpCrowdName,
                dmpCrowdId: dItem.dmpCrowdId
              }
            }
            tabList.push(currentItem)
          })
        }

        return {
          tabIsFocus: item.tabIsFocus,
          tabIsFix: item.tabIsFix || 0,
          tabIsForeverLast: item.tabIsForeverLast || 0,
          tabIsInitInCategory: item.tabIsInitInCategory || 0,
          tabList,
        }
      })
      return finalData
    },
    parseDataToApi(data) {
      const finalData = JSON.parse(JSON.stringify(data))
      const defaultFocusIndex = finalData.defaultFocusIndex
      const tabInfos = []
      finalData.tabInfos.forEach(function(item, index) {
        const tabInfoItem = {
          isDmpTab: 0,
          tabIsFix: item.tabIsFix,
          tabIsInitInCategory: item.tabIsInitInCategory,
          tabIsForeverLast: item.tabIsForeverLast,
          tabIsFocus: item.tabIsFocus
        }
        const dmpTabList = []
        let tabSequence = 0
        item.tabList.forEach(function(tItem) {
          // 如果只有一个版面，并且版面没有设人群，那它是一个普通的版面
          if (tItem.dmpInfo === undefined && item.tabList.length === 1) {
            tabInfoItem.tabId = tItem.tabId
            tabInfoItem.tabSequence = index
          } else {
            // 否则，它不是普通版面
            if (tItem.isDefaultTab) {
              // 如果它是默认版面
              tabInfoItem.tabId = tItem.tabId
              tabInfoItem.tabSequence = index
            } else {
              const dmpInfo = tItem.dmpInfo || {}
              dmpTabList.push({
                tabId: tItem.tabId,
                tabSequence: tabSequence++,
                dmpPolicyId: dmpInfo.dmpPolicyId,
                dmpCrowdId: dmpInfo.dmpCrowdId,
                dmpPolicyName: dmpInfo.dmpPolicyName,
                dmpCrowdName: dmpInfo.dmpCrowdName
              })
            }
          }
        })
        if (dmpTabList.length > 0) {
          if (tabInfoItem.tabId) {
            // 如果有默认版面，又有dmp，把默认版面dmp列表最后
            dmpTabList.push({
              tabId: tabInfoItem.tabId,
              tabSequence: tabSequence++,
              dmpPolicyName: '不限',
              dmpCrowdName: '不限',
              dmpPolicyId: -1,
              dmpCrowdId: -1
            })
            tabInfoItem.tabId = undefined
          }
          tabInfoItem.isDmpTab = 1
          tabInfoItem.dmpTabList = dmpTabList
        }
        tabInfos.push(tabInfoItem)
      })

      finalData.tabInfos = tabInfos
      return finalData
    },
    setHomepage(data) {
      data = this.parseApiToData(data)
      Object.assign(this.homepage, data)
      this.selectedTabList = data.tabInfos.map(function(item) {
        return {
          id: item.tabId,
          label: item.tabName,
          data: item
        }
      })
    },
    handleSelectTabEnd(data) {
      const tabInfos = this.homepage.tabInfos
      this.homepage.tabInfos = tabInfos.concat(data.map(item => {
        return {
          tabIsFix: 0,
          tabIsInitInCategory: 0,
          tabIsForeverLast: 0,
          tabIsFocus: 0,
          tabList: [cloneDeep(item)]
        }
      }))
    },
    handleTabEmbedBack() {
      this.activePage = 'homepage'
    },
    handleCreateTab() {
      this.activePage = 'tab'
      this.embedTab = {
        mode: 'create'
      }
    },
    handleRemoveTab(index) {
      const homepage = this.homepage
      const defaultFocusIndex = homepage.defaultFocusIndex
      this.homepage.tabInfos.splice(index, 1)
      homepage.defaultFocusIndex =
        index < defaultFocusIndex
          ? defaultFocusIndex - 1
          : index === defaultFocusIndex
            ? undefined
            : defaultFocusIndex
    },
    handleCopy(status) {
      const data = JSON.parse(JSON.stringify(this.homepage))
      data.homepageId = undefined
      data.homepageStatus = status
      data.currentVersion = ''
      this.submit(data)
    },
    fetchData(version) {
      this.$service.homePageGetDetail({ id: this.id, version }).then(data => {
        this.setHomepage(data)
      })
    }
  },
  created() {
    this.mode = this.initMode || 'create'
    if (this.id) {
      this.fetchData(this.version)
    }
  }
}
</script>
<style lang='stylus' scoped>
.el-form-add .orderableTable >>>.el-input
   width 100%
.tab-group-filter
  display inline-block
  >>> .el-form-item
    margin-bottom 0
  >>> .el-select
  >>> .el-input
    width 200px
</style>
