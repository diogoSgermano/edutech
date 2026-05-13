/**
 * EduTech Pro — Histórico de Documentos
 * Sidebar com lista de PDFs processados anteriormente.
 */

import React from 'react'
import { FileText, Trash2, Clock, ChevronRight } from 'lucide-react'

export default function DocumentHistory({ documents, onSelect, onDelete, activeId }) {
  if (!documents.length) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '32px 16px',
        color: 'var(--text-muted)',
      }}>
        <FileText size={28} style={{ margin: '0 auto 8px', opacity: .4 }} />
        <p style={{ fontSize: 'var(--fs-sm)' }}>Nenhum documento processado ainda.</p>
      </div>
    )
  }

  return (
    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
      {documents.map((doc) => (
        <li key={doc.id}>
          <div
            onClick={() => onSelect(doc)}
            style={{
              display:      'flex',
              alignItems:   'center',
              gap:          10,
              padding:      '10px 12px',
              borderRadius: 'var(--radius-md)',
              cursor:       'pointer',
              background:   doc.id === activeId ? 'var(--green-100)' : 'transparent',
              border:       `1px solid ${doc.id === activeId ? 'var(--green-300)' : 'transparent'}`,
              transition:   'all var(--t-fast)',
            }}
            onMouseOver={(e) => {
              if (doc.id !== activeId) e.currentTarget.style.background = 'var(--gray-50)'
            }}
            onMouseOut={(e) => {
              if (doc.id !== activeId) e.currentTarget.style.background = 'transparent'
            }}
          >
            {/* Ícone */}
            <div style={{
              width: 32, height: 32, flexShrink: 0,
              background:   doc.id === activeId ? 'var(--green-200)' : 'var(--gray-100)',
              borderRadius: 'var(--radius-sm)',
              display:      'flex',
              alignItems:   'center',
              justifyContent: 'center',
            }}>
              <FileText
                size={15}
                color={doc.id === activeId ? 'var(--green-700)' : 'var(--gray-500)'}
              />
            </div>

            {/* Info */}
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{
                fontSize:     'var(--fs-sm)',
                fontWeight:   600,
                color:        doc.id === activeId ? 'var(--green-800)' : 'var(--text-primary)',
                overflow:     'hidden',
                textOverflow: 'ellipsis',
                whiteSpace:   'nowrap',
                margin: 0,
              }}>
                {doc.filename}
              </p>
              <p style={{
                fontSize: 'var(--fs-xs)',
                color:    'var(--text-muted)',
                display:  'flex',
                alignItems: 'center',
                gap: 3,
                margin: 0,
                marginTop: 2,
              }}>
                <Clock size={10} />
                {formatDate(doc.created_at)}
              </p>
            </div>

            {/* Ações */}
            <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(doc.id) }}
                title="Remover documento"
                style={{
                  background:   'none',
                  border:       'none',
                  cursor:       'pointer',
                  color:        'var(--gray-400)',
                  padding:      4,
                  borderRadius: 6,
                  display:      'flex',
                  transition:   'color var(--t-fast)',
                }}
                onMouseOver={(e) => e.currentTarget.style.color = '#DC2626'}
                onMouseOut={(e)  => e.currentTarget.style.color = 'var(--gray-400)'}
              >
                <Trash2 size={13} />
              </button>
              <ChevronRight
                size={14}
                color={doc.id === activeId ? 'var(--green-600)' : 'var(--gray-400)'}
              />
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'short', year: 'numeric',
    })
  } catch {
    return dateStr
  }
}
