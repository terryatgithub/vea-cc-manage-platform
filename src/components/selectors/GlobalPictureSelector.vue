<template>
  <RemoteSelectorWrapper
    ref="selectorWrapper"
    :title="title || '选择素材'"
    :filter="filter"
    :filterSchema="filterSchema"
    :pagination="pagination"
    @filter-change="handleFilterChange"
    @filter-reset="handleFilterReset"
    @pagination-change="fetchData"
    @select-end="handleSelectEnd"
    @select-start="handleSelectStart"
    :disabled="disabled">
    <div slot="filter">
      <el-form :model="filter" ref="filter" label-width="0px" :inline="true">
        <el-form-item label="">
          <InputPositiveInt v-model="filter.pictureId" placeholder="ID" clearable></InputPositiveInt>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="filter.pictureName" placeholder="素材名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="">
         <el-select v-model="filter.pictureCategory" filterable clearable placeholder="素材类别">
           <el-option v-for="item in materialTypeOptions"
             :key="item.value"
             :label="item.label"
             :value="item.value">
           </el-option>
         </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="filter.pictureStatus" filterable placeholder="审核状态">
            <el-option v-for="item in pictureStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="filter.resolutionTolerance" filterable clearable placeholder="尺寸容忍度">
            <el-option v-for="item in resolutionToleranceOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="$consts.idPrefix !== '10'" label="">
          <el-select v-model="filter.idPrefix" clearable filterable placeholder="数据来源">
            <el-option v-for="item in $consts.idPrefixOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item>
          <el-button type="primary" @click="handleFilterChange">查询</el-button>
          <el-button @click="handleFilterReset">重置</el-button>
        </el-form-item>
      </el-form>
     </div>
    <el-collapse
      v-if="presetTable.data.length > 0"
      slot="prepend"
      class="rel-picture-wrapper"
      v-model="collapseActiveItems">
      <el-collapse-item title="关联图片" name="relPicture">
        <CardList
          class="rel-picture-list"
          :data="presetTable.data"
          :selected="presetTable.selected"
          selection-type="single"
          :select-on-row-click="true"
          @row-selection-change="handlePresetTableRowSelectionChange">
          <div class="picture-item" slot="row" slot-scope="{row: item}">
            <div class="img-wrapper">
              <img referrerpolicy="no-referrer" :key="item.pictureUrl" class="list-img" :src="item.pictureUrl">
            </div>
            <div>
              {{ item.pictureResolution }}
            </div>
          </div>
        </CardList>
      </el-collapse-item>
    </el-collapse>

    <CardList
      slot="item-list"
      :data="table.data"
      :selected="table.selected"
      :selection-type="table.selectionType"
      :select-on-row-click="true"
      @row-selection-change="handleRowSelectionChange">
      <div class="picture-item" slot="row" slot-scope="{row: item}">
        <div class="img-wrapper">
          <img referrerpolicy="no-referrer" :key="item.pictureUrl" class="list-img" :src="item.pictureUrl">
        </div>
        <div>{{item.pictureName}}</div>
        <div>
          {{ item.pictureId }} / {{ $consts.statusText[item.pictureStatus] }} / {{item.pictureResolution}}
        </div>
      </div>
    </CardList>
    <div v-if="table.selectionType === 'single'" slot="actions"></div>
    <slot></slot>
  </RemoteSelectorWrapper>
</template>

