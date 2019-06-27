<template>
  <PageWrapper>
    <PageContentWrapper v-show="activePage == 'homepage_list'">
      <ContentCard refs="contentCard"  class="content">
        <ContentWrapper
          :filter="filter"
          :filterSchema="filterSchema"
          :pagination="pagination"
          @filter-change="handleFilterChange"
          @filter-reset="handleFilterReset"
        >

          <ButtonGroupForListPage
            pageName="homepage"
            @add="handleCreate"
            @edit="handleEdit"
            @delete="handleDelete"
          ></ButtonGroupForListPage>
          <Table
            :props="table.props"
            :header="table.header"
            :data="table.data"
            :selected="table.selected"
            :selection-type="table.selectionType"
            :select-on-row-click="true"
            @row-selection-add="handleRowSelectionAdd"
            @row-selection-remove="handleRowSelectionRemove"
            @all-row-selection-change="handleAllRowSelectionChange"
          />
          <el-dialog
            title="机型机芯"
            :visible.sync="showChipDialog">
            <div class="tag-list tag-list__chip">
              <span class="tag-item" v-for="(item, index) in chips" :key="index">
                  {{ item }}
              </span>
            </div>
          </el-dialog>
          <el-dialog
            title="关联策略"
            :visible.sync="showPolicyNameDialog">
            <div class="tag-list tag-list__policy-name">
              <span @click="handleShowPolicy(item)" class="tag-item" v-for="(item, index) in policyNames" :key="index">
                  {{ item }}
              </span>
            </div>
          </el-dialog>
        </ContentWrapper>
      </ContentCard>
    </PageContentWrapper>
    <PageContentWrapper v-if="activePage == 'policy'">
      <Policy
        init-mode="read"
        :id="policyId"
        @upsert-end="handleShowPolicyEnd"
        @go-back="handleShowPolicyEnd">
      </Policy>
    </PageContentWrapper>
  </PageWrapper>
</template>

<script>
import _ from 'gateschema'
import { Button } from 'element-ui'
import ButtonGroupForListPage from './../../components/ButtonGroupForListPage'
import { ContentWrapper, Table, ActionList, utils } from 'admin-toolkit'
import PageWrapper from '@/components/PageWrapper'
import PageContentWrapper from '@/components/PageContentWrapper'
import Policy from './PolicyManageInfo'
import BaseList from '@/components/BaseList'

