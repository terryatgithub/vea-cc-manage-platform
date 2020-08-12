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
          <el-form-item class="el-col el-col-6" label="品牌">
            <div class="el-col-20">
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

          <el-form-item class="el-col el-col-6" label="客户">
            <div class="el-col-20">
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

          <el-form-item class="el-col el-col-6" label="机芯">
            <div class="el-col-20">
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
          <el-form-item class="el-col el-col-6" label="机型">
            <div class="el-col-20">
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
          <el-form-item class="el-col el-col-6" label="国家">
            <div class="el-col-20">
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
          <el-form-item class="el-col el-col-6" label="版本">
            <div class="el-col-20">
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
              class="el-col-20"
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

          <el-form-item class="el-col el-col-6" label="策略名称">
            <div class="el-col-20">
              <el-input
                placeholder="策略名称"
                clearable
                v-model="filter.releaseConfName"
              ></el-input>
            </div>
          </el-form-item>

          <el-form-item class="el-col el-col-6" label="区域名">
            <div class="el-col-20">
              <el-input
                placeholder="区域名"
                clearable
                v-model="filter.ctmDevCtrName"
              ></el-input>
            </div>
          </el-form-item>

          <el-form-item>
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
import liteOS from "@/assets/liteOS.js";

export default {
  extends: BaseList,
  components: {
    ContentWrapper,
    Table
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
            prop: 'releaseConfId',
            label: '策略ID',
            sortable: true,
            width: 100
          },
          {
            prop: 'releaseConfName',
            label: '策略名称',
            sortable: true,
            width: 100
          },
          {
            prop: 'ctmDevCtrName',
            label: '区域名',
            sortable: true,
            width: 180
          },
          {
            prop: 'ctmDevCtrId',
            label: '区域详情',
            sortable: true,
            width: 100
          },
          {
            prop: 'priority',
            label: '优先级',
            sortable: true,
            width: 100
          },
          {
            prop: 'supportVersion',
            label: '支持版本',
            sortable: true,
            width: 140
          },
          {
            prop: 'releaseStatus',
            label: '状态',
            sortable: true,
            width: 100,
            render: (h, { row }) => {
              if (row.releaseStatus === 0) {
                return '未推送'
              } else if (row.releaseStatus === 1) {
                return '推送中'
              } else if (row.releaseStatus === 2) {
                return '已取消'
              }
            }
          },
          {
            prop: 'releaseStartTime',
            label: '发布开始时间',
            sortable: true,
            width: 180
          },
          {
            prop: 'releaseEndTime',
            label: '发布结束时间',
            sortable: true,
            width: 180
          },
          {
            prop: 'creator',
            label: '操作用户',
            sortable: true,
            width: 100
          },
          {
            prop: 'lastUpdateTime',
            label: '最近上线时间',
            sortable: true,
            width: 180
          },
          {
            label: '操作',
            width: 180,
            fixed: 'right',
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
        ]
      },
      brandOptions: [],
      customerOptions: [],
      countryOptions: [],
      chipOptions: [],
      modelOptions: [],
      versionOptions: [],
      typeOptions: [
        { key: "1", typeName: "财务" },
        { key: "2", typeName: "儿童" },
        { key: "3", typeName: "参考" },
        { key: "4", typeName: "工具" },
        { key: "5", typeName: "购物" }
      ],
      releaseStatusOptions: [
        { typeName: "未推送", key: 0 },
        { typeName: "推送中", key: 1 },
        { typeName: "已取消", key: 2 }
      ]
    };
  },
  methods: {
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
      customerName && (params.customerName = customerName)
      brandName && (params.brandName = brandName)
      this.$service
        .queryCustomerBrandList(params)
        .then(data => {
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
        path: "SecondaryEdit",
        query: {
          id: 0
        }
      });
    },
    handleUp() {
      //发布上线
      this.$confirm("确认发布上线?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          this.$message({
            type: "success",
            message: "发布成功"
          });
        })
        .catch(() => {});
    },
    handleOff() {
      // 取消发布
      this.$confirm("确认取消发布", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          this.$message({
            type: "success",
            message: "取消成功"
          });
        })
        .catch(() => {});
    },
    // 复制
    handleCopy() {
      this.$confirm("确认复制该策略?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          this.$message({
            type: "success",
            message: "复制成功"
          });
          this.$router.push({
            path: "SecondaryEdit",
            query: {
              id: row.tabId
            }
          });
        })
        .catch(() => {});
    },
    handleEdit(row) {
      //编辑 @todo 传数据进去
      this.$router.push({
        path: "SecondaryEdit",
        query: {
          id: row.tabId
        }
      });
    },
    // 删除
    handleDel() {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          this.$message({
            type: "success",
            message: "删除成功"
          });
        })
        .catch(() => {});
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
        return [btn1, btn2, btn3, btn4, btn5];
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
  }
};
</script>

<style lang="stylus" scoped>
.  >>> .el-form-item__content
                width: 100%
                .el-select,.el-cascader
                   width 100%
.content >>> .el-form--inline .el-form-item {
           margin-right: 0px;
}
.content >>> .filter-item
  justify-content: flex-start;
  margin: 10px 0px
</style>
