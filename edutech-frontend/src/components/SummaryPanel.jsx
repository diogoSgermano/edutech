/**
 * EduTech Pro — Painel de Resumo
 * Exibe o resumo gerado pela IA com opção de copiar.
 */

import React, { useState } from 'react'
import { Copy, CheckCheck, BookOpen, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SummaryPanel({ summary, filename }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary)
      setCopied(true)
      toast.success('Resumo copiado!')
      setTimeout(() => setCopied(false), 2500)
    } catch {
      toast.error('Não foi possível copiar.')
    }
  }

  // Formata o texto preservando parágrafos
  const paragraphs = summary
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  return (
    <div style={{
      background:   'var(--bg-card)',
      borderRadius: 'var(--radius-xl)',
      border:       '1px solid var(--border)',
      overflow:     'hidden',
      boxShadow:    'var(--shadow-sm)',
      animation:    'fadeIn .4s ease both',
    }}>
      {/* Header */}
      <div style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        padding:        '16px 20px',
        borderBottom:   '1px solid var(--green-100)',
        background:     'linear-gradient(to right, var(--green-50), var(--white))',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width:          36,
            height:         36,
            borderRadius:   'var(--radius-sm)',
            background:     'var(--green-100)',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
          }}>
            <BookOpen size={18} color="var(--green-700)" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <h3 style={{ fontWeight: 700, fontSize: 'var(--fs-base)', margin: 0, color: 'var(--green-800)' }}>
                Resumo Inteligente
              </h3>
              <span style={{
                display:      'inline-flex',
                alignItems:   'center',
                gap:          3,
                background:   'var(--green-100)',
                color:        'var(--green-700)',
                fontSize:     'var(--fs-xs)',
                fontWeight:   600,
                padding:      '2px 7px',
                borderRadius: 99,
                border:       '1px solid var(--green-200)',
              }}>
                <Sparkles size={9} />
                RAG + LLaMA 3
              </span>
            </div>
            <p style={{
              fontSize: 'var(--fs-xs)',
              color:    'var(--text-muted)',
              margin:   0,
              marginTop: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 280,
            }}>
              {filename}
            </p>
          </div>
        </div>

        {/* Botão copiar */}
        <button
          onClick={handleCopy}
          title="Copiar resumo"
          style={{
            display:      'flex',
            alignItems:   'center',
            gap:          5,
            background:   copied ? 'var(--green-600)' : 'var(--green-100)',
            color:        copied ? '#fff' : 'var(--green-700)',
            border:       'none',
            borderRadius: 'var(--radius-sm)',
            padding:      '6px 12px',
            cursor:       'pointer',
            fontFamily:   'var(--font)',
            fontWeight:   600,
            fontSize:     'var(--fs-xs)',
            transition:   'all var(--t-fast)',
          }}
        >
          {copied ? <CheckCheck size={13} /> : <Copy size={13} />}
          {copied ? 'Copiado!' : 'Copiar'}
        </button>
      </div>

      {/* Conteúdo */}
      <div style={{
        padding:   '20px 24px',
        maxHeight: '420px',
        overflowY: 'auto',
      }}>
        {paragraphs.map((p, i) => {
          // Detecta possíveis títulos de seção (linhas curtas em negrito ou com ":")
          const isHeading = p.endsWith(':') && p.length < 60

          return (
            <p
              key={i}
              style={{
                fontSize:   isHeading ? 'var(--fs-sm)'  : 'var(--fs-sm)',
                fontWeight: isHeading ? 700              : 400,
                color:      isHeading ? 'var(--green-800)' : 'var(--gray-700)',
                lineHeight: 1.75,
                marginBottom: i < paragraphs.length - 1 ? (isHeading ? 6 : 12) : 0,
                paddingLeft: isHeading ? 0 : 0,
              }}
            >
              {p}
            </p>
          )
        })}
      </div>

      {/* Footer */}
      <div style={{
        padding:       '10px 20px',
        borderTop:     '1px solid var(--green-100)',
        background:    'var(--green-50)',
        display:       'flex',
        alignItems:    'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
          {paragraphs.length} parágrafos · {summary.split(' ').length} palavras
        </span>
        <span style={{
          fontSize:     'var(--fs-xs)',
          color:        'var(--green-600)',
          fontWeight:   600,
          display:      'flex',
          alignItems:   'center',
          gap:          4,
        }}>
          <Sparkles size={10} />
          Gerado com IA
        </span>
      </div>
    </div>
  )
}
