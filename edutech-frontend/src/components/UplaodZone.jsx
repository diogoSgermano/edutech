/**
 * EduTech Pro — Zona de Upload
 * Área de drag-and-drop para envio de PDFs.
 */

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function UploadZone({ onUpload, loading }) {
  const [dragActive, setDragActive] = useState(false)
  const [fileReady,  setFileReady]  = useState(null)

  const onDrop = useCallback((accepted, rejected) => {
    setDragActive(false)
    if (rejected.length) {
      alert('Apenas arquivos PDF são aceitos.')
      return
    }
    const file = accepted[0]
    if (file) {
      setFileReady(file)
      onUpload(file)
    }
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    disabled: loading,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  })

  const active = isDragActive || dragActive

  return (
    <div
      {...getRootProps()}
      style={{
        border:       `2px dashed ${active ? 'var(--green-500)' : loading ? 'var(--gray-200)' : 'var(--green-300)'}`,
        borderRadius: 'var(--radius-xl)',
        padding:      '40px 24px',
        textAlign:    'center',
        cursor:       loading ? 'not-allowed' : 'pointer',
        background:   active
          ? 'var(--green-50)'
          : loading
            ? 'var(--gray-50)'
            : 'var(--white)',
        transition:   'all var(--t-normal)',
        transform:    active ? 'scale(1.01)' : 'scale(1)',
        boxShadow:    active ? 'var(--shadow-green)' : 'none',
        userSelect:   'none',
      }}
    >
      <input {...getInputProps()} />

      {/* Ícone central */}
      <div style={{
        width:        64,
        height:       64,
        borderRadius: '50%',
        background:   active ? 'var(--green-200)' : 'var(--green-100)',
        display:      'flex',
        alignItems:   'center',
        justifyContent: 'center',
        margin:       '0 auto 16px',
        transition:   'background var(--t-normal)',
      }}>
        {loading
          ? <Spinner />
          : active
            ? <FileText size={28} color="var(--green-600)" />
            : <Upload   size={28} color="var(--green-600)" />
        }
      </div>

      {/* Texto */}
      {loading ? (
        <>
          <p style={{ fontWeight: 700, fontSize: 'var(--fs-lg)', color: 'var(--green-700)', margin: 0 }}>
            Processando com IA…
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)', marginTop: 6 }}>
            Extraindo texto e gerando resumo via RAG. Isso pode levar alguns instantes.
          </p>
        </>
      ) : active ? (
        <>
          <p style={{ fontWeight: 700, fontSize: 'var(--fs-lg)', color: 'var(--green-700)', margin: 0 }}>
            Solte aqui!
          </p>
          <p style={{ color: 'var(--green-600)', fontSize: 'var(--fs-sm)', marginTop: 4 }}>
            Seu PDF será processado automaticamente
          </p>
        </>
      ) : (
        <>
          <p style={{ fontWeight: 700, fontSize: 'var(--fs-lg)', color: 'var(--text-primary)', margin: 0 }}>
            Arraste seu PDF aqui
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)', marginTop: 6, marginBottom: 16 }}>
            ou clique para selecionar um arquivo do seu computador
          </p>

          <div style={{
            display:      'inline-flex',
            alignItems:   'center',
            gap:          6,
            background:   'var(--green-600)',
            color:        '#fff',
            padding:      '9px 22px',
            borderRadius: 'var(--radius-md)',
            fontWeight:   600,
            fontSize:     'var(--fs-sm)',
            boxShadow:    'var(--shadow-green)',
            transition:   'background var(--t-fast)',
          }}>
            <Upload size={15} />
            Selecionar PDF
          </div>

          <p style={{
            marginTop: 14,
            fontSize: 'var(--fs-xs)',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            justifyContent: 'center',
          }}>
            <AlertCircle size={11} />
            Apenas arquivos .pdf — tamanho máximo recomendado: 50 MB
          </p>
        </>
      )}

      {/* Arquivo selecionado (antes de processar) */}
      {fileReady && !loading && (
        <div style={{
          marginTop:    14,
          display:      'inline-flex',
          alignItems:   'center',
          gap:          6,
          fontSize:     'var(--fs-xs)',
          color:        'var(--green-700)',
          background:   'var(--green-100)',
          padding:      '4px 10px',
          borderRadius: 99,
        }}>
          <CheckCircle2 size={12} />
          {fileReady.name}
        </div>
      )}
    </div>
  )
}

function Spinner() {
  return (
    <span style={{
      width:           28, height: 28,
      border:          '3px solid var(--green-300)',
      borderTopColor:  'var(--green-600)',
      borderRadius:    '50%',
      display:         'inline-block',
      animation:       'spin .8s linear infinite',
    }} />
  )
}
