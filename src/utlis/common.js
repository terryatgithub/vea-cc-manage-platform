import Vue from 'vue'
/*
 列表页只能选择一条数据编辑的提示语
*/
Vue.prototype.$isAllowEdit = function (selectedId){
  if (selectedId.length === 0) {
    this.$message('请选择再编辑')
    return false
  } else if (selectedId.length === 1){
    return true
  } else {
    this.$message('只能选择一条数据')
    return false
  }
}