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
        @row-selection-change="handleRowSelectionChange"
      />
    </ContentWrapper>
  </ContentCard>
</template>

<script>
import _ from 'gateschema'
import ButtonList from './../../components/ButtonLIst'
import { ContentWrapper, Table, ActionList, utils } from 'admin-toolkit'
export default {
  components: {
    ActionList,
    Table,
    ContentWrapper
  },
  props: {
    singleId: null,
  },
  data() {
    return {
        urlIsTrailers: {
            腾讯: 1,
            正片: 0
        },
      filter: {
        sort: undefined,
        order: undefined
      },
      filterSchema: null,
      pagination: {},
      selected: undefined,
      table: {
        props: {},
        header: [
          {
            label: '集数名',
            prop: 'urlCollection',
          },
          {
            label: '单集ID',
            prop: 'coocaaMId'
          },
          {
            label: '单集名称',
            prop: 'urlTitle'
          },
          {
            label: '图片',
            prop: 'thumb',
            width: '130',
            render: (createElement, { row }) => {
              return createElement('img', {
                attrs: {
                  src: row.thumb,
                  width: '50px',
                  height: '50px',
                  class: 'imgs'
                }
              })
            }
          },
          {
            label: '素材类型',
            prop: 'urlType',
            formatter: function (column, row) {
                    return column === 1 ? '预告' : '正片'
                }
          }
        ],
        data: [],
        selected: [],
        selectionType: 'single'
      }
    }
  },
  watch: {
      'singleId': function(newValue,oldValue) {
          this.singleId = newValue
          this.fetchData()
      },
  },
  methods: {
    /**获取数据 */
    fetchData() {
       const filter = this.parseFilter();
       filter.id = this.singleId
      this.$service.getSegmentList(filter).then(data => {
          console.log(data)
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    },
    handleRowSelectionAdd(targetItem) {
      this.selected.push(targetItem.commonOnclickId)
      this.updateTableSelected()
    },
    handleRowSelectionRemove(targetItem) {
      this.selected = this.selected.filter(item => {
        return item !== targetItem.commonOnclickId
      })
      this.updateTableSelected()
    },
    handleRowSelectionChange(value, index) {
      this.table.selected = index
        this.$emit('single',value)
    },
    handleAllRowSelectionRemove() {
      this.selected = []
      this.table.selected = []
    },
    updateTableSelected() {
      const table = this.table
      const newSelectedIndex = this.selected
      table.selected = table.data.reduce((result, item, index) => {
        if (newSelectedIndex.indexOf(item.commonOnclickId) > -1) {
          result.push(index)
        }
        return result
      }, [])
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
      this.pagination.currentPage = 1
      this.fetchData()
    },
    parseFilter() {
      const { filter, pagination } = this
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
        filter.callbackparam = 'result'
        filter.source = 'tencent'
      }
      return filter
      console.log(filter)
    }
  },
  created() {
    let filterSchema = _.map({
       urlIsTrailer: _.o.enum(this.urlIsTrailers).other("form", {
        component: "Select",
        placeholder: "素材类型",
        cols: {
          item: 3,
          label: 0
        }
      }),
      urlTitle: _.o.string.other('form', {
        component: 'Input',
        placeholder: '单集名称',
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
<style lang = 'stylus' scoped>
.btns {
  margin-bottom: 10px;
}
</style>



