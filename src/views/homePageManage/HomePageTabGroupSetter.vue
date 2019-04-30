<template>
  <PageWrapper>
    <PageContentWrapper v-show="activePage === 'tab_group_setter'">
      <ContentCard 
        class="cc-homepage-tab-group-setter"
        :title="title" 
        @go-back="$emit('go-back')">
          <div v-show="!readonly" class="actions" >
            <TabSelector
              ref="tabSelector"
              title="添加定向版面"
              @select-start="handleSelectTabStart"
              @select-end="handleSelectTabEnd"
            />
            <el-button type="primary" @click="handleSave">
              保存
            </el-button>
          </div>
          <OrderableTable 
            ref="tabTable"
            v-model="tabList" 
            :header="tabTableHeader"
            :hide-action="true"
          />
          
        <cc-crowd-selector
            v-if="showCrowdSelector"
            @select-cancel="handleSelectCrowdCancel"
            @select-end="handleSelectCrowdEnd"
        />

      </ContentCard>
    </PageContentWrapper> 

    <PageContentWrapper v-if="activePage === 'tab'">
      <TabInfo
        :title-prefix="title"
        :id="embedTab.id" 
        :version="embedTab.version"
        :init-mode="embedTab.mode" 
        @upsert-end="handleTabEmbedBack"
        @go-back="activePage = 'tab_group_setter'" />
    </PageContentWrapper>
  </PageWrapper>
</template>

<script>
import PageWrapper from '@/components/PageWrapper'
import PageContentWrapper from '@/components/PageContentWrapper'
import TabSelector from '@/components/selectors/TabSelector.vue'
import OrderableTable from '@/components/OrderableTable.vue'
import TabInfo from '@/views/tabInfo/TabInfo'
import titleMixin from '@/mixins/title'
export default {
  mixins: [titleMixin],
  components: {
    PageWrapper,
    PageContentWrapper,
    TabSelector,
    OrderableTable,
    TabInfo
  },
  data() {
    return {
      activePage: 'tab_group_setter',
      resourceName: '版面管理',
      showCrowdSelector: false,
      tabList: [],
      embedTab: undefined,
      activeTabIndex: undefined,
      tabTableHeader: [
        {
          label: '版面ID',
          prop: 'tabId',
          width: 120
        },
        {
          label: '版面名称',
          render: (h, {$index, row}) => {
            return h('el-button', {
              props: {
                type: 'text'
              },
              on: {
                click: () => {
                  this.handlePreviewTab(row, $index)
                }
              }
            }, row.tabName)
          }
        },
        {
          label: 'TAB标题(中文)',
          prop: 'tabCnTitle',
        },
        {
          label: 'TAB标题(英文)',
          prop: 'tabEnTitle',
        },
        {
          label: '默认版面',
          align: 'center',
          width: 100,
          render: (h, { $index, row }) => {
            if (this.readonly) {
              return row.isDefaultTab ? '是' : '否'
            }
            return h('el-radio', {
              attrs: {
                title: row.dmpInfo ? '若要设置该版面为默认版面，请先取消版面定向' : ''
              },
              props: {
                label: !!row.isDefaultTab,
                disabled: !!row.dmpInfo,
                value: true
              },
              on: {
                input: (val) => {
                  this.handleSetDefaultTab($index)
                }
              }
            }, '')
          }
        },
        {
          label: '人群',
          render: (h, { $index, row }) => {
            if (this.readonly) {
              return row.dmpInfo && dmpInfo.dmpCrowdName
            }
            if (row.dmpInfo) {
              return h('el-button', {
                props: {
                  type: 'text'
                },
                on: {
                  click: (val) => {
                    this.handleSelectCrowdStart($index)
                  }
                }
              }, row.dmpInfo.dmpCrowdName)
            }
          }
        },
        {
          label: '操作',
          width: 180,
          render: (h, {$index, row}) => {
            const btns = [
              h('el-button', {
                on: {
                  click: () => {
                    this.handleRemoveTab($index)
                  }
                }
              }, '删除')
            ]
            if (row.dmpInfo) {
              btns.unshift(h('el-button', {
                on: {
                  click: () => {
                    this.handleRemoveCrowd(scope.$index)
                  }
                }
              }, '取消定向'))
            } else {
              btns.unshift(h('el-button', {
                props: {
                  disabled: row.isDefaultTab
                },
                on: {
                  click: () => {
                    this.handleSelectCrowdStart($index)
                  }
                }
              }, '选择人群'))
            }
            return btns
          }
        }
      ]
    }
  },
  props: {
    tabs: {
      type: Array,
      default() {
        return []
      }
    },
    readonly: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  methods: {
    handleSave() {
      if (this.tabList.length > 0) {
        this.$emit('set-end', this.tabList)
      } else {
        this.$message({
          type: 'error',
          message: '请至少选择一个版面'
        })
      }
    },
    handlePreviewTab(row, index) {
      this.activePage = 'tab'
      this.embedTab = {
        index: index,
        id: row.tabId,
        version: row.currentVersion,
        mode: 'read'
      }
    },
    handleTabEmbedBack() {
      const { index, id } = this.embedTab
      const tab = this.tabList[index]
      this.$service.tabGet({
        tabId: id
      }).then(function(result) {
        Object.assign(tab, result)
      })
      this.embedTab = undefined
    },
    handleSetDefaultTab(index) {
      this.tabList.forEach((item, idx) => {
        if (idx === index) {
          this.$set(item, 'isDefaultTab', true)
        } else {
          this.$set(item, 'isDefaultTab', false)
        }
      })
    },
    handleRemoveTab(index) {
      this.tabList.splice(index, 1)
    },
    handleSelectTabStart() {
        this.$nextTick(function() {
            const tabSelector = this.$refs.tabSelector
            this.tabs.forEach(function(item) {
              tabSelector.handleTableRowSelectionAdd(item)
            })
        }.bind(this))
    },
    handleSelectTabEnd(data) {
      this.$refs.tabTable.handleAppendData(data, 'tabId')
    },
    handleSelectCrowdStart(index) {
      this.showCrowdSelector = true
      this.activeTabIndex = index
    },
    handleSelectCrowdCancel() {
      this.showCrowdSelector = false
    },
    handleSelectCrowdEnd(policy, crowd) {
      const tabList = this.tabList
      const index = tabList.findIndex(function(item) {
        const dmpInfo = item.data.dmpInfo
        if (dmpInfo && dmpInfo.dmpPolicyId === policy.value && dmpInfo.dmpCrowdId === crowd.value) {
          return true
        }
      })
      if (index === -1) {
        this.showCrowdSelector = false
        const tab = this.tabList[this.activeTabIndex].data
        this.$set(tab, 'dmpInfo', {
          dmpPolicyId: policy.value,
          dmpCrowdId: crowd.value,
          dmpPolicyName: policy.label,
          dmpCrowdName: crowd.label
        })
      } else {
        this.$message({
          type: 'error',
          message: '第' + (index + 1) +  '个版面已选择该人群'
        })
      }
    },
    handleRemoveCrowd(index) {
      const tabList = this.tabList
      tabList[index].dmpInfo = undefined
      //this.tabList = tabList.slice()
    }
  },
  created() {
    this.tabList = this.tabs.slice()
  }
}
</script>
<style>
</style>