<template>
  <ContentCard class="content">
    <ContentWrapper :pagination="pagination" @filter-change="fetchData">
      <div class="el-row">
        <!-- 过滤表单 -->
        <el-form
          ref="filterForm"
          :rules="filterFormRules"
          :model="filter"
          inline
          label-width="90px"
        >
          <el-form-item class="el-col el-col-6">
            <div class="el-col-20">
              <el-select placeholder="机芯" clearable>
                <el-option
                  v-for="item in typeOptions"
                  :key="item.key"
                  :label="item.typeName"
                  :value="item.key"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item class="el-col el-col-6">
            <div class="el-col-20">
              <el-select placeholder="机型" clearable>
                <el-option
                  v-for="item in typeOptions"
                  :key="item.key"
                  :label="item.typeName"
                  :value="item.key"
              /></el-select>
            </div>
          </el-form-item>
          <el-form-item class="el-col el-col-6">
            <div class="el-col-20">
              <el-cascader
                placeholder="国家"
                v-model="filter['filmDetailPageInfo.channel']"
                :options="channelOptions"
                expand-trigger="hover"
                clearable
                @change="handleChannelChange"
              ></el-cascader>
            </div>
          </el-form-item>
          <el-form-item class="el-col el-col-6">
            <div class="el-col-20">
              <el-select placeholder="版本" clearable>
                <el-option
                  v-for="item in typeOptions"
                  :key="item.key"
                  :label="item.typeName"
                  :value="item.key"
                />
              </el-select>
            </div>
          </el-form-item>
          <el-form-item class="el-col el-col-6">
            <div class="el-col-20">
              <el-select placeholder="品牌" clearable>
                <el-option
                  v-for="item in typeOptions"
                  :key="item.key"
                  :label="item.typeName"
                  :value="item.key"
                />
              </el-select>
            </div>
          </el-form-item>
          <el-form-item class="el-col el-col-6">
            <div class="el-col-20">
              <el-select placeholder="客户" clearable>
                <el-option
                  v-for="item in typeOptions"
                  :key="item.key"
                  :label="item.typeName"
                  :value="item.key"
                />
              </el-select>
            </div>
          </el-form-item>
          <el-form-item class="el-col el-col-6">
            <div class="el-col-20">
              <el-input placeholder="策略名称" clearable></el-input>
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
        currentPage: 1
      },
      channelOptions: [],
      table: {
        props: {},
        data: [],
        header: [
          {
            prop: "tabId",
            label: "策略ID",
            sortable: true,
            width: 100
          },
          {
            prop: "auditor",
            label: "策略名称",
            sortable: true,
            width: 100
          },
          {
            prop: "modifierName",
            label: "国家",
            sortable: true,
            width: 100
          },
          {
            prop: "auditor",
            label: "区域",
            sortable: true,
            width: 180
          },
          {
            prop: "modifierName",
            label: "优先级",
            sortable: true,
            width: 100
          },
          {
            prop: "modifierName",
            label: "支持版本",
            sortable: true,
            width: 140
          },
          {
            prop: "modifierName",
            label: "状态",
            sortable: true,
            width: 100
          },
          {
            prop: "lastUpdateDate",
            label: "发布开始时间",
            sortable: true,
            width: 180
          },
          {
            prop: "lastUpdateDate",
            label: "发布结束时间",
            sortable: true,
            width: 180
          },
          {
            prop: "auditor",
            label: "操作用户",
            sortable: true,
            width: 100
          },
          {
            prop: "lastUpdateDate",
            label: "最近上线时间",
            sortable: true,
            width: 180
          },
          {
            label: "操作",
            width: 180,
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
        ]
      },
      typeOptions: [
        { key: "1", typeName: "财务" },
        { key: "2", typeName: "儿童" },
        { key: "3", typeName: "参考" },
        { key: "4", typeName: "工具" },
        { key: "5", typeName: "购物" }
      ]
    };
  },
  methods: {
    genDefaultFilter() {
      return {
        tabType: 3,
        tabId: undefined,
        tabName: undefined,
        tabStatus: undefined,
        "filmDetailPageInfo.source": undefined,
        "filmDetailPageInfo.channel": [],
        "filmDetailPageInfo.category": undefined,
        "filmDetailPageInfo.product": undefined,
        "filmDetailPageInfo.matchType": undefined,
        "filmDetailPageInfo.videoId": undefined
      };
    },
    fetchData() {
      const filter = this.parseFilter();
      this.$service.tabInfoList(filter).then(data => {
        this.pagination.total = data.total;
        this.table.data = data.rows;
      });
    },
    parseFilter() {
      const { pagination } = this;
      const filter = JSON.parse(JSON.stringify(this.efficientFilter));
      if (pagination) {
        filter.page = pagination.currentPage;
        filter.rows = pagination.pageSize;
      }
      const channel = filter["filmDetailPageInfo.channel"][1];
      if (channel) {
        filter["filmDetailPageInfo.channel"] = channel;
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
      this.filter = this.genDefaultFilter();
      this.efficientFilter = this.genDefaultFilter();
      this.pagination.currentPage = 1;
      this.fetchData();
    },
    getMediaResourceInfo() {
      // 获取查询条件
      //   let data = await this.$service.getMediaResourceInfo();
      return this.$service.getMediaResourceInfo().then(data => {
        var movieData = JSON.parse(decodeURI(data.slice(5, -1)));
        var videoItemModels = movieData.videoItemModels;
        //频道-爱奇艺 channelOptions
        var channelQiyi = {
          label: "爱奇艺",
          value: "iqiyi",
          children: []
        };
        channelQiyi.children = videoItemModels[0].categoryList.reduce(
          (result, item) => {
            return result.concat({
              label: item.category_name,
              value: item.cc_category_id
            });
          },
          []
        );
        var channelTent = {
          label: "腾讯",
          value: "qq",
          children: []
        };
        channelTent.children = videoItemModels[1].categoryList.reduce(
          (result, item) => {
            return result.concat({
              label: item.category_name,
              value: item.cc_category_id
            });
          },
          []
        );
        var channelYouku = {
          label: "优酷",
          value: "youku",
          children: []
        };
        channelYouku.children = videoItemModels[2].categoryList.reduce(
          (result, item) => {
            return result.concat({
              label: item.category_name,
              value: item.cc_category_id
            });
          },
          []
        );
        this.channelOptions.push(channelQiyi);
        this.channelOptions.push(channelTent);
        this.channelOptions.push(channelYouku);
      });
    },
    handleChannelChange(value) {
      this.filter["filmDetailPageInfo.source"] = value[0];
    },
    handleCreate() {
      //新增
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
        })
        .catch(() => {});
    },
    handleEdit(row) {
      //编辑
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
    this.getMediaResourceInfo().then(() => {});
    this.fetchData();
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
