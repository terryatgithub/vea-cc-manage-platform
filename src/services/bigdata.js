export function getBlockRecList (params) {
  // return Promise.resolve({
  //   totla: 5,
  //   rows: [
  //     {
  //       recId: '123',
  //       recName: '6666',
  //       recCategory: 'category',
  //       recFlag: 'mac'
  //     }
  //   ]
  // })
  return this.fetch({
    url: 'api/v1/bigDataRec/getRecList',
    params
  })
}
