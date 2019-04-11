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
        @row-selection-add="handleRowSelectionAdd"
        @row-selection-remove="handleRowSelectionRemove"
        @all-row-selection-change="handleAllRowSelectionChange"
      />
    </ContentWrapper>
  </ContentCard>
</template>

<script>
import { ContentWrapper, Table, utils } from 'admin-toolkit'
import { Input } from 'element-ui'
import _ from 'gateschema'

export default {
  components: {
    ContentWrapper,
    Table
  },
  
  data() {
    return {
      filterSchema: null,
      globalTypes: {}, //角标分类
      attributeTypes: {}, //角标类别
      filter: {
        sort: undefined,
        order: undefined
      },
      pagination: {
        currentPage: 1,
        pageSize: 15
      },
      selected: [],
      table: {
        props: {},
        header: [
       {
            label: 'ID',
            prop: 'cornerIconId'
          },
          {
            label: '角标名称',
            prop: 'cornerIconName',
          },
          {
            label: '图片',
            prop: 'imgUrl',
               render: (createElement, { row }) => {
              return createElement('img', {
                attrs: {
                  src: row.imgUrl,
                  width: '50px',
                  height: '50px',
                  class: 'imgs'
                }
              })
            }
          },
          {
            label: '优先级',
            prop: 'cornerPriority',
            width: 100,
            sortable: true,
              render: (h, { row }) => {
              return h('el-input',
                {
                  props: {
                    value: row.cornerPriority,
                    type: 'text'
                  },
                  on: {
                    input: (value) => {
                      row.cornerPriority = value
                    },
                    blur: () => {
                      this.$service.changePriority({ id: row.cornerIconId })
                    }
                  }
                })
            }
          },
        ],
        data: [],
        selected: [],
        selectionType: 'multiple'
      }
    }
  },

  methods: {
     //初始化表格
    fetchData() {
      const filter = this.parseFilter()
      this.$service.getGlobalMgrList(filter).then(data => {
        console.log(data)
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    },
    parseFilter() {
      const { filter, pagination } = this
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
        filter.idPrefix = '10' //10:酷开数据;11:其他地方。默认酷开
      }
      return filter
    },
    //角标分类
    getCornerTypes() {
      return this.$service.getCornerTypes().then(data => {
        data.forEach(element => {
          this.globalTypes[element.typeName] = element.typeId
        })
      })
    },
    //角标类别
    getIconAttributes() {
      return this.$service.getIconAttributes().then(data => {
        data.attributes.forEach(element => {
          this.attributeTypes[element.attributeName] = element.attributeCode
        })
        console.log(this.attributeTypes)
      })
    },
    // 表单重设
    handleFilterReset() {
      this.filter = {
        sort: undefined,
        order: undefined
      }
      this.fetchData()
    },
    handleFilterChange(type) {
      if (type === 'query') {
        if (this.pagination) {
          this.pagination.currentPage = 1
        }
      }
      this.fetchData()
    },
    handleRowSelectionAdd(targetItem) {
      this.selected.push(targetItem.cornerIconId)
      this.updateTableSelected()
    },
    handleRowSelectionRemove(targetItem) {
      this.selected = this.selected.filter(item => {
        return item !== targetItem.cornerIconId
      })
      this.updateTableSelected()
    },
    handleAllRowSelectionChange(value) {
      if (value) {
        this.table.data.forEach(this.handleRowSelectionAdd)
      } else {
        this.selected = []
        this.table.selected = []
      }
    },
    handleAllRowSelectionRemove() {
      this.selected = []
      this.table.selected = []
    },
    updateTableSelected() {
      const table = this.table
      const newSelectedIndex = this.selected
      table.selected = table.data.reduce((result, item, index) => {
        if (newSelectedIndex.indexOf(item.cornerIconId) > -1) {
          result.push(index)
        }
        return result
      }, [])
    },
  },
 created() {
    let filterSchema = _.map({
      'cornerIconType.typeId': _.o.enum(this.globalTypes).other('form', {
        component: 'Select',
        placeholder: '角标分类',
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
    this.fetchData()
    this.getCornerTypes().then(() => {
      this.getIconAttributes().then(() => {
        this.filterSchema = filterSchema
      })
    }) //获取角标分类
    //角标类别
  }
}
</script>

<style lang="stylus" scoped>
.btns {
  margin-bottom: 10px;
}
</style>