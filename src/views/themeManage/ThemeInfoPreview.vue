<template>
  <ContentCard title="预览页面" @go-back="$emit('go-back')">
    <!--操作btn start-->
    <div class="operate-box">
      <div class="operate-box__head">
        <div class="operate-box__version" v-if="isShowHistory">
          <span>版本： </span>
          <el-select style="width:300px" v-model="currentVersion" @change="changeVersion">
            <el-option v-for="(item, index) in historyList" :key="index" :label="item.label" :value="item.value"/>
          </el-select>
        </div>
        <div class="operate-box__status">{{statusName}}</div> 
      </div>
      <el-button v-if="themeStatus === 0" type="primary">上架</el-button>
      <el-button v-if="themeStatus === 2 || themeStatus === 3 || themeStatus === 5" type="primary">审核</el-button>
      <el-button v-else type="warning">创建副本</el-button>
    </div>
    <!--操作btn end-->
    <div class="split-bar">
      <i class="el-icon-edit">基本信息</i>
    </div>

    <el-form>
      <el-form-item label="主题名称" class="label">
        <span title="themeName">{{form.themeName}}</span>
      </el-form-item>
      <el-form-item label="价格" class="label">
        <span title="price">{{form.price}}元</span>
        <span title="discountPrice">(折扣:{{form.discountPrice}}元)</span>
      </el-form-item>
      <el-form-item label="主题品牌" class="label">
        <span title="themeBrand">{{form.themeBrand}}</span>
      </el-form-item>
      <el-form-item label="主题预览图" class="label">
        <div title="previewImgUrl" class="img-box">
          <img :src="form.previewImgUrl" class="img">
        </div>
      </el-form-item>
      <el-form-item label="主题缩略图" class="label">
        <div title="thumbImgUrl" class="img-box">
          <img :src="form.thumbImgUrl" class="img">
        </div>
      </el-form-item>
      <el-form-item label="图标库" class="label">
        <div class="icon-list" title="pictureEntitys">
          <div v-for="(icon, index) in form.pictureEntitys" :key="index" class="icon-list__item">
            <img class="icon-list__item-img--pictureEntitys" :src="icon.pictureUrl">
            <span class="icon-list__item-text">{{icon.iconTypeName}}</span>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="指定背景图" class="label">
        <div class="icon-list">
          <div v-for="(icon, index) in form.tabBgEntitys" :key="index" class="icon-list__item">
            <img class="icon-list__item-img--tabBgEntitys" :src="icon.pictureUrl">
            <span class="icon-list__item-text">{{index+1}}</span>
          </div>
        </div>
      </el-form-item>
    </el-form>
  </ContentCard>
</template>

<script>
export default {
  components: {},

  props: {
    themeInfo: Object
  },

  data() {
    return {
      form: {
        themeName: '',
        price: '',
        discountPrice: '',
        themeBrand: '',
        previewImgUrl: '',
        thumbImgUrl: '',
        pictureEntitys: [],
        tabBgEntitys: []
      },
      themeStatus: undefined, // 审核状态
      statusOption: ['下架', '上架', '草稿', '待审核', '审核通过', '审核不通过'],
      historyList: [],// 历史版本
      isShowHistory: true,
      currentVersion: ''
    }
  },

  computed: {
    statusName() {
      if(this.historyList.length !== 0) {
        let label = this.historyList.find(item => {
          return item.value === this.currentVersion
        }).label
        let statusName = label.split("/")[3]
        this.themeStatus = this.statusOption.indexOf(statusName)
        return statusName
      }
      return this.statusOption[this.themeStatus]
    }
  },

  methods: {
    changeVersion(version) {
      this.$service.themeInfoDetail({ id: this.themeInfo.themeId, version }).then(data => {
        this.themeStatus = data.themeStatus
        const form = this.form
        Object.keys(form).map(key => {
          form[key] = data[key]
        })
        form.themeBrand = form.themeBrand === 'Coocaa' ? '创维酷开' : '其他'
      })
    }
  },
  created() {
    const { themeInfo, form } = this
    // 填写表单
    form.themeName = themeInfo.themeName
    form.price = themeInfo.price
    form.discountPrice = themeInfo.discountPrice
    form.themeBrand = themeInfo.themeBrand === 'Coocaa' ? '创维酷开' : '其他'
    form.previewImgUrl = themeInfo.previewImgUrl
    form.thumbImgUrl = themeInfo.thumbImgUrl
    form.pictureEntitys = themeInfo.pictureEntitys
    form.tabBgEntitys = themeInfo.tabBgEntitys

    this.themeStatus = themeInfo.themeStatus
    // 历史版本historyList
    let historyList = this.historyList
    this.$service.themeInfoHistory({ id: themeInfo.themeId, type: 'theme' }).then(data => {
      if(data.total === 0){
        this.isShowHistory = false
      }else {
        this.currentVersion = data.rows[0].version 
        data.rows.forEach(row => {
          let label = row.version + '/' + row.lastUpdateDate + '/' + row.modifierName + '/' + this.statusOption[row.status]
          historyList.push({'label': label, 'value': row.version})
        })
      }
    })
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
.el-form >>> .el-form-item__label
  width 110px
  height 30px
  margin auto 5px auto 12px
  text-align center
  border 1px solid #ddd
  border-radius 5px
  background-color #f1f1f1
.img-box
  max-width 700px
  margin-left 120px
.img
  width 100%
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
.operate-box
  width 100%
  height 100px
  float fixed
  background-color #fff
.operate-box__head
  margin-bottom 20px
.operate-box__status
  display inline-block
  width 120px
  height 30px
  line-height 30px
  padding 0 5px
  background #4fc71b
  color #fff
  text-align center
.operate-box__version
  display: inline-block
  margin-right 10px
</style>