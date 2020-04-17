 <template>
  <BaseSelector
    ref="baseSelector"
    id-field="appId"
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
        <InputPositiveInt clearable placeholder="应用ID" v-model="filter.appId"></InputPositiveInt>
      </el-form-item>
      <el-form-item label="">
        <el-input clearable v-model.trim="filter.appName" placeholder="应用名称"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-input clearable v-model.trim="filter.appPackageName" placeholder="应用包名"></el-input>
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
      filter: this.genDefaultFilter(),
      efficientFilter: this.genDefaultFilter(),
      filterSchema: null,
      table: {
        props: {},
        header: [
          {
            label: 'ID',
            prop: 'appId',
            width: '70'
          },
          {
            label: '应用名称',
            prop: 'appName',
            width: '100'
          },
          {
            label: '应用包名',
            prop: 'appPackageName'
          },
          {
            label: '图片',
            prop: 'appImageUrl',
            render: (createElement, { row }) => {
              return createElement('img', {
                key: row.appImageUrl,
                attrs: {
                  src: row.appImageUrl,
                  width: '50px',
                  height: '50px',
                  class: 'imgs'
                }
              })
            }
          }
        ],
        data: []
      }
    }
  },
  computed: {
    selected () {
      return this.$refs.baseSelector.selected.slice()
    }
  },
  props: ['isLive', 'selectionType'],
  methods: {
    genDefaultFilter () {
      return {
        appId: undefined,
        appName: undefined,
        appPackageName: undefined
      }
    },
    getFilter () {
      const pagination = this.pagination
      const filter = this.efficientFilter
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
      this.filter = this.genDefaultFilter()
      this.efficientFilter = this.genDefaultFilter()
      this.pagination.currentPage = 1
      this.fetchData()
    },
    fetchData () {
      const filter = this.getFilter()
      this.$service.getAppManagementList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    }
  },
  created () {
  }
}
</script>

 <style lang='stylus' scoped>
</style>
