<template>
  <PageWrapper>
    <PageContentWrapper v-show="activePage == 'policy'">
      <ContentCard ref="contentCard" class="content">
        <ContentWrapper :pagination="pagination" @filter-change="fetchData">
          <el-form
            inline ref="form"
            v-model="filter"
            @keypress.enter.native.prevent="handleFilterChange"
            @submit.native.prevent="handleFilterChange">
            <el-form-item>
              <InputPositiveInt name="id" autocomplete="on" v-model="filter.id" placeholder="策略组ID" />
            </el-form-item>
            <el-form-item>
              <el-input name="policyGroupName" autocomplete="on" v-model="filter.policyGroupName" placeholder="策略组名称" />
            </el-form-item>
            <el-form-item>
              <el-input name="model" autocomplete="on" v-model="filter.model" placeholder="机型" />
            </el-form-item>
            <el-form-item>
              <el-input name="chip" autocomplete="on" v-model="filter.chip" placeholder="机芯" />
            </el-form-item>
            <el-form-item>
              <InputPositiveInt name="homepageId" autocomplete="on" v-model="filter.homepageId" placeholder="首页方案ID" />
            </el-form-item>
            <el-form-item>
              <el-select v-model="filter.status" placeholder="状态">
                <el-option
                  v-for="item in $consts.statusOptions"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-if="policyGroupCategory === 2">
              <el-input name="mac" autocomplete="on" v-model="filter.mac" placeholder="MAC" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" native-type="submit">查询</el-button>
              <el-button  @click="handleFilterReset">重置</el-button>
            </el-form-item>
          </el-form>
          <ButtonGroupForListPage
            pageName='policyGroup'
            @add="handleCreate"
            @edit="handleEdit"
            @delete="handleDelete">
          </ButtonGroupForListPage>
          <Table
            :props="table.props"
            :header="tableHeader"
            :data="table.data"
            :selected="table.selected"
            :selection-type="table.selectionType"
            :select-on-row-click="true"
            @row-selection-add="handleRowSelectionAdd"
            @row-selection-remove="handleRowSelectionRemove"
            @all-row-selection-change="handleAllRowSelectionChange"
          />
        </ContentWrapper>
      </ContentCard>
    </PageContentWrapper>
    <PageContentWrapper v-if="activePage === 'showHomePageDetail'">
      <HomePageInfo
        :id="homePageId"
        init-mode="read"
        :version="homePageVersion"
        :title-prefix="title"
        @upsert-end="activePage = 'policy'"
        @go-back="activePage = 'policy'"
      />
    </PageContentWrapper>
</PageWrapper>
</template>

