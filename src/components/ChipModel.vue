<template>
  <ContentCard class="content">
    <ContentWrapper
      :pagination="pagination"
    >
      <el-form :inline="true" :model="formSearch" class="search">
            <el-form-item>
              <el-select v-model="formSearch.platform" @change="changePlatform" placeholder="内容源">
                <el-option label="爱奇艺" value="yinhe"></el-option>
                <el-option label="腾讯" value="tencent"></el-option>
                <el-option label="优朋" value="voole"></el-option>
                <el-option label="优酷" value="youku"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item >
              <el-input v-model="formSearch.model" placeholder="机型">></el-input>
            </el-form-item>
            <el-form-item  >
              <el-input v-model="formSearch.chip" placeholder="机芯">></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleFilterChange">查询</el-button>
              <el-button type="primary" @click="handleFilterReset">重置</el-button>
            </el-form-item>
      </el-form>
      <el-collapse>
        <el-collapse-item title="新增">
          <el-form :model="form" :rules="formRules" ref="form" label-width="100px">
            <el-form-item label="内容源" prop="platform">
              <el-select v-model="form.platform" placeholder="内容源">
                <el-option label="爱奇艺" value="yinhe"></el-option>
                <el-option label="腾讯" value="tencent"></el-option>
                <el-option label="优朋" value="voole"></el-option>
                <el-option label="优酷" value="youku"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="机型" prop="model">
              <el-input v-model="form.model" placeholder="机型">></el-input>
            </el-form-item>
            <el-form-item label="机芯" prop="chip">
              <el-input v-model="form.chip" placeholder="机芯">></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addModelChip">添加</el-button>
            </el-form-item>
          </el-form>
        </el-collapse-item>
        <el-collapse-item title="选中的机型机芯">
          <SelectedTag>
            <ul>
              <li v-for="item in selected" :key="item.devParId">
                <el-tag
                  type="success"
                  closable
                  @close="handleRowSelectionRemove(item)"
                >{{item.model}}_{{item.chip}}</el-tag>
              </li>
            </ul>
          </SelectedTag>
        </el-collapse-item>
      </el-collapse>
      <Table
        :props="table.props"
        :header="table.header"
        :data="table.data"
        :selected="table.selected"
        :selection-type="table.selectionType"
        @row-selection-add="handleRowSelectionAdd"
        @row-selection-remove="handleRowSelectionRemove"
        @all-row-selection-change="handleAllRowSelectionChange"
      />
    </ContentWrapper>
  </ContentCard>
</template>
<script>
import _ from 'gateschema'
import { Button } from 'element-ui'
import {
  ContentWrapper,
  Table,
  ActionList,
  utils,
  RemoteSelect
} from 'admin-toolkit'
import SelectedTag from './SelectedTag'
export default {
  components: {
    ActionList,
    Table,
    ContentWrapper,
    SelectedTag
  },
  data() {
    let _this = this
    return {
      platform: '',
      form: {
        platform: null,
        model: null,
        chip: null
      },
      formRules: {
        platform: [{ required: true, message: '请选择', trigger: 'blur' }],
        model: [{ required: true, message: '请输入机型', trigger: 'blur' }],
        chip: [{ required: true, message: '请输入机芯', trigger: 'blur' }]
      },
      formSearch: {
        sort: undefined,
        order: undefined,
        platform: 'tencent',
        chip: undefined,
        model: undefined
      },
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
        selectionType: 'multiple'
      }
    }
  },
  // watch: {
  //   'filter.platform': function(newV,oldV){
  //     debugger
  //      if(window.confirm("是否要切换内容源，切换内容源之后，首页方案数据将会清除掉")){
  //         this.platform = newV
  //         this.fetchData()
  //      } else {
  //        this.filter.platform = oldV
  //      }
  //   }
  // },
  methods: {
    changePlatform($event){ 
      debugger
      if(window.confirm("是否要切换内容源，切换内容源之后，首页方案数据将会清除掉")){
         // this.platform = newV
          this.fetchData()
       } else {
        // this.formSearch.platform = oldV
       }
    },
    addModelChip() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$service.addChipAndModel(this.form, '添加成功').then(data => {
            this.fetchData()
          })
        }
      })
    },
    //表格操作
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
    //查询
    handleFilterChange() {
        if (this.pagination) {
          this.pagination.currentPage = 1
        }
      this.fetchData()
    },
    //重置
    handleFilterReset() {
      this.formSearch = {
        sort: undefined,
        order: undefined,
        platform: 'tencent',
        chip: undefined,
        model: undefined
      }
      this.fetchData()
    },
    parseFilter() {
      const { formSearch, pagination } = this
      if (pagination) {
        formSearch.page = pagination.currentPage
        formSearch.rows = pagination.pageSize
      }
      return formSearch
    },
    /**
     * 获取数据
     */
    fetchData() {
      this.table.selected = []
      const filter = this.parseFilter()
      this.$service.getChipAndModelPageList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    }
  },
  created() {
    let filterSchema = _.map({
      platform: _.o
        .enum({
          腾讯: 'tencent',
          爱奇艺: 'yinhe',
          优朋: 'voole',
          优酷: 'youku'
        })
        .other('form', {
          component: 'Select',
          placeholder: '内容源',
          cols: {
            item: 3,
            label: 0
          }
        }),
      model: _.o.string.other('form', {
        component: 'Input',
        placeholder: '机型',
        cols: {
          item: 3,
          label: 0
        }
      }),
      chip: _.o.string.other('form', {
        component: 'Input',
        placeholder: '机芯',
        cols: {
          item: 3,
          label: 0
        }
      })
    }).other('form', {
      layout: 'inline',
      footer: {
        cols: {
          label: 0,
          wrapper: 24
        },
        showSubmit: true,
        submitText: '查询',
        showReset: true,
        resetText: '重置'
      }
    })
    this.filterSchema = filterSchema
    this.fetchData()
  }
}
</script>

