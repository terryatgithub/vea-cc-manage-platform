<template>
  <ContentCard class="content">
    <ContentWrapper
      :filter="filter"
      :filterSchema="filterSchema"
      :pagination="pagination"
      @filter-change="handleFilterChange"
      @filter-reset="handleFilterReset"
    >
      <div class="btns">
        <el-button type="primary" icon="el-icon-plus" @click="addData">新增</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="editData">编辑</el-button>
        <el-button type="primary" icon="el-icon-delete" @click="deleteData">删除</el-button>
        <el-button type="primary" icon="el-icon-edit-outline" @click="batchHandle">批量审核</el-button>
        <el-button type="primary" @click="changePriority">调整优先级</el-button>
      </div>
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
    <!-- 预览图片 -->
    <el-dialog title="预览图片" :visible.sync="picDialogVisible" width="30%">
      <span class="pics">
        <img :src="reviewPicUrl" alt="图片" style="width:200px">
      </span>
    </el-dialog>
    <!--批量审核-->
    <el-dialog title="审核" :visible.sync="dialogPLVisible" :before-close="handleDialogClose">
      <GlobalIconAudit @auditForm="submitForm" @cancle="cancle" ref="auditForm"></GlobalIconAudit>
    </el-dialog>
    <!--调整优先级-->
    <el-dialog title="调整优先级" :visible.sync="dialogLevelVisible">
      <!-- <GlobelIconLevel @level="handleLevel"></GlobelIconLevel> -->
      <GlobelIconLevel></GlobelIconLevel>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogLevelVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogLevelVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </ContentCard>
