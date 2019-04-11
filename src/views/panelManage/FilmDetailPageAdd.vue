<template>
  <ContentCard :title="title" @go-back="$emit('go-back')">
    <div>
      <el-button type="primary" @click="btnAudit">提交审核</el-button>
      <el-button type="primary" @click="btnSave">保存草稿</el-button>
    </div>

    <div class="split-bar">
      <i class="el-icon-edit">基本信息</i>
    </div>

    <el-form ref="form" :rules="rules" v-model="form" label-width="90px">
      <el-form-item label="版面名称" prop="tabName">
        <el-input v-model="form.tabName" style="width: 240px"/>
      </el-form-item>
      <el-form-item label="业务分类">
        <el-select v-model="form.tabCategory">
          <el-option label="影视" value="0"/>
          <el-option label="教育" value="1"/>
        </el-select>
      </el-form-item>
      <el-form-item label="内容源" v-if="form.tabCategory==='0'">
        <el-radio-group v-model="tabResource"  @change.native.prevent="changeResource">
          <el-radio label="qq">腾讯</el-radio>
          <el-radio label="iqiyi">爱奇艺</el-radio>
          <el-radio label="voole">优朋</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="频道">
        <el-select v-model="pannel">
          <el-option value="" label="不限"/>
          <el-option v-for="(item, index) in pannelItems" :key="index" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="产品包">
        <el-select v-model="product">
          <el-option value="" label="不限"/>
          <el-option v-for="(item, index) in productItems" :key="index" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
    </el-form>
  </ContentCard>
</template>

<script>
export default {
  components: {},

  watch: {
    'form.tabCategory': {
      deep: true,
      handler: function(newVal, oldVal){
        if(newVal === '1'){
          this.pannelItems = []
          this.productItems = this.eduProductItems
          this.pannel = ''
          this.product = ''
        }else if(newVal === '0'){
          this.handleTabResourceChange(this.tabResource)
        }
      }
    },
    tabResource:function (value) {
      this.handleTabResourceChange(value)
    }
  },

  data () {
    return {
      title: '新增页面',
      rules: {
        tabName: [
          { required: true, message: '请输入主题名称', trigger: 'blur' }
        ]
      },
      form: {
        tabResource: 'qq',
        tabCategory: '0'
      },
      tabResource: 'qq',
      iqiyiSource: [],
      qqSource: [],
      pannel: '',
      pannelItems: [],
      product: '',
      productItems: [],
      eduProductItems: []
    };
  },

  methods: {
    // 头部按钮
    btnAudit() {
      console.log('form', this.form);
    },
    btnSave() {
      
    },
    // 内容源改变
    changeResource(value) {
      this.$confirm('是否要切换内容源，切换内容源之后所选择的版块数据将会清除掉！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        this.$message({
          type: 'success',
          message: '内容源切换成功!'
        })
        this.form.tabResource = this.tabResource
        this.clearResource()
      })
      .catch(() => {
        this.$message({
          type: 'info',
          message: '已取消切换'
        })
        this.tabResource = this.form.tabResource
      })
    },
    clearResource() {

    },
    // 服务
    getMediaResourceInfo() {
      return this.$service.getMediaResourceInfo().then(data => {
        var movieData = JSON.parse(decodeURI(data.slice(5,-1)))
        var videoItemModels = movieData.videoItemModels
        // 内容源：iqiyi
        var iqiyiSource = {
          categoryList: [],
          productList: [],
        }
        iqiyiSource.categoryList = this._arrayingOption(videoItemModels[0].categoryList, 'category_name', 'category_id')
        iqiyiSource.productList = this._arrayingOption(videoItemModels[0].productList, 'source_name', 'source_sign')
        this.iqiyiSource = iqiyiSource

        //内容源：tencent
        var qqSource = {
          categoryList: [],
          productList: [],
        }
        qqSource.categoryList = this._arrayingOption(videoItemModels[1].categoryList, 'category_name', 'category_id')
        qqSource.productList = this._arrayingOption(videoItemModels[1].productList, 'source_name', 'source_sign')
        this.qqSource = qqSource
        this.pannelItems = qqSource.categoryList // 初始化
        this.productItems = qqSource.productList
        //教育->产品包
        this.eduProductItems = this._arrayingOption(videoItemModels[2].productList, 'source_name', 'source_sign')
      })
    },
    // 数组化[{label, value}]
    _arrayingOption(arr, label, value) {
      return arr.reduce((result, item) => {
        return result.concat({label: item[label], value: item[value]})
      }, [])
    },
    handleTabResourceChange(value) {
      const { qqSource, iqiyiSource, tabResource } = this
      this.pannel = ''
      this.product = ''
      switch(value){
        case 'qq': {
          this.pannelItems = qqSource.categoryList
          this.productItems = qqSource.productList
          break
        }
        case 'iqiyi': {
          this.pannelItems = iqiyiSource.categoryList
          this.productItems = iqiyiSource.productList
          break
        }
        default: {
          this.pannelItems = []
          this.productItems = []
        }
      }
    }
  },
  created() {
    this.getMediaResourceInfo()
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
</style>