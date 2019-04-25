
<template>
  <ContentCard class="content">
    <ContentWrapper
      :filter="filter"
      :filterSchema="filterSchema"
      :pagination="pagination"
      @filter-change="handleFilterChange"
      @filter-reset="handleFilterReset"
    >
      <Table 
        :props="table.props"
        :header="table.header"
        :data="table.data"
        :selected="table.selected"
        :selection-type="table.selectionType"
        @row-click="rowClick"
        @row-selection-change="rowClick"
      />
    </ContentWrapper>
  </ContentCard>
</template>
<script>
import _ from 'gateschema'
import { ContentWrapper, Table, utils ,ContentEllipsis} from 'admin-toolkit'
export default {
  components: {
    Table,
    ContentWrapper,
    ContentEllipsis
  },
  props: {
   homepageModel: String,
   homepageResource: String,
   homepageStatusArray: String
  },
  data() {
    return {
      filter: {
        sort: undefined,
        order: undefined
      },
      filterSchema: null,
      pagination: {
        pageSize: 5
      },
      selected: [],
      table: {
        props: {},
        header: [
          {
            label: 'ID',
            prop: 'homepageId',
            width: '100'
          },
          {
            label: '名称',
            width: '130',
            prop: 'homepageName',
            sortable: true
          },
          {
            label: '关联版面名称',
            prop: 'relationTabName',
            render: (h, {row}) => {
              let content = row.relationTabName
              if(content.length>40)
              content = content.substring(0,40)+'...'
              return h('div',{
                attrs:{
                  title: row.relationTabName
                }
              },content)
            }
          },
          {
            label: '首页模式',
            prop: 'homepageModel',
            render: (h, {row}) => {
              if(row.homepageModel === 'child') {
                return '儿童模式'
              } else {
               return '标准模式'
              }
            }
          },
          {
            label: '更新时间',
            prop: 'lastUpdateDate',
            width: 150,
            sortable: true
          }
        ],
        data: [],
        selected: [],
        selectionType: 'single'
      }
    }
  },
  watch: {
    homepageModel: function(){
      this.fetchData()
    }
  },
  methods: {
    rowClick(params) {
        this.$emit("row-click",params)
    },
    handleFilterChange(type) {
      if (type === 'query') {
        if (this.pagination) {
          this.pagination.currentPage = 1
        }
      }
      this.fetchData()
    },
    handleFilterReset() {
      this.filter = {
        sort: undefined,
        order: undefined
      }
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
      filter.homepageModel = this.homepageModel
      filter.homepageResource = this.homepageResource
      filter.homepageStatusArray = this.homepageStatusArray
      this.$service.getHomePageModelPageList(filter).then(data => {
        data.rows.splice(5)
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    }
  },
  created() {
    let filterSchema = _.map({
      homepageId: _.o.string.other('form', {
        component: 'Input',
        placeholder: 'ID',
        cols: {
          item: 3,
          label: 0
        }
      }),
      homepageName: _.o.string.other('form', {
        component: 'Input',
        placeholder: '名称',
        cols: {
          item: 3,
          label: 0
        }
      })
    }).other('form', {
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
  }
}
</script>

