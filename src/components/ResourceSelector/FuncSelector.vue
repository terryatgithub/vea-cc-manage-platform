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
                  src: imgSrc,
                  'referrerpolicy': 'no-referrer'
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
  props: ['isLive', 'selectionType', 'source'],
  computed: {
    selected() {
      return this.$refs.baseSelector.selected.slice()
    }
  },
  methods: {
    getDefaultFilter() {
      return {
        pluginId: undefined,
        pluginName: undefined,
        // 只显示审核通过的
        pluginStatus: 4,
        source: sourceValueMap[this.source],
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
      this.$service.getMultiBlockList(filter).then(result => {
        this.pagination.total = result.total
        this.table.data = result.rows
      })
    }
  },
  created() {
    const source = this.source
    let sourceOptions = this.$consts.sourceOptionsWithEmpty
    if (source) {
      sourceOptions = sourceOptions.filter(item => item.value === source || item.value === '')
    }
    const sourceEnums = sourceOptions.reduce((result, item) => {
      result[item.label] = sourceValueMap[item.value]
      return result
    }, {})
    const filterSchema = _.map({
      pluginId: _.o.oneOf([_.value(''), _.number]).$msg('请输入数字').other('form', {
        component: 'Input',
        placeholder: '功能ID',
        label: ' '
      }),
      pluginName: _.o.string.other('form', {
        placeholder: '功能名称',
        label: ' '
      }),
      source: _.o.enum(sourceEnums).other('form', {
        component: 'Select',
        placeholder: '内容源',
        label: ' '
      })
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
