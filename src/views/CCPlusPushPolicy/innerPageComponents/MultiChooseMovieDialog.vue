<template>
  <ContentCard class="ccplus-choose-movie-dialog-content">
    <ContentWrapper :pagination="pagination" @filter-change="fetchData">
      <h2>选择影片</h2>
      <el-form ref="CCChooseMovieForm" :model="filter" inline>
        <el-form-item prop="supplier" class="el-form-width">
          <el-select
            placeholder="来源"
            clearable=""
            v-model="filter.supplier"
            multiple
          >
            <el-option
              v-for="option in sourceOptions"
              :label="option.supplier"
              :key="option.supplier"
              :value="option.supplier"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="category" class="el-form-width">
          <el-select
            placeholder="类型"
            clearable=""
            v-model="filter.category"
            multiple
          >
            <el-option
              v-for="option in categoryOptions"
              :label="option.category"
              :key="option.category"
              :value="option.category"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="tag" class="el-form-width">
          <el-select
            placeholder="标签"
            clearable=""
            v-model="filter.tag"
            multiple
          >
            <el-option
              v-for="option in tagOptions"
              :label="option.tag"
              :key="option.tag"
              :value="option.tag"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="影片名称" prop="title" class="el-form-searchbar">
          <el-input
            v-model="filter.title"
            placeholder="请输入影片名称，支持模糊查询"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click="handleFilterChange" type="primary"
            >搜 索</el-button
          >
        </el-form-item>
      </el-form>
      <hr />

      <Table
        ref="tableScroll"
        :props="table.props"
        :header="table.header"
        :data="table.data"
        :selection-type="table.selectionType"
        :selected="tableSelected"
        @row-selection-remove="rowSelectionRemove"
        @row-selection-add="rowSelectionAdd"
        @row-click="rowClick"
        @selection-change="handleSelectionChange"
      />
    </ContentWrapper>
    <div class="footer">
      <el-button type="primary" @click="handlerFinish(true)">确 认</el-button>
      <el-button @click="handlerFinish(false)">取 消</el-button>
    </div>
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
      tableSelected: [], //保存复选的多选项
      table: {
        selectionType: "multiple",
        props: {
          "max-height": 400
        },
        data: [],
        header: [
          // {
          //   // prop: '',
          //   label: "选择",
          //   "min-width": 50,
          //   align: "center",
          //   render: (h, { row }) => {
          //     const self = this;
          //     return h(
          //       "el-table-column",
          //       {
          //         props: {
          //           type: 'selection'
          //         },
          //       },
          //       ""
          //     );
          //   }
          // },
          {
            prop: "title",
            label: "影片名称",
            // sortable: true,
            "min-width": 100,
            align: "center"
          },
          {
            prop: "mediaPic",
            label: "海报",
            // sortable: true,
            "min-width": 100,
            align: "center",
            render: (h, { row }) => {
              return h("el-image", {
                style: {
                  height: "100px"
                },
                attrs: {
                  src: row.mediaPic
                },
                props: {
                  fit: "contain",
                  "preview-src-list": [row.mediaPic]
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
    handleSelectionChange(val) {
      // todo
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
        supplier: [],
        category: [],
        tag: [],
        title: ""
      };
    },
    scrollTableTop() {
      document.getElementsByClassName(
        //换页后滚动到顶部
        "el-table__body-wrapper"
      )[0].scrollTop = 0;
    },
    resetTableData() {
      this.radioUserSelect = -1; //reset index
      this.table.data.splice(0);
    },
    async fetchData() {
      const filter = this.parseFilter();
      let res = await this.$service.queryCCPlusMediaResourceNew(filter);
      if (res.code === 0) {
        this.resetTableData();
        this.pagination.total = res.data.total;
        const { results } = res.data;
        const { data } = this.table;
        results.forEach((item, index) => {
          data.push({});
          data[index].mediaResourcesId = item.mediaResourcesId;
          data[index].title = item.title;
          data[index].mediaPicType = item.posterType;
          data[index].mediaPic = item.posterUrl;
          data[index].detailSeq = index;
        });
        this.scrollTableTop();
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
      filter.page = pagination.currentPage;
      filter.size = pagination.pageSize;
      return filter;
    },
    handleFilterChange() {
      this.$refs.CCChooseMovieForm.validate(valid => {
        if (valid) {
          this.pagination.currentPage = 1;
          this.pagination.total = 0;
          let filter = {};
          filter.templateType = this.$attrs.templateType;
          filter.supplier = this.filter.supplier.join(",");
          filter.category = this.filter.category.join(",");
          filter.tag = this.filter.tag.join(",");
          this.filter.title && (filter.title = this.filter.title);
          this.efficientFilter = cloneDeep(filter);
          this.fetchData();
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.el-form-width
  width 30%
.el-form-searchbar
  width 75%
  >>> .el-form-item__content
    width calc(100% - 70px)
.footer
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
</style>
<style lang="stylus"></style>
