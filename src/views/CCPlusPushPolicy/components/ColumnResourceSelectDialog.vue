<template>
  <el-form ref="resourceForm" :model="form" label-width="100px" inline width="30%" :rules="rules">
    <el-col :span="8">
      <el-form-item>
        <el-select
          multiple
          v-model="form.source"
          placeholder="来源 video_source"
        >
          <el-option
            v-for="option in sourceOptions"
            :label="option.supplier"
            :key="option.supplier"
            :value="option.supplier"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-col>

    <el-col :span="8">
      <el-form-item>
        <el-select multiple v-model="form.category" placeholder="类型 category">
          <el-option
            v-for="option in categoryOptions"
            :label="option.category"
            :key="option.category"
            :value="option.category"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-col>

    <el-col :span="8">
      <el-form-item>
        <el-select multiple v-model="form.tag" placeholder="标签 tags">
          <el-option
            v-for="option in tagOptions"
            :label="option.tag"
            :key="option.tag"
            :value="option.tag"
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
      ],
      categoryOptions: [
      ],
      tagOptions: [
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
      this.$refs.resourceForm.resetFields()
    },
    async getAllSelections(){
      let res = await this.$service.queryCCPlusMediaResourceAllSelect()
      if(res.code === 0) {
        this.sourceOptions = res.data.supplierList
        this.categoryOptions = res.data.categoryList
        this.tagOptions = res.data.tagList
      }else {
        this.$message({
            type: "error",
            message: res.msg
          });
      }
    }
  },
  created() {
    this.getAllSelections()
  }
};
</script>

<style lang="stylus" scoped></style>
