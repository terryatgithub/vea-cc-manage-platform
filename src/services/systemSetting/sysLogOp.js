/**
 * 操作日志
 */
export function sysLogOpPageList (data) {
  return this.fetch({
    method: 'post',
    url: '/api/sysLogOp/pageList.html',
    data
  })
}
