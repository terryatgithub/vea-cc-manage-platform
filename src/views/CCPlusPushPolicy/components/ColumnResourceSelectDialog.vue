<template>
  <el-form :model="form" label-width="100px" inline width="30%" :rules="rules">
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
        <el-select multiple v-model="form.category" placeholder="类型 category">
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

    <el-form-item>
      <el-button @click="closeColumnResourceSelectDialog(false)"
        >取消</el-button
      >
      <el-button @click="closeColumnResourceSelectDialog(true)">完成</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
//栏目资源选择组件
export default {
  data() {
    return {
      form: {
        source: [],
        category: [],
        tag: []
      },
      rules: {},
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
    closeColumnResourceSelectDialog(confirm) {
      console.log("close: ", confirm);
      if(confirm) {
        let res = Object.keys(this.form).filter(key => this.form[key].length !== 0)
        if (!res.length) {
          this.$message({type:'error', message: '请选择至少一个类别'})
        } else {
          this.$emit('get-select-resource', this.form)
        }
      } else {
        this.$emit('get-select-resource')
      }
    }
  }
};
</script>

<style lang="stylus" scoped></style>
