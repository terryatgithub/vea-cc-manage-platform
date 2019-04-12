/**
 * 操作日志
 */
// 接口文档的方法
export function sysLogOpPageList (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/sysLogOp/pageList.html',
    data
  })
}
