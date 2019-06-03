<template>
  <ContentCard :title="title" @go-back="$emit('go-back')">
    <!--新增编辑界面-->
    <el-button type="primary" @click="submitBtn">保存</el-button>
    <div class="form-legend-header">
      <i class="el-icon-edit">基本信息</i>
    </div>
    <el-form :model="form" :rules="formRules" ref="form" label-width="100px" class="el-form-add">
      <el-form-item label="字典名称" prop="dictCnName">
        <el-input v-model="form.dictCnName" placeholder="字典名称"></el-input>
      </el-form-item>
      <el-form-item label="字典值" prop="dictEnName">
        <el-input v-model="form.dictEnName" placeholder="字典值"></el-input>
      </el-form-item>
      <el-form-item label="字典分类" prop="dictCategory">
        <!-- <el-select  v-model="form.dictCategory"   clearable placeholder="请选择字典分类" value-key="value">
              <el-option v-for="item in dictCategoryStr" :key="item.value" :label="item.label" :value="item">
              </el-option>
        </el-select>-->
        <el-select v-model="form.dictCategory" clearable placeholder="请选择字典分类">
          <el-option
            v-for="item in dictCategoryStr"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </ContentCard>
</template>
<script>
export default {
  props: {
    editData: {
      type: Object
    }
  },
  //  prop: ['editId'],
  data() {
    return {
      title: null,
      form: {
        dictId: null,
        dictCnName: null,
        dictEnName: null,
        dictCategory: null,
        checked: null,
        createdDate: null,
        creater: null,
        dictStatus: null,
        flag: null,
        id: null,
        keyword: null,
        lastUpdateDate: null,
        modifier: null
      },
      dictCategoryStr: [],
      formRules: {
        //表单规则
        dictCnName: [
          { required: true, message: '请输入字典名称', trigger: 'blur' }
        ],
        dictEnName: [
          { required: true, message: '请输入字典值', trigger: 'blur' }
        ],
        dictCategory: [
          { required: true, message: '请选择字典分类', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    /**
     * 获取字典分类
     */
    getDictCategoryList() {
      this.$service.getDictCategoryList().then(data => {
        //去重
        var obj = {}
        this.dictCategoryStr = data
      })
    },

    submitBtn() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const dictObj = {
            dictId: this.form.dictId,
            dictCategory: this.form.dictCategory,
            dictCnName: this.form.dictCnName,
            dictEnName: this.form.dictEnName
          }
          this.$service.SaveDictionary(dictObj, '保存成功').then(data => {
            this.$emit('open-list-page')
          })
        }
      })
    }
  },
  created() {
    if (this.editData !== null && this.editData !== undefined) {
      this.title = '编辑'
      this.form = this.editData
    } else {
      this.title = '新增'
    }
    this.getDictCategoryList()
  }
}
</script>

