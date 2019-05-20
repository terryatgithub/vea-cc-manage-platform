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

export function uploadBlockImage ({ file, onUploadProgress }) {
  const formData = new FormData()
  formData.append('file', file)
  return axios({
    method: 'post',
    url: 'api/v1/uploadHomeImg.html',
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
    url: 'api/v1/layoutInfo/getLayoutFile.html',
    data: formData,
    onUploadProgress
  }).then(({ data }) => {
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
