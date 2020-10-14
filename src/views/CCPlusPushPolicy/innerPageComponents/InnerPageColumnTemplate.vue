<template>
  <div class="column-template-wrapper">
    <el-form label-width="90px" :model="content" ref="tempForm" :rules="rules">
      <el-form-item label="栏目名称:" prop="itemName">
        <el-input
          placeholder=""
          clearable
          v-model="content.itemName"
          maxlength="99"
        />
      </el-form-item>

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

      <el-form-item
        label="影片数量上限:"
        label-width="120px"
        prop="itemMediaMax"
        v-if="!specialTemplates.includes(content.template)"
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
            @input="handleInputOnlyNumberItemMediaMax"
            @focus="handleMediaMaxFocus"
            @blur="handleMediaMaxBlur"
            v-model.number="content.itemMediaMax"
          />
        </el-popover>
      </el-form-item>

      <el-form-item v-if="content.template < 'G'">
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
          <div
            class="image-wrapper"
            v-for="(item, index) in content.itemMediaList"
            :key="item.mediaResourcesId"
          >
            <el-image :src="item.mediaPic"></el-image>
            <span class="demo-image-title">{{ item.title }}</span>
            <p v-if="content.template === 'G'">
              <span v-if="item.posterId">
                <i
                  class="el-icon-close"
                  @click="removeCurPostForGTemplate(index)"
                ></i>
                {{ item.title }}
              </span>
              <el-button v-else @click="addPosterForGTemplate(index)">
                关联海报
              </el-button>
            </p>
            <i
              v-if="content.template > 'G'"
              style="position: absolute; font-size: 20px; top: -2px;right: -5px;"
              class="el-icon-close"
              @click="removeCurPostForHJTemplate(index)"
            ></i>
          </div>
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
      :visible.sync="showSelectPosterDialog"
      title="选择海报"
      :show-close="false"
    >
      <PosterSelPop @posterSure="posterSure" @close="posterClose" />
    </el-dialog>

    <el-dialog
      :visible.sync="showEditDetailPage"
      title="编辑栏目详情"
      :show-close="false"
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
import ColumnResourceSelectDialog from "../components/ColumnResourceSelectDialog.vue";
import ColumnTemplateDetail from "../components/ColumnTemplateDetail";
import PosterSelPop from "@/components/liteOS/posterSelPop";

