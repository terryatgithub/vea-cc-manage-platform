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
    @filter-change="handleFilterChange"
    @filter-reset="handleFilterReset"
    @select-cancel="$emit('select-cancel')"
    @select-end="$emit('select-end')"
  ></BaseSelector>
</template>
 
<script>
import _ from 'gateschema'
import BaseSelector from '../BaseSelector'
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
            prop: 'source',
            label: '内容源',
            width: '120',
            options: [],
            render: (h, {row}) => {
              return this.$consts.sourceText[row.source] || '未知'
            }
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
  props: ['isLive', 'selectionType', 'source'],
  computed: {
    selected() {
      return this.$refs.baseSelector.selected.slice()
    }
  },
  methods: {
    getDefaultFilter() {
      return {
        id: undefined,
        containerName: undefined,
        source: undefined
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
    handleFilterChange(filter) {
      this.filter = filter
      this.fetchData()
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
      id: _.o.oneOf([_.value(''), _.number]).$msg('请输入数字').other('form', {
        component: 'Input',
        placeholder: '轮播ID',
        label: ' '
      }),
      containerName: _.o.string.other('form', {
        placeholder: '轮播名称',
        label: ' '
      }),
    }).other('form', {
      cols: {
        item: 3,
        label: 1,
        wrapper: 23
      },
      layout: 'inline',
      footer: {
        cols: {
          item: 3,
          label: 1,
          wrapper: 23
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