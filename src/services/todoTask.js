export function myDraftsPageList (data) {
  return this.fetch({
    method: 'post',
    url: 'api/myDrafts/pageList.html',
    data
  })
}   

export function mySubmitTasksPageList (data) {
  return this.fetch({
    method: 'post',
    url: 'api/mySubmitTasks/pageList.html',
    data
  })
} 

export function myReviewTasksPageList (data) {
  return this.fetch({
    method: 'post',
    url: 'api/myReviewTasks/pageList.html',
    data
  })
} 