export default {
  name: "InnerPageColumnTemplate",
  components: {
    ColumnResourceSelectDialog,
    ColumnTemplateDetail,
    PosterSelPop
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
        itemName: [
          { required: true, message: "请输入栏目名称", trigger: "blur" },
          {
            min: 1,
            max: 99,
            message: "最大长度99",
            trigger: ["blur", "change"]
          }
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
      showPopoverSeq: false,
      mediaMaxPrev: 0, //保存影片上限旧值，供恢复旧值用
      showSelectResourceDialog: false,
      showSelectPosterDialog: false,
      adheredPosterIndex: -1,
      showEditDetailPage: false,
      specialTemplates: ["H", "J"],
      templateOptions: [
        { label: "模板A 媒资混排", value: "A" },
        { label: "模板B 媒资竖图", value: "B" },
        { label: "模板C 媒资横图", value: "C" },
        { label: "模板D 媒资方图", value: "D" },
        { label: "模板G 媒资大背景banner", value: "G" },
        { label: "模板H 普通一张图banner", value: "H" },
        { label: "模板J 普通两张图banner", value: "J" }
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
    onlyNumber(val) {
      return parseInt(val.toString().replace(/[^\d]/g, "")) || "";
    },
    handleInputOnlyNumberItemMediaMax(val) {
      // return val =>
      //   (this.content[field] = parseInt(val.toString().replace(/[^\d]/g, "")) || '')
      this.content.itemMediaMax = this.onlyNumber(val);
    },
    handleMediaMaxFocus() {
      this.mediaMaxPrev = this.content.itemMediaMax;
    },
    handleMediaMaxBlur() {
      if (this.content.itemMediaMax < this.content.itemMediaList.length) {
        this.$confirm(
          "上限值小于当前影片数量, 将会删掉列表最后多余的影片，是否继续操作？",
          "提示",
          {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            this.content.itemMediaList.splice(this.content.itemMediaMax);
          })
          .catch(() => {
            this.content.itemMediaMax = this.mediaMaxPrev;
          });
      }
    },
    handleTemplateVisibleChange(val) {
      if (val) {
        this.prevTemplateType = this.content.template;
      }
    },
    removeCurPostForHJTemplate(index) {
      // 删除模板H/J的海报
      this.content.itemMediaList.splice(index, 1);
    },
    async verifyGTemplateUnique() {
      // 如果选择G，需要: 1. 判断是否唯一  2. 置顶
      if (this.content.template === "G") {
        let isUnique = await new Promise((resolve, reject) => {
          this.$bus.$once(
            "ccplus-innerpage-gtemplate-verify-result",
            result => {
              resolve(result);
            }
          );
          this.$emit("gtemplate-selected");
        });
        if (!isUnique) {
          this.$message.warning("同一页面仅支持一个模板G: 大背景banner栏目");
          this.content.template = this.prevTemplateType; //取消时恢复oldvalue
          return false;
        }
      } else {
        // bugfix 避免模板1先选G再改为其它，此时新增一个G模板2，模板1的值也会变为旧值
        this.$bus.$off("ccplus-innerpage-gtemplate-verify-result");
      }
      return true;
    },
    async handleTemplateChange(val) {
      if (!this.content.itemMediaList.length) {
        // 无图片，直接判断
        await this.verifyGTemplateUnique();
        return;
      }
      this.$confirm("更改模板将会清空所有图片，确认更改吗？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 有图片，在用户确认更改时再判断
          let GUnique = await this.verifyGTemplateUnique();
          if (!GUnique) {
            throw new Error("G template 只能有一个");
          }
          this.prevTemplateType = this.content.template; //确定时保存值
          this.content.itemMediaList.splice(0);
          if (this.specialTemplates.includes(this.content.template)) {
            this.content.itemMediaMax = this.content.template === "H" ? 1 : 2;
          }
        })
        .catch(() => {
          this.content.template = this.prevTemplateType; //取消时恢复oldvalue
        });
    },
    reSortSequence() {
      const { itemMediaList } = this.content;
      itemMediaList.forEach((v, i) => (v.detailSeq = i));
    },
    // beforeDonePicOperation(done) {
    //   done();
    // },
    donePicOperation(...rest) {
      this.showEditDetailPage = false;
      rest[0] && this.reSortSequence();
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
        size: 100, //todo 完善size为更精确值
        templateType:
          this.content.template === "G" ? "C" : this.content.template, //后台要求G模板传横图
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
          itemMediaList.splice(len, 0, {
            mediaResourcesId: item.mediaResourcesId,
            mediaPicType: item.posterType,
            mediaPic: item.posterUrl,
            releaseDate: item.releaseDate,
            score: item.score,
            title: item.title,
            detailSeq: len,
            posterId: null //海报id
          });
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
    posterSure(...data) {
      this.showSelectPosterDialog = false;
      if (this.content.template === "G") {
        if (this.adheredPosterIndex !== -1) {
          this.content.itemMediaList[this.adheredPosterIndex].posterId =
            data[0];
          this.adheredPosterIndex = -1;
        }
      } else {
        // for template 'H', 'J'
        const { itemMediaList } = this.content;
        let len = itemMediaList.length;
        itemMediaList.splice(len, 0, {
          mediaResourcesId: data[0], //媒资id
          mediaPicType: "", //todo
          mediaPic: data[2], //媒资图片url
          posterId: data[0], //海报id
          detailSeq: len,
          title: data[1]
        });
      }
    },
    posterClose() {
      this.showSelectPosterDialog = false;
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
      let type = this.content.template > "G";
      if (type) {
        this.showSelectPosterDialog = true;
      } else {
        this.showSelectResourceDialog = true;
      }
    },
    addPosterForGTemplate(index) {
      this.showSelectPosterDialog = true;
      this.adheredPosterIndex = index;
    },
    removeCurPostForGTemplate(index) {
      this.content.itemMediaList[index].posterId = null;
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
    .image-wrapper
      width: 110px; 
      position:relative;
      display: flex;
      flex-direction: column;
      flex-shrink 0
      justify-content: center;
    .el-image
      flex-shrink 0
      display inline-flex
      align-items center
      margin 5px
      width 100px
      >>> .el-image__inner
        height auto
    .demo-image-title
      display:inline-block;
      white-space:nowrap;
      text-overflow:ellipsis;
      width:100%;
      text-align: center;
      overflow:hidden;
// todo 为什么无法穿透进去？
.el-popover >>> .el-popover__title
  color red
  text-align center
  font-size 16px
</style>
