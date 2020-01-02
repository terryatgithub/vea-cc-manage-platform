/***********************************************************************************************
*@method ： 根据业务分类获取对应的appID
*@description ：根据业务分类获取对应的appID
*@param  ：{str}key   传入字符串
*@return string appID
*@author ： zmj
*@createTime：
*@modifyTime ：
***********************************************************************************************/
const CATEGORY_TO_APPID = {
  '60': '4', // 教育
  '67': '-1',
  '61': '10', // 购物
  '66': '6', // 体育
  '31': '0' // 影视
}
export function getAppIDByTabCategory (key) {
  return CATEGORY_TO_APPID[key] || '-1'
}
