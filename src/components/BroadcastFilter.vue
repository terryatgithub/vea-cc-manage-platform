/**** 
轮播筛选器
*/
<template>
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
      @row-selection-add="handleRowSelectionAdd"
      @row-selection-remove="handleRowSelectionRemove"
      @all-row-selection-change="handleAllRowSelectionChange"
    />
  </ContentWrapper>
</template>

<script>
import _ from 'gateschema'
import { ContentWrapper, Table } from 'admin-toolkit'
export default {
  components: {
    ContentWrapper,
    Table
  },
  props: ['multi'],
  data() {
    return {
      filter: {
        resType: 'operation',
        dataType: 'rotate',
        levelType: 'rotateSta',
        callback: 'result',
        page: 1,
        rows: 10
      },
      filterSchema: null,
      pagination: {
        pageSize: 5
      },
      selected: [],
      selectedRows: {},
      table: {
        props: {},
        header: [
          {
            label: '轮播入口ID',
            prop: 'id',
            sortable: true
          },
          {
            label: '轮播入口名称',
            prop: 'title'
          }
        ],
        data: [
        //  {id: 1, title: 'test'}
        ],
        selected: [],
        selectionType: 'single'
      }
    }
  },
 watch: {
    selected: function(value) {
      this.$emit('input', this.selected)
    }
  },
  methods: {
    rowClick(params) {
       if (this.multi === 'single') {
         this.$emit("row-click",params)
       }
    },
    fetchData: function() {
      this.handleAllRowSelectionRemove()
      const filter = this.parseFilter()
      this.$service.getMediaVideoInfos(filter).then(result => {
        this.pagination.total = result.total
        this.table.data = result.rows
      })
    },
    parseFilter() {
      const { filter, pagination } = this
      filter.code = filter.id
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
    handleFilterReset() {
      this.filter = {
        resType: 'operation',
        dataType: 'rotate',
        levelType: 'rotateSta',
        callback: 'result',
        page: 1,
        rows: 10
      },
       this.pagination.currentPage = 1
        this.fetchData()
    },
   handleFilterChange(type) {
      if(this.$validateId(this.filter.id)) {
        if (type === 'query') {
          if (this.pagination) {
            this.pagination.currentPage = 1
          }
        }
        this.fetchData() 
      }
    },

      handleRowSelectionAdd(targetItem) {
      this.selected.push(targetItem);
      this.updateTableSelected();
    },
    handleRowSelectionRemove(targetItem) {
      this.selected = this.selected.filter(item => {
        return item !== targetItem;
      });
      this.updateTableSelected();
    },
    handleAllRowSelectionChange(value) {
      if (value) {
        this.table.data.forEach(this.handleRowSelectionAdd);
      } else {
        this.selected = [];
        this.table.selected = [];
      }
    },
    handleAllRowSelectionRemove() {
      this.selected = [];
      this.table.selected = [];
    },
    updateTableSelected() {
      const table = this.table;
      const newSelectedIndex = this.selected.map((e) => {
        return e.id
      });
      table.selected = table.data.reduce((result, item, index) => {
        if (newSelectedIndex.indexOf(item.id) > -1) {
          result.push(index);
        }
        return result;
      }, []);
    }
  },
  created() {
    this.table.selectionType = this.multi
    let filterSchema = _.map({
      id: _.o.number.other('form', {
        component: 'Input',
        placeholder: 'ID',
        label: '轮播入口ID'
      }),
      title: _.o.string.other('form', {
        component: 'Input',
        placeholder: '轮播入口名称',
        label: '轮播入口名称'
      })
    }).other('form', {
       cols: {
        item: 6,
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
  }
}
</script>

<style lang='stylus' scoped>
</style>