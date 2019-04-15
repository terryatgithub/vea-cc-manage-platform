//专属影院
/**列表 */
export function privatePannelInfo(data) {
    return this.fetch({
        method: 'post',
        url: 'api/privatePannelInfo/pageList.html',
        data
    })
}