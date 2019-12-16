<template>
  <RemoteSelectorWrapper
    ref="wrapper"
    :title="title"
    custom-class="resource-selector"
    :disabled="disabled"
    :is-live="isLive"
    @select-start="handleSelectStart">
    <template slot="content" slot-scope="{isShow}">
      <BaseSelector
        v-if="isLive ? true : isShow"
        ref="baseSelector"
        id-field="devParId"
        :selection-type="selectionType"
        :select-end-on-click="true"
        :table="table"
        :filter="filter"
        :filterSchema="filterSchema"
        :pagination="pagination"
        @pagination-change="fetchData"
        @filter-change="handleFilterChange"
        @filter-reset="handleResetFilter"
        @select-cancel="handleSelectCancel"
        @select-end="handleSelectEnd">
        <div slot="filter" slot-scope="{selected}">
          <el-form :inline="true" :model="filter" class="">
            <el-form-item>
              <el-select :value="filter.platform" @input="handleInputPlatform" placeholder="内容源">
                <el-option label="爱奇艺" value="yinhe"></el-option>
                <el-option label="腾讯" value="tencent"></el-option>
                <el-option label="优朋" value="voole"></el-option>
                <el-option label="优酷" value="youku"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item >
              <el-input v-model.trim="filter.model" placeholder="机型">></el-input>
            </el-form-item>
            <el-form-item  >
              <el-input v-model.trim="filter.chip" placeholder="机芯">></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleFilterChange">查询</el-button>
              <el-button type="primary" @click="handleResetFilter">重置</el-button>
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
          <div>
              选中的机型机芯
              <el-tag
                v-for="item in selected"
                :key="item.chip + item.devParId"
                class="selected-item"
                type="success"
                closable
                @close="handleRowSelectionRemove(item)">
                {{item.model}}_{{item.chip}}
              </el-tag>
          </div>
        </div>
      </BaseSelector>
    </template>
  </RemoteSelectorWrapper>
</template>

<script>
import RemoteSelectorWrapper from '../SelectorWrapper'
import BaseSelector from '../BaseSelector'
export default {
  data () {
    return {
      options: [],
      pagination: {
        currentPage: 1,
        pageSize: 15,
        total: 0
      },
      form: this.genDefaultFormData(),
      formRules: {
        platform: [{ required: true, message: '请选择', trigger: 'blur' }],
        model: [{ required: true, message: '请输入机型', trigger: 'blur' }],
        chip: [{ required: true, message: '请输入机芯', trigger: 'blur' }]
      },
      filter: this.genDefaultFilter(),
      effectiveFilter: this.genDefaultFilter(),
      filterSchema: null,
      table: {
        data: [],
        selected: [],
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
        selectionType: 'multiple',
        props: {
          'tooltip-effect': 'dark'
        }
      }
    }
  },
  props: ['title', 'disabled', 'isLive', 'source', 'selectionType', 'platform', 'initSelected'],
  computed: {
  },
  components: {
    RemoteSelectorWrapper,
    BaseSelector
  },
  methods: {
    genDefaultFormData () {
      return {
        platform: undefined,
        model: undefined,
        chip: undefined
      }
    },
    handleInputPlatform (val) {
      this.$confirm('是否要切换内容源，切换内容源之后，首页方案数据将会清除掉', '提示')
        .then(() => {
          this.filter.platform = val
          this.$refs.baseSelector.clearSelected()
        })
        .catch(() => {})
    },
    addModelChip () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$service.addChipAndModel(this.form, '添加成功').then(data => {
            this.fetchData()
            this.form = this.genDefaultFormData()
          })
        }
      })
    },
    handleSelectStart () {
      this.$emit('select-start')
      if (!this.isLive) {
        this.handleResetFilter()
      } else {
        this.fetchData()
      }
      const initSelected = this.initSelected
      if (initSelected) {
        this.$nextTick(() => {
          const $baseSelector = this.$refs.baseSelector
          $baseSelector.selected = initSelected.filter(item => item.devParId)
          $baseSelector.updateTableSelected()
        })
      }
    },
    handleSelectCancel () {
      this.$refs.wrapper.handleSelectCancel()
    },
    handleSelectEnd (data) {
      this.$emit('select-end', data)
      this.$refs.wrapper.handleSelectEnd()
    },
    genDefaultFilter () {
      return {
        platform: this.platform,
        chip: undefined,
        model: undefined
      }
    },
    handleFilterChange () {
      this.effectiveFilter = JSON.parse(JSON.stringify(this.filter))
      this.pagination.currentPage = 1
      this.fetchData()
    },
    handleResetFilter () {
      this.filter = this.genDefaultFilter()
      this.effectiveFilter = this.genDefaultFilter()
      this.pagination.currentPage = 1
      this.fetchData()
    },
    fetchData () {
      const filter = JSON.parse(JSON.stringify(this.effectiveFilter))
      const pagination = this.pagination
      if (pagination) {
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      this.$service.getChipAndModelPageList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    }
  },
  created () {
  }
}
</script>

<style lang="stylus" scoped>
.selected-item
  margin-right 10px
</style>
