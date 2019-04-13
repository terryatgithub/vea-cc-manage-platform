<template>
  <ContentCard :title="title" @go-back="$emit('go-back')">
    <div class="split-bar">
      <i class="el-icon-edit">基本信息</i>
    </div>

    <el-form ref="form" :rules="rules" :model="form" label-width="90px">
      <el-form-item label="主题名称" prop="themeName">
        <el-input v-model="form.themeName" style="width:200px"/>
      </el-form-item>
      <el-form-item label="收费类型">
        <el-radio-group v-model="form.chargeType">
          <el-radio label>免费</el-radio>
          <el-radio label="pay">付费</el-radio>
          <el-radio label="VIPfree">VIP免费</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="form.chargeType!==''" class="priceInput">
        <el-form-item label="价格">
          <el-input v-model="form.price"/>元
        </el-form-item>
        <el-form-item label="折扣价">
          <el-input v-model="form.discountPrice"/>元
        </el-form-item>
      </div>
      <el-form-item label="主题品牌">
        <el-radio-group v-model="form.themeBrand">
          <el-radio label="Coocaa">创维酷开</el-radio>
          <el-radio label="Other">全部</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="皮肤APK">
        <ThemeFileUpload
          accept="application/vnd.android.package-archive"
          fileCount="1"
          @pic-data="handleApk"
          @handleRemove="form.themeDownUrl='';form.themeMd5=''"
        />
      </el-form-item>
      <el-form-item label="主题预览图">
        <ThemeFileUpload
          accept="image/*"
          fileCount="1"
          @pic-data="handlePreviewImg"
          @handleRemove="form.previewImgUrl=''"
        />
      </el-form-item>
      <el-form-item label="主题缩略图">
        <ThemeFileUpload
          accept="image/*"
          fileCount="1"
          @pic-data="handleThumbImg"
          @handleRemove="form.thumbImgUrl=''"
        />
      </el-form-item>
      <el-form-item label="图标库">
        <ThemeFileUpload
          accept="application/zip"
          fileCount="1"
          zipType="icon"
          @pic-data="handlePictureEntitys"
          @handleRemove="form.pictureEntitys=[]"
        />
      </el-form-item>

      <div class="icon-list">
        <div v-for="(icon, index) in form.pictureEntitys" :key="index" class="icon-list__item">
          <img class="icon-list__item-img--pictureEntitys" :src="icon.pictureUrl">
          <span class="icon-list__item-text">{{index+1}}</span>
        </div>
      </div>

      <el-form-item label="指定背景图片">
        <ThemeFileUpload
          accept="application/zip"
          fileCount="1"
          zipType="tabBg"
          @pic-data="handleTabBgEntitys"
          @handleRemove="form.tabBgEntitys=[]"
        />
      </el-form-item>

      <div class="icon-list">
        <div v-for="(icon, index) in form.tabBgEntitys" :key="index" class="icon-list__item">
          <img class="icon-list__item-img--tabBgEntitys" :src="icon.pictureUrl">
          <span class="icon-list__item-text">{{index+1}}</span>
        </div>
      </div>
    </el-form>
    
    <div class="btn-save">
      <el-button type="primary" @click="btnSave">提交审核</el-button>
      <el-button type="warning" @click="$emit('go-back')">关闭</el-button>
    </div>
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

  data() {
    return {
      form: {
        themeName: '',
        chargeType: '',
        price: '',
        discountPrice: '',
        themeBrand: 'Coocaa',
        themeDownUrl: '',
        previewImgUrl: '',
        thumbImgUrl: '',
        systemDefault: '0',
        themeCode: '',
        themeVersion: '',
        themeMd5: '',
        pictureEntitys: [],
        tabBgEntitys: []
      },
      rules: {
        themeName: [
          { required: true, message: '请输入主题名称', trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    btnSave() {
      let form = this.form
      if (form.chargeType === '') {
        form.price = '0'
        form.discountPrice = '0'
      }
    },
    handleApk(picData) {
      this.form.themeDownUrl = picData.url
      this.form.themeMd5 = picData.fileMd5
    },
    handlePreviewImg(picData) {
      this.form.previewImgUrl = picData.url
    },
    handleThumbImg(picData) {
      this.form.thumbImgUrl = picData.url
    },
    handlePictureEntitys(picData) {
      this.form.pictureEntitys = this.EntitysPicUp(picData)
    },
    handleTabBgEntitys(picData) {
      this.form.tabBgEntitys = this.EntitysPicUp(picData)
    },
    EntitysPicUp(picData) {
      return picData.reduce((result, item) => {
        let entity = {
          pictureName: item.originFileName,
          pictureUrl: item.url,
          pictureResolution: item.resolution
        }
        result.push(entity)
        return result
      }, [])
    }
  },
  created() {
    if (this.editId) {
      this.title = '编辑页面'
    } else {
      this.title = '新增页面'
    }
  }
}
</script>

<style lang='stylus' scoped>
.split-bar
  width 96%
  height 36px
  margin 8px 0px
  padding 0px 6px
  font-size 17px
  line-height 36px
  background #e5e9f2
  border-radius 4px
.priceInput >>> .el-input
  width 100px
.icon-list
  display flex
  flex-direction row
  flex-wrap wrap
  width 700px
  margin 5px 85px 16px
  background #fff
  border 1px solid #ddd
.icon-list__item
  display flex
  flex-direction column
  margin 5px
.icon-list__item-img--pictureEntitys
  width 50px
  height 50px
  border 1px solid #eee
  border-radius 3px
.icon-list__item-img--tabBgEntitys
  width 192px
  height 108px
.icon-list__item-text
  height 20px
  line-height 20px
  text-align center
.btn-save
  margin 10px
</style>