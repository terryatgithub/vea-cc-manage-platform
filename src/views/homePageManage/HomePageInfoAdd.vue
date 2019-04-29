<template>
  <ContentCard :title="title" @go-back="$emit('go-back')">
    <!--新增编辑界面-->
    <el-row :gutter="40">
      <el-col :span="24">
        <el-form :model="form" :rules="formRules" ref="form" label-width="160px" class="el-form-add">
          <!-- <el-form-item label="菜单ID" prop="homepageId">
            <el-input v-model="form.homepageId" placeholder="菜单ID"></el-input>
          </el-form-item> -->
          <el-form-item label="首页名称" prop="vDataListName">
            <el-input v-model="form.vDataListName" placeholder="首页名称"></el-input>
          </el-form-item>
          <el-form-item label="首页模式" prop="vDataSequenceType">
            <el-radio-group v-model="form.vDataSequenceType">
              <el-radio label="标准模式" value="normal"></el-radio>
              <el-radio label="儿童模式" value="child"></el-radio>
              <el-radio label="老人模式" value="old"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="首页版本号" prop="homepageVersion">
            <el-input type="textarea" v-model="form.homepageVersion" placeholder="首页版本号"></el-input>
          </el-form-item>
          <el-form-item label="首页模式" prop="homepageList">
            <el-button type="primary" size="mini" @click="addTabDialog">添加版面</el-button>
            <span class="cc-form-annotation">至少选择1个版面</span>
          </el-form-item>
          <el-form-item label="">
            <div>
              <Table
                :props="tableAdd.props"
                :header="tableAdd.header"
                :data="tableAdd.data"
                :selected="tableAdd.selected"
                :selection-type="tableAdd.selectionType"
                @row-selection-add="handleRowSelectionAdd"
                @row-selection-remove="handleRowSelectionRemove"
                @all-row-selection-change="handleAllRowSelectionChange"
              />
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitBtn">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 添加版面 -->
    <el-dialog title="添加版面" :visible.sync="addTabDialogVisible" width="50%">
      <div v-loading="addTabLoading">
        <ContentWrapper
          :filter="filter"
          :filterSchema="filterSchema"
          :pagination="pagination"
          @filter-change="handleFilterChange"
          @filter-reset="handleFilterReset"
        >
          <Table
            :props="table.props"
            :header="table.header"
            :data="table.data"
            :selected="table.selected"
            :selection-type="table.selectionType"
            @row-selection-add="handleRowSelectionAdd"
            @row-selection-remove="handleRowSelectionRemove"
            @all-row-selection-change="handleAllRowSelectionChange"
          />
        </ContentWrapper>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addTabDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmBtn">确 定</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 添加版面 end --->
  </ContentCard>
