import axios from 'axios'

export function uploadImage ({ file, onUploadProgress }) {
  const formData = new FormData()
  formData.append('file', file)
  return axios({
    method: 'post',
    url: 'api/v1/upload/image.html',
    data: formData,
    onUploadProgress
  }).then(({ data }) => {
    return data
  })
}

export function uploadLayoutFile ({ file, onUploadProgress }) {
  const formData = new FormData()
  formData.append('file', file)
  return axios({
    method: 'post',
    url: 'api/v1/layout/getLayoutFile.html',
    data: formData,
    onUploadProgress
  }).then(({ data }) => {
    // eslint-disable-next-line
    if (data.code !== undefined && data.code != '0') {
      throw new Error(data.msg)
    }
    data = data.data
    data.content = JSON.parse(data.content)
    const layoutType = data.content.type
    if (!['Panel', 'Lengthwise', 'Expander'].includes(layoutType)) {
      throw new Error('选择的文件不对，应该选择布局格式的文件')
    }
    return data
  })
}

export function uploadApk ({ file, onUploadProgress }) {
  const formData = new FormData()
  formData.append('file', file)
  return axios({
    method: 'post',
    url: 'api/v1/upload/apk.html',
    data: formData,
    onUploadProgress
  }).then(({ data }) => {
    return data
  })
}

export function uploadZip ({ file, type, onUploadProgress }) {
  const formData = new FormData()
  formData.append('file', file)
  return axios({
    method: 'post',
    url: 'api/v1/upload/zip.html?type=' + type,
    data: formData,
    onUploadProgress
  }).then(({ data }) => {
    return data
  })
}
