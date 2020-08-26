<template>
  <ContentCard
    class="content"
    title="新增推荐内容策略"
    @go-back="cancelForm('ccplusSecondaryEditForm')"
  >
    <div class="el-row">
      <el-form
        :model="form"
        :rules="rules"
        ref="ccplusSecondaryEditForm"
        label-width="90px"
        label-position="left"
      >
        <el-form-item label="策略名称:" prop="releaseConfName">
          <el-input
            placeholder="请输入策略名称"
            clearable
            v-model="form.releaseConfName"
          />
        </el-form-item>

        <el-form-item label="版本:" prop="supportVersion">
          <el-select
            v-model="form.supportVersion"
            multiple
            placeholder="请选择(支持多选)"
            @change="handleVersionChange"
            @remove-tag="handleVersionRemoveTag"
          >
            <el-option
              key="All"
              label="All"
              value="All"
              @click.native="handleVersionClickAll"
            ></el-option>
            <el-option
              v-for="item in versionOptions"
              :key="item.supportVersion"
              :label="item.supportVersion"
              :value="item.supportVersion"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="选择区域:" prop="ctmDevCtrName">
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

        <el-form-item label="发布时间:" prop="datePublish">
          <el-date-picker
            v-model="form.datePublish"
            type="datetimerange"
            range-separator="至"
            start-placeholde="开始时间"
            end-placeholde="结束时间"
            align="right"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="选择优先级:" prop="priority">
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
          v-for="item in form.itemList"
          ref="columnTemplateForm"
          :key="item.itemSeq"
          :content="item"
          @remove-column="handleRemoveColumn"
        ></ColumnTemplate>

        <el-form-item>
          <el-tooltip
            placement="top-start"
            :content="'栏目数最多为' + columnsMaxNum + '个'"
            :disabled="columnsNum < columnsMaxNum"
          >
            <div>
              <el-button
                type="success"
                plain
                icon="el-icon-edit"
                class="el-col el-col-6"
                @click="handleAddColumn"
                :disabled="columnsNum >= columnsMaxNum"
                >添加栏目</el-button
              >
            </div>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="指定设备" prop="tvActiveId">
          <el-input
            placeholder="DeviceID,多个用逗号隔开"
            v-model="form.tvActiveId"
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
        <el-button @click="confirmRegionSelect(false)">
          取消
        </el-button>
        <el-button type="primary" @click="confirmRegionSelect(true)">
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
  name: "SecondaryEdit",
  components: {
    ColumnTemplate,
    SelectRegionComponent
  },
  data() {
    return {
      showSelectRegionDialog: false,
      versionOptions: [],
      priorityOptions: [
        {
          label: "优先级 A",
          value: 3
        },
        {
          label: "优先级 B",
          value: 2
        },
        {
          label: "优先级 C",
          value: 1
        }
      ],
      form: this.getDefaultForm(),
      rules: {
        releaseConfName: [
          { required: true, message: "请输入策略名称", trigger: "blur" }
        ],
        supportVersion: [
          {
            required: true,
            message: "请选择版本信息",
            trigger: ["blur", "change"]
          }
        ],
        ctmDevCtrName: [
          { required: true, message: "请设置区域信息", trigger: "blur" }
        ],
        datePublish: [
          { required: true, message: "请选择发布时间", trigger: "blur" }
        ],
        priority: [{ required: true, message: "请选择优先级", trigger: "blur" }]
        // tvActiveId: [
        //   { required: true, message: "请输入设备信息", trigger: "blur" }
        // ],
      },
      regionBakup: {
        //区域备份
        ctmDevCtrId: 0,
        ctmDevCtrName: ""
      },
      columnsMaxNum: 50 //栏目数最多为50
    };
  },
  computed: {
    columnsNum() {
      return this.form.itemList.length;
    }
  },
  created() {},
  activated() {
    this.init();
  },
  deactivated() {
    this.form = this.getDefaultForm();
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
      this.getDetailById();
    },
    handleVersionClickAll() {
      //在这里处理All的click, 点击all只有2种case：
      // case 1. 不满的情况下点all
      // case 2: 满的情况下点all
      if (this.form.supportVersion.length < this.versionOptions.length) {
        this.form.supportVersion = [];
        this.versionOptions.map(item => {
          this.form.supportVersion.push(item.supportVersion);
        });
        this.form.supportVersion.unshift("All");
      } else {
        this.form.supportVersion = [];
      }
    },
    handleVersionChange(val) {
      //这里处理其他option的click，有以下case
      //1. 包含all，但长度不够，说明用户反选了选项
      //2. 不包含all，但长度够了，说明用户选择了所有选项，那自动把all选上
      if (!val.includes("All") && val.length === this.versionOptions.length) {
        this.form.supportVersion.unshift("All");
      } else if (
        val.includes("All") &&
        val.length - 1 < this.versionOptions.length
      ) {
        this.form.supportVersion = this.form.supportVersion.filter(item => {
          return item !== "All";
        });
      }
    },
    handleVersionRemoveTag(val) {
      if (val === "All") {
        this.form.supportVersion = [];
      }
    },
    getDefaultForm() {
      return {
        releaseConfName: "",
        supportVersion: [],
        datePublish: [],
        ctmDevCtrId: 0,
        ctmDevCtrName: "",
        priority: 3,
        itemList: [this.getColumnTemplateSample()], //栏目列表
        tvActiveId: ""
      };
    },
    async getDetailById() {
      const { releaseConfId } = this.$route.query;
      if (!releaseConfId) {
        return;
      }
      let res = await this.$service.queryCCPlusGetPushManageByReleaseConfId({
        releaseConfId
      });
      if (res.code === 0) {
        const { form } = this;
        Object.keys(res.data).forEach(key => {
          form[key] = res.data[key];
        });
        form.supportVersion = form.supportVersion.split(",");
        //如果版本信息包含'all'
        if (form.supportVersion.includes("all")) {
          this.versionOptions.forEach(item => {
            !form.supportVersion.includes(item.supportVersion) &&
              form.supportVersion.push(item.supportVersion);
          });
        }
        const date = (
          liteOS.parserDate(form.releaseStartTime) +
          "," +
          liteOS.parserDate(form.releaseEndTime)
        ).split(",");
        delete form.releaseStartTime;
        delete form.releaseEndTime;
        form.datePublish = date;
      } else {
        this.$message({
          type: "error",
          message: data.msg
        });
      }
    },
    getColumnTemplateSample() {
      // 获取模板数据样本
      return {
        template: "A",
        // releaseItemId: 0,
        itemSeq: 1,
        itemName: "",
        itemMediaMax: 99,
        itemMediaList: [] //媒体资源
      };
    },
    handleAddColumn() {
      const col = this.getColumnTemplateSample();
      col.itemSeq = this.form.itemList.length + 1;
      this.form.itemList.push(col);
    },
    handleRemoveColumn(...rest) {
      let content = rest[0];
      let idx = this.form.itemList.indexOf(content);
      this.form.itemList.splice(idx, 1);
    },
    checkDuplicatedSerialNo() {
      // 判断栏目模板序号是否有重复的
      let arr = [];
      this.$refs["columnTemplateForm"].forEach(ref =>
        arr.push(ref.content.itemSeq)
      );
      let res = liteOS.findRepeatElementInArr(arr);
      console.log("查找模板是否有重复序号:", res);
      return res;
    },
    async createOrUpdatePolicy() {
      const { handleType } = this.$route.query;
      let doModify = false; // 区分修改和增加（增加包括复制+新增两种情况）
      if (handleType === "edit") {
        doModify = true;
      }
      let data = Object.assign({}, this.form);
      delete data.datePublish;
      if (data.supportVersion.includes("All")) {
        data.supportVersion = "all";
      } else {
        data.supportVersion = this.form.supportVersion.join(",");
      }
      data.releaseStartTime = liteOS.date(this.form.datePublish[0]);
      data.releaseEndTime = liteOS.date(this.form.datePublish[1]);
      data.creator = this.$appState.user.name;
      data.releaseStatus = "0";
      let res;
      if (doModify) {
        res = await this.$service.queryCCPlusUpdatePushManage(data);
      } else {
        delete data.releaseConfId;
        res = await this.$service.queryCCPlusAddPushManage(data);
      }
      if (res.code === 0) {
        this.$message.success(
          doModify ? "修改成功,即将返回上页" : "创建成功,即将返回上页"
        );
        setTimeout(() => this.$router.back(), 1000);
      } else {
        this.$message({
          type: "error",
          message: res.msg
        });
      }
    },
    async submitForm(formName) {
      console.log("submit", this.form);
      try {
        let colNum = this.$refs["columnTemplateForm"].length;
        if (colNum === 0) {
          throw new Error("必须至少有一个栏目模板");
        }
        let res;
        if (colNum > 1) {
          res = this.checkDuplicatedSerialNo();
          if (res !== undefined) {
            throw new Error("栏目模板序号不能重复，重复序号为: " + res);
          }
        }
        let cols = this.$refs["columnTemplateForm"].map(ref => ref.validate());
        res = await Promise.all(cols);
        console.log("res", res);
        if (res) {
          res = await this.$refs[formName].validate();
          if (res) {
            await this.createOrUpdatePolicy();
            this.reset();
            return;
          }
        }
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
      } finally {
      }
    },
    cancelForm(formName) {
      this.$confirm("退出后修改内容会全部丢失，确认退出吗？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.reset();
          this.$router.back();
        })
        .catch();
    },
    reset() {
      this.$refs["columnTemplateForm"].forEach(ref => {
        ref.$refs["tempForm"].clearValidate();
        ref.$refs["tempForm"].resetFields();
      });
      this.$refs["ccplusSecondaryEditForm"].clearValidate();
      this.$refs["ccplusSecondaryEditForm"].resetFields();
    },
    selectRegion() {
      this.regionBakup.ctmDevCtrName = this.form.ctmDevCtrName;
      this.regionBakup.ctmDevCtrId = this.form.ctmDevCtrId;
      this.showSelectRegionDialog = true;
    },
    getRegion(...rest) {
      this.form.ctmDevCtrId = rest[0];
      this.form.ctmDevCtrName = rest[1];
    },
    confirmRegionSelect(confirm) {
      if (!confirm) {
        this.form.ctmDevCtrName = this.regionBakup.ctmDevCtrName;
        this.form.ctmDevCtrId = this.regionBakup.ctmDevCtrId;
        this.showSelectRegionDialog = false;
        return;
      }
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
