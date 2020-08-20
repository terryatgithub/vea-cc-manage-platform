<template>
  <div>
    <el-form :inline="true" :model="formInline" class="form-inline">
      <el-form-item class="">
        <el-input v-model="formInline.materialName" placeholder="请输入应用名" clearable maxlength="99"></el-input>
      </el-form-item>
      <el-form-item class="">
        <el-select v-model="formInline.materialType" placeholder="请选择应用类型" clearable>
          <el-option
            v-for="item in typeOptions"
            :key="item.key"
            :label="item.typeName"
            :value="item.typeName"
          />
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
      v-el-table-infinite-scroll="load"
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
      typeOptions: [
        { key: '1', typeName: '财务' },
        { key: '2', typeName: '儿童' },
        { key: '3', typeName: '参考' },
        { key: '4', typeName: '工具' },
        { key: '5', typeName: '购物' },
        { key: '6', typeName: '健康健美' },
        { key: '7', typeName: '教育' },
        { key: '8', typeName: '旅游' },
        { key: '9', typeName: '美食' },
        { key: '10', typeName: '商务' },
        { key: '11', typeName: '社交' },
        { key: '12', typeName: '生活' },
        { key: '13', typeName: '体育' },
        { key: '14', typeName: '天气' },
        { key: '15', typeName: '图书' },
        { key: '16', typeName: '新闻' },
        { key: '17', typeName: '音乐' },
        { key: '18', typeName: '娱乐' }
      ],
      tableData: [],
      currentRow: null,
      total: 0, // 总记录数
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页显示10条数据
      radio: null, // 如果使用单选框，定义一个model值
      isLoad: false
    }
  },
  methods: {
    fetchData () {
      const params = {
        page: this.currentPage,
        size: this.pageSize,
        materialState: 1,
        materialName: this.formInline.materialName,
        materialType: this.formInline.materialType
      }
      this.$service.queryAppManageListPage(params).then(data => {
        if (data.code === 0) {
          this.currentPage !== 1
            ? this.tableData = this.tableData.concat(data.data.results)
            : this.tableData = data.data.results
          if (this.tableData.length < data.data.total) {
            this.isLoad = true
          } else {
            this.isLoad = false
          }
        } else {
          this.$message({
            type: 'error',
            message: data.msg
          })
        }
      })
    },
    // 滚动加载
    load () {
      if (this.isLoad) {
        this.currentPage += 1
        this.fetchData()
      }
    },
    cancel () {
      this.radio = null
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
      this.currentPage = 1
      this.$refs.singleTable.bodyWrapper.scrollTop = 0
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
