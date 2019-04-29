<template>
  <el-form class="version-list" :inline="true">
    <el-form-item label="版本" v-if="versionList && versionList.length > 0">
        <el-select 
          class="version-selector" 
          :value="version"
          @input="handleSelectVersion" 
          placeholder="请选择"
        >
            <el-option 
              v-for="item in versionList" 
              :key="item.version" 
              :label="item.label" 
              :value="item.value"
            >
            </el-option>
        </el-select>
    </el-form-item>
    <el-form-item>
        <div class="status"> {{ $consts.statusText[status] }}</div>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  props: ['version', 'status', 'versionList'],
  methods: {
    handleSelectVersion(version) {
      this.$emit('select-version', version)
    }
  }
}
</script>
<style lang="stylus" scoped>
.version-selector 
  width 350px
.status {
  display: inline-block;
  width: 120px;
  height: 30px;
  line-height: 30px;
  padding: 0 5px;
  background: #4fc71b;
  color: #fff;
  text-align: center;
}
</style>

