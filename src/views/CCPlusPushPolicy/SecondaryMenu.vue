<template>
  <ContentCard class="content">
    <ContentWrapper :pagination="pagination" @filter-change="fetchData">
      <!-- 页头过滤器 -->
      <div class="el-row">
        <el-form
          ref="filterForm"
          :rules="filterFormRules"
          :model="filter"
          inline
          label-width="90px"
        >
          <el-form-item label="品牌">
            <div>
              <el-select
                placeholder="品牌"
                clearable
                v-model="filter.branchName"
                @change="
                  selectBrandorCustomer({ brandName: filter.branchName })
                "
              >
                <el-option
                  v-for="item in brandOptions"
                  :key="item.brandId"
                  :label="item.brandName"
                  :value="item.brandName"
                />
              </el-select>
            </div>
          </el-form-item>

          <el-form-item label="客户">
            <div>
              <el-select
                placeholder="客户"
                clearable
                v-model="filter.customerName"
                @change="
                  selectBrandorCustomer({ customerName: filter.customerName })
                "
              >
                <el-option
                  v-for="item in customerOptions"
                  :key="item.customerId"
                  :label="item.customerName"
                  :value="item.customerName"
                />
              </el-select>
            </div>
          </el-form-item>

          <el-form-item label="机芯">
            <div>
              <el-select
                placeholder="机芯"
                clearable
                v-model="filter.chip"
                @change="selectChip"
              >
                <el-option
                  v-for="item in chipOptions"
                  :key="item.chip"
                  :label="item.chip"
                  :value="item.chip"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="机型">
            <div>
              <el-select
                placeholder="机型"
                clearable
                v-model="filter.model"
                @change="selectModel"
              >
                <el-option
                  v-for="item in modelOptions"
                  :key="item.model"
                  :label="item.model"
                  :value="item.model"
              /></el-select>
            </div>
          </el-form-item>
          <el-form-item label="国家">
            <div>
              <el-cascader
                placeholder="国家"
                v-model="filter.countryName"
                :options="countryOptions"
                expand-trigger="hover"
                clearable
                @change="handleChannelChange"
              ></el-cascader>
            </div>
          </el-form-item>
          <el-form-item label="版本">
            <div>
              <el-select
                placeholder="版本"
                clearable
                v-model="filter.supportVersion"
              >
                <el-option
                  v-for="item in versionOptions"
                  :key="item.versionId"
                  :label="item.supportVersion"
                  :value="item.supportVersion"
                />
              </el-select>
            </div>
          </el-form-item>

          <el-form-item label="状态">
            <el-select
              placeholder="状态"
              clearable=""
              v-model="filter.releaseStatus"
            >
              <el-option
                v-for="item in releaseStatusOptions"
                :key="item.key"
                :label="item.typeName"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="策略名称" prop="releaseConfName">
            <div>
              <el-input
                placeholder="策略名称"
                clearable
                maxlength="99"
                v-model="filter.releaseConfName"
              ></el-input>
            </div>
          </el-form-item>

          <el-form-item label="区域名" prop="ctmDevCtrName">
            <div>
              <el-input
                placeholder="区域名"
                clearable
                maxlength="99"
                v-model="filter.ctmDevCtrName"
              ></el-input>
            </div>
          </el-form-item>

          <el-form-item class="btnBox">
            <el-button type="primary" @click="handleFilterChange"
              >查询</el-button
            >
            <el-button @click="handleFilterReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 按钮：新增 -->
      <el-button
        class="filter-item"
        style="margin-bottom:10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        新增
      </el-button>

      <el-dialog
        title="区域信息"
        :visible.sync="dialogFormVisible"
        width="550px"
        v-if="dialogFormVisible"
      >
        <RegionDetail :id="risId"></RegionDetail>
      </el-dialog>

      <!-- Table显示结果列表 -->
      <Table :props="table.props" :header="table.header" :data="table.data" />
    </ContentWrapper>
  </ContentCard>
</template>

<script>
/**
  酷开LiteOS CC Plus二级菜单页面
 */
