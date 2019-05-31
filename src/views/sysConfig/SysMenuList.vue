<template>
  <ContentCard class="content">
    <ContentWrapper
      :filter="filter"
      :filterSchema="filterSchema"
      :pagination="pagination"
      @filter-change="handleFilterChange"
      @filter-reset="handleFilterReset"
    >
        <ButtonGroupForListPage
        pageName='sysMenu'
        @add="addData"
        @edit="editData"
        @delete="deleteData"
        >
        </ButtonGroupForListPage>
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
      <!--设置操作-->
      <el-dialog title="设置操作" :visible.sync="setDialogVisible" v-if="setDialogVisible">
        <span>
          <el-transfer
            v-model="svalue"
            :data="sdata"
            :titles="['待选操作','已选操作']"
            @change="handleChange"
          ></el-transfer>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="setDialogVisible = false;setSave()">确 定</el-button>
        </span>
      </el-dialog>
      <!--设置操作end-->
    </ContentWrapper>
  </ContentCard>
</template>

<script>
import _ from 'gateschema'
import ButtonGroupForListPage from '@/components/ButtonGroupForListPage'
import { ContentWrapper, Table, utils } from 'admin-toolkit'
export default {
  components: {
    Table,
    ContentWrapper,
    ButtonGroupForListPage
  },
  data() {
    return {
      filter: {
        sort: undefined,
        order: undefined
      },
      filterSchema: null,
      pagination: {},
      setDialogVisible: false, // 弹框默认关闭
      svalue: [], // 右边数据
      sdata: [], // 弹框全部数据
      allData: [], // 弹框数据
      setMenuId: [], // 弹窗对象Id
      setMenu: [], // 弹框对象
      selectMenu: [], // 选中数据
      data1: [], // 待选数据
      data2: [], // 已选数据
      selected: [],
      buttonList: [],
      table: {
        props: {},
        header: [
          {
            label: '菜单ID',
            prop: 'menuId'
          },
          {
            label: '菜单名称',
            prop: 'menuName'
          },
          {
            label: '元素ID',
            prop: 'elid'
          },
          {
            label: '图标样式',
            prop: 'iconClass'
          },
          {
            label: '标签ID',
            prop: 'tabId'
          },
          {
            label: '标签名称',
            prop: 'tabTitle'
          },
          {
            label: '标签图标',
            prop: 'tabIcon'
          },
          {
            label: '跳转地址URL',
            prop: 'iframeUrl'
          },
          {
            label: '排序',
            prop: 'seq'
          },
          {
            label: '菜单目录',
            prop: 'modle'
          },
          {
            label: '禁用',
            prop: 'disabled'
          },
          {
            label: '父菜单ID',
            prop: 'pmid'
          },
          {
            label: '操作',
            fixed: 'right',
            render: utils.component.createOperationRender(this, {
              setData: '设置操作'
            })
          }
        ],
        data: [],
        selected: [],
        selectionType: 'multiple'
      }
    }
  },
  methods: {
    // click (index) {
    //   const methodsMap = ['addData', 'editData', 'deleteData', 'selectData', 'handleFilterReset', 'printData', 'importData', 'exportData', 'dealData']
    //   const method = methodsMap[index]
    //   if (index == null) {
    //     return this.$message({
    //       type: 'error',
    //       message: '点击失败'
    //     })
    //   }
    //   if(index === 1){
    //     if (this.selected.length==0) {
    //        this.$message('请选择一条数据')
    //     }
    //     else if(this.selected.length >1){
    //        this.$message('只能选择一条数据')
    //     }
    //     else{
    //       this[method](this.selected[0])
    //     }
    //   } else {
    //     this[method]()
    //   }

    // },
    /**
     * 新增
     */
    addData() {
      this.$emit('open-add-page', null)
    },
    /**
     * 编辑
     */
    editData() {
      if (this.$isAllowEdit(this.selected)) {
        this.$emit('open-add-page', this.selected[0])
      }
    },
    /**
     * 批量删除
     */
    deleteData() {
      if (this.selected.length === 0) {
        this.$message('请选择再删除')
        return
      }
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$service
          .deleteMenuById({ id: this.selected.join(',') }, '删除成功')
          .then(data => {
            this.handleAllRowSelectionRemove()
            this.fetchData()
          })
      })
    },
    handleCreate() {
      this.$router.push({ name: 'prize-create' })
    },
    // 表格操作
    handleRowSelectionAdd(targetItem) {
      this.selected.push(targetItem.menuId)
      this.updateTableSelected()
    },
    handleRowSelectionRemove(targetItem) {
      this.selected = this.selected.filter(item => {
        return item !== targetItem.menuId
      })
      this.updateTableSelected()
    },
    handleAllRowSelectionChange(value) {
      if (value) {
        this.table.data.forEach(this.handleRowSelectionAdd)
      } else {
        this.selected = []
        this.table.selected = []
      }
    },
    handleAllRowSelectionRemove() {
      this.selected = []
      this.table.selected = []
    },
    updateTableSelected() {
      const table = this.table
      const newSelectedIndex = this.selected
      table.selected = table.data.reduce((result, item, index) => {
        if (newSelectedIndex.indexOf(item.menuId) > -1) {
          result.push(index)
        }
        return result
      }, [])
    },
    // 查询
    handleFilterChange(type, filter) {
      if (filter) { this.filter = filter}
      if (this.$validateId([
        { label: 'ID', value: this.filter.elid },
        { label: '标签ID', value: this.filter.tabId },
        { label: '菜单父ID', value: this.filter.pmid }
      ])) {
        if (type === 'query') {
          if (this.pagination) {
            this.pagination.currentPage = 1
          }
        }
        this.fetchData()
      }
    },
    // 重置
    handleFilterReset() {
      this.filter = {
        sort: undefined,
        order: undefined
      }
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
      this.$service.getSysMenuList(filter).then(data => {
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    },
    /**
     * 获取menuInfoTree
     */
    getSysMenuInfo() {
      return this.$service.getMenuInfo().then(data => {
        this.buttonList = data
      })
    },
    /**
     * 设施操作
     */
    setData({ row }) {
      this.setDialogVisible = true
      const MenuObj = { menuId: row.menuId }
      var newData = []
      var rightData = []
      var rightData1 = []
      this.setMenuId = row.menuId
      this.$service.getNotMenuByRunId(MenuObj).then(data => {
        this.data1 = data // 待选数据
        this.$service.getMenuByRunId(MenuObj).then(data => {
          this.data2 = data // 已选数据
          this.allData = this.data1.concat(this.data2)
          // 数组对象去重
          const obj = {}
          this.allData = this.allData.reduce(function(item, next) {
            obj[next.runId] ? '' : (obj[next.runId] = true && item.push(next))
            return item
          }, []) // 全部数据
          for (let i = 0; i < this.allData.length; i++) {
            newData.push({
              key: this.allData[i].runId,
              label: this.allData[i].runName
            })
          }
          for (let j = 0; j < this.data2.length; j++) {
            rightData.push(this.data2[j].runId)
          }
          for (let k = 0; k < rightData.length; k++) {
            if (rightData1.indexOf(rightData[k]) == -1) {
              rightData1.push(rightData[k])
            }
          }
          this.sdata = newData
          this.svalue = rightData1
          console.log(newData)
          console.log(rightData1)
        })
      })
    },
    // 选中操作
    handleChange(value, direction, movedKeys) {
      var str = []
      // 去重
      for (var i = 0; i < value.length; i++) {
        if (str.indexOf(value[i]) == -1) {
          str.push(value[i])
        }
      }
      const select = str.join(',')
      this.setMenu = select
    },
    // 弹框保存事件
    setSave() {
      const menuId = this.setMenuId
      const runIds = this.setMenu
      this.$service.saveMenuRun({ menuId: menuId, runIds: runIds }, '保存成功').then(() => {
        this.setDialogVisible = false
        this.fetchData()
      })
    }
  },
  created() {
    let filterSchema = _.map({
      menuName: _.o.string.other('form', {
        component: 'Input',
        placeholder: '菜单名称'
      }),
      elid: _.o.string.other('form', {
        component: 'Input',
        placeholder: 'ID'
      }),
      tabId: _.o.string.other('form', {
        component: 'Input',
        placeholder: '标签ID'
      }),
      iframeUrl: _.o.string.other('form', {
        component: 'Input',
        placeholder: '跳转地址URL'
      }),
      modle: _.o.string.other('form', {
        component: 'Input',
        placeholder: '菜单目录'
      }),
      pmid: _.o.string.other('form', {
        component: 'Input',
        placeholder: '菜单父ID'
      }),
      disabled: _.o.enum({ 否: '0', 是: '1' }).other('form', {
        component: 'Select',
        placeholder: '是否禁用'
      })
    }).other('form', {
      cols: {
        item: 6,
        label: 0,
        wrapper: 20
      },
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
    this.getSysMenuInfo()
  }
}
</script>
<style lang = 'stylus' scoped>
.btns {
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
}
</style>
