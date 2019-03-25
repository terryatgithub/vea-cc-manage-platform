/**
 * 推荐位管理->轮播推荐位
 */
export function broadcastBlockPageList (data) {
  return this.fetch({
    method: 'post',
    url: '/api/blockInfo/pageList.html',
    data
  })
}
