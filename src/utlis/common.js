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

/**
 *将数字转为对应的审核优先级标示
 *1一般,2重要,3紧急
 */
Vue.prototype.$numToReviewPriority = function (num) {
  var auditStatus
  if (typeof (num) === 'number') {
    switch (num) {
      case 1:
        auditStatus = "一般"
        break
      case 2:
        auditStatus = "重要"
        break
      case 3:
        auditStatus = "紧急"
        break
      default:
        auditStatus = "未知"
    }
  }
  return auditStatus
}


/**
 *将数字转为对应的任务状态标示
 *1进行中,2终止,3结束,4失效
 */
Vue.prototype.$numToTaskStatus = function (num) {
  var auditStatus
  if (typeof (num) === 'number') {
    switch (num) {
      case 1:
        auditStatus = "进行中"
        break
      case 2:
        auditStatus = "终止"
        break
      case 3:
        auditStatus = "结束"
        break
      case 4:
        auditStatus = "失效"
        break
      default:
        auditStatus = "未知"
    }
  }
  return auditStatus
}
Vue.prototype.$platform = function (platform) {
  switch (platform) {
    case 'yinhe':
      return '爱奇艺'
    case 'tencent':
      return '腾讯'
    case 'voole':
      return '优朋'
  }
}
/** 检验MAC地址是否正确 */
Vue.prototype.$checkMacType = function (rule, value, callback) {
  value = value.replace(/(^\s*)|(\s*$)/g, '') // 去掉空格
  var reg = /^[a-zA-Z0-9]{12}$/
  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error('请输入12位的MAC地址'))
  }
}
/**
 * 得到搜索框的select组件需要的键值对象
*/
Vue.prototype.$getFilterSelectField = function (data, key, value) {
  return data.reduce((result, current) => {
    result[current[key]] = current[value]
    return result
  }, {})
}
Vue.prototype.$sourceName = function (tabResource) {
  const data = {
    "yinhe": '爱奇艺',
    "o_iqiyi": '爱奇艺',
    "qq": '腾讯',
    "o_tencent": '腾讯',
    "o_youku": '优酷',
    "tencent": '腾讯',
    "o_voole": '优朋',
    "voole": '优朋',
    "voolesohu": '优朋搜狐'
  }
  return data[tabResource]
}
