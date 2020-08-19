<template>
    <el-form class="detailForm">
        <el-form-item label="区域名:">
            {{regionData.ctmDevCtrName}}
        </el-form-item>
        <el-form-item label="客户&品牌:">
          <el-tag 
            type="warning" 
            v-for="item in regionData.brandNames" 
            :key="item"
          >{{item}}</el-tag>
        </el-form-item>
        <el-form-item label="机芯&机型:">
          <el-tag 
            type="warning" 
            v-for="item in regionData.devices" 
            :key="item"
          >{{item}}</el-tag>
        </el-form-item>
        <el-form-item label="国家:">
          <el-tag 
            type="warning" 
            v-for="item in regionData.countryNames" 
            :key="item"
          >{{item}}</el-tag>
        </el-form-item>
    </el-form>
</template>
<script>
// import ContentCard from '@/components/ContentCard'
// import Bus from '@/assets/Bus.js'
export default {
  components: {},
  props: {
    // 没搞明白为啥参数名是id才能传
    id: {
      type: String
    }
  },
  data () {
    return {
      regionData: {}
    }
  },
  methods: {
    detail () {
      if (this.id) {
        this.$service.getAreaManageRlsId({ rlsId: this.id }).then(data => {
          if (data.code === 0) {
            this.regionData = data.data
            this.regionData.brandNames = this.regionData.brandNames.split(',')
            this.regionData.devices = this.regionData.devices.split(',')
            this.regionData.countryNames = this.regionData.countryNames.split(',')
          } else {
            this.$message({
              type: 'error',
              message: data.msg
            })
          }
        })
      }
    }
  },
  created () {
    this.detail()
  }
}
</script>
<style lang='scss'>
.detailForm {
  .el-form-item {
    .el-form-item__label {
      width: 90px;
      text-align: right;
    }
    .el-form-item__content {
      width: 350px;
      display: inline-block;
    }
    .el-tag {
      margin: 0 10px;
    }
  }
}
</style>
