<template>
  <RemoteSelectorWrapper
    title="选择浮窗"
    :filter="filter"
    :filterSchema="filterSchema"
    :pagination="pagination"
    @filter-change="handleFilterChange"
    @filter-reset="handleFilterReset"
    @select-end="handleSelectEnd"
    @select-start="fetchData"
  >
    <CardList
      slot="item-list"
      :data="table.data"
      :selected="table.selected"
      :selection-type="table.selectionType"
      :select-on-row-click="true"
      @row-selection-change="handleRowSelectionChange"
    >
      <div class="box-list" slot="row" slot-scope="{row: item}">
        <p class="list-p">
          <img class="list-img" :src="item.globalPicture.pictureUrl">
        </p>
        <p class="list-title">{{item.pluginName}}</p>
        <div>{{ item.pluginId }} / {{ item.modifierName }} / {{ item.createdDate }}</div>
      </div>
    </CardList>
    <slot/>
  </RemoteSelectorWrapper>
</template>

<script>
import _ from 'gateschema'
import RemoteSelectorWrapper from '../RemoteSelectorWrapper.vue'
import { ContentWrapper, Table, CardList, utils } from 'admin-toolkit'
export default {
  components: {
    Table,
    ContentWrapper,
    CardList,
    RemoteSelectorWrapper
  },
  props: {
    params: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      filter: {
        pluginId: undefined,
        pluginName: undefined
      },
      filterSchema: _.map({
        pluginId: _.o.oneOf([_.value(''), _.number]).$msg('请输入数字').other('form', {
          component: 'Input',
          label: 'ID',
          cols: { item: 6, label: { offset: 1, span: 5 }, wrapper: 18 }
        }),
        pluginName: _.o.string.other('form', {
          label: '功能名称',
          cols: { item: 6, label: { offset: 1, span: 5 }, wrapper: 18 }
        })
      }).other('form', {
        layout: 'inline',
        footer: {
          cols: {
            item: 6,
            label: 1,
            wrapper: 23
          },
          showSubmit: true,
          submitText: '查询',
          showReset: true,
          resetText: '重置'
        }
      }),
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
  methods: {
    handleRowSelectionChange(row, index) {
      this.table.selected = index
    },
     handleFilterChange(type) {
      if(this.$validateId(this.filter.pluginId)) {
        if (type === 'query') {
          if (this.pagination) {
            this.pagination.currentPage = 1
          }
        }
        this.fetchData() 
      }
    },
    handleFilterReset() {
      this.filter = {
        pluginId: undefined,
        pluginName: undefined
      }
      this.pagination.currentPage = 1
      this.fetchData()
    },
    parseFilter() {
      const { filter, pagination, params } = this
      const { sourceArray } = params
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      if (sourceArray) {
        filter.sourceArray = sourceArray
      }
      return filter
    },
    //获取数据
    fetchData() {
      const filter = this.parseFilter()
      if (this.pictureResolution) {
        filter.pictureResolution = this.pictureResolution
      }
      this.$service.floatWindowList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    },
    handleSelectEnd() {
      const { data, selected } = this.table
      this.$emit('select-end', data[selected])
      this.table.selected = undefined
    }
  },
  created() {}
}
</script>

<style scoped>
.content-list >>> .card-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.card-list >>> .card-item-wrapper {
  width: 17%;
  border: 1px solid #d8bebe;
  margin: 5px;
  padding: 10px;
}
.list-p >>> img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
p {
  margin: 0;
}
</style>