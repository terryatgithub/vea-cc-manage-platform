 <template>
  <BaseSelector
    ref="baseSelector"
    id-field="id"
    :is-live="isLive"
    :selection-type="selectionType"
    :table="table"
    :pagination="pagination"
    :filter="filter"
    :filter-schema="null"
    :select-end-on-dbl-click="true"
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
        <InputPositiveInt clearable placeholder="轮播ID" v-model="filter.id"></InputPositiveInt>
      </el-form-item>
      <el-form-item label="">
        <el-input clearable v-model.trim="filter.containerName" placeholder="轮播名称"></el-input>
      </el-form-item>
      <el-form-item label="">
        <CommonSelector  filterable v-model="filter.source" :options="sourceOptions" />
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
import CommonSelector from '@/components/CommonSelector'
import InputPositiveInt from '@/components/InputPositiveInt'
export default {
  components: {
    BaseSelector,
    InputPositiveInt,
    CommonSelector
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
            prop: 'id',
            label: '轮播ID',
            fixed: true,
            searched: true
          },
          {
            prop: 'containerName',
            label: '轮播名称',
            fixed: true,
            searched: true
          },
          {
            prop: 'source',
            label: '内容源',
            width: '120',
            options: [],
            render: (h, { row }) => {
              return this.$consts.sourceTextWithNone[row.source] || '未知'
            }
          },
          {
            prop: 'lastUpdateDate',
            label: '创建时间'
          }
        ],
        data: []
      }
    }
  },
  props: ['isLive', 'selectionType', 'source'],
  computed: {
    selected () {
      return this.$refs.baseSelector.selected.slice()
    }
  },
  methods: {
    getDefaultFilter () {
      return {
        id: undefined,
        containerName: undefined,
        source: this.source
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
      this.$service.broadcastBlockDataList(filter).then(result => {
        this.pagination.total = result.total
        this.table.data = result.rows
      })
    }
  },
  created () {
    const source = this.source
    let sourceOptions = JSON.parse(JSON.stringify(this.$consts.sourceOptionsWithEmpty))
    if (source) {
      sourceOptions = sourceOptions.filter(item => item.value === source || item.value === '')
    }
    // 轮播这里如果内容源为 无 时，是 none
    const noSourceItem = sourceOptions.find(item => item.value === '')
    if (noSourceItem) {
      noSourceItem.value = 'none'
    }
    this.sourceOptions = sourceOptions
  }
}
</script>

 <style lang='stylus' scoped></style>
