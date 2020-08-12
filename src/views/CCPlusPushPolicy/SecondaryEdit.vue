<template>
  <ContentCard
    class="content"
    title="新增推荐内容策略"
    @go-back="$router.back()"
  >
    <div class="el-row">
      <el-form
        :model="form"
        :rules="rules"
        ref="ccplusSecondaryEditForm"
        label-width="90px"
        label-position="left"
      >
        <el-form-item label="策略名称:" prop="name">
          <el-input
            placeholder="请输入策略名称"
            clearable
            v-model="form.name"
          />
        </el-form-item>

        <el-form-item label="版本:">
          <el-select
            v-model="form.versions"
            multiple
            placeholder="请选择(支持多选)"
          >
            <el-option
              v-for="item in versionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="选择区域:">
          <el-button
            v-if="!form.ctmDevCtrName"
            type="primary"
            @click="selectRegion"
            >选择区域</el-button
          >
          <div v-else class="nameBox">
            {{ form.ctmDevCtrName }}
            <i class="el-icon-error" @click="selectRegion"> </i>
          </div>
        </el-form-item>

        <el-form-item label="发布时间:">
          <el-date-picker
            v-model="form.datePublish"
            type="datetimerange"
            range-separator="至"
            start-placeholde="开始时间"
            end-placeholde="结束时间"
            align="right"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="选择优先级:">
          <el-select v-model="form.priority" placeholder="选择优先级">
            <el-option
              v-for="item in priorityOptions"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 栏目区域 -->
        <el-form-item label="栏目:"> 栏目数 {{ columnsNum }} </el-form-item>

        <!-- <el-form-item label-width="10px"> -->
        <!-- 栏目模板 -->
        <ColumnTemplate
          v-for="(item, index) in form.columns"
          ref="columnTemplateForm"
          :key="item.columnId"
          :content="item"
          :prop="'columns.' + index"
          :rules="{
            validator: checkColumnSerialNo,
            trigger: ['blur', 'change']
          }"
        ></ColumnTemplate>

        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-edit"
            class="el-col el-col-6"
            @click="handleAddColumn"
            >添加栏目</el-button
          >
        </el-form-item>

        <el-form-item label="指定设备">
          <el-input
            placeholder="DeviceID,多个用逗号隔开"
            v-model="form.devices"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click="submitForm('ccplusSecondaryEditForm')"
            >完成</el-button
          >
          <el-button @click="cancelForm('ccplusSecondaryEditForm')"
            >取消</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="选择区域" :visible.sync="showSelectRegionDialog">
      <SelectRegionComponent @getRegion="getRegion" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="showSelectRegionDialog=false">
          取消
        </el-button>
        <el-button type="primary" @click="confirmRegionSelect">
          确定
        </el-button>
      </div>
    </el-dialog>
  </ContentCard>
</template>

<script>
/**
  酷开LiteOS CC Plus二级菜单-’新增/编辑’页面
 */
import SelectRegionComponent from "./components/SelectRegionComponent";
import ColumnTemplate from "./components/ColumnTemplate";
import liteOS from "@/assets/liteOS.js";

export default {
  components: {
    ColumnTemplate,
    SelectRegionComponent
  },
  data() {
    return {
      showSelectRegionDialog: false,
      versionOptions: [],
      regionOptions: [
        {
          label: "亚太",
          value: "asian"
        },
        {
          label: "南美",
          value: "NA"
        }
      ],
      priorityOptions: [
        {
          label: "优先级 A",
          value: "A"
        },
        {
          label: "优先级 B",
          value: "B"
        }
      ],
      form: {
        name: "",
        versions: [],
        ctmDevCtrName: "",
        priority: "",
        datePublish: [],
        columns: [
          {
            columnTemplate: "媒资模板A: 混排",
            columnId: 122121,
            serialNo: 1,
            columnName: "",
            moviesNum: "12"
          }
        ],
        devices: ""
      },
      rules: {
        name: [{ required: true, message: "请输入策略名称", trigger: "blur" }]
      }
    };
  },
  computed: {
    columnsNum() {
      return this.form.columns.length;
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
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
    handleAddColumn() {
      const col = {
        columnTemplate: "媒资模板B: 竖排",
        columnId: 122121,
        serialNo: 2,
        columnName: "",
        moviesNum: "20"
      };
      this.form.columns.push(col);
    },
    async submitForm(formName) {
      console.log("submit", this.form);
      // let pAll = this.$refs["columnTemplateForm"].map(form => form.validate())
      let res = await this.$refs["columnTemplateForm"][0].validate();
      console.log("res", res);
      if (res) {
        res = await this.$refs[formName].validate();
        if (res) {
          alert("submit ok");
          return;
        }
      }
      alert("error");
      return false;
    },
    cancelForm(formName) {
      console.log("cancel", this.form);
    },
    checkColumnSerialNo: (rule, value, callback) => {
      //校验模板栏目序列号
      console.log("check no...");
      if (!value) {
        return callback(new Error("请输入栏目序号!"));
      }
      this.form.columns.forEach(col => {
        if (col.serialNo === value) {
          return callback(new Error("模板序号不能重复，请重新设置"));
        }
      });
    },
    selectRegion() {
      this.showSelectRegionDialog = true;
    },
    getRegion(...rest) {
      this.form.ctmDevCtrName = rest[1];
    },
    confirmRegionSelect() {
      if (this.form.ctmDevCtrName) {
        this.showSelectRegionDialog = false
      } else {
        this.$message({
          type: "error",
          message: "请选择一项！"
        });
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.content >>> .el-form-item__content
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
