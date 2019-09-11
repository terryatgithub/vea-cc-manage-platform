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
        <template slot="row" slot-scope="{row: item}">
          <div class="list-item__img-wrapper">
            <img :key="item.imgUrl" class="list-item__img" :src="item.imgUrl">
          </div>
          <div class="list-item__info">
            {{ item.cornerIconName }}
            <br />
            {{ $consts.statusText[item.cornerStatus] }}
          </div>
        </template>
        <!-- <div class="box-list" slot="row" slot-scope="{row: item}">
          <p class="list-p">
            <img :key="item.imgUrl" class="list-img" :src="item.imgUrl" alt>
          </p>
          <p class="list-title">{{item.cornerIconName}}</p>
          <p style="margin:0">
            <span>{{ $consts.statusText[item.cornerStatus] }}</span>
          </p>
        </div> -->
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
      if (value) {
        this.fetchData()
      }
    }
  },
  data() {
    return {
      cornerIconType: {
        typePosition: this.typePosition,
        typeId: ''
      },
      picDialogVisible: false, // 预览图片弹出框
      auditDialogVisible: false, // 审核弹出框
      reviewPicUrl: null,
      filter: this.genDefaultFilter(),
      filterSchema: null,
      pagination: {
        currentPage: 1,
        pageSize: 10
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
    // 选中时间
    handleRowSelectionChange(row, index) {
      this.table.selected = index
      this.$emit('input', row)
      if (this.table.selectionType === 'single') {
        this.$emit('close-dialog', 'savePicture')
      }
    },
    handleFilterChange(type, filter) {
      if (filter) { this.filter = filter }
      if (this.$validateId(this.filter.cornerIconId)) {
        if (type === 'query') {
          if (this.pagination) {
            this.pagination.currentPage = 1
          }
        }
        this.fetchData()
      }
    },
    genDefaultFilter() {
      return {
        cornerStatus: this.$consts.status.accepted
      }
    },
    handleFilterReset() {
      this.filter = this.genDefaultFilter() 
      this.pagination.currentPage = 1
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
      // filter['cornerIconType.typeId'] = this.cornerIconType.typeId
      //  filter['cornerIconType.typePosition'] = this.cornerIconType.typePosition
      filter['typeId'] = this.cornerIconType.typeId
      filter['typePosition'] = this.cornerIconType.typePosition
      return filter
    },
    // 获取数据
    fetchData() {
      this.table.selected = undefined
      const filter = this.parseFilter()
      this.$service.getCornerList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
        console.log(data)
      })
    }
  },
  created() {
    const $status = this.$consts.status
    let filterSchema = _.map({
      cornerIconId: _.o.string.other('form', {
        component: 'Input',
        placeholder: 'ID',
        cols: {
          item: 3,
          label: 0,
          wrapper: 23
        }
      }),
      cornerIconName: _.o.string.other('form', {
        component: 'Input',
        placeholder: '角标名称',
        cols: {
          item: 3,
          label: 0,
          wrapper: 23
        }
      }),
      cornerIconType: _.o.enum(this.cornerIconTypeOptions).other('form', {
        component: 'Select',
        placeholder: '角标类别',
        cols: {
          item: 3,
          label: 0,
          wrapper: 23
        }
      }),
      cornerStatus: _.o.enum({
        '审核通过': $status.accepted,
        '待审核': $status.waiting
      }).other('form', {
        label: '',
        component: 'Select',
        placeholder: '审核状态',
        cols: {
          item: 3,
          label: 0,
          wrapper: 23
        }
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
<style lang="stylus" scoped>
.card-list >>> .card-item-wrapper
  pisition relative
  width 180px
  height 200px
  border 1px solid #ccc
  margin 5px
  padding 10px

.list-item__img
  max-height 170px
  max-width 170px
  margin 0 auto
  display block
.list-item__info
  position absolute
  bottom 0
</style>
