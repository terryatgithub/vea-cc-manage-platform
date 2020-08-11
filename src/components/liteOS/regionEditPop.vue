<template>
  <div>
    <el-table
      ref="singleTable"
      :data="tableData"
      highlight-current-row
      @current-change="handleCurrentChange"
      style='width: 100%;overflow: auto'
      height='300'
    >
      <el-table-column
        width="50">
        <template slot-scope="scope">
          <el-radio :label='scope.row.rlsId' v-model='radio'>&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column
        property="rlsId"
        label="区域ID"
        width="100">
      </el-table-column>
      <el-table-column
        property="ctmDevCtrName"
        label="区域名"
        width="200">
      </el-table-column>
      <el-table-column
        property="address"
        label="区域详情"
        width="120">
        <template slot-scope="scope">
          <el-button @click="handleDetail(scope.row)" type="text" size="small">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">
        取消
      </el-button>
      <el-button type="primary" @click="create">
        确定
      </el-button>
    </div>
  </div>
</template>
<script>
// import Bus from '@/assets/Bus.js'
export default {
  data () {
    return {
      tableData: [],
      currentRow: null,
      total: 0, // 总记录数
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页显示10条数据
      radio: null // 如果使用单选框，定义一个model值
    }
  },
  methods: {
    fetchData () {
      const params = {
        page: this.currentPage,
        size: this.pageSize
      }
      this.$service.queryAreaManageListPage(params).then(data => {
        if (data.code === 0) {
          this.tableData = data.data.results
        } else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
      })
    },
    cancel () {
      this.$emit('close')
      this.$emit('getRegion', '')
    },
    create () {
      if (this.radio) {
        this.$emit('close')
      } else {
        this.$message({
          type: 'error',
          message: '请选择一项！'
        })
      }
    },
    handleDetail (row) {
      this.$emit('regionDetail', row.rlsId)
    },
    // 列表特定操作时可调用，如取消选择
    setCurrent (row) {
      this.$refs.singleTable.setCurrentRow(row)
    },
    // 列表选中时触发
    handleCurrentChange (val) {
      this.radio = val.rlsId
      this.$emit('getRegion', val.rlsId, val.ctmDevCtrName)
    }
  },
  created () {
    this.fetchData()
  }
}
</script>
<style lang="scss">
.form-inline {
  display: flex;
  .el-form-item {
    flex-grow: 1;
    margin-right: 15px!important;
  }
}
.dialog-footer {
  margin-top: 20px;
  .el-button {
    width: 90px;
  }
}
</style>
