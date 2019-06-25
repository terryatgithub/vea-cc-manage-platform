 <template>
  <BaseSelector
    ref="baseSelector"
    id-field="pid"
    :is-live="isLive"
    :selection-type="selectionType"
    :table="table"
    :pagination="pagination"
    @pagination-change="fetchData"
    @filter-reset="handleFilterReset"
    @select-cancel="$emit('select-cancel')"
    @select-end="$emit('select-end')">
    <el-form slot="filter" :inline="true" v-model="filter" label-width="72px">
      <el-form-item label="资源类型">
        <CommonSelector v-model="filter.pType" :options="pTypeEnums" />
      </el-form-item>
      <el-form-item label="内容搜索">
        <el-input v-model="filter.pTitle"/>
      </el-form-item>
      <div style="text-align: center">
        <el-button size="small" type="primary" @click="handleFilterChange">查询</el-button>
        <el-button size="small" type="warning" @click="handleFilterReset">重置</el-button>
      </div>
    </el-form>
  </BaseSelector>
</template>

<script>
import BaseSelector from '../BaseSelector'
import CommonSelector from '@/components/CommonSelector'
export default {
  components: {
    BaseSelector,
    CommonSelector
  },
  data() {
    return {
      pagination: {
        currentPage: 1,
        pageSize: 15
      },
      filter: this.getDefaultFilter(),
      efficientFilter: this.getDefaultFilter(),
      pTypeEnums: [
        {
          label: '直播',
          value: 'live'
        },
        {
          label: '录播',
          value: 'res'
        }
      ],
      table: {
        props: {
        },
        data: [],
        header: [
          {
            prop: 'pid',
            label: 'ID',
            fixed: true,
            width: '100'
          },
          {
            prop: 'pTitle',
            label: '节目名',
            fixed: true,
            width: '220'
          },
          {
            prop: 'liveStatus',
            label: '直播状态',
            width: 120
          },
          {
            prop: 'competition',
            label: '赛事名',
            width: 120
          },
          {
            prop: 'format',
            label: '赛制名',
            width: 120
          },
          {
            prop: 'round',
            label: '轮次名',
            width: 120
          },
          {
            prop: 'pType',
            label: '节目类型',
            width: 120
          },
          {
            prop: 'homeTeam',
            label: '主队名',
            width: 150
          },
          {
            prop: 'guestTeam',
            label: '客队名',
            width: 150
          },
          {
            prop: 'groups',
            label: '分组名',
            width: 150
          },
          {
            prop: 'startTime',
            label: '开始时间',
            width: 200
          },
          {
            prop: 'endTime',
            label: '结束时间',
            width: 200
          },
          {
            prop: 'score',
            label: '比分',
            width: 120
          },
          {
            prop: 'createDate',
            label: '创建时间',
            width: 200
          }
        ],
        selected: [],
        selectionType: 'single'
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
        pType: 'live',
        pTitle: undefined
      }
    },
    getFilter() {
      const pagination = this.pagination
      const filter = Object.assign({}, this.efficientFilter)
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
    handleFilterChange() {
      this.efficientFilter = JSON.parse(JSON.stringify(this.filter))
      this.pagination.currentPage = 1
      this.fetchData()
    },
    handleFilterReset() {
      this.filter = this.getDefaultFilter()
      this.efficientFilter = this.getDefaultFilter()
      this.pagination.currentPage = 1
      this.fetchData()
    },
    fetchData() {
      const filter = this.getFilter()
      this.$service.mediaPPTVVideoList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    }
  }
}
</script>

 <style lang='stylus' scoped>
</style>
