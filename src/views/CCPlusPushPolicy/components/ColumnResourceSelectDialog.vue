<template>
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
  methods: {}
};
</script>

<style lang="stylus" scoped></style>
