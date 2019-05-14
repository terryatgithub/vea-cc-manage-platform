 <template>
  <BaseSelector
    ref="baseSelector"
    id-field="pluginId"
    :is-live="isLive"
    :selection-type="selectionType"
    :table="table"
    :pagination="pagination"
    :filter="filter"
    :filter-schema="filterSchema"
    @pagination-change="fetchData"
    @filter-change="fetchData"
    @filter-reset="handleFilterReset"
    @select-cancel="$emit('select-cancel')"
    @select-end="$emit('select-end')"
  ></BaseSelector>
</template>
 
<script>
import _ from 'gateschema'
import BaseSelector from './BaseSelector'
const sourceValueMap = {
  '': '0',
  'o_tencent': '1',
  'o_iqiyi': '2',
  'o_youku': '3'
}
export default {
  components: {
    BaseSelector
  },
  data() {
    return {
      pagination: {
        currentPage: 1,
        pageSize: 15
      },
      filter: this.getDefaultFilter(),
      filterSchema: null,
      table: {
        props: {},
        header: [
          {
            prop: 'id',
            label: "轮播ID",
            fixed: true,
            searched: true
          },
          {
            prop: 'containerName',
              label: "轮播名称",
              fixed: true,
              searched: true
          },
          {
            prop: 'lastUpdateDate',
            label: "创建时间"
          }
        ],
        data: []
      }
    }
  },
  props: ['isLive', 'selectionType'],
  computed: {
    selected() {
      return this.$refs.baseSelector.selected.slice()
    }
  },
  methods: {
    getDefaultFilter() {
      return {
        id: undefined,
        containerName: undefined
      }
    },
    getFilter() {
      const pagination = this.pagination
      const filter = Object.assign({}, this.filter)
      filter.code = filter.id
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
    handleFilterReset() {
      this.filter = this.getDefaultFilter()
      this.pagination.currentPage = 1
      this.fetchData()
    },
    fetchData() {
      const filter = this.getFilter()
      this.$service.broadcastBlockDataList(filter).then(result => {
        this.pagination.total = result.total
        this.table.data = result.rows
      })
    }
  },
  created() {
    const filterSchema = _.map({
      id: _.o.number.other('form', {
        placeholder: '轮播ID',
        label: '轮播ID'
      }),
      containerName: _.o.string.other('form', {
        placeholder: '轮播名称',
        label: '轮播名称'
      }),
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
  }
}
</script>
 
 <style lang='stylus' scoped></style>