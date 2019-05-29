<template>
  <RemoteSelectorWrapper
    :title="title || '选择角标'"
    :filter="filter"
    :filterSchema="filterSchema"
    :pagination="pagination"
    @pagination-change="fetchData"
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
        <template slot="row" slot-scope="{row: item}">
          <div class="list-item__img-wrapper">
            <img class="list-item__img" :src="item.imgUrl">
          </div>
          <div class="list-item__info">
            {{ item.cornerIconName }}
            <br />
            {{ item.pictureStatus == 1 ? '审核通过' : '待审核'}}
          </div>
        </template>
      </CardList>
      <slot />
  </RemoteSelectorWrapper>
</template>

<script>
import _ from "gateschema";
import RemoteSelectorWrapper from '../RemoteSelectorWrapper.vue'
import { ContentWrapper, Table, CardList, utils } from "admin-toolkit";
export default {
  components: {
    Table,
    ContentWrapper,
    CardList,
    RemoteSelectorWrapper, 
  },
  props: ['title', 'position'],
  data() {
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
        selectionType: "single"
      }
    };
  },
  methods: {
    getDefaultFilter() {
      return {
        cornerIconId: undefined,
        cornerIconName: undefined,
        'cornerIconType.typeId': undefined
      }
    },
    handleRowSelectionChange(row,index){
      this.table.selected = index
    },
    handleFilterChange() {
      this.pagination.currentPage = 1
      this.fetchData() 
    },
    handleFilterReset() {
      this.filter = this.getDefaultFilter();
      this.pagination.currentPage = 1
      this.fetchData();
    },
    parseFilter() {
      const { filter, pagination, position } = this;
      if (pagination) {
        filter.page = pagination.currentPage;
        filter.rows = pagination.pageSize;
      }
      if (position !== undefined) {
        filter['cornerIconType.typePosition'] = position
      }
      return filter;
    },
    //获取数据
    fetchData() {
      const filter = this.parseFilter();
      if (this.pictureResolution) {
        filter.pictureResolution = this.pictureResolution
      }
      this.$service.getCornerList(filter).then(data => {
        this.pagination.total = data.total;
        this.table.data = data.rows;
      });
    },
    getMaterialTypes() {
      return this.$service.getMaterialTypes().then(data => {
        data.forEach(element => {
          this.materialTypes[element.label] = element.id;
        });
      });
    },
    handleSelectEnd() {
      const { data, selected } = this.table
      this.$emit('select-end', data[selected])
      this.table.selected = undefined
    }

  },
  created() {
    this.$service.getCornerTypes().then((data) => {
      const cornerTypeEnums = data.reduce((result, item) => {
        return (result[item.typeName] = item.typeId) && result
      }, {})
      const filterSchema = _.map({
        cornerIconId: _.o.oneOf([_.value(''), _.number]).$msg('请输入数字').other("form", {
          component: 'Input',
          label: 'ID',
          placeholder: "ID",
          cols: {
            item: 5,
            label: 6,
            wrapper: 18
          }
        }),
        cornerIconName: _.o.string.other("form", {
          label: '角标名称',
          placeholder: " 角标名称",
          cols: {
            item: 5,
            label: 6,
            wrapper: 18
          }
        }),
        'cornerIconType.typeId': _.o.enum(cornerTypeEnums).other("form", {
          component: "Select",
          label: '角标类型',
          placeholder: "角标类型",
          cols: {
            item: 5,
            label: 6,
            wrapper: 18
          }
        })
      }).other("form", {
        layout: "inline",
        footer: {
          cols: {
            label: 5,
            wrapper: 19
          },
          showSubmit: true,
          submitText: "查询",
          showReset: true,
          resetText: "重置"
        }
      })
      this.filterSchema = filterSchema;
    })
  }
};
</script>

<style lang="stylus" scoped>
.card-list >>> .card-item-wrapper
  pisition relative
  width 180px
  height 200px
  border 1px solid #ccc
  margin 5px
  padding 10px

.list-item__img
  max-height 170px
  max-width 170px
  margin 0 auto
  display block
.list-item__info
  position absolute
  bottom 0
</style>
