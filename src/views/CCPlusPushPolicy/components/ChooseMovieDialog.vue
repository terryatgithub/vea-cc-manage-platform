<template>
  <ContentCard class="content">
    <ContentWrapper :pagination="pagination" @filter-change="fetchData">
      <el-form ref="CCChooseMovieForm" :model="filter" inline>
        <el-form-item prop="supplier">
          <el-select placeholder="来源" clearable="" v-model="filter.supplier">
            <el-option
              v-for="option in sourceOptions"
              :label="option.supplier"
              :key="option.supplier"
              :value="option.supplier"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="category">
          <el-select placeholder="类型" clearable="" v-model="filter.category">
            <el-option
              v-for="option in categoryOptions"
              :label="option.category"
              :key="option.category"
              :value="option.category"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="tag">
          <el-select placeholder="标签" clearable="" v-model="filter.tag">
            <el-option
              v-for="option in tagOptions"
              :label="option.tag"
              :key="option.tag"
              :value="option.tag"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="影片名称" prop="title">
          <el-input
            v-model="filter.title"
            placeholder="请输入影片名称，支持模糊查询"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click="handleFilterChange">搜索</el-button>
        </el-form-item>
      </el-form>
      <hr />

      <Table :props="table.props" :header="table.header" :data="table.data" />

      <div>
        <br />
        <br />
        <el-button type="primary" @click="handlerFinish(true)">确定</el-button>
        <el-button @click="handlerFinish(false)">取消</el-button>
      </div>
    </ContentWrapper>
  </ContentCard>
</template>

<script>
//'选择影片'弹窗组件
import { ContentWrapper, Table } from "admin-toolkit";
import BaseList from "@/components/BaseList";
import { cloneDeep } from "lodash";

export default {
  name: "ChooseMovieDialog",
  extends: BaseList,
  components: {
    ContentWrapper,
    Table
  },
  data() {
    return {
      radioUserSelect: -1,
      sourceOptions: [],
      categoryOptions: [],
      tagOptions: [],
      filter: this.genDefaultFilter(),
      efficientFilter: this.genDefaultFilter(),
      pagination: {
        currentPage: 1,
        pageSize: 10
      },
      table: {
        props: {},
        data: [],
        header: [
          {
            // prop: '',
            label: "选择",
            width: 50,
            render: (h, { row }) => {
              const self = this;
              return h(
                "el-radio",
                {
                  props: {
                    label: this.radioUserSelect,
                    value: row.detailSeq
                  },
                  on: {
                    change: function(event) {
                      // self.$emit('change', event)
                      self.radioUserSelect = event;
                    }
                  }
                },
                ""
              );
            }
          },
          {
            prop: "title",
            label: "影片名称",
            // sortable: true,
            width: 100
          },
          {
            prop: "mediaPicType",
            label: "海报类型",
            // sortable: true,
            width: 100,
            render(h, { row }) {
              return row.mediaPicType === "vertical"
                ? "竖图"
                : row.mediaPicType === "horizontal"
                ? "横图"
                : "方图";
            }
          },
          {
            prop: "mediaPic",
            label: "海报",
            // sortable: true,
            width: 100,
            render: (h, { row }) => {
              return h("el-image", {
                attrs: {
                  src: row.mediaPic
                }
              });
            }
          }
        ]
      }
    };
  },
  created() {
    this.getAllSelections();
  },
  activated() {
    this.getAllSelections();
  },
  deactivated() {
    this.uninit();
  },
  methods: {
    uninit() {
      this.$refs.CCChooseMovieForm.resetFields();
      this.table.data = [];
      this.radioUserSelect = -1;
    },
    handlerFinish(confirm) {
      let selected = null;
      if (confirm) {
        if (this.radioUserSelect === -1) {
          this.$message({
            type: "error",
            message: "请先选择替换的影片"
          });
          return;
        }
        selected = Object.assign({}, this.table.data[this.radioUserSelect]);
      }
      this.$emit("done-movie-replace", selected);
      this.uninit();
    },
    async getAllSelections() {
      let res = await this.$service.queryCCPlusMediaResourceAllSelect();
      if (res.code === 0) {
        this.sourceOptions = res.data.supplierList;
        this.categoryOptions = res.data.categoryList;
        this.tagOptions = res.data.tagList;
      } else {
        this.$message({
          type: "error",
          message: res.msg
        });
      }
    },
    genDefaultFilter() {
      return {
        page: 1,
        size: 10,
        templateType: "",
        supplier: "",
        category: "",
        tag: "",
        title: ""
      };
    },
    async fetchData() {
      const filter = this.parseFilter();
      let res = await this.$service.queryCCPlusMediaResourceNew(filter);
      if (res.code === 0) {
        this.radioUserSelect = -1; //reset index
        this.pagination.total = res.total;
        const { results } = res.data;
        this.table.data.splice(0);
        const { data } = this.table;
        results.forEach((item, index) => {
          data.push({});
          let len = data.length - 1;
          data[len].mediaResourcesId = item.mediaResourcesId;
          data[len].title = item.title;
          data[len].mediaPicType = item.posterType;
          data[len].mediaPic = item.posterUrl;
          data[len].detailSeq = index;
        });
      } else {
        this.$message({
          type: "error",
          message: res.msg
        });
      }
    },
    parseFilter() {
      const { pagination } = this;
      const filter = JSON.parse(JSON.stringify(this.efficientFilter));
      if (pagination) {
        filter.page = pagination.currentPage;
        filter.size = pagination.pageSize;
      }
      filter.templateType = this.$attrs.templateType;
      // filter.supplier = this.filter.supplier.join(",")
      // filter.category = this.filter.category.join(",")
      // filter.tag = this.filter.tag.join(",")
      // filter.title = this.filter.title
      return filter;
    },
    handleFilterChange() {
      this.$refs.CCChooseMovieForm.validate(valid => {
        if (valid) {
          this.pagination.currentPage = 1;
          this.efficientFilter = cloneDeep(this.filter);
          this.fetchData();
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped></style>
