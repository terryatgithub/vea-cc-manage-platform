export function desktopGetDataSyncInfo() {
  return this.fetch({
    method: 'post',
    url: 'api/dataSync/getSwitcherInfo.html'
  }).then(({ isOn }) => {
    return {
      isOn: !isOn
    }
  })
}

export function desktopUpdateDataSyncInfo(params) {
  return this.fetch({
    url: 'api/dataSync/manualIsOn.html',
    params: {
      enableManualOn: params.enableManualOn ? 'false' : 'true'
    }
  })
}

export function desktopGetDataSyncGeneral() {
  return this.fetch({
    url: 'api/secondAudit/getTotalInfo.html'
  })
}

export function desktopGetDataSyncList(params) {
  return this.fetch({
    url: 'api/secondAudit/pageList.html',
    params
  })
}
