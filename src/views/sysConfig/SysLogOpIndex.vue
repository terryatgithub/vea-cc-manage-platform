<template>
  <ContentCard class="content">
    <ContentWrapper
      :pagination="pagination"
      @filter-change="handleFilterChange"
    >
      <el-form ref="form" :model="filter" inline label-width="90px" size="mini">
        <el-form-item label="自增ID">
          <el-input v-model="filter.id"></el-input>
        </el-form-item>
        <el-form-item label="操作者ID">
          <el-input v-model="filter.userId"></el-input>
        </el-form-item>
        <el-form-item label="操作者名称">
          <el-input v-model="filter.userName"></el-input>
        </el-form-item>
        <el-form-item label="菜单名称">
          <el-input v-model="filter.menuName"></el-input>
        </el-form-item>
        <el-form-item label="菜单Elid">
          <el-input v-model="filter.menuElid"></el-input>
        </el-form-item>
        <el-form-item label="执行的方法">
          <el-input v-model="filter.execMethod"></el-input>
        </el-form-item>
        <el-form-item label="操作耗时">
          <el-input v-model="filter.elapsedTime"></el-input>
        </el-form-item>
        <el-form-item label="操作时间">
          <el-input v-model="filter.createTime"></el-input>
        </el-form-item>
        <el-form-item label="操作的数据">
          <el-input v-model="filter.opData" type="textarea" size="medium"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleFilterChange">搜索</el-button>
          <el-button icon="el-icon-delete" @click="clearForm">清空</el-button>
        </el-form-item>
      </el-form>

      <Table
        :props="table.props"
        :header="table.header"
        :data="table.data"
        :selected="table.selected"
        :selection-type="table.selectionType"
      />
    </ContentWrapper>
  </ContentCard>
</template>

<script>
import { ContentWrapper, Table, utils } from 'admin-toolkit'
import _ from '../../utlis/gateschema'
import { Button, Tooltip } from 'element-ui'

export default {
  components: {
    ContentWrapper,
    Table
  },

  data() {
    return {
      filter: {
        sort: undefined,
        order: undefined
      },
      selected: [],
      pagination: {},
      table: {
        props: {},
        header: [
          {
            label: '自增ID',
            prop: 'id',
            width: '70',
            sortable: true
          },
          {
            label: '操作者ID',
            prop: 'userId',
            width: '60',
            sortable: true
          },
          {
            label: '操作名称',
            prop: 'userName'
          },
          {
            label: '菜单名称',
            prop: 'menuName'
          },
          {
            label: '菜单Elid',
            prop: 'menuElid'
          },
          {
            label: '执行的方法',
            prop: 'execMethod'
          },
          {
            label: '操作的数据',
            prop: 'opData',
            render(h, { row }) {
              return h(
                Tooltip,
                {
                  props: {
                    content: row.opData,
                    placement: 'top'
                  }
                },
                [h('div', { class: 'op-data' }, [row.opData])]
              )
            }
          },
          {
            label: '操作耗时',
            prop: 'elapsedTime',
            fit: true,
            sortable: true
          },
          {
            label: '操作时间',
            prop: 'createTime',
            fit: true
          },
          {
            label: '操作',
            width: '90',
            fixed: 'right',
            render(h, { row }) {
              return h(
                Button,
                {
                  props: {
                    type: 'success',
                    icon: 'el-icon-plus'
                  },
                  on: {
                    click: function() {
                      console.log(this)
                    }
                  }
                },
                ['复制']
              )
            }
          }
        ],
        data: [],
        selected: [],
        selectionType: 'none'
      }
    }
  },

  methods: {
    /**
     * 获取数据
     */
    fetchData() {
      const filter = this.parseFilter()
      this.$service.sysLogOpPageList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    },
    parseFilter() {
      const { filter, pagination } = this
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
    clearForm() {
      this.filter = {}
      this.fetchData()
    },
    handleFilterChange(type) {
      if (type === 'filter') {
        if (this.pagination) {
          this.pagination.currentPage = 1
        }
      }
      this.fetchData()
    }
  },
  created() {
    this.fetchData()
  }
}
</script>

<style lang='stylus' scoped>
.content >>> .op-data
  height: 50px;
</style>