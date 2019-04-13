/** 角标素材管理*/
//分页
export function getGlobalMgrList(params) {
    return this.fetch({
        method: 'get',
        url: 'api/v1/cornerIcon/pageList.html',
        params
    }) 
}
//获取角标分类
export function getCornerTypes(params) {
    return this.fetch({
        method: 'get',
        url: '/api/v1/cornerIconType/getCornerTypes.html',
        params
    })
}
//角标类别
export function getIconAttributes(params) {
    return this.fetch({
        method: 'post',
        url: '/api/v1/cornerIcon/getIconAttributes.html',
        params
    })
}
//角标素材管理-编辑
export function globalCornerIconEdit(params) {
    return this.fetch({
        method: 'get',
        url: 'api/globalCornerIcon/edit.html',
        params
    })
    .then(data => {
        return JSON.parse(data.match(/para = (\{.+\})/)[1])
      })
}
//角标素材管理-保存
export function globalCornerIconSave(data) {
    return this.fetch({
        method: 'post',
        url: 'api/v1/cornerIcon/save.html',
        data
    })
}
//角标素材-删除
export function globalCornerIconRemove(params) {
    return this.fetch({
        method: 'get',
        url: 'api/v1/cornerIcon/remove.html',
        params
    })
}
//角标素材管理—批量审核
export function batchAudit(params) {
    return this.fetch({
        method: 'get',
        url: '/api/v1/cornerIcon/batchAudit.html',
        params
    })
}
//角标素材管理-详情页审核
export function executionTask(data) {
    return this.fetch({
        method: 'post',
        url: '/api/auditTaskInfo/executionTask.html',
        data
    })
}
//角标素材管理—撤销审核
export function revokedAudit(data) {
    return this.fetch({
        method: 'post',
        url: '/api/auditTaskInfo/revokedAudit.html',
        data
    })
}
//角标素材管理-预览
export function getDetailInfo(params) {
    return this.fetch({
        method: 'get',
        url: 'api/v1/cornerIcon/getDetailInfo.html',
        params
    })
}
//角标素材管理—调整优先级
export function changePriority(params) {
    return this.fetch({
        method: 'get',
        url: 'api/v1/cornerIcon/changePriority.html',
        params
    })
}