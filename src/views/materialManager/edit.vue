<template>
    <div>
      <el-form
        ref="appForm"
        :model="appForm"
        class="appEdit"
        :rules="appRules"
        :inline="true"
        style="width: 500px;text-align: center;"
        v-if="dialogType === 'appCreate' || dialogType === 'appEdit'"
      >
        <el-form-item label="应用名" prop="appName">
          <el-input
            placeholder="请输入应用名"
            v-model="appForm.appName"
          />
        </el-form-item>
        <el-form-item label="图标" class="imgUpload">
          <el-upload
            class="app-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <i class="el-icon-plus app-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="类型"
          prop="type"
        >
          <el-select
            class="filter-item"
            placeholder="请选择类型"
            v-model="appForm.type"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.key"
              :label="item.typeName"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="应用跳转url" prop="skipUrl">
          <el-input
            placeholder="请输入应用跳转url"
            v-model="appForm.skipUrl"
          />
        </el-form-item>
        <el-form-item label="api url" prop="apiUrl">
          <el-input
            placeholder="请输入api url"
            v-model="appForm.apiUrl"
          />
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
          <el-input type="textarea" :rows="2" maxlength="200" show-word-limit placeholder="请输入备注" v-model="appForm.remark"></el-input>
        </el-form-item>
        <el-form-item
          label="状态"
          prop="statu"
        >
          <el-select
            class="filter-item"
            placeholder="请选择状态"
            v-model="appForm.statu"
          >
            <el-option value="0" label="失效"/>
            <el-option value="1" label="有效"/>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form
        ref="posterForm"
        :model="posterForm"
        class="appEdit"
        :rules="posterRules"
        :inline="true"
        style="width: 500px;text-align: center;"
        v-if="dialogType === 'posterCreate' || dialogType === 'posterEdit'"
      >
        <el-form-item label="海报名" prop="posterName">
          <el-input
            placeholder="请输入海报名"
            v-model="posterForm.posterName"
          />
        </el-form-item>
        <el-form-item label="图标" class="imgUpload" prop="posterImg">
          <el-upload
            class="long-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="posterForm.posterImg" :src="posterForm.posterImg" class="avatar">
            <i v-else class="el-icon-plus long-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="尺寸类型"
          prop="type"
        >
          <el-select
            class="filter-item"
            placeholder="请选择尺寸类型"
            v-model="posterForm.type"
          >
            <el-option
              v-for="item in sizeOptions"
              :key="item.key"
              :label="item.sizeName"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="关联url" prop="relevanceUrl">
          <el-input
            placeholder="请输入关联url"
            v-model="posterForm.relevanceUrl"
          />
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
          <el-input type="textarea" :rows="2" maxlength="200" show-word-limit placeholder="请输入备注" v-model="posterForm.remark"></el-input>
        </el-form-item>
        <el-form-item
          label="状态"
          prop="statu"
        >
          <el-select
            class="filter-item"
            placeholder="请选择状态"
            v-model="posterForm.statu"
          >
            <el-option value="0" label="失效"/>
            <el-option value="1" label="有效"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">
          取消
        </el-button>
        <el-button type="primary" @click="create">
          确定
        </el-button>
      </div>
    </div>
</template>

<script>
export default {
  components: {},
  props: {
    dialogType: {
      type: String
    }
  },
  watch: {
    dialogType: (newVal, oldVal) => {
      console.log(newVal)
    }
  },
  data () {
    return {
      typeOptions: [
        { key: '1', typeName: '财务' },
        { key: '2', typeName: '儿童' },
        { key: '3', typeName: '参考' },
        { key: '4', typeName: '工具' },
        { key: '5', typeName: '购物' },
        { key: '6', typeName: '健康健美' },
        { key: '7', typeName: '教育' },
        { key: '8', typeName: '旅游' },
        { key: '9', typeName: '美食' },
        { key: '10', typeName: '商务' },
        { key: '11', typeName: '社交' },
        { key: '12', typeName: '生活' },
        { key: '13', typeName: '体育' },
        { key: '14', typeName: '天气' },
        { key: '15', typeName: '图书' },
        { key: '16', typeName: '新闻' },
        { key: '17', typeName: '音乐' },
        { key: '18', typeName: '娱乐' }
      ],
      sizeOptions: [
        { key: '1', sizeName: '400*600' },
        { key: '2', sizeName: '400*600' },
        { key: '3', sizeName: '600*900' }
      ],
      appForm: {
        appName: '',
        squareImg: '',
        longImg: '',
        type: '',
        skipUrl: '',
        apiUrl: '',
        remark: '',
        statu: ''
      },
      appRules: {
        appName: [
          { required: true, message: '请输入应用名', trigger: 'blur' }
        ],
        squareImg: [
          { required: true, message: '请上传方logo', trigger: 'change' }
        ],
        longImg: [
          { required: true, message: '请上传长logo', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        skipUrl: [
          { required: true, message: '请输入跳转url', trigger: 'blur' }
        ],
        apiUrl: [
          { required: true, message: '请输入api url', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'blur' }
        ],
        statu: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      },
      posterForm: {
        posterName: '',
        posterImg: '',
        type: '',
        relevanceUrl: '',
        remark: '',
        statu: ''
      },
      posterRules: {
        posterName: [
          { required: true, message: '请输入海报名', trigger: 'blur' }
        ],
        posterImg: [
          { required: true, message: '请上传海报图', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择尺寸类型', trigger: 'change' }
        ],
        relevanceUrl: [
          { required: true, message: '请输入关联url', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'blur' }
        ],
        statu: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    cancel () {

    },
    create () {
      if (this.dialogType === 'appCreate' || this.dialogType === 'appEdit') {
        this.$refs['appForm'].validate((valid) => {
          if (valid) {
            alert('submit!')
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else if (this.dialogType === 'posterCreate' || this.dialogType === 'posterEdit') {
        this.$refs['posterForm'].validate((valid) => {
          if (valid) {
            alert('submit!')
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handleAvatarSuccess (res, file) {
      debugger
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' || 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 PNG或JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图标图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>
<style lang='scss'>
.appEdit {
  .el-form-item {
    .el-form-item__label {
      width: 120px;
      text-align: left
    }
    .el-form-item__content {
      width: 240px!important;
      .el-select{
        margin: 0;
      }
    }
    // 上传
    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      &:hover {
        border-color: #409EFF;
      }
    }
    .app-uploader {
      .el-upload--picture-card {
        width: 80px;
        height: 80px;
        line-height: 88px;
      }
    }
    .long-uploader {
      .long-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 90px;
        height: 80px;
        line-height: 80px;
        text-align: center;
      }
      .avatar {
        width: 90px;
        height: 80px;
        display: block;
      }
    }
  }
  .imgUpload {
    .el-form-item {
      text-align: left;
    }
    .el-form-item__content {
      text-align: left;
    }
  }
}
</style>
