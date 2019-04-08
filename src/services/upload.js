import axios from 'axios'

export function uploadImage ({ file, onUploadProgress }) {
  const formData = new FormData()
  formData.append('file', file)
  return axios({
    method: 'post',
    url: 'api/upload/image.html',
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
    url: 'api/layoutInfo/getLayoutFile.html',
    data: formData,
    onUploadProgress
  }).then(({ data }) => {
    return data
  })
}
