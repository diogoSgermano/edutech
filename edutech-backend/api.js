/**
 * EduTech Pro — Serviço de API
 * Centraliza todas as chamadas ao backend FastAPI.
 */

import axios from 'axios'

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 120_000, // 2 min — resumo pode demorar
})

// ── Documentos ────────────────────────────────────────────────────────────────

/**
 * Envia um arquivo PDF e retorna o resumo gerado.
 * @param {File} file - Arquivo PDF
 * @param {Function} onProgress - Callback de progresso (0-100)
 */
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

  return data // { id, file_id, filename, summary }
}

/**
 * Lista todos os documentos processados.
 */
export async function listDocuments() {
  const { data } = await api.get('/documents')
  return data
}

/**
 * Busca os detalhes de um documento pelo ID numérico.
 */
export async function getDocument(id) {
  const { data } = await api.get(`/documents/${id}`)
  return data // { id, file_id, filename, summary, created_at }
}

/**
 * Remove um documento pelo ID.
 */
export async function deleteDocument(id) {
  const { data } = await api.delete(`/documents/${id}`)
  return data
}

/**
 * Retorna a URL para o áudio MP3 do resumo.
 */
export function getAudioURL(fileId) {
  return `${API_BASE}/audio/${fileId}`
}
