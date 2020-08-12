<template>
  <div>
    <!-- 选择区域 -->
    <el-table
      ref="singleTable"
      :data="tableData"
      highlight-current-row
      @current-change="handleCurrentChange"
      style="width: 100%;overflow: auto"
      height="300"
    >
      <el-table-column width="50">
        <template slot-scope="scope">
          <el-radio :label="scope.row.rlsId" v-model="radio">&nbsp;</el-radio>
        </template>
      </el-table-column>

      <el-table-column property="rlsId" label="区域ID" width="100">
      </el-table-column>

      <el-table-column property="ctmDevCtrName" label="区域名" width="200">
      </el-table-column>

      <el-table-column property="address" label="区域详情" width="120">
        <template slot-scope="scope">
          <el-button @click="handleDetail(scope.row)" type="text" size="small"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 查看区域详情 -->
    <el-dialog
      title="查看区域详情"
      :visible.sync="showRegionDetailDialog"
      append-to-body
      center
    >
      <el-form class="detailForm">
        <el-form-item label="区域名:">
          {{ regionData.ctmDevCtrName }}
        </el-form-item>
        <el-form-item label="客户&品牌:">
          <el-tag
            type="warning"
            v-for="item in regionData.brandNames"
            :key="item"
            >{{ item }}</el-tag
          >
        </el-form-item>
        <el-form-item label="机芯&机型:">
          <el-tag
            type="warning"
            v-for="item in regionData.devices"
            :key="item"
            >{{ item }}</el-tag
          >
        </el-form-item>
        <el-form-item label="国家:">
          <el-tag
            type="warning"
            v-for="item in regionData.countryNames"
            :key="item"
            >{{ item }}</el-tag
          >
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="showRegionDetailDialog = false">取 消</el-button> -->
        <el-button type="primary" @click="showRegionDetailDialog = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      currentRow: null,
      total: 0, // 总记录数
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页显示10条数据
      radio: null, // 如果使用单选框，定义一个model值
      showRegionDetailDialog: false, //显示区域详情对话框
      regionData: {}
    };
  },
  methods: {
    fetchData() {
      const params = {
        page: this.currentPage,
        size: this.pageSize
      };
      this.$service.queryAreaManageListPage(params).then(data => {
        if (data.code === 0) {
          this.tableData = data.data.results;
        } else {
          this.$message({
            type: "error",
            message: data.msg
          });
        }
      });
    },
    // 列表特定操作时可调用，如取消选择
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    // 列表选中时触发
    handleCurrentChange(val) {
      this.radio = val.rlsId;
      this.$emit("getRegion", val.rlsId, val.ctmDevCtrName);
    },
    handleDetail(row) {
      this.showRegionDetailDialog = true;
      this.getRegionDetail(row.rlsId);
    },
    getRegionDetail(id) {
      this.$service.getAreaManageRlsId({ rlsId: id }).then(data => {
        if (data.code === 0) {
          this.regionData = data.data;
          this.regionData.brandNames = this.regionData.brandNames.split(",");
          this.regionData.devices = this.regionData.devices.split(",");
          this.regionData.countryNames = this.regionData.countryNames.split(
            ","
          );
        } else {
          this.$message({
            type: "error",
            message: data.msg
          });
        }
      });
    }
  },
  created() {
    this.fetchData();
  }
};
</script>
<style lang="scss">
.form-inline {
  display: flex;
  .el-form-item {
    flex-grow: 1;
    margin-right: 15px !important;
  }
}
.dialog-footer {
  margin-top: 20px;
  .el-button {
    width: 90px;
  }
}

.detailForm {
  .el-form-item {
    .el-form-item__label {
      width: 90px;
      text-align: right;
    }
    .el-form-item__content {
      width: 350px;
      display: inline-block;
    }
    .el-tag {
      margin: 0 10px;
    }
  }
}
</style>
