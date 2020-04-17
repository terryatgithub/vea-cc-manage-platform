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
        <InputPositiveInt clearable placeholder="轮播入口ID" v-model="filter.id"></InputPositiveInt>
      </el-form-item>
      <el-form-item label="">
        <el-input clearable v-model.trim="filter.title" placeholder="轮播入口名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">查询</el-button>
        <el-button native-type="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </BaseSelector>
</template>

<script>
import _ from 'gateschema'
import BaseSelector from '../BaseSelector'
import InputPositiveInt from '@/components/InputPositiveInt'
export default {
  components: {
    BaseSelector,
    InputPositiveInt
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
            label: '轮播入口ID',
            prop: 'id'
          },
          {
            label: '轮播入口名称',
            prop: 'title'
          }
        ],
        data: []
      }
    }
  },
  props: ['isLive', 'selectionType'],
  computed: {
    selected () {
      return this.$refs.baseSelector.selected.slice()
    }
  },
  methods: {
    getDefaultFilter () {
      return {
        id: undefined,
        title: undefined,
        resType: 'operation',
        dataType: 'rotate',
        levelType: 'rotateSta',
        callback: 'result'
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
      this.$service.getMediaVideoInfos(filter).then(result => {
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
