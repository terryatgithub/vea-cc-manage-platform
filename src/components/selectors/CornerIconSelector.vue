<template>
  <RemoteSelectorWrapper
    ref="selectorWrapper"
    :title="title || '选择角标'"
    :filter="filter"
    :filterSchema="filterSchema"
    :pagination="pagination"
    @pagination-change="fetchData"
    @filter-change="handleFilterChange"
    @filter-reset="handleFilterReset"
    @select-end="handleSelectEnd"
    @select-start="fetchData"
    :disabled="disabled"
  >
      <CardList
        slot="item-list"
        :data="table.data"
        :selected="table.selected"
        :selection-type="table.selectionType"
        :select-on-row-click="true"
        @row-selection-change="handleRowSelectionChange"
      >
        <template slot="row" slot-scope="{row: item}">
          <div class="list-item__img-wrapper">
            <img referrerpolicy="no-referrer" :key="item.imgUrl" class="list-item__img" :src="item.imgUrl">
          </div>
          <div class="list-item__info">
            {{ item.cornerIconName }}
            <br />
            {{ $consts.statusText[item.cornerStatus] }}
          </div>
        </template>
      </CardList>
      <div v-if="table.selectionType === 'single'" slot="actions"></div>
      <slot />
  </RemoteSelectorWrapper>
</template>

<script>
import _ from 'gateschema'
import RemoteSelectorWrapper from '../RemoteSelectorWrapper.vue'
import { CardList } from 'admin-toolkit'
export default {
  components: {
    CardList,
    RemoteSelectorWrapper
  },
  props: ['title', 'position', 'disabled'],
  data () {
    return {
      reviewPicUrl: null,
      filter: this.getDefaultFilter(),
      filterSchema: null,
      pagination: {
        currentPage: 1,
        pageSize: 30
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
  methods: {
    getDefaultFilter () {
      const idPrefix = this.$consts.idPrefix
      return {
        cornerStatus: this.$consts.status.accepted,
        cornerIconId: undefined,
        cornerIconName: undefined,
        typeId: undefined,
        idPrefix: idPrefix !== '10' ? idPrefix : undefined
      }
    },
    handleRowSelectionChange (row, index) {
      this.table.selected = index
      this.$refs.selectorWrapper.handleSelectEnd()
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
      const { filter, pagination, position } = this
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      if (position !== undefined) {
        filter.typePosition = position
      }
      return filter
    },
    // 获取数据
    fetchData () {
      this.table.selected = undefined
      const filter = this.parseFilter()
      if (this.pictureResolution) {
        filter.pictureResolution = this.pictureResolution
      }
      this.$service.getCornerList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    },
    getMaterialTypes () {
      return this.$service.getMaterialTypes().then(data => {
        data.forEach(element => {
          this.materialTypes[element.label] = element.id
        })
      })
    },
    handleSelectEnd () {
      const { data, selected } = this.table
      this.$emit('select-end', data[selected])
      this.table.selected = undefined
    }

  },
  created () {
    const $status = this.$consts.status
    this.$service.getCornerTypes().then((data) => {
      const cornerTypeEnums = data.reduce((result, item) => {
        return (result[item.typeName] = item.typeId) && result
      }, {})
      const filterSchema = _.map({
        cornerIconId: _.o.oneOf([_.value(''), _.number]).$msg('请输入数字').other('form', {
          component: 'Input',
          label: ' ',
          placeholder: 'ID',
          cols: {
            item: 3,
            wrapper: 23
          }
        }),
        cornerIconName: _.o.string.other('form', {
          label: ' ',
          placeholder: ' 角标名称',
          cols: {
            item: 3,
            wrapper: 23
          }
        }),
        typeId: _.o.enum(cornerTypeEnums).other('form', {
          component: 'Select',
          label: ' ',
          placeholder: '角标类型',
          cols: {
            item: 3,
            wrapper: 23
          }
        }),
        cornerStatus: _.o.enum({
          '审核通过': $status.accepted,
          '待审核': $status.waiting
        }).other('form', {
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
            wrapper: 24
          },
          showSubmit: true,
          submitText: '查询',
          showReset: true,
          resetText: '重置'
        }
      })

      const idPrefix = this.$consts.idPrefix
      if (idPrefix !== '10') {
        filterSchema.map({
          idPrefix: _.o.enum(this.$consts.idPrefixEnums).other('form', {
            label: ' ',
            placeholder: '数据来源',
            component: 'Select',
            layout: 'inline',
            cols: {
              item: 3,
              wrapper: 23
            }
          })
        })
      }

      this.filterSchema = filterSchema
    })
  }
}
</script>

<style lang="stylus" scoped>
.card-list >>> .card-item-wrapper
  pisition relative
  width 180px
  height 200px
  border 1px solid #ccc
  margin 5px
  padding 10px
  cursor pointer
  &:hover
    border 1px solid #444
.card-list  >>> .card-item__selection
  display none

.list-item__img
  max-height 170px
  max-width 170px
  margin 0 auto
  display block
.list-item__info
  position absolute
  bottom 0
</style>
