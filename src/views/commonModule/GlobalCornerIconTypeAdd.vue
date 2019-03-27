<template>
  <ContentCard :title="title" @go-back="$emit('go-back')">
    <!--新增编辑界面-->
    <el-row :gutter="40">
      <el-col :span="24">
        <el-form :model="form" :rules="formRules" ref="form" label-width="100px">
          <el-form-item label="角标名称" prop="typeName">
            <el-input v-model="form.typeName" placeholder="角标名称"></el-input>
          </el-form-item>
          <el-form-item label="角标位置" prop="typePosition">
            <el-select v-model="form.typePosition" placeholder="角标位置">
              <el-option
                v-for="item in typePosition"
                :key="item.name+''"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="优先级" prop="typePriority">
            <el-input-number v-model="form.typePriority" :min="1" label="优先级"></el-input-number>
            <!-- <el-input v-model="form.typePriority" placeholder="优先级"></el-input> -->
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitBtn">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </ContentCard>
</template>
<script>
export default {
  props: {
    editId: Number,
    default: null
  },
  data() {
    return {
      title: null,
      typePosition: [
        {
          name: '左上',
          id: 0
        },
        {
          name: '右上',
          id: 1
        },
        {
          name: '右下',
          id: 2
        },
        {
          name: '左下',
          id: 3
        }
      ],
      form: {
        typeName: null,
        typePosition: null,
        typePriority: null
      },
      formRules: {
        // 表单规则
        typeName: [
          { required: true, message: '请输入角标名称', trigger: 'blur' }
        ],
        typePosition: [
          { required: true, message: '请输入角标位置', trigger: 'blur' }
        ],
        typePriority: [
          { required: true, message: '请输入角标优先级', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitBtn() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$service
            .globalCornerIconTypeSave({ 'jsonStr': JSON.stringify(this.form) }, '保存成功')
            .then(data => {
              this.$emit('openListPage')
            })
        }
      })
    },
    getEditData() {
      let obj = this
      this.$service
        .globalCornerIconTypeDetail({ id: this.editId })
        .then(data => {
          Object.keys(this.form).forEach(v => {
            this.form[v] = data[v]
          })
        })
    }
  },
  created() {
    if (this.editId !== null && this.editId !== undefined) {
      this.title = '编辑'
      this.typeId = this.editId
      this.getEditData()
    } else {
      this.title = '新增'
    }
  }
}
</script>
