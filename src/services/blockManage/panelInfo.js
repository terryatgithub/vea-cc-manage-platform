/**
 * 版块管理 -> 常规运营
 */
export function panelPageList(data) {
  return this.fetch({
    method: 'post',
<<<<<<< HEAD
    url: '/api/v1/panel/pageList.html',
    data
  })
}

export function panelDataList(data) {
  return this.fetch({
    method: 'post',
    url: '/api/v1/panel/dataList.html',
=======
    url: 'api/panel/pageList.html',
>>>>>>> f8a755de70512085bcd651f80725dcb32bee43a6
    data
  })
}
