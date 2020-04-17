 <template>
  <BaseSelector
    ref="baseSelector"
    id-field="resourceId"
    :is-live="isLive"
    :selection-type="selectionType"
    :table="table"
    :pagination="pagination"
    :select-end-on-dbl-click="true"
    :filter="filter"
    :filter-schema="null"
    @pagination-change="fetchData"
    @filter-change="handleFilterChange"
    @filter-reset="handleFilterReset"
    @select-cancel="$emit('select-cancel')"
    @select-end="$emit('select-end')">
    <el-form
      slot="filter"
      :model="filter"
      label-width="80px"
      :inline="true"
      @reset.native.prevent="handleFilterReset"
      @submit.native.prevent="handleFilterChange">
      <el-form-item label="">
        <el-input clearable v-model.trim="filter.keyword" placeholder="商品名称/ID"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">查询</el-button>
        <el-button native-type="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </BaseSelector>
</template>

<script>
import BaseSelector from '../BaseSelector'
export default {
  components: {
    BaseSelector
  },
  data () {
    return {
      pagination: {
        currentPage: 1,
        pageSize: 15
      },
      filter: this.getDefaultFilter(),
      efficientFilter: this.getDefaultFilter(),
      filterSchema: null,
      table: {
        props: {},
        header: [
          {
            label: '商品ID',
            prop: 'resourceId'
          },
          {
            label: '商品名称',
            prop: 'resourceName'
          },
          {
            label: '供应商名称',
            prop: 'sourceName'
          },
          {
            label: '商品价格',
            prop: 'originPrice',
            render: (h, { row }) => {
              return row.originPrice / 100
            }
          },
          {
            label: '宝贝图片',
            render: (h, { row }) => {
              return h('img', {
                class: 'good-img',
                style: {
                  height: '100px'
                },
                key: row.resourceImgUrl,
                attrs: {
                  src: row.resourceImgUrl
                }
              })
            }
          }
        ],
        data: []
      }
    }
  },
  props: ['isLive', 'selectionType', 'source', 'disablePartner'],
  computed: {
    selected () {
      return this.$refs.baseSelector.selected.slice()
    }
  },
  methods: {
    getDefaultFilter () {
      return {
        resournceName: undefined,
        company: undefined
      }
    },
    getFilter () {
      const pagination = this.pagination
      const filter = JSON.parse(JSON.stringify(this.efficientFilter))
      filter.code = filter.id
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
    handleFilterChange () {
      this.efficientFilter = JSON.parse(JSON.stringify(this.filter))
      this.fetchData()
    },
    handleFilterReset () {
      this.filter = this.getDefaultFilter()
      this.efficientFilter = this.getDefaultFilter()
      this.pagination.currentPage = 1
      this.fetchData()
    },
    fetchData () {
      const filter = this.getFilter()
      this.$service.mallGetList(filter).then(result => {
        this.pagination.total = result.total
        this.table.data = result.rows || []
      })
    }
  },
  created () {
  }
}
</script>

<style lang='stylus' scoped>
</style>
