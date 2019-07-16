 <template>
  <BaseSelector
    ref="baseSelector"
    id-field="sCoocaaMId"
    :is-live="isLive"
    :selection-type="selectionType"
    :table="table"
    :pagination="pagination"
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
        <el-input placeholder="关联正片" clearable v-model="filter.pCoocaaVId">
          <ResourceSelector
            slot="append"
            :selectors="['video', 'edu']"
            :source="source"
            :disable-partner="true"
            @select-end="handleSelectParentVideoEnd">
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
            render: (h, {row}) => {
              return this.$consts.partnerText[row.source]
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
    handleSelectParentVideoEnd({video, episode, edu}) {
      let pCoocaaVId
      if (video.length > 0) {
        const coocaaVId = video[0].coocaaVId
        const selectedEpisode = episode[coocaaVId]
        if (selectedEpisode) {
          pCoocaaVId = selectedEpisode.coocaaMId
        } else {
          pCoocaaVId = coocaaVId
        }
      } else if (edu.length > 0) {
        pCoocaaVId = edu[0].coocaaVId
      }
      this.filter.pCoocaaVId = pCoocaaVId

    },
    getDefaultFilter() {
      return {
        source: this.$consts.sourceToPartner[this.source || this.$consts.partnerOptions[0].value],
        mTitle: '',
        pCoocaaVId: '',
        resType: 'shortVideo',
        callback: 'result'
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