import { ContentWrapper, Table } from "admin-toolkit";
import BaseList from "@/components/BaseList";
import { cloneDeep } from "lodash";
import RegionDetail from "@/components/liteOS/regionDetail2";
import liteOS from "@/assets/liteOS.js";

export default {
  name: "SecondaryMenu",
  extends: BaseList,
  components: {
    ContentWrapper,
    Table,
    RegionDetail
  },
  data() {
    return {
      filter: this.genDefaultFilter(),
      efficientFilter: this.genDefaultFilter(),
      pagination: {
        currentPage: 1,
        pageSize: 10
      },
      channelOptions: [],
      table: {
        props: {},
        data: [],
        header: [
          {
            prop: "releaseConfId",
            label: "策略ID",
            sortable: true,
            width: 100
          },
          {
            prop: "releaseConfName",
            label: "策略名称",
            sortable: true,
            width: 100
          },
          {
            prop: "ctmDevCtrName",
            label: "区域名",
            sortable: true,
            width: 180
          },
          {
            prop: "ctmDevCtrId",
            label: "区域详情",
            sortable: true,
            width: 100,
            render: (h, { row }) => {
              return h("i", {
                attrs: {
                  class: "el-icon-view",
                  style: "font-size: 20px; cursor: pointer;"
                },
                on: {
                  click: this.handleShowRegionDetail.bind(this, row.ctmDevCtrId)
                }
              });
            }
          },
          {
            prop: "priority",
            label: "优先级",
            sortable: true,
            width: 100
          },
          {
            prop: "supportVersion",
            label: "支持版本",
            sortable: true,
            width: 140
          },
          {
            prop: "releaseStatus",
            label: "状态",
            sortable: true,
            width: 100,
            render: (h, { row }) => {
              if (row.releaseStatus === 0) {
                return "未发布";
              } else if (row.releaseStatus === 1) {
                return "已发布";
              } else if (row.releaseStatus === 2) {
                return "已取消";
              }
            }
          },
          {
            prop: "releaseStartTime",
            label: "发布开始时间",
            sortable: true,
            width: 180
          },
          {
            prop: "releaseEndTime",
            label: "发布结束时间",
            sortable: true,
            width: 180
          },
          {
            prop: "creator",
            label: "操作用户",
            sortable: true,
            width: 100
          },
          {
            prop: "lastUpdateTime",
            label: "最近上线时间",
            sortable: true,
            width: 180
          },
          {
            label: "操作",
            fixed: "right",
            render: this.operation(this)
          }
        ]
      },
      filterFormRules: {
        tabId: [
          {
            validator(rule, value, cb) {
              if (value && !/^\d+$/.test(value)) {
                return cb(Error("请输入数字"));
              }
              cb();
            }
          }
        ],
        releaseConfName: [
          {
            min: 0,
            max: 99,
            message: "有效长度为0-99个字符",
            trigger: ["blur", "change"]
          }
        ],
        ctmDevCtrName: [
          {
            min: 0,
            max: 99,
            message: "有效长度为0-99个字符",
            trigger: ["blur", "change"]
          }
        ]
      },
      brandOptions: [],
      customerOptions: [],
      countryOptions: [],
      chipOptions: [],
      modelOptions: [],
      versionOptions: [],
      creator: this.$appState.user.name,
      typeOptions: [
        //@todo del
        { key: "1", typeName: "财务" },
        { key: "2", typeName: "儿童" },
        { key: "3", typeName: "参考" },
        { key: "4", typeName: "工具" },
        { key: "5", typeName: "购物" }
      ],
      releaseStatusOptions: [
        { typeName: "未发布", key: 0 },
        { typeName: "已发布", key: 1 },
        { typeName: "已取消", key: 2 }
      ],
      dialogFormVisible: false,
      risId: ""
    };
  },
  methods: {
    handleShowRegionDetail(val) {
      this.dialogFormVisible = true;
      this.risId = val;
    },
    genDefaultFilter() {
      return {
        brandName: undefined,
        customerName: undefined,
        chip: undefined,
        model: undefined,
        countryName: undefined,
        supportVersion: undefined,
        releaseStatus: undefined,
        releaseConfName: undefined,
        ctmDevCtrName: undefined
      };
    },
    fetchData() {
      const filter = this.parseFilter();
      this.$service.queryCCPlusPushManageListPage(filter).then(data => {
        this.pagination.total = data.data.total;
        this.table.data = data.data.results;
      });
    },
    parseFilter() {
      const { pagination } = this;
      const filter = JSON.parse(JSON.stringify(this.efficientFilter));
      if (pagination) {
        filter.page = pagination.currentPage;
        filter.size = pagination.pageSize;
      }
      return filter;
    },
    handleFilterChange() {
      this.$refs.filterForm.validate(valid => {
        if (valid) {
          this.pagination.currentPage = 1;
          this.efficientFilter = cloneDeep(this.filter);
          this.fetchData();
        }
      });
    },
    handleFilterReset() {
      this.pagination.currentPage = 1;
      this.filter = this.genDefaultFilter();
      this.efficientFilter = this.genDefaultFilter();
      this.fetchData();
    },
    selectBrandorCustomer({ customerName = "", brandName = "" }) {
      let params = {};
      customerName && (params.customerName = customerName);
      brandName && (params.brandName = brandName);
      this.$service.queryCustomerBrandList(params).then(data => {
        if (data.code === 0) {
          this.brandOptions = data.data.brandList;
          this.customerOptions = data.data.customerList;
        } else {
          this.$message({
            type: "error",
            message: data.msg
          });
        }
      });
    },
    selectChip(val) {
      this.$service.queryModelChipList({ chip: val, model: "" }).then(data => {
        if (data.code === 0) {
          if (this.filter.model) {
            this.modelOptions = data.data.modelList;
          } else {
            this.chipOptions = data.data.chipList;
            this.modelOptions = data.data.modelList;
          }
        } else {
          this.$message({
            type: "error",
            message: data.msg
          });
        }
      });
    },
    selectModel(val) {
      this.$service.queryModelChipList({ chip: "", model: val }).then(data => {
        if (data.code === 0) {
          if (this.filter.chip) {
            this.chipOptions = data.data.chipList;
          } else {
            this.chipOptions = data.data.chipList;
            this.modelOptions = data.data.modelList;
          }
        } else {
          this.$message({
            type: "error",
            message: data.msg
          });
        }
      });
    },
    getMediaResourceInfo() {
      this.$service.queryCustomerBrandList().then(data => {
        if (data.code === 0) {
          this.brandOptions = data.data.brandList;
          this.customerOptions = data.data.customerList;
        } else {
          this.$message({
            type: "error",
            message: data.msg
          });
        }
      });
      this.$service.queryAreaCountryListAll().then(data => {
        if (data.code === 0) {
          this.countryOptions = liteOS.areaTransform(data.data);
        } else {
          this.$message({
            type: "error",
            message: data.msg
          });
        }
      });
      this.$service.queryModelChipList({ chip: "", model: "" }).then(data => {
        if (data.code === 0) {
          this.chipOptions = data.data.chipList;
          this.modelOptions = data.data.modelList;
        } else {
          this.$message({
            type: "error",
            message: data.msg
          });
        }
      });
      this.$service.queryVersionList().then(data => {
        if (data.code === 0) {
          this.versionOptions = liteOS.versionTransform(data.data);
        } else {
          this.$message({
            type: "error",
            message: data.msg
          });
        }
      });
    },
    handleChannelChange(value) {
      this.filter.countryName = value[1];
    },
    handleCreate() {
      // 新增
      this.$router.push({
        path: "CCPlusSecondaryEdit",
        query: {
          id: 0
        }
      });
    },
    async handleUp(row) {
      //发布上线
      try {
        if (row.releaseStatus == "1") {
          this.$message({
            type: "success",
            message: "已上线"
          });
          return;
        }
        let res = await this.$confirm("确认发布上线?", "提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        });
        if (res == "confirm") {
          res = await this.$service.queryCCPlusUpdatePushStatus({
            releaseConfId: row.releaseConfId,
            releaseStatus: "1",
            creator: this.creator
          });
          if (res.code === 0) {
            this.$message({
              type: "success",
              message: "发布成功"
            });
            this.fetchData();
          } else {
            this.$message({
              type: "error",
              message: res.msg
            });
          }
        }
      } catch (e) {}
    },
    async handleOff(row) {
      // 取消发布
      try {
        if (row.releaseStatus == "2") {
          this.$message({
            type: "success",
            message: "已下线"
          });
          return;
        }
        let res = await this.$confirm("确认取消发布?", "提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        });
        if (res == "confirm") {
          res = await this.$service.queryCCPlusUpdatePushStatus({
            releaseConfId: row.releaseConfId,
            releaseStatus: "2",
            creator: this.creator
          });
          if (res.code === 0) {
            this.$message({
              type: "success",
              message: "取消成功"
            });
            this.fetchData();
          } else {
            this.$message({
              type: "error",
              message: res.msg
            });
          }
        }
      } catch (e) {}
    },
    // 复制
    async handleCopy(row) {
      this.$router.push({
        path: "CCPlusSecondaryEdit",
        query: {
          releaseConfId: row.releaseConfId,
          handleType: "copy"
        }
      });
    },
    async handleEdit(row) {
      //编辑 @todo 传数据进去
      this.$router.push({
        path: "CCPlusSecondaryEdit",
        query: {
          releaseConfId: row.releaseConfId,
          handleType: "edit"
        }
      });
    },
    // 删除
    async handleDel(row) {
      try {
        let res = await this.$confirm("是否确认删除?", "提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        });
        if (res == "confirm") {
          res = await this.$service.queryCCPlusDeletePushManage({
            releaseConfId: row.releaseConfId,
            creator: this.creator
          });
          if (res.code === 0) {
            this.$message({
              type: "success",
              message: "删除成功！"
            });
            this.fetchData();
          } else {
            this.$message({
              type: "error",
              message: res.msg
            });
          }
        }
      } catch (e) {}
    },
    //列表操作
    operation(obj) {
      return (h, { row }) => {
        let btn1 = h(
          "el-button",
          {
            props: {
              type: "text"
            },
            on: {
              click: () => {
                obj.handleUp(row);
              }
            }
          },
          "发布上线"
        );
        let btn2 = h(
          "el-button",
          {
            props: {
              type: "text"
            },
            on: {
              click: () => {
                obj.handleOff(row);
              }
            }
          },
          "取消发布"
        );
        let btn3 = h(
          "el-button",
          {
            props: {
              type: "text"
            },
            on: {
              click: () => {
                obj.handleCopy(row);
              }
            }
          },
          "复制"
        );
        let btn4 = h(
          "el-button",
          {
            props: {
              type: "text"
            },
            on: {
              click: () => {
                obj.handleEdit(row);
              }
            }
          },
          "编辑"
        );
        let btn5 = h(
          "el-button",
          {
            props: {
              type: "text"
            },
            on: {
              click: () => {
                obj.handleDel(row);
              }
            }
          },
          "删除"
        );

        return row.releaseStatus === 1
          ? [btn2, btn3]
          : [btn1, btn3, btn4, btn5];
      };
    }
  },
  created() {
    console.log("cc created");
    this.getMediaResourceInfo();
    this.fetchData();
  },
  mounted() {
    console.log("cc mounted");
  },
  activated() {
    console.log("cc activated");
    this.getMediaResourceInfo();
    this.fetchData();
  },
  deactivated() {
    console.log("cc deactivated");
  }
};
</script>

<style lang="stylus" scoped>
.content  >>> .el-form-item__content
  .el-select,.el-cascader
      width 100%
.content >>> .el-form--inline .el-form-item
  margin-right: 5px;

.content >>> .el-form--inline .el-form-item__label
  text-align: left;

.content >>> .filter-item
  justify-content: flex-start;
  margin: 10px 0px
.content >>> .btnBox
  margin-left: 0px;
.content >>> .btnBox
  .el-form-item__content
    width: 100%
</style>
