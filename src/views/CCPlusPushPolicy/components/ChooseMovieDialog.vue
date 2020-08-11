<template>
  <ContentCard class="content">
    <ContentWrapper :pagination="pagination" @filter-change="fetchData">
      <el-form ref="CCChooseMovieForm" :model="form" inline>
        <el-form-item>
          <el-select placeholder="来源" clearable="">
            <el-option
              v-for="item in SourceOptions"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select placeholder="类型" clearable="">
            <el-option
              v-for="item in MovieOptions"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select placeholder="标签" clearable="">
            <el-option
              v-for="item in tagOptions"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="影片名称">
          <el-input
            v-model="form.name"
            placeholder="请输入影片名称，支持模糊查询"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click="handleFilterChange">搜索</el-button>
        </el-form-item>
      </el-form>
      <hr />

      <Table :props="table.props" :header="table.header" :data="table.data" />
    </ContentWrapper>
  </ContentCard>
</template>

<script>
//'选择影片'弹窗组件
import { ContentWrapper, Table } from "admin-toolkit";
import BaseList from "@/components/BaseList";
import { cloneDeep } from "lodash";

export default {
  extends: BaseList,
  data() {
    return {
      SourceOptions: ["iqiyi", "tencent", "youku"],
      MovieOptions: ["man", "kid", "edu"],
      tagOptions: ["good", "common", "bad"],
      form: {
        source: "",
        category: "",
        tag: "",
        name: ""
      },
      filter: this.genDefaultFilter(),
      efficientFilter: this.genDefaultFilter(),
      pagination: {
        currentPage: 1
      },
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
          }
        ]
      },
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
  }
};
</script>

<style lang="stylus" scoped></style>
