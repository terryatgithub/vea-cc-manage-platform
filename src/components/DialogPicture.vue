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
         :select-on-row-click="true"
        @row-selection-change="handleRowSelectionChange"
      >
        <div class="box-list" slot="row" slot-scope="{row: item}">
          <p class="list-p">
            <img class="list-img" :src="item.pictureUrl" alt>
          </p>
          <p class="list-title">{{item.pictureName}}</p>
          <p style="margin:0">
            <span v-if="item.pictureStatus==1">审核通过</span>
            <span v-else>待审核</span>
            <span>{{item.pictureResolution}}</span>
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
    pictureResolution:{
      type: String,
      default: ''
    }
  },
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
        data: [],
        selected: undefined,
        selectionType: 'single'
      }
    }
  },
  methods: {
    //选中事件
    handleRowSelectionChange(row, index) {
      this.table.selected = index
      this.$emit('input', row)
      if(this.table.selectionType === 'single') {
         this.$emit("close-dialog",'savePicture')
      }
    },
    handleFilterChange(type, filter) {
      if (filter) { this.filter = filter}
      if(this.$validateId(this.filter.pictureId)) {
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
    },
    //获取数据
    fetchData() {
      this.table.selected = undefined
      const filter = this.parseFilter()
      filter.pictureResolution = this.pictureResolution
      this.$service.getResourceList(filter).then(data => {
      this.pagination.total = data.total
      this.table.data = data.rows
      //  this.data = data.rows;
      console.log(data)
      })
    },
    getMaterialTypes() {
      return this.$service.getMaterialTypes().then(data => {
        data.forEach(element => {
          this.materialTypes[element.dictCnName] = element.dictId
        })
      })
    }
  },
  created() {
    let filterSchema = _.map({
      pictureId: _.o.string.other('form', {
        component: 'Input',
        placeholder: 'ID'
      }),
      pictureName: _.o.string.other('form', {
        component: 'Input',
        placeholder: '素材名称'
      }),
      pictureCategory: _.o.enum(this.materialTypes).other('form', {
        component: 'Select',
        placeholder: '素材类别'
      }),
      pictureStatus: _.o.enum(this.pictureStatus).other('form', {
        component: 'Select',
        placeholder: '审核状态'
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
    this.getMaterialTypes().then(() => {
      this.filterSchema = filterSchema
    })
    this.fetchData()
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
