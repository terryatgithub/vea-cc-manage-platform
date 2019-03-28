import axios from 'axios'

export default function uploadImage ({ file, onUploadProgress }) {
  const formData = new FormData()
  formData.append('file', file)
  return axios({
    method: 'post',
    url: 'api/upload/image.html',
    data: formData,
    onUploadProgress
  })
}
