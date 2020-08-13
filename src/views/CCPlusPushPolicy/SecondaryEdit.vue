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
          v-for="item in form.columns"
          ref="columnTemplateForm"
          :key="item.serialNo"
          :content="item"
          @remove-column="handleRemoveColumn"
        ></ColumnTemplate>

        <el-form-item>
          <el-button
            type="success"
            plain
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
        <el-button @click="showSelectRegionDialog = false">
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
        ctmDevCtrId: 0,
        ctmDevCtrName: "",
        priority: "",
        datePublish: [],
        columns: [
          {
            columnTemplate: 0,
            // columnId: 0,
            serialNo: 1,
            columnName: "",
            moviesNum: "99"
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
        columnTemplate: 0,
        // columnId: 0,
        serialNo: this.form.columns.length + 1,
        columnName: "",
        moviesNum: "99"
      };
      this.form.columns.push(col);
    },
    handleRemoveColumn(...rest) {
      let content = rest[0];
      let idx = this.form.columns.indexOf(content);
      this.form.columns.splice(idx, 1);
    },
    checkDuplicatedSerialNo() {
      //判断栏目模板序号是否有重复的
      let arr = [];
      this.$refs["columnTemplateForm"].forEach(ref =>
        arr.push(ref.content.serialNo)
      );
      let res = liteOS.findRepeatElementInArr(arr);
      console.log("查找重复序号:", res);
      return res;
    },
    async submitForm(formName) {
      console.log("submit", this.form);
      let cols = this.$refs["columnTemplateForm"].map(ref => ref.validate());
      try {
        let res = this.checkDuplicatedSerialNo();
        if (res !== undefined) {
          throw new Error("栏目模板序号不能重复，重复序号为: " + res);
        }
        res = await Promise.all(cols);
        console.log("res", res);
        if (res) {
          //@todo 校验序号重复
          res = await this.$refs[formName].validate();
          if (res) {
            alert("submit ok");
            return;
          }
        }
        // throw new Error('')
      } catch (e) {
        if (e) {
          this.$message({
            type: "error",
            message: e
          });
        } else {
          this.$message({
            type: "error",
            message: "校验出错，请修改提示错误字段"
          });
        }
      }
    },
    cancelForm(formName) {
      this.$confirm("退出后修改内容会全部丢失，确认退出吗？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => this.$router.back())
        .catch(() => {});
    },
    selectRegion() {
      this.showSelectRegionDialog = true;
    },
    getRegion(...rest) {
      this.form.ctmDevCtrId = rest[0];
      this.form.ctmDevCtrName = rest[1];
    },
    confirmRegionSelect() {
      if (this.form.ctmDevCtrName) {
        this.showSelectRegionDialog = false;
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
.content .el-form-item__content
                width: 25%
                .el-select,.el-cascader
                   width 100%
.content .el-form--inline .el-form-item {
           margin-right: 0px;
}

.content .filter-item
  justify-content: flex-start;
  margin: 10px 0px
</style>