<script>
import emitter from 'element-ui/src/mixins/emitter'
import RemoteSelectorWrapper from '../RemoteSelectorWrapper.vue'
import { CardList } from 'admin-toolkit'
import { debounce } from 'lodash'
import InputPositiveInt from '@/components/InputPositiveInt'
export default {
  mixins: [emitter],
  components: {
    CardList,
    RemoteSelectorWrapper,
    InputPositiveInt
  },
  props: ['title', 'pictureResolution', 'queryLongPoster', 'disabled', 'resource'],
  data () {
    const $status = this.$consts.status
    return {
      collapseActiveItems: ['relPicture'],
      materialTypeOptions: [],
      pictureStatusOptions: [
        {
          label: '审核通过',
          value: $status.accepted
        },
        {
          label: '待审核',
          value: $status.waiting
        }
      ],
      resolutionToleranceOptions: [
        {
          label: '10%',
          value: 10
        },
        {
          label: '30%',
          value: 30
        },
        {
          label: '50%',
          value: 50
        }
      ],
      picDialogVisible: false, // 预览图片弹出框
      auditDialogVisible: false, // 审核弹出框
      reviewPicUrl: null,
      filter: this.getDefaultFilter(),
      filterSchema: null,
      pagination: {
        currentPage: 1,
        pageSize: 15
      },
      selectedCollection: 'normal', // 'normal' 是正常选择， 'preset' 是预置图片
      selected: [],
      table: {
        props: {},
        data: [],
        selected: undefined,
        selectionType: 'single'
      },
      presetTable: {
        data: [],
        selected: undefined
      },
      // 与资源关联的海报
      picturePreset: []
    }
  },
  watch: {
    filter: {
      deep: true,
      handler: 'onFilterChange'
    }
  },
  methods: {
    getDefaultFilter () {
      const filter = {
        pictureStatus: 4
      }
      if (this.$consts.idPrefix !== '10') {
        filter.idPrefix = this.$consts.idPrefix
      }
      return filter
    },
    handleRowSelectionChange (row, index) {
      this.selectedCollection = 'normal'
      this.table.selected = index
      this.$refs.selectorWrapper.handleSelectEnd()
      this.$nextTick(() => {
        this.dispatch('ElFormItem', 'el.form.blur')
      })
    },
    onFilterChange () {
      this.handleFilterChangeDebounce()
    },
    handleFilterChange () {
      this.pagination.currentPage = 1
      this.fetchData()
    },
    handleFilterReset () {
      this.filter = this.getDefaultFilter()
      this.pagination.currentPage = 1
      this.fetchData()
    },
    parseFilter () {
      const { filter, pagination } = this
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return { ...filter }
    },
    // 获取数据
    fetchData () {
      this.table.selected = undefined
      const filter = this.parseFilter()
      const pictureResolution = this.pictureResolution
      if (pictureResolution) {
        filter.pictureResolution = pictureResolution
      }
      const queryLongPoster = this.queryLongPoster
      if (queryLongPoster !== undefined) {
        filter.queryLongPoster = queryLongPoster
      }
      this.$service.getResourceList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    },
    getMaterialTypes () {
      return this.$service.getMaterialTypes().then(data => {
        this.materialTypeOptions = data.map(item => {
          return {
            label: item.dictCnName,
            value: item.dictId
          }
        })
      })
    },
    handleSelectStart () {
      if (!this.filterSchema) {
        this.initFilterSchema()
      }
      this.getPresetPictures()
      this.fetchData()
    },
    handleSelectEnd () {
      const selectedCollection = this.selectedCollection
      const table = selectedCollection === 'preset' ? this.presetTable : this.table
      const { data, selected } = table
      this.$emit('select-end', data[selected])
      this.table.selected = undefined
    },
    handlePresetTableRowSelectionChange (row, index) {
      this.selectedCollection = 'preset'
      this.presetTable.selected = index
      this.$refs.selectorWrapper.handleSelectEnd()
    },
    getPresetPictures () {
      const resource = this.resource
      const mapPictures = (items) => items.map((item) => {
        return {
          pictureResolution: item.size,
          pictureUrl: item.url
        }
      })
      const filterPictures = (items) => {
        const resolution = this.pictureResolution.split('*')
        const [width, height] = resolution
        return items.filter(item => {
          const pictureResolution = item.pictureResolution.split('*')
          const [pWidth, pHeight] = pictureResolution
          return Math.abs(pWidth - width) < 5 && Math.abs(pHeight - height) < 5
        })
      }

      if (resource && resource.coverType === 'media') {
        if (resource.picturePreset) {
          this.presetTable.data = filterPictures(mapPictures(resource.picturePreset))
          return
        }

        const resourceId = resource.extraValue1
        if (resourceId) {
          const options = {
            id: resourceId,
            resType: 'vod',
            callbackparam: 'result',
            page: 1,
            rows: 1
          }
          this.$service.getMediaVideoInfos(options).then((result) => {
            const rows = result.rows || []
            const targetResource = rows[0]
            if (targetResource) {
              const picturePreset = targetResource.imageInfoList || []
              this.presetTable.data = filterPictures(mapPictures(picturePreset))
            }
          })
        }
      }
    },
    initFilterSchema () {
      this.getMaterialTypes()
    }
  },
  created () {
    this.handleFilterChangeDebounce = debounce(this.handleFilterChange, 500)
  }
}
</script>

<style scoped lang="stylus">
.content-list >>> .card-list
  display flex
  flex-direction row
  flex-wrap wrap

.card-list  >>> .card-item__selection
  display none

.card-list >>> .card-item-wrapper:hover
  border 1px solid #444

.card-list >>> .card-item-wrapper
  width 17%
  height 256px
  border 1px solid #ccc
  margin 5px
  padding 10px
  cursor pointer

.img-wrapper img
  width 100%
  height 200px
  object-fit cover

.rel-picture-wrapper
  margin-bottom 20px
.rel-picture-list
  width 100%
  display block
  overflow-x auto
  white-space nowrap
  >>> .card-item-wrapper
    width 13%
    display inline-block
  .img-wrapper img
    display block
    margin 0 auto
    width unset
    max-width 100%
    max-height 200px
</style>
