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
      />
    </ContentWrapper>
  </ContentCard>
</template>

<script>
import _ from 'gateschema'
import { Button, Tooltip } from 'element-ui'
import ButtonList from './../../components/ButtonLIst'
import { ContentWrapper, Table, ActionList, utils } from 'admin-toolkit'
export default {
  components: {
    ActionList,
    Table,
    ContentWrapper
  },
  data() {
    return {
      filter: {
        sort: undefined,
        order: undefined
      },
      filterSchema: null,
      pagination: {},
      selected: [],
      table: {
        props: {},
      header: [
          {
            label: '自增ID',
            prop: 'id',
            width: '70',
            sortable: true
          },
          {
            label: '操作者ID',
            prop: 'userId',
            width: '60',
            sortable: true
          },
          {
            label: '操作名称',
            prop: 'userName'
          },
          {
            label: '菜单名称',
            prop: 'menuName'
          },
          {
            label: '菜单Elid',
            prop: 'menuElid'
          },
          {
            label: '执行的方法',
            prop: 'execMethod'
          },
          {
            label: '操作的数据',
            prop: 'opData',
            render(h, { row }) {
              return h(
                Tooltip,
                {
                  props: {
                    content: row.opData,
                    placement: 'top'
                  }
                },
                [h('div', { class: 'operatiton-data' }, [row.opData])]
              )
            }
          },
          {
            label: '操作耗时',
            prop: 'elapsedTime',
            fit: true,
            sortable: true
          },
          {
            label: '操作时间',
            prop: 'createTime',
            fit: true
          },
          {
            label: '操作',
            width: '90',
            fixed: 'right',
            render: (h, { row }) => {
              return h(
                Button,
                {
                  props: {
                    type: 'success',
                    icon: 'el-icon-plus'
                  },
                  on: {
                    click: this.handleCopy.bind(this, row)
                  }
                },
                ['复制']
              )
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
    // 老项目的方法
    handleCopy: function (row) {
      var opData = row.opData
      var textArea = document.createElement("textarea");
      textArea.style.position = 'fixed';
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.width = '2em';
      textArea.style.height = '2em';
      textArea.style.padding = '0';
      textArea.style.border = 'none';
      textArea.style.outline = 'none';
      textArea.style.boxShadow = 'none';
      textArea.style.background = 'transparent';
      textArea.value = opData;
      document.body.appendChild(textArea);
      textArea.select();
      try {
          var successful = document.execCommand('copy');
          if (successful){
              this.$message({
                  showClose: true,
                  message: '复制成功',
                  type: 'success'
              })
          }
      } catch (err) {
          this.$message({
              showClose: true,
              message: '复制失败',
              type: 'warning'
          })
      }
      document.body.removeChild(textArea);
    },
    handleFilterChange(type, filter) {
      this.filter = filter
      if(this.$validateId(this.filter.id)) {
        if (type === 'query') {
          if (this.pagination) {
            this.pagination.currentPage = 1
          }
        }
        this.fetchData() 
      }
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
      }
      return filter
      console.log(filter)
    },
    /**
     * 获取数据
     */
    fetchData() {
      const filter = this.parseFilter()
      this.$service.sysLogOpPageList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    }
  },
  created() {
    let filterSchema = _.map({
      id: _.o.string.other('form', {
        component: 'Input',
        placeholder: 'ID  '
      }),
      userId: _.o.string.other('form', {
        component: 'Input',
        placeholder: '操作者ID  '
      }),
      userName: _.o.string.other('form', {
        component: 'Input',
        placeholder: '操作者名称'
      }),
      menuName: _.o.string.other('form', {
        component: 'Input',
        placeholder: '菜单名称'
      }),
       menuElid: _.o.string.other('form', {
        component: 'Input',
        placeholder: '菜单Elid  '
      }),
      execMethod: _.o.string.other('form', {
        component: 'Input',
        placeholder: '执行的方法  '
      }),
      elapsedTime: _.o.string.other('form', {
        component: 'Input',
        placeholder: '操作耗时'
      }),
      createTime: _.o.string.other('form', {
        component: 'Input',
        placeholder: '操作耗时'
      }),
       opData: _.o.string.other('form', {
        component: 'Input',
        type: 'textarea',
        placeholder: '操作的数据'
      })
    }).other('form', {
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
  }
}
</script>
<style lang='stylus' scoped>
.content >>> .operatiton-data
  height: 50px;
</style>



