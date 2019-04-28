<template>
  <ContentCard class="content">
    <ContentWrapper
      :filter="filter"
      :filterSchema="filterSchema"
      :pagination="pagination"
      @filter-change="handleFilterChange"
      @filter-reset="handleFilterReset"
    >
      <CardList
        :data="table.data"
        :selected="table.selected"
        :selection-type="table.selectionType"
        @row-selection-change="handleRowSelectionChange"
      >
        <div class="box-list" slot="row" slot-scope="{row: item}">
          <p class="list-p">
            <img class="list-img" :src="item.imgUrl" alt>
          </p>
          <p class="list-title">{{item.cornerIconName}}</p>
          <p style="margin:0">
            <span v-if="item.cornerStatus==1">审核通过</span>
            <span v-else>待审核</span>
            <!-- <span>{{item.pictureResolution}}</span> -->
          </p>
        </div>
      </CardList>
    </ContentWrapper>
  </ContentCard>
</template>

<script>
import _ from 'gateschema'
import { ContentWrapper, Table, CardList, utils } from 'admin-toolkit'
export default {
  components: {
    Table,
    ContentWrapper,
    CardList
  },
  props: {
    title: String,
    typePosition: Number,
    cornerIconTypeOptions: Object,
    visible: false
  },
  watch: {
    visible(value) {
      if(value) {
        this.fetchData()
      }
    }
  },
  data() {
    return {
      pictureStatus: {
        //状态
        审核通过: 1,
        待审核: 2
      },
      cornerIconType: {
        typePosition: this.typePosition,
        typeId: ''
      },
      picDialogVisible: false, //预览图片弹出框
      auditDialogVisible: false, //审核弹出框
      reviewPicUrl: null,
      filter: {
        sort: undefined,
        order: undefined
      },
      filterSchema: null,
      pagination: {
        currentPage: 1,
        pageSize: 10
      },
      selected: [],
      table: {
        props: {},
        header: [
          {
            label: 'ID',
            prop: 'cornerIconId',
            width: '70'
          },
          {
            label: 'imgUrl',
            prop: 'imgUrl',
            width: '70',
            render: (createElement, { row }) => {
              return createElement('img', {
                attrs: {
                  src: row.imgUrl,
                  width: '50px',
                  height: '50px',
                  class: 'imgs'
                },
                on: {
                  click: () => {
                    this.reviewPic(row)
                  }
                }
              })
            }
          },
          {
            label: '角标名称',
            width: '120',
            prop: 'cornerIconName',
            sortable: true
          },
          {
            label: '状态',
            prop: 'cornerStatus',
            width: '90',
            render: (createElement, { row }) => {
              switch (row.cornerStatus) {
                case 0:
                  return '不可用'
                  break
                case 1:
                  return '可用'
                  break
                case 2:
                  return '待审核'
                  break
                case 3:
                  return '审核不通过'
                  break
              }
            }
          },
          {
            label: '角标类型',
            prop: 'cornerIconType',
            width: '70',
            render: (createElement, { row }) => {
              return row.cornerIconType.length > 0
                ? row.cornerIconType[0].typeName
                : ''
            }
          },
          {
            label: '创建时间',
            prop: 'createdDate',
            sortable: true
          },
          {
            label: '修改时间',
            prop: 'lastUpdateDate',
            sortable: true
          },
          {
            label: '操作',
            width: '200',
            fixed: 'right',
            render: utils.component.createOperationRender(this, {
              editData: '编辑'
            })
          }
        ],
        data: [],
        selected: undefined,
        selectionType: 'single'
      }
    }
  },
  methods: {
    //选中时间
    handleRowSelectionChange(row, index) {
      console.log(row)
      // this.table.data = row
      this.$emit('input', row)
      let rowData = row
      this.table.selected = index
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
        page: 1,
        rows: 10
      }
      this.fetchData()
    },
    parseFilter() {
      const { filter, pagination } = this
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      this.cornerIconType.typeId = filter.cornerIconType
      this.cornerIconType.typePosition = this.typePosition
      filter.cornerIconType = undefined
      filter['cornerIconType.typeId'] = this.cornerIconType.typeId
      filter['cornerIconType.typePosition'] = this.cornerIconType.typePosition
      return filter
    },
    //获取数据
    fetchData() {
      const filter = this.parseFilter()
      this.$service.getCornerList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
        console.log(data)
      })
    }
  },
  created() {
    let filterSchema = _.map({
      cornerIconId: _.o.string.other('form', {
        component: 'Input',
        placeholder: '角标ID'
      }),
      cornerIconName: _.o.string.other('form', {
        component: 'Input',
        placeholder: '角标名称'
      }),
      cornerIconType: _.o.enum(this.cornerIconTypeOptions).other('form', {
        component: 'Select',
        placeholder: '角标类别'
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
    this.fetchData()
    this.filterSchema = filterSchema
  }
}
</script>

<style scoped>
.content-list >>> .card-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.card-list >>> .card-item-wrapper {
  width: 17%;
  border: 1px solid #d8bebe;
  box-shadow: 1px 3px 1px #d8bebe;
  margin: 5px;
  padding: 10px;
  border-radius: 5px;
}
.list-p >>> img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
p {
  margin: 0;
}
</style>
