import axios from 'axios'

const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:8000').replace(/\/$/, '')

const api = axios.create({
  baseURL: API_BASE,
  timeout: 120_000,
})

const sanitizeSummary = (text) => {
  if (!text) return text
  return text.replace(/\*/g, '')
}

export async function uploadPDF(file, onProgress) {
  if (!file) {
    throw new Error('Nenhum arquivo fornecido para upload.')
  }
  const form = new FormData()
  form.append('file', file)
  try {
    const { data } = await api.post('/upload', form, {
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded / e.total) * 100))
        }
      },
    })
    if (data && data.summary) {
      data.summary = sanitizeSummary(data.summary)
    }
    return data
  } catch (error) {
    if (error.response?.status === 422) {
      console.error('Erro de validação no Backend (422):', error.response.data.detail)
    }
    throw error
  }
}

export async function listDocuments() {
  const { data } = await api.get('/documents')
  return data.map(doc => ({
    ...doc,
    summary: sanitizeSummary(doc.summary)
  }))
}

export async function getDocument(id) {
  if (!id) {
    throw new Error('ID do documento não fornecido.')
  }
  const { data } = await api.get(`/documents/${id}`)
  if (data && data.summary) {
    data.summary = sanitizeSummary(data.summary)
  }
  return data
}

export async function deleteDocument(id) {
  if (!id) {
    throw new Error('ID do documento não fornecido para exclusão.')
  }
  const { data } = await api.delete(`/documents/${id}`)
  return data
}

export function getAudioURL(fileId) {
  if (!fileId) {
    return null
  }
  return `${API_BASE}/audio/${fileId}`
}
