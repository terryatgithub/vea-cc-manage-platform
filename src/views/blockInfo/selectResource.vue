<template>
  <ContentCard class="content">
    <ContentWrapper
      :filter="filter"
      :filterSchema="filterSchema"
      :pagination="pagination"
      @filter-change="handleFilterChange"
      @filter-reset="handleFilterReset"
    >
      <CardList
        :data="table.data"
        :selected="table.selected"
        :selection-type="table.selectionType"
        @row-selection-change="handleRowSelectionChange"
      >
      <div class="box-list" slot="row" slot-scope="{row: item}">
        <p class="list-p">
          <img class="list-img" :src="item.pictureUrl" alt="" v-on:click="reviewPic(item.pictureUrl)">
          </p>
        <p class="list-title"> {{item.pictureName}}</p>
          <p style="margin:0">
            <span v-if='item.pictureStatus==1'>审核通过</span>
            <span v-else>待审核</span>
             <span> {{item.pictureResolution}}</span>
          </p>
      </div>
      </CardList>
       <!-- 预览图片 -->
    <el-dialog title="预览图片" :visible.sync="picDialogVisible" append-to-body >
      <span class="pics">
        <img :src="reviewPicUrl" alt="图片" style="width:50%">
      </span>
    </el-dialog>
    </ContentWrapper>
  </ContentCard>
</template>

<script>
import _ from "gateschema";
import { ContentWrapper, Table, CardList, utils } from "admin-toolkit";
export default {
  components: {
    Table,
    ContentWrapper,
    CardList
  },
  data() {
    return {
      materialTypes: {}, //素材类型
      pictureStatus: {
        //状态
        审核通过: 1,
        待审核: 2,
      },
      picDialogVisible: false, //预览图片弹出框
      auditDialogVisible: false, //审核弹出框
      reviewPicUrl: null,
      filter: {
        sort: undefined,
        order: undefined
      },
      filterSchema: null,
      pagination: {},
      selected: [],
      table: {
        props: {},
        header: [
          {
            label: "ID",
            prop: "pictureId",
            width: "70"
          },
          {
            label: "ID",
            prop: "pictureUrl",
            width: "70",
            render: (createElement, { row }) => {
              return createElement("img", {
                attrs: {
                  src: row.pictureUrl,
                  width: "50px",
                  height: "50px",
                  class: "imgs"
                },
                on: {
                  click: () => {
                    this.reviewPic(row);
                  }
                }
              });
            }
          },
          {
            label: "素材名称",
            width: "120",
            prop: "pictureName",
            sortable: true
          },
          {
            label: "分辨率",
            prop: "pictureResolution",
            width: "110",
            sortable: true
          },
          {
            label: "状态",
            prop: "pictureStatus",
            width: "90",
            render: (createElement, { row }) => {
              switch (row.pictureStatus) {
                case 0:
                  return "不可用";
                  break;
                case 1:
                  return "可用";
                  break;
                case 2:
                  return "待审核";
                  break;
                case 3:
                  return "审核不通过";
                  break;
              }
            }
          },
          {
            label: "素材类型",
            prop: "materialTypes",
            width: "70",
            render: (createElement, { row }) => {
              return row.materialTypes.length > 0
                ? row.materialTypes[0].dictCnName
                : "";
            }
          },
          {
            label: "创建时间",
            prop: "createdDate",
            sortable: true
          },
          {
            label: "修改时间",
            prop: "lastUpdateDate",
            sortable: true
          },
          {
            label: "操作",
            width: "200",
            fixed: "right",
            render: utils.component.createOperationRender(this, {
              editData: "编辑"
            })
          }
        ],
        data: [],
        selected: undefined,
        selectionType: "single"
      }
    };
  },
  methods: {
     reviewPic(url) {
      this.reviewPicUrl = url
      this.picDialogVisible = true
    },
    //选中时间
    handleRowSelectionChange(row,index){
      console.log(row)
      // this.table.data = row
      this.$emit('selected',row)
      let rowData = row
      this.table.selected = index
    },
   handleFilterChange(type) {
      if(this.$isNumber(this.filter.pictureId)) {
        if (type === 'query') {
          if (this.pagination) {
            this.pagination.currentPage = 1
          }
        }
        this.fetchData() 
      }
    },
    handleFilterReset() {
      this.filter = {
        sort: undefined,
        order: undefined
      };
      this.pagination.currentPage = 1
      this.fetchData();
    },
    parseFilter() {
      const { filter, pagination } = this;
      if (pagination) {
        filter.page = pagination.currentPage;
        filter.rows = pagination.pageSize;
      }
      return filter;
    },
    //获取数据
    fetchData() {
      const filter = this.parseFilter();
      this.$service.getResourceList(filter).then(data => {
        this.pagination.total = data.total;
        this.table.data = data.rows;
        //  this.data = data.rows;
         console.log(data);
         
      });
    },
    getMaterialTypes() {
      return this.$service.getDictType({type: 'materialType'}).then(data => {
        data.forEach(element => {
          this.materialTypes[element.dictCnName] = element.dictId;

        });
      });
    }
  },
  created() {
    let filterSchema = _.map({
      pictureId: _.o.string.other("form", {
        component: "Input",
        placeholder: "ID",
        cols: {
          item: 3,
          label: 0
        }
      }),
      pictureName: _.o.string.other("form", {
        component: "Input",
        placeholder: "素材名称",
        cols: {
          item: 3,
          label: 0
        }
      }),
      pictureCategory: _.o.enum(this.materialTypes).other("form", {
        component: "Select",
        placeholder: "素材类别",
        cols: {
          item: 3,
          label: 0
        }
      }),
      pictureStatus: _.o.enum(this.pictureStatus).other("form", {
        component: "Select",
        placeholder: "审核状态",
        cols: {
          item: 3,
          label: 0
        }
      })
    }).other("form", {
      layout: "inline",
      footer: {
        cols: {
          label: 0,
          wrapper: 24
        },
        showSubmit: true,
        submitText: "查询",
        showReset: true,
        resetText: "重置"
      }
    });
    this.getMaterialTypes().then(() => {
      this.filterSchema = filterSchema;
    });
    this.fetchData();
  }
};
</script>

<style scoped>
 .content-list >>> .card-list{
display: flex;
flex-direction: row;
flex-wrap: wrap
}
.card-list >>> .card-item-wrapper{
  width: 17%;
  border: 1px solid #d8bebe;
    box-shadow: 1px 3px 1px #d8bebe;
    margin: 5px;
    padding: 10px;
    border-radius: 5px;
}
.list-p >>> img {
width: 100%;
height: 200px;
object-fit: cover
}
p{
  margin: 0
}
</style>
