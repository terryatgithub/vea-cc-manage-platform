<template>
  <div>
    <el-form :inline="true" :model="formInline" class="form-inline">
      <el-form-item class="">
        <el-input v-model="formInline.materialName" placeholder="请输入应用名" clearable></el-input>
      </el-form-item>
      <el-form-item class="">
        <el-select v-model="formInline.materialState" placeholder="请选择应用类型" clearable>
          <el-option value="1" label="有效"/>
          <el-option value="0" label="失效"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
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
          <el-radio :label='scope.row.materialId' v-model='radio'>&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column
        property="materialId"
        label="应用ID"
        width="80">
      </el-table-column>
      <el-table-column
        property="materialName"
        label="应用名"
        width="120">
      </el-table-column>
      <el-table-column
        property="materialType"
        label="类型"
        width="100">
      </el-table-column>
      <el-table-column
        property="materialUrl"
        label="备注">
      </el-table-column>
      <el-table-column
        property="materialUrl"
        label="api">
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">
        取消
      </el-button>
      <el-button type="primary" @click="nextStep">
        下一步
      </el-button>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      formInline: {
        materialName: '',
        materialState: ''
      },
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
        size: this.pageSize,
        materialName: this.formInline.materialName,
        materialState: this.formInline.materialState
      }
      this.$service.queryAppManageListPage(params).then(data => {
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
    },
    nextStep () {
      if (this.radio) {
        this.$emit('appDetail', this.radio)
      } else {
        this.$message({
          type: 'error',
          message: '请选择一项！'
        })
      }
    },
    onSubmit () {
      this.fetchData()
    },
    // 列表特定操作时可调用，如取消选择
    setCurrent (row) {
      this.$refs.singleTable.setCurrentRow(row)
    },
    // 列表选中时触发
    handleCurrentChange (val) {
      this.currentRow = val
      this.radio = val.materialId
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
