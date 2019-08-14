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
    @select-start="fetchData"
    :disabled="disabled"
  >
    <el-collapse 
      v-if="picturePresetMatchResolution.length > 0"
      slot="prepend" 
      class="rel-picture-wrapper"
      v-model="collapseActiveItems">
      <el-collapse-item title="关联图片" name="relPicture">
        <CardList
          class="rel-picture-list"
          :data="picturePresetMatchResolution"
          :selected="table.selected"
          selection-type="single"
          :select-on-row-click="true"
          @row-selection-change="handleRowSelectionChange">
          <div class="picture-item" slot="row" slot-scope="{row: item}">
            <div class="img-wrapper">
              <img class="list-img" :src="item.url">
            </div>
            <div>
              {{ item.size }}
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
        <p class="img-wrapper">
          <img class="list-img" :src="item.pictureUrl">
        </p>
        <p>{{item.pictureName}}</p>
        <div>
          {{ item.pictureId }} / {{ $consts.statusText[item.pictureStatus] }} / {{item.pictureResolution}}
        </div>
      </div>
    </CardList>
    <div slot="actions"></div>
    <slot></slot>
  </RemoteSelectorWrapper>
</template>

<script>
import _ from 'gateschema'
import RemoteSelectorWrapper from '../RemoteSelectorWrapper.vue'
import { Table, CardList, utils } from 'admin-toolkit'
export default {
  components: {
    Table,
    CardList,
    RemoteSelectorWrapper
  },
  props: ['title', 'pictureResolution', 'queryLongPoster', 'disabled', 'picturePreset'],
  data() {
    return {
      collapseActiveItems: ['relPicture'],
      materialTypes: {}, // 素材类型
      pictureStatus: {
        // 状态
        审核通过: 1,
        待审核: 2
      },
      picDialogVisible: false, // 预览图片弹出框
      auditDialogVisible: false, // 审核弹出框
      reviewPicUrl: null,
      filter: this.getDefaultFilter(),
      filterSchema: null,
      pagination: {
        currentPage: 1,
        pageSize: 15
      },
      selected: [],
      table: {
        props: {},
        data: [],
        selected: undefined,
        selectionType: 'single'
      }
    }
  },
  computed: {
    picturePresetMatchResolution() {
      const preset = this.picturePreset || []
      return preset
    }
  },
  methods: {
    getDefaultFilter() {
      const filter = {
        pictureStatus: 1
      }
      if (this.$consts.idPrefix != '10') {
        filter.idPrefix = this.$consts.idPrefix
      }
      return filter
    },
    handleRowSelectionChange(row, index) {
      this.table.selected = index
      this.$refs.selectorWrapper.handleSelectEnd()
    },
    handleFilterChange() {
      this.pagination.currentPage = 1
      this.fetchData()
    },
    handleFilterReset() {
      this.filter = this.getDefaultFilter()
      this.pagination.currentPage = 1
      this.fetchData()
    },
    parseFilter() {
      const { filter, pagination } = this
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return { ...filter }
    },
    // 获取数据
    fetchData() {
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
    getMaterialTypes() {
      return this.$service.getMaterialTypes().then(data => {
        data.forEach(item => {
          this.materialTypes[item.dictCnName] = item.dictId
        })
      })
    },
    handleSelectEnd() {
      const { data, selected } = this.table
      this.$emit('select-end', data[selected])
      this.table.selected = undefined
    }
  },
  created() {
    let filterSchema = _.map({
      pictureId: _.o.oneOf([_.value(''), _.number]).$msg('请输入数字').other('form', {
        label: '',
        component: 'Input',
        placeholder: 'ID',
        cols: {
          item: 3,
          label: 0,
          wrapper: 23
        }
      }),
      pictureName: _.o.string.other('form', {
        label: '',
        component: 'Input',
        placeholder: '素材名称',
        cols: {
          item: 3,
          label: 0,
          wrapper: 23
        }
      }),
      pictureCategory: _.o.enum(this.materialTypes).other('form', {
        label: '',
        component: 'Select',
        placeholder: '素材类别',
        cols: {
          item: 3,
          label: 0,
          wrapper: 23
        }
      }),
      pictureStatus: _.o.enum(this.pictureStatus).other('form', {
        label: '',
        component: 'Select',
        placeholder: '审核状态',
        cols: {
          item: 3,
          label: 0,
          wrapper: 23
        }
      })
    }).other('form', {
      layout: 'inline',
      footer: {
        cols: {
          item: 3,
          label: 0,
          wrapper: 23
        },
        showSubmit: true,
        submitText: '查询',
        showReset: true,
        resetText: '重置'
      }
    })
    if (this.$consts.idPrefix != '10') {
      filterSchema.map({
        idPrefix: _.o.enum(this.$consts.idPrefixEnums).other('form', {
          label: ' ',
          placeholder: '数据来源',
          component: 'Select',
          layout: 'inline',
          cols: {
            item: 3,
            wrapper: 18
          }
        })
      })
    }
    this.getMaterialTypes().then(() => {
      this.filterSchema = filterSchema
    })
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

