<template>
  <RemoteSelectorWrapper
    ref="wrapper"
    :title="title || '选择视频'"
    custom-class="resource-selector"
    :disabled="disabled"
    :is-live="isLive"
    @select-start="handleSelectStart">
    <template slot="content" slot-scope="{isShow}">
      <BaseSelector
        v-if="isLive ? true : isShow"
        ref="baseSelector"
        id-field="coocaaBVId"
        :selection-type="selectionType"
        :table="table"
        :pagination="pagination"
        :selectEndOnDblClick="true"
        @pagination-change="fetchData"
        @select-cancel="handleSelectCancel"
        @select-end="handleSelectEnd">
        <el-form slot="filter" @keypress.enter.native.prevent="handleFilterChange" :inline="true" v-model="filter">
          <el-form-item >
            <el-input clearable v-model="filter.title" placeholder="视频标题"></el-input>
          </el-form-item>
          <el-form-item v-if="!userId">
            <el-input clearable v-model="filter.userName" placeholder="作者名称"></el-input>
          </el-form-item>
          <el-form-item v-if="!categoryId" >
            <KnowledgeTagSelector selection-type="single" @select-end="handleSetFilterCategory($event)">
              <el-input :value="filter.categoryName"  placeholder="所属知识">
                <el-button slot="append">
                  <span v-if="filter.categoryId" @click.stop="handleSetFilterCategory()">清除</span>
                  <span v-else>选择</span>
                </el-button>
              </el-input>
            </KnowledgeTagSelector>
          </el-form-item>

          <el-button type="primary" @click="handleFilterChange">查询</el-button>
          <el-button type="warning" @click="handleResetFilter">重置</el-button>
        </el-form>
      </BaseSelector>
    </template>
    <slot></slot>
  </RemoteSelectorWrapper>
</template>

<script>
import RemoteSelectorWrapper from '../RemoteSelectorWrapper'
import BaseSelector from '../BaseSelector'
import KnowledgeTagSelector from '@/components/mask/KnowledgeTagSelector/KnowledgeTagSelector'
export default {
  components: {
    KnowledgeTagSelector,
    RemoteSelectorWrapper,
    BaseSelector
  },
  data () {
    return {
      options: [],
      pagination: {
        currentPage: 1,
        pageSize: 15,
        total: 0
      },
      filter: this.genDefaultFilter(),
      efficientFilter: this.genDefaultFilter(),
      table: {
        data: [],
        selected: [],
        header: [
          {
            label: '视频ID',
            prop: 'coocaaBVId',
            width: 200
          },
          {
            label: '视频标题',
            prop: 'title',
            'show-overflow-tooltip': true
          },
          {
            label: '作者名称',
            prop: 'userName',
            'show-overflow-tooltip': true
          },
          {
            prop: 'categoryName',
            label: '所属知识',
            width: 190
          },
          {
            prop: 'createdTime',
            label: '创建时间',
            width: 190
          }
        ],
        selectionType: 'multiple',
        props: {
          'tooltip-effect': 'dark'
        }
      },
      selected: [],
      originSelected: []
    }
  },
  props: ['title', 'disabled', 'isLive', 'source', 'selectionType', 'categoryId', 'userId'],
  methods: {
    handleSelectStart () {
      this.$emit('select-start')
      if (!this.isLive) {
        this.handleResetFilter()
      } else {
        this.fetchData()
      }
    },
    handleSelectCancel () {
      this.$refs.wrapper.handleSelectCancel()
    },
    handleSelectEnd (data) {
      this.$emit('select-end', data)
      this.$refs.wrapper.handleSelectEnd()
    },
    handleSetFilterCategory (tag) {
      const filter = this.filter
      if (tag) {
        tag = tag[0]
        filter.categoryId = tag.tagCode
        filter.categoryName = tag.tagCnName
      } else {
        filter.categoryId = undefined
        filter.categoryName = undefined
      }
    },
    genDefaultFilter () {
      return {
        title: undefined,
        userId: this.userId,
        categoryId: this.categoryId,
        categoryName: undefined
      }
    },
    handleFilterChange () {
      this.efficientFilter = JSON.parse(JSON.stringify(this.filter))
      this.pagination.currentPage = 1
      this.fetchData()
    },
    handleResetFilter () {
      this.filter = this.genDefaultFilter()
      this.efficientFilter = this.genDefaultFilter()
      this.pagination.currentPage = 1
      this.fetchData()
    },
    fetchData () {
      const filter = JSON.parse(JSON.stringify(this.efficientFilter))
      filter.categoryName = undefined
      const pagination = this.pagination
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      this.$service.mediaGetVideoList(filter).then(data => {
        this.table.data = data.rows
        this.pagination.total = data.total
      })
    }
  },
  created () {
  }
}
</script>

<style>

</style>
