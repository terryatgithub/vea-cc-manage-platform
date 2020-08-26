<template>
  <div class="column-template-wrapper">
    <el-form label-width="90px" :model="content" ref="tempForm" :rules="rules">
      <el-form-item label="栏目模板:">
        <el-select
          v-model="content.template"
          placeholder="请选择"
          @change="handleTemplateChange"
          @visible-change="handleTemplateVisibleChange"
        >
          <el-option
            v-for="item in templateOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label-width="0" style="margin-left:90px;">
        <el-button @click="handleSelectColumnResource" type="primary" plain
          >新增栏目资源</el-button
        >
      </el-form-item>

      <!-- <el-form-item label="栏目ID:">
        {{ content.releaseItemId }}
      </el-form-item> -->

      <!-- todo 这里输入为什么会失焦？ -->
      <el-form-item label="栏目序号:" prop="itemSeq">
        <el-input placeholder="" clearable v-model="content.itemSeq" />
      </el-form-item>

      <el-form-item label="栏目名称:" prop="itemName">
        <el-input placeholder="" clearable v-model="content.itemName" />
      </el-form-item>

      <el-form-item
        label="影片数量上限:"
        label-width="120px"
        prop="itemMediaMax"
      >
        <el-popover
          ref="popover"
          placement="top-start"
          title="限制输入两位数"
          trigger="manual"
          v-model="showPopover"
          popper-class="popover"
        >
          <el-input
            slot="reference"
            placeholder=""
            clearable
            v-model.number="content.itemMediaMax"
          />
        </el-popover>
      </el-form-item>

      <el-form-item>
        <el-button @click="handleEditMovies" type="primary" plain
          >编辑栏目影片</el-button
        >
      </el-form-item>

      <el-form-item>
        <el-button type="danger" plain @click="handleDeleteColumn"
          >删除栏目</el-button
        >
      </el-form-item>

      <!-- 图片展示区 -->
      <el-form-item class="image-wrapper">
        <div class="demo-image__lazy">
          <el-image
            v-for="item in content.itemMediaList"
            :key="item.mediaResourcesId"
            :src="item.mediaPic"
            lazy
          ></el-image>
        </div>
      </el-form-item>

      <el-form-item>
        <hr />
      </el-form-item>
    </el-form>

    <el-dialog
      :visible.sync="showSelectResourceDialog"
      title="新增栏目资源(可多选)(可反选)"
      :show-close="false"
    >
      <ColumnResourceSelectDialog @get-select-resource="getSelectResource" />
    </el-dialog>

    <el-dialog
      :visible.sync="showEditDetailPage"
      title="编辑栏目详情"
      width="100%"
      :show-close="false"
      :before-close="beforeDonePicOperation"
    >
      <ColumnTemplateDetail
        v-if="showEditDetailPage"
        :content="content"
        :templateType="content.template"
        @done-pic-operation="donePicOperation"
      />
    </el-dialog>
  </div>
</template>

<script>
// 添加栏目的'栏目模板'组件
import ColumnResourceSelectDialog from "./ColumnResourceSelectDialog.vue";
import ColumnTemplateDetail from "./ColumnTemplateDetail";

