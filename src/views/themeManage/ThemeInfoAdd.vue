<template>
  <ContentCard :title="title" @go-back="$emit('go-back')">
    <div class="btn-save">
      <el-button type="primary" @click="btnSave">提交审核</el-button>
      <el-button type="warning" @click="$emit('go-back')">关闭</el-button>
    </div>

    <div class="split-bar">
      <i class="el-icon-edit">基本信息</i>
    </div>

    <el-form ref="form" :rules="rules" :model="form" label-width="90px">
      <el-form-item label="主题名称" prop="themeName">
        <el-input v-model="form.themeName" style="width:200px"/>
      </el-form-item>
      <el-form-item label="收费类型">
        <el-radio-group v-model="form.chargeType">
          <el-radio label="0">免费</el-radio>
          <el-radio label="1">付费</el-radio>
          <el-radio label="2">VIP免费</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="form.chargeType!=='0'" class="priceInput">
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
          ref="apk"
          accept="application/vnd.android.package-archive"
          fileCount="1"
          @pic-data="handleApk"
          @handleRemove="form.themeDownUrl='';form.themeMd5=''"
        />
      </el-form-item>
      <el-form-item label="主题预览图">
        <ThemeFileUpload
          ref="preview"
          accept="image/*"
          fileCount="1"
          @pic-data="handlePreviewImg"
          @handleRemove="form.previewImgUrl=''"
        />
      </el-form-item>
      <el-form-item label="主题缩略图">
        <ThemeFileUpload
          ref="thumbImg"
          accept="image/*"
          fileCount="1"
          @pic-data="handleThumbImg"
          @handleRemove="form.thumbImgUrl=''"
        />
      </el-form-item>
      <el-form-item label="图标库">
        <ThemeFileUpload
          ref="pictureEntitys"
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
          ref="tabBgEntitys"
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
    
  </ContentCard>
</template>

<script>
import ThemeFileUpload from './ThemeFileUpload'
export default {
  props: {
    editId: Number,
    version: String,
    default: null
  },

  components: {
    ThemeFileUpload
  },

  data() {
    return {
      form: {
        themeName: '',
        chargeType: '0',
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
        tabBgEntitys: [],
        themeStatus: 3 // 默认待审核
      },
      rules: {
        themeName: [
          { required: true, message: '请输入主题名称', trigger: 'blur' }
        ]
      },
      editForm: {} // 编辑页面save的其他表单信息
    }
  },

  methods: {
    btnSave() {
      let form = this.form
      if (form.chargeType === '0') {
        form.price = '0'
        form.discountPrice = '0'
      }
      const editForm = this.editForm
      const formData = Object.assign({}, form, editForm)
      console.log('formData', formData);
      this.$service.savethemeInfo({jsonStr: JSON.stringify(formData)}, '保存成功').then(() => {
        this.$emit('open-list-page')
      })
    },
    handleApk(picData) {
      this.$service.checkThemeMd5({ themeMd5: picData.fileMd5 }, '该主题可用').then(() => {
        this.form.themeDownUrl = picData.url
        this.form.themeMd5 = picData.fileMd5
      })
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
      this.$service.themeInfoDetail({ id: this.editId, version: this.version }).then(data => {
        const form = this.form
        form.themeName = data.themeName
        form.chargeType = data.chargeType.toString()
        form.price = data.price
        form.discountPrice = data.discountPrice
        form.themeBrand = data.themeBrand

        // apk
        form.themeDownUrl = data.themeDownUrl
        form.themeMd5 = data.themeMd5
        let apkFile = {
          name: 'file'
        }
        let apkFileList = this.$refs.apk.$refs.upload.fileList
        apkFileList.push(apkFile)
        this.$refs.apk.fileNum++
        // preview
        form.previewImgUrl = data.previewImgUrl
        let previewFile = {
          name: 'img',
          dataUrl: data.previewImgUrl
        }
        let previewFileList = this.$refs.preview.$refs.upload.fileList
        previewFileList.push(previewFile)
        this.$refs.preview.fileNum++
        // thumbImg
        form.thumbImgUrl = data.thumbImgUrl
        let thumbImgFile = {
          name: 'img',
          dataUrl: data.thumbImgUrl
        }
        let thumbImgFileList = this.$refs.thumbImg.$refs.upload.fileList
        thumbImgFileList.push(thumbImgFile)
        this.$refs.thumbImg.fileNum++
        // pictureEntitys
        form.pictureEntitys = data.pictureEntitys
        let pictureEntitysFile = {
          name: 'file'
        }
        let pictureEntitysFileList = this.$refs.pictureEntitys.$refs.upload.fileList
        pictureEntitysFileList.push(pictureEntitysFile)
        this.$refs.pictureEntitys.fileNum++
        // tabBgEntitys
        form.tabBgEntitys = data.tabBgEntitys
        let tabBgEntitysFile = {
          name: 'file'
        }
        let tabBgEntitysFileList = this.$refs.tabBgEntitys.$refs.upload.fileList
        tabBgEntitysFileList.push(tabBgEntitysFile)
        this.$refs.tabBgEntitys.fileNum++

        form.systemDefault = data.systemDefault
        form.themeStatus = 3
        
        this.editForm = {
          themeId: data.themeId,
          currentVersion: this.version ? '' : data.currentVersion
        }
      })
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