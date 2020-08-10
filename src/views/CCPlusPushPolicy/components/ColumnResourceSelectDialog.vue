<template>
  <el-dialog
    :visible.sync="show"
    title="栏目资源选择(可多选)(可反选)"
    :before-close="handleClose"
  >
    <el-form :model="form" label-width="100px" inline width="30%">
      <el-col :span="8">
        <el-form-item>
          <el-select
            multiple
            v-model="form.source"
            placeholder="来源 video_source"
          >
            <el-option
              v-for="option in sourceOptions"
              :label="option.label"
              :key="option.value"
              :value="option.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item>
          <el-select
            multiple
            v-model="form.category"
            placeholder="类型 category"
          >
            <el-option
              v-for="option in categoryOptions"
              :label="option.label"
              :key="option.value"
              :value="option.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item>
          <el-select multiple v-model="form.tag" placeholder="标签 tags">
            <el-option
              v-for="option in tagOptions"
              :label="option.label"
              :key="option.value"
              :value="option.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close(false, $event)">取消</el-button>
      <el-button type="primary" @click="close(true, $event)"
        >确定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
//栏目资源选择组件
export default {
  props: {
    show: Boolean
  },
  data() {
    return {
      form: {
        source: [],
        category: [],
        tag: []
      },
      sourceOptions: [
        {
          label: "奈飞",
          value: "netflix"
        },
        {
          label: "油管",
          value: "youtube"
        }
      ],
      categoryOptions: [
        {
          label: "Movies",
          value: "movie"
        },
        {
          label: "TV",
          value: "tv"
        }
      ],
      tagOptions: [
        {
          label: "ohio",
          value: "ohio"
        },
        {
          label: "Goldstate",
          value: "goldstate"
        }
      ]
    };
  },
  methods: {
      close(confirm, event) {
          console.log('close: ', confirm, event);
          this.show = false
          this.$emit('dlg-close', event)
      },
    handleClose(done) {   
      this.$confirm("确认关闭？")
        .then(() => {
        this.close(false)
          done();
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="stylus" scoped></style>