</template>
<script>
import _ from 'gateschema'
import ButtonList from './../../components/ButtonLIst'
import GlobalIconAudit from './GlobalIconAudit'
import GlobelIconLevel from './GlobelIconLevel'
import { ContentWrapper, Table, ActionList, utils } from 'admin-toolkit'
export default {
  components: {
    ActionList,
    Table,
    ContentWrapper,
    GlobalIconAudit,
    GlobelIconLevel
  },
  data() {
    return {
      checkAll: false,
      globalTypes: {
        test1: '1010',
        test2: '1011',
        付费属性: '101',
        排行榜: '103',
        教育角标: '105',
        策划类: '104',
        素材播出属性: '102'
      }, //角标分类
      attributeTypes: {}, //角标类别
      dialogPLVisible: false,
      dialogLevelVisible: false,
      cornerStatuses: {
        // 下架: 0,
        // 上架: 1,
        // 草稿: 2,
        待审核: 3,
        审核通过: 4,
        审核不通过: 5
      },
      typePositions: {
        左上: 0,
        右上: 1,
        左下: 3,
        右下: 2
      },
      picDialogVisible: false, //预览图片弹出框
      reviewPicUrl: null,
      filter: {
        sort: undefined,
        order: undefined
      },
      filterSchema: null,
      pagination: {},
      selected: [],
      table: {
        props: {},
        header: [
          {
            label: 'ID',
            prop: 'cornerIconId'
          },
          {
            label: '角标名称',
            prop: 'cornerIconName',
            render: (createElement, { row }) => {
              return createElement(
                'el-button',
                {
                  attrs: {
                    type: 'text'
                  },
                  on: {
                    click: () => {
                      this.openReview(row)
                    }
                  }
                },
                row.cornerIconName
              )
            }
          },
          {
            label: '图片',
            prop: 'imgUrl',
            render: (createElement, { row }) => {
              return createElement('img', {
                attrs: {
                  src: row.imgUrl,
                  width: '50px',
                  height: '50px',
                  class: 'imgs'
                },
                on: {
                  click: () => {
                    this.reviewPic(row)
                  }
                }
              })
            }
          },
          {
            label: '审核状态',
            prop: 'cornerStatus',
            render: (createElement, { row }) => {
              switch (row.cornerStatus) {
                case 0:
                  return '下架'
                  break
                case 1:
                  return '上架'
                  break
                case 2:
                  return '草稿'
                  break
                case 3:
                  return '待审核'
                  break
                case 4:
                  return '审核通过'
                  break
                case 5:
                  return '审核不通过'
                  break
              }
            }
          }
        ],
        data: [],
        selected: [],
        selectionType: 'multiple'
      }
    }
  },
  methods: {
    //初始化表格
    fetchData() {
      const filter = this.parseFilter()
      this.$service.getGlobalMgrList(filter).then(data => {
        console.log(data)
        this.pagination.total = data.total
        this.table.data = data.rows
      })
    },
    parseFilter() {
      const { filter, pagination } = this
      if (pagination) {
        filter.idPrefix = '10' //10:酷开数据;11:其他地方。默认酷开
        filter.page = pagination.currentPage
        filter.rows = pagination.pageSize
      }
      return filter
    },
    addData() {
      this.$emit('open-add-page', null)
    },
    editData() {
      if (this.$isAllowEdit(this.selected)) {
        this.$emit('open-add-page', this.selected[0])
      }
    },
    deleteData() {
      if (this.selected.length == 0) {
        this.$message('请至少选择一条数据')
      } else {
        if (window.confirm('确定要删除吗')) {
          const ids = this.$service
            .globalCornerIconRemove({ id: this.selected.join(',') }, '删除成功')
            .then(data => {
              this.fetchData()
            })
        }
      }
    },
    //批量审核
    batchHandle() {
      var that = this
      if (that.selected.length == 0) {
        that.$message('最少选择一条数据')
      } else {
        console.log(that.table.data)
        const ids = that.selected
        for (var i = 0; i < ids.length; i++) {
          for (var j = 0; j < that.table.data.length; j++) {
            if (ids[i] == that.table.data[j].cornerIconId) {
              if (that.table.data[j].cornerStatus == 3||that.table.data[j].cornerStatuses == 2) {
                this.dialogPLVisible = true
              } else {
                that.$message('[' + ids[i] + ']' + '不是待审核状态，不允许审核')
              }
            }
          }
        }
      }
    },
    submitForm(data) {
      const auditForm = data
      this.$service
        .batchAudit(
          {
            idStr: this.selected.join(','),
            auditFlag: auditForm.auditFlag,
            auditDesc: auditForm.auditDesc
          },
          '审核成功'
        )
        .then(data => {
          this.fetchData()
          this.$refs.auditForm.cancle()
          this.dialogPLVisible = false
        })
    },
    //取消事件
    cancle(data) {
      this.dialogPLVisible = data
    },
    handleDialogClose() {
      this.$refs.auditForm.cancle()
    },
    changePriority() {
      this.dialogLevelVisible = true
    },
    //预览
    openReview(row) {
      console.log(row)
      // this.$emit('open-view-page', row.cornerIconId)
      this.$emit('open-view-page', row)
    },
    //查询
    handleFilterChange(type) {
      if (type === 'query') {
        if (this.pagination) {
          this.pagination.currentPage = 1
        }
      }
      this.fetchData()
    },
    //重置
    handleFilterReset() {
      this.filter = {
        sort: undefined,
        order: undefined
      }
      this.fetchData()
    },
    //表格操作
    handleRowSelectionAdd(targetItem) {
      this.selected.push(targetItem.cornerIconId)
      this.updateTableSelected()
    },
    handleRowSelectionRemove(targetItem) {
      this.selected = this.selected.filter(item => {
        return item !== targetItem.cornerIconId
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
        if (newSelectedIndex.indexOf(item.cornerIconId) > -1) {
          result.push(index)
        }
        return result
      }, [])
    },
    //角标分类
    getCornerTypes() {
      return this.$service.getCornerTypes().then(data => {
        data.forEach(element => {
          this.globalTypes[element.typeName] = element.typeId
        })
        console.log(this.globalTypes)
      })
    },
    //角标类别
    getIconAttributes() {
      return this.$service.getIconAttributes().then(data => {
        data.attributes.forEach(element => {
          this.attributeTypes[element.attributeName] = element.attributeCode
        })
        console.log(this.attributeTypes)
      })
    },
    reviewPic(row) {
      this.reviewPicUrl = row.imgUrl
      this.picDialogVisible = true
    }
  },
  created() {
    let filterSchema = _.map({
      cornerIconName: _.o.string.other('form', {
        component: 'Input',
        placeholder: '角标名称  ',
        cols: {
          item: 3,
          label: 0
        }
      }),
      cornerIconId: _.o.string.other('form', {
        component: 'Input',
        placeholder: '角标ID',
        cols: {
          item: 3,
          label: 0
        }
      }),
      typeId: _.o.enum(this.globalTypes).other('form', {
        component: 'Select',
        placeholder: '角标分类',
        cols: {
          item: 3,
          label: 0
        }
      }),
      typePosition: _.o.enum(this.typePositions).other('form', {
        component: 'Select',
        placeholder: '角标位置',
        cols: {
          item: 3,
          label: 0
        }
      }),
      attributeCode: _.o.enum(this.attributeTypes).other('form', {
        component: 'Select',
        placeholder: '角标类别',
        cols: {
          item: 3,
          label: 0
        }
      }),
      cornerStatus: _.o.enum(this.cornerStatuses).other('form', {
        component: 'Select',
        placeholder: '审核状态',
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
    this.fetchData()
    this.getCornerTypes().then(() => {
      this.getIconAttributes().then(() => {
        this.filterSchema = filterSchema
      })
    }) //获取角标分类

    //角标类别
  }
}
</script>

<style lang = 'stylus' scoped>
.btns {
  margin-bottom: 10px;
}
</style>
