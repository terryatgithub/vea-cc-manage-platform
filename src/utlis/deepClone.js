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