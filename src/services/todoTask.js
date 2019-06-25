// export function myDraftsPageList (data) {
//   return this.fetch({
//     method: 'post',
//     url: 'api/myDrafts/pageList.html',
//     data
//   })
// }

// export function mySubmitTasksPageList (data) {
//   return this.fetch({
//     method: 'post',
//     url: 'api/mySubmitTasks/pageList.html',
//     data
//   })
// }

// export function myReviewTasksPageList (data) {
//   return this.fetch({
//     method: 'post',
//     url: 'api/myReviewTasks/pageList.html',
//     data
//   })
// }

export function getTotal (type) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/' + type + '/getTotal.html'
  })
}
export function todoTaskPageList (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/' + data.type + '/pageList.html',
    data
  })
}
export function getMoviePageList (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/msn/pageList.html',
    data
  })
}
