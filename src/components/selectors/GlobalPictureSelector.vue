<template>
  <RemoteSelectorWrapper
    ref="selectorWrapper"
    :title="title || '选择素材'"
    :filter="filter"
    :filterSchema="filterSchema"
    :pagination="pagination"
    @filter-change="handleFilterChange"
    @filter-reset="handleFilterReset"
    @pagination-change="fetchData"
    @select-end="handleSelectEnd"
    @select-start="fetchData"
  >
    <CardList
      slot="item-list"
      :data="table.data"
      :selected="table.selected"
      :selection-type="table.selectionType"
      :select-on-row-click="true"
      @row-selection-change="handleRowSelectionChange">
      <div class="box-list" slot="row" slot-scope="{row: item}">
        <p class="list-p">
          <img class="list-img" :src="item.pictureUrl">
        </p>
        <p class="list-title">{{item.pictureName}}</p>
        <div>
          <span>{{ $consts.statusText[item.pictureStatus] }}</span>
          <span>{{item.pictureResolution}}</span>
        </div>
      </div>
    </CardList>
    <div slot="actions"></div>
    <slot></slot>
  </RemoteSelectorWrapper>
</template>

<script>
import _ from 'gateschema'
import RemoteSelectorWrapper from '../RemoteSelectorWrapper.vue'
import { ContentWrapper, Table, CardList, utils } from 'admin-toolkit'
export default {
  components: {
    Table,
    ContentWrapper,
    CardList,
    RemoteSelectorWrapper
  },
  props: ['title', 'pictureResolution'],
  data() {
    return {
      materialTypes: {}, //素材类型
      pictureStatus: {
        //状态
        审核通过: 1,
        待审核: 2
      },
      picDialogVisible: false, //预览图片弹出框
      auditDialogVisible: false, //审核弹出框
      reviewPicUrl: null,
      filter: {
      },
      filterSchema: null,
      pagination: {
        currentPage: 1,
        pageSize: 15,
      },
      selected: [],
      table: {
        props: {},
        data: [],
        selected: undefined,
        selectionType: 'single'
      }
    }
  },
  methods: {
    handleRowSelectionChange(row, index) {
      this.table.selected = index
      this.$refs.selectorWrapper.handleSelectEnd()
    },
    handleFilterChange(type) {
      if (type === 'filter') {
        if (this.pagination) {
          this.pagination.currentPage = 1
        }
      }
      this.fetchData()
    },
    handleFilterReset() {
      this.filter = {}
      this.pagination.currentPage = 1
      this.fetchData()
    },
    parseFilter() {
      const { filter, pagination } = this
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return {...filter}
    },
    //获取数据
    fetchData() {
      const filter = this.parseFilter()
      if (this.pictureResolution) {
        filter.pictureResolution = this.pictureResolution
      }
      this.$service.getResourceList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    },
    getMaterialTypes() {
      return this.$service.getMaterialTypes().then(data => {
        data.forEach(element => {
          this.materialTypes[element.label] = element.id
        })
      })
    },
    handleSelectEnd() {
      const { data, selected } = this.table
      this.$emit('select-end', data[selected])
      this.table.selected = undefined
    }
  },
  created() {
    let filterSchema = _.map({
      pictureId: _.o.string.other('form', {
        component: 'Input',
        placeholder: '素材ID',
        cols: {
          item: 3,
          label: 0
        }
      }),
      pictureName: _.o.string.other('form', {
        component: 'Input',
        placeholder: '素材名称',
        cols: {
          item: 3,
          label: 0
        }
      }),
      pictureCategory: _.o.enum(this.materialTypes).other('form', {
        component: 'Select',
        placeholder: '素材类别',
        cols: {
          item: 3,
          label: 0
        }
      }),
      pictureStatus: _.o.enum(this.pictureStatus).other('form', {
        component: 'Select',
        placeholder: '审核状态',
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
    this.getMaterialTypes().then(() => {
      this.filterSchema = filterSchema
    })
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
  margin: 5px;
  padding: 10px;
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