<script>
import BaseList from '@/components/BaseList'
import { ContentWrapper, Table } from 'admin-toolkit'
import ButtonGroupForListPage from '@/components/ButtonGroupForListPage'
import InputPositiveInt from '@/components/InputPositiveInt'
import HomePageInfo from '../homePageManage/HomePageInfo'
import PageWrapper from '@/components/PageWrapper'
import PageContentWrapper from '@/components/PageContentWrapper'
export default {
  extends: BaseList,
  components: {
    ContentWrapper,
    Table,
    ButtonGroupForListPage,
    InputPositiveInt,
    PageWrapper,
    PageContentWrapper,
    HomePageInfo
  },

  data () {
    return {
      canAdd: false,
      activePage: 'policy',
      homePageId: undefined,
      homePageVersion: undefined,
      resourceType: 'policyGroup',
      selected: [],
      filter: this.genDefaultFilter(),
      efficientFilter: this.genDefaultFilter(),
      pagination: {
        currentPage: 1
      },
      table: {
        props: {},
        data: [],
        header: [],
        selected: [],
        selectionType: 'multiple'
      }
    }
  },
  computed: {
    title () {
      return this.policyGroupCategory === 2
        ? '定向策略'
        : '保底策略'
    },
    tableHeader () {
      const policyGroupCategory = this.policyGroupCategory
      const header = [
        {
          label: '策略组ID',
          prop: 'id'
        },
        {
          label: '策略组名称',
          prop: 'policyGroupName',
          'show-overflow-tooltip': true,
          render: (createElement, { row }) => {
            return createElement(
              'el-button',
              {
                attrs: {
                  type: 'text'
                },
                on: {
                  click: () => {
                    this.handleRead(row)
                  }
                }
              },
              row.policyGroupName
            )
          }
        },
        {
          label: '关联首页方案',
          width: 150,
          render: (h, { row }) => {
            const normalHomepage = row.normalHomepage || {}
            return h(
              'el-button',
              {
                attrs: {
                  type: 'text'
                },
                on: {
                  click: () => {
                    this.showHomePageDetail(row.normalHomepage)
                  }
                }
              },
              `${normalHomepage.homepageName}(${normalHomepage.homepageId})`
            )
          }
        },
        {
          label: '机型/机芯',
          prop: 'chip',
          render: (h, { row }) => {
            return this.getModelChipInfo(h, row)
          }
        },
        {
          label: '版本/状态',
          prop: 'tabStatus',
          formatter: row => {
            const status = row.status
            const currentVersion = row.currentVersion
            return `${currentVersion}/${this.$consts.statusText[status]}`
          }
        },
        {
          label: '待审核副本',
          prop: 'duplicateVersion',
          render: (createElement, { row }) => {
            return createElement(
              'el-button',
              {
                attrs: {
                  type: 'text'
                },
                on: {
                  click: () => {
                    this.handleRead(row, row.duplicateVersion)
                  }
                }
              },
              row.duplicateVersion
            )
          }
        },
        {
          label: '更新时间',
          prop: 'lastUpdateDate',
          width: 140
        },
        {
          label: '更新人',
          prop: 'modifierName',
          width: 100
        },
        {
          label: '操作',
          width: 80,
          fixed: 'right',
          render: (h, { row }) => {
            if (this.canAdd) {
              return h('div', [
                h('el-button', {
                  props: { type: 'text' },
                  on: {
                    click: (event) => {
                      event.stopPropagation()
                      this.handleCopy(row)
                    }
                  }
                }, '复制')
              ])
            }
          }
        }
      ]

      const mac = {
        label: 'mac',
        width: '130',
        render: (h, { row }) => {
          return this.getMacInfo(h, row)
        }
      }

      if (policyGroupCategory === 2) {
        header.splice(4, 0, mac)
      }

      return header
    }
  },
  props: ['policyGroupCategory'],
  methods: {
    showHomePageDetail (homepage) {
      this.homePageId = homepage.homepageId
      this.homePageVersion = homepage.currentVersion
      this.activePage = 'showHomePageDetail'
    },
    genDefaultFilter () {
      return {
        id: '',
        policyGroupName: '',
        model: '',
        chip: '',
        homepageId: '',
        status: '',
        mac: '',
        policyGroupCategory: this.policyGroupCategory
      }
    },
    fetchData () {
      const filter = this.parseFilter()
      this.$service.policyGroupList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    },
    parseFilter () {
      const pagination = this.pagination
      const filter = JSON.parse(JSON.stringify(this.efficientFilter))
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
    handleFilterChange () {
      this.pagination.currentPage = 1
      this.efficientFilter = JSON.parse(JSON.stringify(this.filter))
      this.fetchData()
    },
    handleFilterReset () {
      this.filter = this.genDefaultFilter()
      this.efficientFilter = this.genDefaultFilter()
      this.pagination.currentPage = 1
      this.fetchData()
    },
    getModelChipInfo (h, row) {
      const rlsModelChipList = row.rlsModelChipList || []
      const count = rlsModelChipList.length
      let info
      if (count > 3) {
        info = `${count}个`
      } else {
        info = rlsModelChipList.map(item => h('div', `${item.model}_${item.chip}`))
      }
      return h('div', null, info)
    },
    getMacInfo (h, row) {
      const mac = row.mac.split(',')
      const count = mac.length
      let info
      if (count > 3) {
        info = `${count}个`
      } else {
        info = mac.map(item => h('div', item))
      }
      return h('div', null, info)
    }
  },
  created () {
    this.fetchData()
    this.$service.getButtonGroupForPageList('policyGroup').then(data => {
      this.canAdd = data.some(item => item.runComm === 'add')
    })
  }
}
</script>

<style lang = 'stylus' scoped>
.form >>>.el-form-item__content
  width: 83.33333%
  .el-select
    width: 100%
.form >>>.el-form-item
  margin-right: 0px
.el-form-item-submit
  width: 200px
</style>