</template>
<script>
import _ from "gateschema";
import { Button } from 'element-ui'
import ButtonList from "./../../components/ButtonLIst";
import { ContentWrapper, Table, ActionList, utils } from "admin-toolkit";
export default {
  components: {
    ActionList,
    Table,
    ContentWrapper
  },
  props: {
    editId: Number,
    default: null
  },
  //  prop: ['editId'],
  data() {
    return {
      title: null,
      form: {
        //homepageId: null,
        vDataListName: null,
        vDataSequenceType: null,
        homepageVersion: null,
        homepageList: null
      },
      formRules: {
        //表单规则
        vDataListName: [{ required: true, message: "请输入首页名称", trigger: "blur" }]
      },
      paramsList: [{
        key: '',
        value: ''
      }],
      filter: {
        sort: undefined,
        order: undefined
      },
      filterSchema: null,
      pagination: {},
      addTabDialogVisible: false, //弹框默认关闭
      addTabLoading: false, //
      selected: [],
      table: {
        props: {},
        header: [
            {
                label: '版面ID',
                prop: 'tabId'
            },
            {
                label: '版面名称',
                prop: 'tabName'
            },
             {
                label: 'TAB标题（中文）',
                prop: 'tabCnTitle'
            },
            {
                label: 'TAB标题（英文）',
                prop: 'tabEnTitle'
            },
            {
                  label: '内容源',
                  prop: 'tabResource',
                  align: 'center',
                  render: (h, { row }) => {
                    if (row.duplicateVersion === '') {
                      return ''
                    } else {
                      return h(Button, 
                        { 
                          ref: 'button',
                          props: {  },
                          domProps: {
                            innerHTML: row.duplicateVersion
                          },
                          on: {
                            click: (value) => {
                              this.showData(row.tabId, row.duplicateVersion)
                            }
                          }
                        })
                    }
                  }
            },
            {
                  label: '审核状态',
                  prop: 'tabStatus',
                  render: (h, { row }) => {
                    return h('span', 
                      { 
                        style: {
                          whiteSpace: 'nowrap'
                        },
                        domProps: {
                          innerHTML: row.chipModel
                        }
                      })
                  }
            }
        ],
        data: [],
        selected: [],
        selectionType: "multiple"
      },
      tableAdd: {
        props: {},
        header: [
            {
                label: '版面ID',
                prop: 'tabId'
            },
            {
                label: '版面名称',
                prop: 'tabName'
            },
             {
                label: 'TAB标题（中文）',
                prop: 'tabCnTitle'
            },
            {
                label: 'TAB标题（英文）',
                prop: 'tabEnTitle'
            },
            {
                  label: '内容源',
                  prop: 'tabResource',
                  align: 'center',
                  render: (h, { row }) => {
                    if (row.duplicateVersion === '') {
                      return ''
                    } else {
                      return h(Button, 
                        { 
                          ref: 'button',
                          props: {  },
                          domProps: {
                            innerHTML: row.duplicateVersion
                          },
                          on: {
                            click: (value) => {
                              this.showData(row.tabId, row.duplicateVersion)
                            }
                          }
                        })
                    }
                  }
            },
            {
                  label: '审核状态',
                  prop: 'tabStatus',
                  render: (h, { row }) => {
                    return h('span', 
                      { 
                        style: {
                          whiteSpace: 'nowrap'
                        },
                        domProps: {
                          innerHTML: row.chipModel
                        }
                      })
                  }
            }
        ],
        data: [],
        selected: [],
        selectionType: "multiple"
      }
    };
  },
  methods: {
    paramsAddBtn() {
      this.paramsList.push({
        key: '',
        value: ''
      })
    },
    paramsRedBtn(index) {
      this.paramsList.splice(index, 1)
    },
    submitBtn() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let params = {}
          let jsonStr = {}
          this.paramsList.forEach(function (item) {
            if(item.key.trim() != '') {
              params[item.key] = item.value;
            }
          })
          this.form.params = JSON.stringify(params)
          jsonStr.jsonStr = JSON.stringify(this.form)
          console.log(this.form)
          this.$service.homePageInfoSave(jsonStr, "保存成功").then(data => {
            this.$emit("openListPage");
          });
        }
      });
    },
    getEditData() {
      let obj = this;
      this.$service.getHomePageInfoEdit({ id: this.editId }).then(data => {
        Object.keys(this.form).forEach(v => {
          obj.form[v] = data[v];
          if (v === 'params') {
            let arrs = []
            let lists = JSON.parse(data[v])
            console.log(lists)
            Object.keys(lists).forEach(p => {
              let jsons = {}
              jsons.key = p
              jsons.value = lists[p]
              arrs.push(jsons)
            })
            if (data[v] !== '{}') {
              obj.paramsList = arrs
            }
          }
        });
      });
    },
    addTabDialog() {
      this.addTabDialogVisible = true
    },
    confirmBtn() {
      console.log(this.selected)
    },
    /**
     * 获取版面数据
     */
    fetchTabData() {
      const filter = this.parseFilter();
      this.$service.tabInfoList(filter).then(data => {
        this.pagination.total = data.total;
        this.table.data = data.rows;
      });
    },
    //版面表格操作
    handleRowSelectionAdd(targetItem) {
      this.selected.push(targetItem.tabId);
      this.updateTableSelected();
    },
    handleRowSelectionRemove(targetItem) {
      this.selected = this.selected.filter(item => {
        return item !== targetItem.tabId;
      });
      this.updateTableSelected();
    },
    handleAllRowSelectionChange(value) {
      if (value) {
        this.table.data.forEach(this.handleRowSelectionAdd);
      } else {
        this.selected = [];
        this.table.selected = [];
      }
    },
    handleAllRowSelectionRemove() {
      this.selected = [];
      this.table.selected = [];
    },
    updateTableSelected() {
      const table = this.table;
      const newSelectedIndex = this.selected;
      table.selected = table.data.reduce((result, item, index) => {
        if (newSelectedIndex.indexOf(item.tabId) > -1) {
          result.push(index);
        }
        return result;
      }, []);
    },
    //查询
    handleFilterChange(type) {
      if (type === "filter") {
        if (this.pagination) {
          this.pagination.currentPage = 1;
        }
      }
      this.fetchTabData();
    },
    //重置
    handleFilterReset() {
      this.filter = {
        sort: undefined,
        order: undefined
      };
      this.fetchTabData();
    },
    parseFilter() {
      const { filter, pagination } = this;
      if (pagination) {
        filter.page = pagination.currentPage;
        filter.rows = pagination.pageSize;
      }
      return filter;
      console.log(filter);
    },
    /**
     * 获取menuInfoTree
     */
    getSysMenuInfo () {
      return this.$service.getHomePageInfoMenu().then(data => {
        this.buttonList = data
      })
    }
  },
  created() {
    if (this.editId !== null && this.editId !== undefined) {
      this.title = "编辑";
      this.getEditData();
    } else {
      this.title = "新增";
    }
    
    let filterSchema = _.map({
      tabId: _.o.string.other("form", {
        component: "Input",
        placeholder: "版面ID",
        cols: {
          item: 3,
          label: 0
        }
      }),
      tabName: _.o.string.other("form", {
        component: "Input",
        placeholder: "版面名称",
        cols: {
          item: 3,
          label: 0
        }
      }),
      tabStatusArray: _.o.enum({
        请选择: '3,4',
        待审核:'3',
        审核通过:'4',
        审核通过未上线:'7'
      }).other("form", {
        component: "Select",
        placeholder: "审核状态",
        cols: {
          item: 3,
          label: 0
        },
      }),
      tabResource: _.o.enum({
        请选择: '',
        爱奇艺:'o_iqiyi',
        腾讯:'o_tencent',
        优朋:'o_voole'
      }).other("form", {
        component: "Select",
        placeholder: "内容源",
        cols: {
          item: 3,
          label: 0
        },
      })
    })
      .other("form", {
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
    this.fetchTabData()
  }
};
</script>
<style lang="stylus" scoped>
.cc-form-annotation 
  color #999
  padding-left 15px
</style>