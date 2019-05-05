<template>
  <div>
    <h4>{{title}}</h4>
    <section class="content">
      <div v-for="(item, index) in dataArr" :key="index" class="homePageView">
        <el-form label-width="80px">
          <el-form-item label="人群">
            <el-tag type="success" size="medium"></el-tag>
          </el-form-item>
          <el-form-item label="首页方案">
            <el-tag type="success" size="medium">{{item.homepageName}}</el-tag>
          </el-form-item>
          <el-form-item label="AB测试">
            <!-- <el-tag type="success" v-for="(n, i) in item.testHomeList" :key="i">
            编号：{{n.distributeModel}},首页方案：{{n.homepageName}}
            </el-tag>-->
            <el-table :data="item.testHomeList" border>
              <el-table-column prop="distributeModel" label="编号"></el-table-column>
              <el-table-column prop="homepageName" label="首页方案"></el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
        <div class="homePageView__action">
          <i class="el-icon-edit" @click="edit(item.homepageModel,index)"></i>
          <i class="el-icon-close" @click="remove(item.homepageModel,index)"></i>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  props: {
    dataArr: Array,
    title: String
  },
  data() {
    return {}
  },
  methods: {
    edit(homepageModel, index) {
      this.$emit('edit-item', homepageModel, index)
    },
     remove(homepageModel, index) {
      this.$emit('remove-item',homepageModel ,index)
    }
  },
  created () {
    debugger
    this.$service.getCrowdOfPolicy('254').then((data)=>{
      debugger
    })
  }
}
</script>
<style lang="stylus" scoped>
.content
  display flex
  flex-wrap wrap
.homePageView
  width: 250px
  border: 1px solid #ccc
  padding: 10px
  position: relative
  cursor: pointer
  margin 0 10px 10px 0
h4
  width: 100%
  border-bottom: 1px solid #ccc
.homePageView__action
  position: absolute
  top: 10px
  right: 10px
</style>


