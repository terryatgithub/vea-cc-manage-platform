import Vue from 'vue'
/*
 *提示语
 *列表页选择数据进行--编辑查看
 列表页只能选择一条数据编辑的提示语 selectedId 为选择的ID 数组
*/
Vue.prototype.$isAllowEdit = function (selected) {
  if (selected.length !== 1) {
    this.$message('请选择一条数据进行编辑')
    return false
  } else {
    return true
  }
}

/*
 *提示语
 *列表页选择数据进行-删除操作
*/
Vue.prototype.$isAllowDelete = function (selected) {
  if (selected.length === 0) {
    this.$message('请选择数据后进行操作')
    return false
  } else {
    return true
  }
}

/**
 *将数字转为对应的审核状态
 *0下架,1上架,2草稿,3待审核,4审核通过,5审核不通过
 */
Vue.prototype.$numToAuditStatus = function (num) {
  let auditStatus = ''
  if (typeof (num) === 'number') {
    switch (num) {
      case 0:
        auditStatus = '下架'
        break
      case 1:
        auditStatus = '上架'
        break
      case 2:
        auditStatus = '草稿'
        break
      case 3:
        auditStatus = '待审核'
        break
      case 4:
        auditStatus = '审核通过'
        break
      case 5:
        auditStatus = '审核不通过'
        break
      case 6:
        auditStatus = '审核中'
        break
      case 7:
        auditStatus = '审核通过未上线'
        break
      case 9:
        auditStatus = '待二次审核'
        break
      default:
        auditStatus = '未知'
    }
  }
  return auditStatus
}

/**
 *匹配圆括号内的内容
 *返回数组
 */
Vue.prototype.$regParenthesesContent = function (str) {
  // eslint-disable-next-line no-useless-escape
  return str.match(/([^\(\)]+)(?=\))/g)
}

/***********************************************************************************************
 *@method : deepClone
 *@desc   : 深拷贝
 *@param  : obj:待克隆的对象
 *@author : shelly
 ***********************************************************************************************/
Vue.prototype.deepClone = function (obj) {
  var _this = this;
  var o;
  switch (typeof obj) {
      case 'undefined':
          break;
      case 'string':
          o = obj + '';
          break;
      case 'number':
          o = obj - 0;
          break;
      case 'boolean':
          o = obj;
          break;
      case 'object':
          if (obj === null) {
              o = null;
          } else {
              if (obj instanceof Array) {
                  o = [];
                  for (var i = 0, len = obj.length; i < len; i++) {
                      o.push(_this.deepClone(obj[i]));
                  }
              } else {
                  o = {};
                  for (var k in obj) {
                      o[k] = _this.deepClone(obj[k]);
                  }
              }
          }
          break;
      default:
          o = obj;
          break;
  }
  return o;
};