export default {
  extends: BaseList,
  components: {
    ActionList,
    Table,
    ContentWrapper,
    ButtonGroupForListPage,
    Policy,
    PageWrapper,
    PageContentWrapper
  },
  data() {
    let _this = this
    return {
      resourceType: 'homepage',
      activePage: 'homepage_list',
      showChipDialog: false,
      showPolicyNameDialog: false,
      policyId: undefined,
      policyNames: [],
      chips: [],
      filter: {
        sort: undefined,
        order: undefined
      },
      filterSchema: null,
      pagination: {},
      setDialogVisible: false, // 弹框默认关闭
      selected: [],
      buttonList: [],
      table: {
        props: {
          'row-key': 'homepageId'
        },
        header: [
          {
            label: 'ID',
            prop: 'homepageId'
          },
          {
            label: '首页名称',
            prop: 'homepageName',
            minWidth: 150,
            'show-overflow-tooltip': true,
            render: (h, { row }) => {
              return h(Button,
                {
                  props: {
                    type: 'text'
                  },
                  on: {
                    click: (event) => {
                      event.stopPropagation()
                      this.handleRead(row)
                    }
                  }
                }, row.homepageName)
            }
          },
          {
            label: '关联策略',
            prop: 'relationPolicyName',
            align: 'center',
            render: (h, { row }) => {
              const content = row.relationPolicyName
              if (content !== '--') {
                return h('el-button', {
                  props: {
                    type: 'text'
                  },
                  on: {
                    click: (event) => {
                      event.stopPropagation()
                      this.handleShowPolicyNames(content)
                    }
                  }
                }, '查看')
              }
            }
          },
          {
            label: '版本/状态',
            prop: 'homepageStatus',
            align: 'center',
            render: (h, { row }) => {
              const statusText = this.$consts.statusText
              return h('span', `${row.currentVersion}/${statusText[row.homepageStatus]}`)
            }
          },
          {
            label: '待审核副本',
            prop: 'duplicateVersion',
            align: 'center',
            render: (h, { row }) => {
              if (row.duplicateVersion === '') {
                return ''
              } else {
                return h(Button,
                  {
                    props: {
                      type: 'text'
                    },
                    on: {
                      click: (event) => {
                        event.stopPropagation()
                        this.handleRead(row, row.duplicateVersion)
                      }
                    }
                  }, row.duplicateVersion)
              }
            }
          },
          {
            label: '机型机芯',
            prop: 'chipModel',
            align: 'center',
            render: (h, { row }) => {
              const content = row.chipModel
              if (content !== '--') {
                return h('el-button', {
                  props: {
                    type: 'text'
                  },
                  on: {
                    click: (event) => {
                      event.stopPropagation()
                      this.handleShowChips(content)
                    }
                  }
                }, '查看')
              }
            }
          },
          {
            label: '更新时间',
            prop: 'lastUpdateDate',
            width: 140
          },
          {
            label: '更新人',
            prop: 'modiferName'
          },
          {
            label: '操作',
            width: '140',
            fixed: 'right',
            render: (h, { row }) => {
              return h('div', [
                h('el-button', {
                  props: {
                    type: 'text'
                  },
                  on: {
                    click: (event) => {
                      event.stopPropagation()
                      this.handleCopy(row)
                    }
                  }
                }, '复制'),
                (!!row.showContentAuthSettingBtn) && h('el-button', {
                  props: { type: 'text'},
                  on: {
                    click: (event) => {
                      event.stopPropagation()
                      this.handleOpenContentAuthManager(row)
                    }
                  }
                }, '内容权限')
              ])
            }
          }
        ],
        data: [],
        selected: [],
        selectionType: 'multiple'
      }
    }
  },
  computed: {
  },
  methods: {
    handleOpenContentAuthManager(row) {
      this.$refs.contentCard.handleShowContentAuthManager({
        id: row.homepageId,
        type: 'homepage',
        menuElId: 'homepageInfo',
      })
    },
    handleShowChips(chipStr) {
      this.chips = chipStr.split(',')
      this.showChipDialog = true
    },
    handleShowPolicyNames(relationPolicyNames) {
      this.policyNames = relationPolicyNames.split(',')
      this.showPolicyNameDialog = true
    },
    handleShowPolicy(name) {
      const id = name.match(/\((.+)\)/)[1]
      this.policyId = +id
      this.activePage = 'policy'
      this.showPolicyNameDialog = false
    },
    handleShowPolicyEnd() {
      this.showPolicyNameDialog = true
      this.activePage = 'homepage_list'
    },
    // 查询
    handleFilterChange(type, filter) {
      if (filter) { this.filter = filter }
      if (type === 'query') {
        if (this.pagination) {
          this.pagination.currentPage = 1
        }
      }
      this.fetchData()
    },
    // 重置
    handleFilterReset() {
      this.filter = {
        sort: undefined,
        order: undefined
      }
      this.pagination.currentPage = 1
      this.fetchData()
    },
    parseFilter() {
      const { filter, pagination } = this
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
    /**
     * 获取数据
     */
    fetchData() {
      const filter = this.parseFilter()
      this.$service.getHomePageInfoList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    }
    /**
     * 获取menuInfoTree
     */
    // getSysMenuInfo () {
    //   return this.$service.getHomePageInfoMenu().then(data => {
    //     this.buttonList = data
    //   })
    // }
  },
  created() {
    const filterSchema = _.map({
      homepageId: _.o.oneOf([_.value(''), _.number]).$msg('请输入数字').other('form', {
        component: 'InputPositiveInt',
        placeholder: 'ID'
      }),
      homepageName: _.o.string.other('form', {
        component: 'Input',
        placeholder: '名称'
      }),
      homepageStatus: _.o.enum({
        下架: '0',
        上架: '1',
        草稿: '2',
        待审核: '3',
        审核通过: '4',
        审核不通过: '5'
      }).other('form', {
        component: 'Select',
        placeholder: '状态'
      }),
      chipModel: _.o.string.other('form', {
        component: 'Input',
        placeholder: '机型/机芯'
      })
    })
      .other('form', {
        cols: {
          item: 5,
          label: 0,
          wrapper: 20
        },
        layout: 'inline',
        footer: {
          cols: {
            label: 0,
            wrapper: 24
          },
          showSubmit: true,
          submitText: '查询',
          showReset: true,
          resetText: '重置'
        }
      })
    this.filterSchema = filterSchema
    this.fetchData()
    // this.getSysMenuInfo();
  }
}
</script>
<style lang = 'stylus' scoped>
.tag-list
  .tag-item
    padding 5px
    margin 5px
    border 1px solid #ccc
    display inline-block
.tag-list__policy-name
  .tag-item
    cursor pointer
</style>
