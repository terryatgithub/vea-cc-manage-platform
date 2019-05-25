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
      />
    </ContentWrapper>
  </ContentCard>
</template>
<script>
import _ from 'gateschema'
import { ContentWrapper, Table, utils } from 'admin-toolkit'
export default {
  components: {
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
            label: 'ID',
            prop: 'id',
            width: '70'
          },
          {
            label: '名称',
            width: '150',
            prop: 'thirdVideoTitle'
          },
          {
            label: '图片',
            width: '150',
            prop: 'imgUrl',
            render: (createElement, { row }) => {
              return createElement('img', {
                attrs: {
                  src: row.imgUrl,
                  width: '100px',
                  height: '100px',
                  class: 'imgs'
                }
                // ,
                // on: {
                //   click: () => {
                //     this.reviewPic(row)
                //   }
                // }
              })
            }
          },
          {
            label: '引用状态',
            prop: 'rlsInfo',
            render: (createElement, { row }) => {
              return row.rlsInfo.reduce((result, element) => {
                let e = createElement(
                  'el-button',
                  {
                    attrs: {
                      type: 'text'
                    },
                    on: {
                      click: () => {
                        this.handleRead(element)
                      }
                    }
                  },
                  element
                )
               result.push(e)
               return result
              }, [])
            }
          }
        ],
        data: [],
        selected: [],
        selectionType: 'none'
      }
    }
  },
  methods: {
    goBack(){
      this.isShowList = true
    },
    handleRead(itemTitle) {
      let start = itemTitle.indexOf('[') + 1;
      let end = itemTitle.indexOf(']');
      let paramPannel = itemTitle.slice(start, end).split(',');
      let id = paramPannel[0];
      let version = paramPannel[1];
      this.$emit('read', id, version)
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
        filter.currentPage = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
    /**
     * 获取数据
     */
    fetchData() {
      const filter = this.parseFilter()
      this.$service.getMoviePageList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    }
  },
  created() {
    let filterSchema = _.map({
      keyword: _.o.string.other('form', {
        component: 'Input',
        placeholder: '请输入影片ID/名称'
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
<style lang = 'stylus' scoped>
.pics img
  max-width: 350px
  max-height: 500px
.content
  >>> table .imgs
    cursor: pointer
.btns
  margin-bottom: 10px
.checkItemStyle
  margin: 10px

</style>
