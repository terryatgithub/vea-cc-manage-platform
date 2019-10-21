 <template>
  <BaseSelector
    ref="baseSelector"
    id-field="sCoocaaMId"
    :is-live="isLive"
    :selection-type="selectionType"
    :table="table"
    :pagination="pagination"
    :select-end-on-dbl-click="true"
    @pagination-change="fetchData"
    @filter-change="handleFilterChange"
    @filter-reset="handleFilterReset"
    @select-cancel="$emit('select-cancel')"
    @select-end="$emit('select-end')">

    <el-form slot="filter" :inline="true" v-model="filter" label-width="72px">
      <el-form-item>
        <CommonSelector v-model="filter.source" placeholder="内容源" :options="$consts.partnerOptions" :disabled="disablePartner" />
      </el-form-item>
      <el-form-item>
        <el-input placeholder="正片id" clearable v-model="filter.pThirdVId">
          <ResourceSelector
            slot="append"
            :selectors="['video', 'edu']"
            :source="source"
            :disable-partner="true"
            @select-end="handleSelectParentVideoEnd">
            <el-button>选择正片</el-button>
          </ResourceSelector>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input placeholder="短视频标题" clearable v-model="filter.mTitle"/>
      </el-form-item>
      <el-button size="small" type="primary" @click="handleFilterChange">查询</el-button>
      <el-button size="small" type="warning" @click="handleFilterReset">重置</el-button>
    </el-form>
  </BaseSelector>
</template>

<script>
import _ from 'gateschema'
import BaseSelector from '../BaseSelector'
import CommonSelector from '@/components/CommonSelector'
import ResourceSelector from './ResourceSelector'
export default {
  components: {
    BaseSelector,
    CommonSelector,
    ResourceSelector
  },
  data() {
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
            label: '短视频ID',
            prop: 'sCoocaaMId'
          },
          {
            label: '短视频名',
            prop: 'sShowTitle'
          },
          {
            label: '内容源',
            prop: 'source',
            render: (h, { row }) => {
              return this.$consts.partnerText[row.source]
            }
          },
          {
            label: '短视频时长',
            prop: 'mDuration',
            render: (h, { row }) => {
              return this.secondToTimeStr(row.mDuration)
            }
          },
          {
            label: '平均播放时长',
            prop: 'avgPerplayTimeSec',
            render: (h, { row }) => {
              return this.secondToTimeStr(row.avgPerplayTimeSec)
            }
          },
          {
            label: '正片',
            prop: 'pTitle'
          }
        ],
        data: []
      }
    }
  },
  props: ['isLive', 'selectionType', 'source', 'disablePartner'],
  computed: {
    selected() {
      return this.$refs.baseSelector.selected.slice()
    }
  },
  methods: {
    secondToTimeStr(seconds) {
      if (seconds) {
        const hour = Math.floor(seconds / 3600)
        const min = Math.floor((seconds - 3600 * hour) / 60)
        const sec = seconds - 3600 * hour - 60 * min
        return `${hour}小时${min}分${sec}秒`
      }
    },
    handleSelectParentVideoEnd({ video, episode, edu }) {
      let pThirdVId
      if (video.length > 0) {
        const coocaaVId = video[0].coocaaVId
        const selectedEpisode = episode[coocaaVId]
        if (selectedEpisode) {
          pThirdVId = selectedEpisode.coocaaMId
        } else {
          pThirdVId = coocaaVId
        }
      } else if (edu.length > 0) {
        pThirdVId = edu[0].coocaaVId
      }
      this.filter.pThirdVId = pThirdVId
    },
    getDefaultFilter() {
      return {
        source: this.$consts.sourceToPartner[this.source || this.$consts.partnerOptions[0].value],
        mTitle: '',
        pThirdVId: '',
        resType: 'shortVideo',
        callback: 'result',
        orderBy: 'm_duration',
        order: 'desc'
      }
    },
    getFilter() {
      const pagination = this.pagination
      const filter = Object.assign({}, this.efficientFilter)
      filter.code = filter.id
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
      this.$service.getMediaVideoInfos(filter).then(result => {
        this.pagination.total = result.total
        this.table.data = result.rows || []
      })
    }
  },
  created() {
  }
}
</script>

 <style lang='stylus' scoped>
</style>
