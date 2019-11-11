<template>
  <ContentCard class="content">
    <ContentWrapper
      :pagination="pagination"
      @filter-change="fetchData"
      @filter-reset="handleFilterReset"
    >
      <el-form :inline="true" :model="formSearch" class="">
        <el-form-item>
          <el-select v-model="formSearch.platform" @change="changePlatform" placeholder="内容源">
            <el-option label="爱奇艺" value="yinhe"></el-option>
            <el-option label="腾讯" value="tencent"></el-option>
            <el-option label="优朋" value="voole"></el-option>
            <el-option label="优酷" value="youku"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item >
          <el-input v-model.trim="formSearch.model" placeholder="机型">></el-input>
        </el-form-item>
        <el-form-item  >
          <el-input v-model.trim="formSearch.chip" placeholder="机芯">></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleFilterChange">查询</el-button>
          <el-button type="primary" @click="handleFilterReset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true" :model="form" :rules="formRules" ref="form" label-width="100px" class="chip-add">
        <el-form-item label="内容源" prop="platform">
          <el-select v-model="form.platform" placeholder="内容源">
            <el-option label="爱奇艺" value="yinhe"></el-option>
            <el-option label="腾讯" value="tencent"></el-option>
            <el-option label="优朋" value="voole"></el-option>
            <el-option label="优酷" value="youku"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机型" prop="model">
          <el-input v-model.trim="form.model" placeholder="机型">></el-input>
        </el-form-item>
        <el-form-item label="机芯" prop="chip">
          <el-input v-model.trim="form.chip" placeholder="机芯">></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addModelChip">添加机芯</el-button>
        </el-form-item>
      </el-form>
      <div class="chip-selected-list">
          选中的机型机芯
          <el-tag
            v-for="item in selected" :key="item.devParId"
            class="chip-selected-item"
            type="success"
            closable
            @close="handleRowSelectionRemove(item)">
            {{item.model}}_{{item.chip}}
          </el-tag>
      </div>
      <Table
        ref="table"
        :props="table.props"
        :header="table.header"
        :data="table.data"
        :selected="table.selected"
        :selection-type="table.selectionType"
        @row-click="rowClick"
        @row-selection-change="rowClick"
        @row-selection-add="handleRowSelectionAdd"
        @row-selection-remove="handleRowSelectionRemove"
        @all-row-selection-change="handleAllRowSelectionChange"
      />
    </ContentWrapper>
  </ContentCard>
</template>
<script>
import {
  ContentWrapper,
  Table
} from 'admin-toolkit'
export default {
  props: {
    selectionType: {
      type: String,
      default() {
        return 'multiple'
      }
    }
  },
  components: {
    Table,
    ContentWrapper
  },
  data() {
    return {
      platform: 'tencent', // 默认平台
      form: this.genDefaultFormData(),
      formRules: {
        platform: [{ required: true, message: '请选择', trigger: 'blur' }],
        model: [{ required: true, message: '请输入机型', trigger: 'blur' }],
        chip: [{ required: true, message: '请输入机芯', trigger: 'blur' }]
      },
      formSearch: this.genDefaultFilter(),
      filter: this.genDefaultFilter(),
      pagination: {
        pageSize: 5
      },
      selected: [],
      table: {
        props: {},
        header: [
          {
            label: 'ID',
            prop: 'devParId'
          },
          {
            label: '内容源',
            prop: 'platform',
            render: (h, { row }) => {
              return this.$platform(row.platform)
            }
          },
          {
            label: '机芯',
            prop: 'chip'
          },
          {
            label: '机型',
            prop: 'model'
          }
        ],
        data: [],
        selected: [],
        selectionType: this.selectionType
      }
    }
  },
  methods: {
    genDefaultFormData() {
      return {
        platform: undefined,
        model: undefined,
        chip: undefined
      }
    },
    genDefaultFilter() {
      return {
        platform: 'tencent',
        chip: undefined,
        model: undefined
      }
    },
    rowClick(params) {
      this.$emit('row-click', params)
    },
    changePlatform($event) {
      if (window.confirm('是否要切换内容源，切换内容源之后，首页方案数据将会清除掉')) {
        this.platform = $event
        this.fetchData()
      } else {
        this.formSearch.platform = this.platform
      }
    },
    addModelChip() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$service.addChipAndModel(this.form, '添加成功').then(data => {
            this.fetchData()
            this.form = this.genDefaultFormData()
          })
        }
      })
    },
    // 表格操作
    handleRowSelectionAdd(targetItem) {
      this.selected.push(targetItem)
      this.updateTableSelected()
    },
    handleRowSelectionRemove(targetItem) {
      this.selected = this.selected.filter(item => {
        return item.devParId !== targetItem.devParId
      })
      this.updateTableSelected()
    },
    handleAllRowSelectionChange(value) {
      if (value) {
        this.table.data.forEach(this.handleRowSelectionAdd)
      } else {
        this.unselectedIds = this.table.data.map(e => {
          return e.devParId
        })
        this.selected = this.selected.filter(e => {
          if (this.unselectedIds.indexOf(e.devParId) < 0) {
            return e
          }
        })
        this.table.selected = []
      }
    },
    handleAllRowSelectionRemove() {
      this.selected = []
      this.table.selected = []
    },
    updateTableSelected() {
      const table = this.table
      const newSelectedIndex = this.selected.map(e => {
        return e.devParId
      })
      table.selected = table.data.reduce((result, item, index) => {
        if (newSelectedIndex.indexOf(item.devParId) > -1) {
          result.push(index)
        }
        return result
      }, [])
    },
    // 查询
    handleFilterChange() {
      this.filter = { ...this.formSearch }
      this.pagination.currentPage = 1
      this.fetchData()
    },
    // 重置
    handleFilterReset() {
      this.filter = this.genDefaultFilter()
      this.formSearch = this.genDefaultFilter()
      this.pagination.currentPage = 1
      this.fetchData()
    },
    parseFilter() {
      const { filter, pagination } = this
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
    /**
     * 获取数据
     */
    fetchData() {
      this.handleAllRowSelectionRemove()
      const filter = this.parseFilter()
      this.$service.getChipAndModelPageList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
        this.$refs.table.$refs.table.doLayout()
      })
    }
  },
  created() {
    this.fetchData()
  }
}
</script>
<style lang="stylus" scoped>
.chip-add
  padding-top 20px
  border 1px solid #f0f0f0
.chip-selected-list
  padding 10px 0
.chip-selected-item
  margin-right 10px
</style>
