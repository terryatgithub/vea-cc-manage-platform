<template>
  <ContentCard :title="title" @go-back="$emit('go-back')">
    <!--新增编辑界面-->
    <el-row :gutter="40">
      <el-col :span="24">
        <el-form :model="form" :rules="formRules" ref="form" label-width="100px">
          <el-form-item label="布局名称(中文)" prop="layoutName">
            <el-input v-model="form.layoutName" placeholder="布局名称"></el-input>
          </el-form-item>
          <el-form-item label="布局类别" prop="layoutType">
            <el-select v-model="form.layoutType" placeholder="布局类别">
              <el-option
                v-for="item in layoutType"
                :key="item.name+''"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上传文件" >
              <Upload :multiple="true" class="global-picture__uploader" ref="upload" @upload="handleUpload">

              </Upload>
          </el-form-item>
           <el-form-item label="布局" prop="typePriority">
           <el-button type="primary" @click="productLayout">生存布局</el-button>
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
import { Upload } from 'admin-toolkit'
export default {
  components: {
    Upload
  },
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
          { required: true, message: "请输入角标名称", trigger: "blur" }
        ],
        typePosition: [
          { required: true, message: "请输入角标位置", trigger: "blur" }
        ],
        typePriority: [
          { required: true, message: "请输入角标优先级", trigger: "blur" },
        ]
      }
    };
  },
  methods: {
    submitBtn() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$service.globalCornerIconTypeSave(this.form, "保存成功").then(data => {
            this.$emit('open-list-page');
          });
        }
      });
    },
    getEditData() {
      let obj = this;
      this.$service.globalCornerIconTypeDetail({ id: this.editId }).then(data => {
        Object.keys(this.form).forEach(v => {
            this.form[v] = data[v];
        });
      });
    },
    handleUpload(file, fileItem) {

    },
    productLayout() {
      
    }

  },
  created() {
    if (this.editId !== null && this.editId !== undefined) {
      this.title = "编辑";
      this.typeId = this.editId
      this.getEditData();
    } else {
      this.title = "新增";
    }
  }
};
</script>
