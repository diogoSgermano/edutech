/**
 * EduTech Pro — App Principal
 * Sistema de resumo inteligente de PDFs com IA.
 *
 * Stack: React · FastAPI · LangChain · Groq (LLaMA 3) · HuggingFace · gTTS · MySQL
 */

import React, { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import {
  BookOpen, GraduationCap, Cpu, RefreshCw,
  ChevronDown, FileText, Menu, X,
} from 'lucide-react'

import UploadZone      from './components/UploadZone.jsx'
import SummaryPanel    from './components/SummaryPanel.jsx'
import AudioPlayer     from './components/AudioPlayer.jsx'
import DocumentHistory from './components/DocumentHistory.jsx'

import {
  uploadPDF, listDocuments, getDocument,
  deleteDocument, getAudioURL,
} from './services/api.js'

/* ── Estilos inline como constantes ────────────────────────────────────────── */
const card = {
  background:   'var(--bg-card)',
  borderRadius: 'var(--radius-xl)',
  border:       '1px solid var(--border)',
  boxShadow:    'var(--shadow-sm)',
  overflow:     'hidden',
}

export default function App() {
  const [loading,     setLoading]     = useState(false)
  const [result,      setResult]      = useState(null)   // { id, file_id, filename, summary }
  const [documents,   setDocuments]   = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [genAudio,    setGenAudio]    = useState(false)
  const [audioUrl,    setAudioUrl]    = useState(null)

  /* ── Carrega histórico ao iniciar ──────────────────────────────────────── */
  const fetchDocs = useCallback(async () => {
    try {
      const docs = await listDocuments()
      setDocuments(docs)
    } catch {
      /* silencioso — backend pode estar desligado */
    }
  }, [])

  useEffect(() => { fetchDocs() }, [fetchDocs])

  /* ── Upload de PDF ─────────────────────────────────────────────────────── */
  const handleUpload = async (file) => {
    setLoading(true)
    setResult(null)
    setAudioUrl(null)
    setGenAudio(false)

    const toastId = toast.loading(`Processando "${file.name}"…`)

    try {
      const data = await uploadPDF(file)
      setResult(data)
      await fetchDocs()
      toast.success('Resumo gerado com sucesso!', { id: toastId })
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Erro ao processar o PDF. Tente novamente.'
      toast.error(msg, { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  /* ── Seleciona documento do histórico ──────────────────────────────────── */
  const handleSelectDoc = async (doc) => {
    setSidebarOpen(false)
    try {
      const full = await getDocument(doc.id)
      setResult(full)
      setAudioUrl(null)
      setGenAudio(false)
    } catch {
      toast.error('Não foi possível carregar o documento.')
    }
  }

  /* ── Remove documento ──────────────────────────────────────────────────── */
  const handleDelete = async (id) => {
    if (!window.confirm('Remover este documento permanentemente?')) return
    try {
      await deleteDocument(id)
      await fetchDocs()
      if (result?.id === id) { setResult(null); setAudioUrl(null) }
      toast.success('Documento removido.')
    } catch {
      toast.error('Erro ao remover documento.')
    }
  }

  /* ── Gera áudio ────────────────────────────────────────────────────────── */
  const handleGenerateAudio = () => {
    if (!result?.file_id) return
    setGenAudio(true)
    setAudioUrl(getAudioURL(result.file_id))
    toast.success('Áudio carregado!')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <header style={{
        background:   '#fff',
        borderBottom: '1px solid var(--green-100)',
        position:     'sticky',
        top:          0,
        zIndex:       100,
        boxShadow:    '0 1px 12px rgba(0,0,0,.05)',
      }}>
        <div style={{
          maxWidth: 1200,
          margin:   '0 auto',
          padding:  '0 24px',
          height:   64,
          display:  'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width:        36,
              height:       36,
              borderRadius: 10,
              background:   'linear-gradient(135deg, var(--green-600) 0%, var(--green-400) 100%)',
              display:      'flex',
              alignItems:   'center',
              justifyContent: 'center',
              boxShadow:    'var(--shadow-green)',
            }}>
              <GraduationCap size={20} color="#fff" />
            </div>
            <div>
              <span style={{
                fontWeight: 800,
                fontSize:   'var(--fs-lg)',
                color:      'var(--green-800)',
                letterSpacing: '-.3px',
              }}>
                EduTech<span style={{ color: 'var(--green-500)' }}>Pro</span>
              </span>
              <span style={{
                display:    'block',
                fontSize:   9,
                fontWeight: 600,
                color:      'var(--text-muted)',
                letterSpacing: '.8px',
                textTransform: 'uppercase',
                lineHeight: 1,
              }}>
                Resumo Inteligente de PDFs
              </span>
            </div>
          </div>

          {/* Tech badges */}
          <div style={{
            display:    'flex',
            gap:        6,
            alignItems: 'center',
          }} className="hide-mobile">
            {['Groq · LLaMA 3', 'HuggingFace', 'LangChain RAG', 'FastAPI'].map((t) => (
              <span key={t} style={{
                fontSize:     'var(--fs-xs)',
                fontWeight:   600,
                color:        'var(--green-700)',
                background:   'var(--green-50)',
                border:       '1px solid var(--green-200)',
                padding:      '3px 9px',
                borderRadius: 99,
              }}>
                {t}
              </span>
            ))}
          </div>

          {/* Botão histórico (mobile) */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background:   'none',
              border:       '1px solid var(--green-200)',
              borderRadius: 'var(--radius-sm)',
              padding:      '6px 10px',
              cursor:       'pointer',
              display:      'flex',
              alignItems:   'center',
              gap:          5,
              color:        'var(--green-700)',
              fontFamily:   'var(--font)',
              fontWeight:   600,
              fontSize:     'var(--fs-xs)',
            }}
          >
            {sidebarOpen ? <X size={15} /> : <Menu size={15} />}
            Histórico
            <span style={{
              background:   'var(--green-600)',
              color:        '#fff',
              borderRadius: 99,
              padding:      '0 6px',
              fontSize:     10,
              fontWeight:   700,
              minWidth:     18,
              textAlign:    'center',
            }}>
              {documents.length}
            </span>
          </button>
        </div>
      </header>

      {/* ── Layout principal ───────────────────────────────────────────────── */}
      <div style={{
        maxWidth: 1200,
        margin:   '0 auto',
        padding:  '32px 24px',
        width:    '100%',
        flex:     1,
        display:  'grid',
        gridTemplateColumns: 'minmax(0,1fr) 300px',
        gap:      24,
        alignItems: 'start',
      }}>

        {/* ── Coluna principal ─────────────────────────────────────────────── */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Hero title */}
          <div style={{ marginBottom: 4 }}>
            <h1 style={{
              fontSize:   'var(--fs-3xl)',
              fontWeight: 800,
              color:      'var(--gray-900)',
              lineHeight: 1.2,
              margin:     0,
              letterSpacing: '-.5px',
            }}>
              Entenda qualquer PDF com{' '}
              <span style={{
                background: 'linear-gradient(90deg, var(--green-600), var(--green-400))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                inteligência artificial
              </span>
            </h1>
            <p style={{
              color:     'var(--text-secondary)',
              fontSize:  'var(--fs-base)',
              marginTop: 8,
              margin:    '8px 0 0',
            }}>
              Envie um documento acadêmico, técnico ou científico e receba um resumo
              estruturado e a leitura em áudio — tudo em segundos.
            </p>
          </div>

          {/* Upload Zone */}
          <section>
            <UploadZone onUpload={handleUpload} loading={loading} />
          </section>

          {/* Loading state */}
          {loading && (
            <div style={{
              ...card,
              padding: '24px',
              textAlign: 'center',
              animation: 'fadeIn .3s ease',
            }}>
              <ProcessingSteps />
            </div>
          )}

          {/* Resultados */}
          {result && !loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'fadeIn .4s ease' }}>

              {/* Meta do documento */}
              <div style={{
                display:      'flex',
                alignItems:   'center',
                gap:          10,
                padding:      '12px 16px',
                background:   'var(--green-50)',
                borderRadius: 'var(--radius-md)',
                border:       '1px solid var(--green-200)',
              }}>
                <FileText size={18} color="var(--green-600)" />
                <span style={{ fontWeight: 600, color: 'var(--green-800)', fontSize: 'var(--fs-sm)' }}>
                  {result.filename}
                </span>
                <span style={{
                  marginLeft:   'auto',
                  fontSize:     'var(--fs-xs)',
                  color:        'var(--green-600)',
                  fontWeight:   600,
                  background:   'var(--green-200)',
                  padding:      '2px 8px',
                  borderRadius: 99,
                }}>
                  Processado com sucesso
                </span>
              </div>

              {/* Resumo */}
              <SummaryPanel summary={result.summary} filename={result.filename} />

              {/* Botão gerar áudio */}
              {!genAudio ? (
                <button
                  onClick={handleGenerateAudio}
                  style={{
                    display:      'flex',
                    alignItems:   'center',
                    justifyContent: 'center',
                    gap:          8,
                    padding:      '14px 24px',
                    background:   'linear-gradient(135deg, var(--green-600) 0%, var(--green-700) 100%)',
                    color:        '#fff',
                    border:       'none',
                    borderRadius: 'var(--radius-lg)',
                    cursor:       'pointer',
                    fontFamily:   'var(--font)',
                    fontWeight:   700,
                    fontSize:     'var(--fs-base)',
                    boxShadow:    'var(--shadow-green)',
                    transition:   'all var(--t-fast)',
                    letterSpacing: '-.2px',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                  onMouseOut={(e)  => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  🎧 Ouvir Resumo em Áudio
                </button>
              ) : (
                audioUrl && (
                  <AudioPlayer audioUrl={audioUrl} filename={result.filename} />
                )
              )}
            </div>
          )}

          {/* Estado inicial vazio */}
          {!result && !loading && (
            <EmptyState />
          )}
        </main>

        {/* ── Sidebar de histórico ──────────────────────────────────────────── */}
        <aside style={{
          ...card,
          position: 'sticky',
          top:      88,
        }}>
          <div style={{
            padding:        '14px 16px',
            borderBottom:   '1px solid var(--green-100)',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            background:     'linear-gradient(to right, var(--green-50), var(--white))',
          }}>
            <h2 style={{ fontSize: 'var(--fs-sm)', fontWeight: 700, color: 'var(--green-800)', margin: 0 }}>
              Documentos Processados
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                background:   'var(--green-600)',
                color:        '#fff',
                borderRadius: 99,
                padding:      '1px 7px',
                fontSize:     11,
                fontWeight:   700,
              }}>
                {documents.length}
              </span>
              <button
                onClick={fetchDocs}
                title="Atualizar"
                style={{
                  background: 'none',
                  border:     'none',
                  cursor:     'pointer',
                  color:      'var(--text-muted)',
                  display:    'flex',
                  padding:    2,
                }}
              >
                <RefreshCw size={13} />
              </button>
            </div>
          </div>

          <div style={{ padding: '10px 10px', maxHeight: 'calc(100vh - 260px)', overflowY: 'auto' }}>
            <DocumentHistory
              documents={documents}
              onSelect={handleSelectDoc}
              onDelete={handleDelete}
              activeId={result?.id}
            />
          </div>
        </aside>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer style={{
        borderTop:  '1px solid var(--green-100)',
        background: '#fff',
        padding:    '16px 24px',
        textAlign:  'center',
      }}>
        <p style={{
          fontSize: 'var(--fs-xs)',
          color:    'var(--text-muted)',
          margin:   0,
          display:  'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}>
          <Cpu size={11} />
          EduTech Pro — Trabalho Acadêmico &middot; React · FastAPI · LangChain · Groq · HuggingFace · MySQL
        </p>
      </footer>

      {/* ── Overlay sidebar mobile ────────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position:   'fixed',
            inset:      0,
            background: 'rgba(0,0,0,.3)',
            zIndex:     200,
          }}
        />
      )}

      <style>{`
        @media (max-width: 768px) {
          main   { grid-column: 1 / -1 !important; }
          aside  { display: none !important; }
          .hide-mobile { display: none !important; }
        }
      `}</style>
    </div>
  )
}

/* ── Subcomponentes internos ──────────────────────────────────────────────── */

function ProcessingSteps() {
  const steps = [
    { icon: '📄', label: 'Extraindo texto do PDF…'      },
    { icon: '🧠', label: 'Criando embeddings (HuggingFace)…' },
    { icon: '🔍', label: 'Indexando com FAISS (RAG)…'   },
    { icon: '✨', label: 'Gerando resumo com LLaMA 3…'  },
  ]

  return (
    <div>
      <div style={{
        width:           40,
        height:          40,
        border:          '3px solid var(--green-200)',
        borderTopColor:  'var(--green-600)',
        borderRadius:    '50%',
        animation:       'spin .8s linear infinite',
        margin:          '0 auto 16px',
      }} />
      <p style={{ fontWeight: 700, color: 'var(--green-800)', fontSize: 'var(--fs-lg)', marginBottom: 16 }}>
        Processando seu PDF…
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 280, margin: '0 auto', textAlign: 'left' }}>
        {steps.map((s, i) => (
          <div key={i} style={{
            display:    'flex',
            alignItems: 'center',
            gap:        8,
            color:      'var(--text-secondary)',
            fontSize:   'var(--fs-sm)',
          }}>
            <span>{s.icon}</span>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function EmptyState() {
  const features = [
    { icon: '📤', title: 'Upload de PDF',      desc: 'Arraste ou selecione qualquer arquivo PDF' },
    { icon: '🤖', title: 'Resumo com RAG',     desc: 'IA usa recuperação de contexto para resumir' },
    { icon: '🎧', title: 'Leitura em Áudio',   desc: 'Ouça o resumo em português com gTTS' },
    { icon: '🗄️', title: 'Histórico MySQL',    desc: 'Documentos salvos no banco de dados' },
  ]

  return (
    <div style={{
      ...card,
      padding:   '36px 24px',
      textAlign: 'center',
    }}>
      <div style={{
        width:          56,
        height:         56,
        borderRadius:   '50%',
        background:     'var(--green-100)',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        margin:         '0 auto 16px',
      }}>
        <BookOpen size={26} color="var(--green-600)" />
      </div>

      <h2 style={{ fontWeight: 700, fontSize: 'var(--fs-xl)', color: 'var(--gray-800)', margin: '0 0 6px' }}>
        Pronto para começar
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)', marginBottom: 24 }}>
        Envie um PDF acima para gerar seu resumo inteligente
      </p>

      <div style={{
        display:             'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap:                 12,
        maxWidth:            480,
        margin:              '0 auto',
        textAlign:           'left',
      }}>
        {features.map((f) => (
          <div key={f.title} style={{
            padding:      '14px',
            background:   'var(--green-50)',
            borderRadius: 'var(--radius-md)',
            border:       '1px solid var(--green-100)',
          }}>
            <span style={{ fontSize: 20 }}>{f.icon}</span>
            <p style={{ fontWeight: 700, fontSize: 'var(--fs-sm)', color: 'var(--green-800)', margin: '6px 0 2px' }}>
              {f.title}
            </p>
            <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-secondary)', margin: 0 }}>
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