export default {
  name: "ColumnTemplate",
  components: {
    ColumnResourceSelectDialog,
    ColumnTemplateDetail
  },
  props: {
    content: {
      //prop会在一个组件实例创建之前进行验证，所以实例的property（如data、computed等)在default/validator函数中是不可用的
      type: Object,
      required: true,
      default: function() {
        //对象或数组默认值必须从一个工厂函数获取
        return {
          template: "A",
          // releaseItemId: 0,
          itemSeq: 1,
          itemName: "",
          itemMediaMax: 99,
          itemMediaList: [] //媒体资源
        };
      }
      // validator: function(value) {
      //   return ['success', 'warning', 'error'].indexOf(value) !== -1
      // }
    }
  },
  data() {
    return {
      rules: {
        itemSeq: [
          { required: true, message: "请输入栏目序号", trigger: "blur" }
        ],
        itemName: [
          { required: true, message: "请输入栏目名称", trigger: "blur" }
        ],
        itemMediaMax: [
          { required: true, message: "请输入影片数量", trigger: "blur" },
          {
            type: "number",
            min: 1,
            max: 99,
            message: "影片数量最小为1，最大为99",
            trigger: ["blur", "change"]
          }
        ]
      },
      showPopover: false,
      showSelectResourceDialog: false,
      showEditDetailPage: false,
      templateOptions: [
        { label: "模板A 媒资混排", value: "A" },
        { label: "模板B 媒资竖图", value: "B" },
        { label: "模板C 媒资横图", value: "C" },
        { label: "模板D 媒资方图", value: "D" }
      ],
      prevTemplateType: this.content.template,
      columnResourceSelections: null //栏目资源标签选择项
    };
  },
  watch: {
    "content.itemMediaMax": function(newVal, oldVal) {
      if (newVal > 100) {
        this.content.itemMediaMax = parseInt(newVal.toString().slice(0, 2));
        if (!this.showPopover) {
          this.showPopover = true;
          setTimeout(() => {
            this.showPopover = false;
          }, 1500);
        }
      }
    }
  },
  methods: {
    handleTemplateVisibleChange(val) {
      if (val) {
        this.prevTemplateType = this.content.template;
      }
    },
    handleTemplateChange(val) {
      if (!this.content.itemMediaList.length) {
        return;
      }
      this.$confirm("更改模板将会清空所有图片，确认更改吗？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.prevTemplateType = this.content.template; //确定时保存值
          this.content.itemMediaList.splice(0);
        })
        .catch(() => {
          this.content.template = this.prevTemplateType; //取消时恢复oldvalue
        });
    },
    reSortSequence() {
      const { itemMediaList } = this.content;
      itemMediaList.forEach((v, i) => (v.detailSeq = i));
    },
    beforeDonePicOperation(done) {
      console.log("beforeDonePicOperation");
      this.reSortSequence();
      done();
    },
    async donePicOperation(...rest) {
      this.showEditDetailPage = false;
      this.reSortSequence();
    },
    async getSelectResource(...rest) {
      // 获取选择的资源类型
      this.showSelectResourceDialog = false;
      if (!rest[0]) {
        return;
      }
      this.columnResourceSelections = rest[0];
      let res = await this.$service.queryCCPlusMediaResourceNew({
        page: 1,
        size: 100,
        templateType: this.content.template,
        supplier: this.columnResourceSelections.source.join(","),
        category: this.columnResourceSelections.category.join(","),
        tag: this.columnResourceSelections.tag.join(",")
      });
      if (res.code === 0) {
        const { results } = res.data;
        const { itemMediaList, itemMediaMax } = this.content;
        let len = itemMediaList.length,
          end = itemMediaMax - len; //图片数量不能超过指定上限
        results.slice(0, end > 0 ? end : 0).forEach((item, index) => {
          this.$set(itemMediaList, len, {});
          itemMediaList[len].mediaResourcesId = item.mediaResourcesId;
          itemMediaList[len].mediaPicType = item.posterType;
          itemMediaList[len].mediaPic = item.posterUrl;
          itemMediaList[len].releaseDate = item.releaseDate;
          itemMediaList[len].score = item.score;
          itemMediaList[len].detailSeq = len;
          len++;
        });
        this.sortAndDedupItemMediaList();
      } else {
        this.$message({
          type: "error",
          message: res.msg
        });
      }
    },
    sortAndDedupItemMediaList() {
      const { itemMediaList } = this.content;
      //dedup
      let s = new Set();
      for (let i = itemMediaList.length - 1; i >= 0; i--) {
        let v = itemMediaList[i];
        if (s.has(v.mediaResourcesId)) {
          itemMediaList.splice(i, 1);
        } else {
          s.add(v.mediaResourcesId);
        }
      }
      //sort
      const fDate = d => new Date(d).getTime();
      const sort = (a, b) =>
        fDate(a.releaseDate) > fDate(b.releaseDate)
          ? -1
          : fDate(a.releaseDate) === fDate(b.releaseDate) &&
            parseInt(a.score) > parseInt(b.score)
          ? -1
          : 1;
      itemMediaList.sort(sort);
    },
    // handleClose(done) {
    //   this.$confirm("确认关闭？")
    //     .then(() => {
    //       this.closeColumnResourceSelectDialog(false);
    //       done();
    //     })
    //     .catch(() => {});
    // },
    load() {
      this.loading = true;
      setTimeout(() => {
        this.count += 2;
        this.loading = false;
      }, 2000);
    },
    handleSelectColumnResource() {
      this.showSelectResourceDialog = true;
    },
    handleEditMovies() {
      this.showEditDetailPage = true;
      /*  this.$router.push({
        path: "ColumnTemplateDetail",
        //@todo 带海报参数过去，直接带对象可以吗？
        query: {
          id: 1 //row.tabId
        }
      }); */
    },
    handleDeleteColumn() {
      this.$confirm("确认删除该模板吗？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$emit("remove-column", this.content);
        })
        .catch(() => {});
    },
    async validate() {
      //@todo 子组件的校验问题
      let res = await this.$refs["tempForm"].validate();
      console.log("sub res", res);
      return res;
    }
  }
};
</script>

<style lang="stylus" scoped>
.column-template-wrapper
  background lightgray
.el-form
  display flex
  flex-wrap wrap
  .el-form-item
    margin 5px

.image-wrapper
  overflow: hidden;
  .demo-image__lazy
    display flex
    overflow-x scroll
    .el-image
      flex-shrink 0
      display inline-flex
      align-items center
      margin 5px
      width 100px
      >>> .el-image__inner
        height auto
// todo 为什么无法穿透进去？
.el-popover >>> .el-popover__title
  color red
  text-align center
  font-size 16px
</style>
