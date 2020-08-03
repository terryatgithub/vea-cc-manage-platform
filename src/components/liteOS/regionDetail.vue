<template>
  <ContentCard title="区域信息" @go-back="goBack">
    <el-form class="detailForm">
        <el-form-item label="区域名:">
            哈哈
        </el-form-item>
        <el-form-item label="客户&品牌:">
            <el-tag>标签一</el-tag>
            <el-tag type="success">标签二</el-tag>
            <el-tag type="info">标签三</el-tag>
            <el-tag type="warning">标签四</el-tag>
            <el-tag type="danger">标签五</el-tag>
        </el-form-item>
        <el-form-item label="机芯&机型:">
            <el-tag>标签一</el-tag>
            <el-tag type="success">标签二</el-tag>
            <el-tag type="info">标签三</el-tag>
            <el-tag type="warning">标签四</el-tag>
            <el-tag type="danger">标签五</el-tag>
        </el-form-item>
        <el-form-item label="国家:">
            <el-tag>标签一</el-tag>
            <el-tag type="success">标签二</el-tag>
        </el-form-item>
    </el-form>
  </ContentCard>
</template>
<script>
import ContentCard from '@/components/ContentCard'
export default {
  components: {
    ContentCard
  },
  data () {
    return {}
  },
  methods: {
    goBack () {
      this.$emit('goRegion')
    }
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
            width: 200px;
            display: inline-block;
        }
    }
}
</style>
