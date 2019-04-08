<template>
  <ContentCard :title="title" @go-back="$emit('go-back')">
    <div>
      <el-button type="primary">提交审核</el-button>
      <el-button type="warning" @click="$emit('go-back')">关闭</el-button>
    </div>

    <div class="split-bar">
      <i class="el-icon-edit">基本信息</i>
    </div>

    <el-form ref="form" :model="form" label-width="90px">
      <el-form-item label="主题名称">
        <el-input v-model="form.themeName" style="width:200px"/>
      </el-form-item>
      <el-form-item label="收费类型">
        <el-radio-group v-model="form.chargeType">
          <el-radio label="">免费</el-radio>
          <el-radio label="pay">付费</el-radio>
          <el-radio label="VIPfree">VIP免费</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="form.chargeType!==''" class="priceInput">
        <el-form-item label="价格">
          <el-input v-model="form.price"/>元
        </el-form-item>
        <el-form-item v-model="form.discountPrice" label="折扣价">
          <el-input/>元
        </el-form-item>
      </div>
      <el-form-item label="主题品牌">
        <el-radio-group v-model="form.themeBrand">
          <el-radio label="Coocaa">创维酷开</el-radio>
          <el-radio label="Other">全部</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="皮肤APK">
        <ThemeFileUpload/>
      </el-form-item>
      <el-form-item label="主题预览图">
        <ThemeFileUpload accept="image/png"/>
      </el-form-item>
      <el-form-item label="主题缩略图">
        <ThemeFileUpload/>
      </el-form-item>
      <el-form-item label="图标库">
        <ThemeFileUpload/>
      </el-form-item>
      
      <div class="line"></div>

      <el-form-item label="指定背景图片">
        <ThemeFileUpload/>
      </el-form-item>
    </el-form>
  </ContentCard>
</template>

<script>
import ThemeFileUpload from './ThemeFileUpload'
export default {
  props: {
    editId: Number,
    default: null
  },

  components: {
    ThemeFileUpload
  },

  data () {
    return {
      form: {
        chargeType: '',
        themeBrand: 'Coocaa'
      }
    };
  },

  methods: {},
  created() {
    if(this.editId){
      this.title = '编辑页面'
    }else {
      this.title = '新增页面'
    }
  }

}
</script>

<style lang='stylus' scoped>
.split-bar 
  width: 96%
  height: 36px
  margin: 8px 0px
  padding: 0px 6px
  font-size: 17px
  line-height: 36px
  background: #e5e9f2
  border-radius: 4px
.priceInput >>> .el-input
  width 100px
.line
  position: relative
  width 700px
  margin 5px 85px
  border: 1px solid #ddd
</style>