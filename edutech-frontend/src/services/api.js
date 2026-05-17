import axios from 'axios'

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 300_000,
})

export async function uploadPDF(file, onProgress) {
  const form = new FormData()
  form.append('file', file)
  const { data } = await api.post('/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    },
  })
  document.getElementById('refresh-history-btn')?.click()
  return data
}

export async function listDocuments() {
  const { data } = await api.get('/documents')
  return data
}

export async function getDocument(id) {
  const { data } = await api.get(`/documents/${id}`)
  return data
}

export async function generateAudio(fileId) {
  return await api.get(`/audio/${fileId}`)
}

export async function deleteDocument(id) {
  const { data } = await api.delete(`/documents/${id}`)
  return data
}

export function getAudioURL(fileId) {
  return `${API_BASE}/audio/${fileId}`
}