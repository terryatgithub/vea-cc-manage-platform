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
    :select-end-on-dbl-click="true"
    @pagination-change="fetchData"
    @filter-change="handleFilterChange"
    @filter-reset="handleFilterReset"
    @select-cancel="$emit('select-cancel')"
    @select-end="handleSelectEnd">
    <el-form
      slot="filter"
      :model="filter"
      label-width="80px"
      :inline="true"
      @reset.native.prevent="handleFilterReset"
      @submit.native.prevent="handleFilterChange">
      <el-form-item label="">
        <InputPositiveInt clearable placeholder="功能ID" v-model="filter.pluginId"></InputPositiveInt>
      </el-form-item>
      <el-form-item label="">
        <el-input clearable v-model.trim="filter.pluginName" placeholder="功能名称"></el-input>
      </el-form-item>
      <el-form-item label="">
        <CommonSelector  filterable v-model="filter.source" :options="sourceOptions" placeholder="内容源" />
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
const sourceValueMap = {
  '': '0',
  'o_tencent': '1',
  'o_iqiyi': '2',
  'o_youku': '3'
}
export default {
  components: {
    BaseSelector,
    CommonSelector,
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
            prop: 'pluginId',
            label: '功能ID',
            width: '80'
          },
          {
            prop: 'pluginName',
            label: '功能名称'
          },
          {
            prop: 'source',
            label: '内容源',
            width: '120',
            options: [],
            render: (h, { row }) => {
              let content = ''
              switch (row.source) {
                case 0:
                  content = '无'
                  break
                case 1:
                  content = '腾讯'
                  break
                case 2:
                  content = '爱奇艺'
                  break
                case 3:
                  content = '优酷'
                  break
                default:
                  content = 'Error: 没有对应的处理!!'
                  break
              }
              return content
            }
          },
          {
            prop: 'globalPicture.pictureId',
            label: '通用内容图片',
            render: (h, { row }) => {
              const globalPicture = row.globalPicture
              const BLOCK_SIGN_IMG_SRC = process.env.BASE_URL + 'block/sign.png'
              const pictureUrl = (globalPicture && globalPicture.pictureUrl)
              const imgSrc = pictureUrl === '/themes/images/block/sign.png'
                ? BLOCK_SIGN_IMG_SRC
                : pictureUrl
              return h('img', {
                style: {
                  'max-height': '64px',
                  'max-width': '120px'
                },
                attrs: {
                  referrerpolicy: 'no-referrer',
                  src: imgSrc
                }
              })
            }
          },
          {
            prop: 'createdDate',
            label: '创建时间'
          },
          {
            prop: 'modifierName',
            label: '更新人'
          }
        ],
        data: []
      }
    }
  },
  props: ['isLive', 'selectionType', 'source', 'beforeSelectEndCb'],
  computed: {
    selected () {
      return this.$refs.baseSelector.selected.slice()
    }
  },
  methods: {
    getDefaultFilter () {
      return {
        pluginId: undefined,
        pluginName: undefined,
        // 只显示审核通过的
        pluginStatus: 4,
        source: sourceValueMap[this.source]
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
      this.$service.getMultiBlockList(filter).then(result => {
        this.pagination.total = result.total
        this.table.data = result.rows
      })
    },
    handleSelectEnd (rows) {
      let isValid = true
      if (this.beforeSelectEndCb) {
        isValid = this.beforeSelectEndCb(rows)
      }
      isValid && this.$emit('select-end', rows)
    }
  },
  created () {
    const source = this.source
    let sourceOptions = JSON.parse(JSON.stringify(this.$consts.sourceOptionsWithEmpty))
    if (source) {
      sourceOptions = sourceOptions.filter(item => item.value === source || item.value === '')
    }
    sourceOptions.forEach(item => {
      item.value = sourceValueMap[item.value]
    })
    this.sourceOptions = sourceOptions
  }
}
</script>

 <style lang='stylus' scoped></style>
