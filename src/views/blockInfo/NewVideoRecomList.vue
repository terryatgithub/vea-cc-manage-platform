<template>
  <ContentCard ref="contentCard" class="content">
    <ContentWrapper
      :filter="filter"
      @filter-change="fetchData"
      :pagination="pagination"
    >
        <el-form :inline="true"
        ref="form"
        class="form"
        v-form-autocomplete
        v-model="filter"
            @submit.native.prevent="handleFilterChange"
            @reset.native.prevent="handleFilterReset">
            <el-form-item>
                <el-input clearable v-model="filter.id" placeholder="影片流ID" title="id"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input clearable v-model="filter.name" placeholder="影片流名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-select  v-model="filter.source" placeholder="内容源" clearable>
                    <el-option
                    v-for="(item , index) in sourceOption"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select  v-model="filter.scene" multiple placeholder="适用场景" clearable>
                    <el-option
                    v-for="item in sceneOption"
                    :key="item.dictId"
                    :label="item.dictCnName"
                    :value="item.dictId"
                    />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select  v-model="filter.openStatus" placeholder="可用状态" clearable>
                    <el-option value="1" label="开启">开启</el-option>
                    <el-option value="0" label="关闭">关闭</el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="el-form-item-submit">
                <el-button type="primary" native-type="submit">查询</el-button>
                <el-button native-type="reset">重置</el-button>
            </el-form-item>
        </el-form>
      <Table
        :props="table.props"
        :header="table.header"
        :data="table.data"
      />
       <!-- <Table
        :props="table.props"
        :header="table.header"
        :data="table.data"
        :selected="table.selected"
        :selection-type="table.selectionType"
        :select-on-row-click="true"
        @row-selection-add="handleRowSelectionAdd"
        @row-selection-remove="handleRowSelectionRemove"
        @all-row-selection-change="handleAllRowSelectionChange"
      /> -->
    </ContentWrapper>

  </ContentCard>
</template>
<script>
// import _ from 'gateschema'
import BaseList from '@/components/BaseList'
import { ContentWrapper, Table } from 'admin-toolkit'
// import ButtonGroupForListPage from './../../components/ButtonGroupForListPage'
// const typeOption = {
//   normal: '普通', child: '少儿', movie: '电影', series: '电视剧'
// }

export default {
  extends: BaseList,
  components: {
    Table,
    ContentWrapper
    // ButtonGroupForListPage
  },
  data () {
    return {
      notContainBtns: ['audit', 'batchAudit'],
      resourceType: 'broadcastBlock',
      filter: this.genDefaultFilter(),
      filterSchema: null,
      sourceOption: this.$consts.sourceOptionsWithNone,
      sceneOption: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        scene: ''
      },
      selected: [],
      table: {
        props: {},
        header: [
          {
            label: '推荐流ID',
            prop: 'id',
            // sortable: true,
            width: '120px',
            fixed: 'left'
          },
          {
            label: '推荐流名称',
            prop: 'name',
            fixed: 'left',
            render: (h, { row }) => {
              return h(
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
                row.name
              )
            }
          },
          {
            label: '内容源',
            prop: 'source',
            render: (h, { row }) => {
              return this.$consts.sourceTextWithNone[row.source]
            }
          },
          {
            label: '适用场景',
            prop: 'source',
            render: (h, { row }) => {
              return this.sceneOption[row.source]
            }
          },
          {
            label: '推荐流业务来源',
            prop: 'source',
            render: (h, { row }) => {
              return this.$consts.sourceTextWithNone[row.source]
            }
          },
          {
            label: '可用状态',
            prop: 'openStatus',
            render: (h, { row }) => {
              return ['关闭', '开启'][row.openStatus]
            }
          },
          {
            label: '备注',
            prop: 'note'
          },
          {
            label: '操作',
            fixed: 'right',
            render: (h, { row }) => {
              return h('div')
            }
          }
        ],
        data: [],
        selected: [],
        selectionType: 'multiple'
      }
    }
  },
  methods: {
    // 开启关闭按钮
    handleOpenStatus (row) {},
    handleOpenContentAuthManager (row) {
      this.$refs.contentCard.handleShowContentAuthManager({
        id: row.id,
        type: 'block',
        menuElId: 'broadcastBlock'
      })
    },
    genDefaultFilter () {
      return {
        page: 1,
        rows: 10,
        scene: ''
      }
    },
    handleFilterReset () {
      this.filter = this.genDefaultFilter()
      this.efficientFilter = this.genDefaultFilter()
      this.pagination.currentPage = 1
      this.fetchData()
    },
    handleFilterChange () {
      this.pagination.currentPage = 1
      this.efficientFilter = JSON.parse(JSON.stringify(this.filter))
      this.fetchData()
    },
    parseFilter () {
      const { filter, pagination } = this
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
    fetchData () {
      const filter = this.parseFilter()
      console.log(filter, '----')
      this.$service.getMediaAutomationList(filter).then(data => {
        this.pagination.total = data.total
        data.rows = data.rows.map(item => {
          item.picSize = item.picSize.join(',')
          return item
        })
        this.table.data = data.rows
      })
    },
    keyAndValueExchage (obj) {
      return Object.keys(obj).reduce((result, key) => {
        result[obj[key]] = key
        return result
      }, {})
    },
    fetchMediaSence () {
      this.$service.getMediaSence().then(res => {
        this.sceneOption = res
      })
    }
  },
  created () {
    this.fetchMediaSence()
    // let filterSchema = _.map({
    //   id: _.o.oneOf([_.number, _.value('')]).$msg('请输入数字').other('form', {
    //     component: 'InputPositiveInt',
    //     placeholder: '推荐流ID'
    //   }),
    //   name: _.o.string.other('form', {
    //     component: 'Input',
    //     placeholder: '推荐流名称'
    //   }),
    //   source: _.o.enum(this.$consts.sourceOptionsWithNoneEnums).other('form', {
    //     component: 'Select',
    //     placeholder: '内容源',
    //     clearable: true
    //   }),
    //   since: _.o.enumList(this.keyAndValueExchage(typeOption)).other('form', {
    //     component: 'Select',
    //     multiple: true,
    //     placeholder: '适用场景',
    //     clearable: true
    //   }),
    //   openStatus: _.o.enum({ '开启': 1, '关闭': 0 }).other('form', {
    //     component: 'Select',
    //     placeholder: '可用状态',
    //     clearable: true
    //   })
    // }).other('form', {
    //   layout: 'inline',
    //   cols: {
    //     item: 6,
    //     label: 0,
    //     wrapper: 20
    //   },
    //   footer: {
    //     cols: {
    //       label: 0,
    //       wrapper: 24
    //     },
    //     showSubmit: true,
    //     submitText: '查询',
    //     showReset: true,
    //     resetText: '重置'
    //   }
    // })
    // this.filterSchema = filterSchema
    this.fetchData()
  }
}
</script>
<style lang = 'stylus' scoped>
.pics img
  max-width 350px
  max-height 500px
.content
  >>> table .imgs
    cursor pointer
.btns
  margin-bottom 10px
.checkItemStyle
  margin 10px
</style>
