/**
 * EduTech Pro — Componente AudioPlayer
 * Player de áudio customizado para reprodução do resumo em voz.
 */

import React, { useRef, useState, useEffect } from 'react'
import {
  Play, Pause, Volume2, VolumeX,
  RotateCcw, Download, Headphones,
} from 'lucide-react'

export default function AudioPlayer({ audioUrl, filename }) {
  const audioRef      = useRef(null)
  const progressRef   = useRef(null)
  const [playing,  setPlaying]  = useState(false)
  const [muted,    setMuted]    = useState(false)
  const [volume,   setVolume]   = useState(1)
  const [current,  setCurrent]  = useState(0)
  const [duration, setDuration] = useState(0)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(false)

  // Carrega novo src
  useEffect(() => {
    setPlaying(false)
    setCurrent(0)
    setLoading(true)
    setError(false)
  }, [audioUrl])

  const fmt = (s) => {
    if (!s || isNaN(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  const pct = duration ? (current / duration) * 100 : 0

  const togglePlay = async () => {
    const a = audioRef.current
    if (!a) return
    if (playing) { a.pause(); setPlaying(false) }
    else         { await a.play(); setPlaying(true) }
  }

  const seek = (e) => {
    const a    = audioRef.current
    const bar  = progressRef.current
    if (!a || !bar || !duration) return
    const rect = bar.getBoundingClientRect()
    const x    = e.clientX - rect.left
    a.currentTime = (x / rect.width) * duration
  }

  const restart = () => {
    const a = audioRef.current
    if (!a) return
    a.currentTime = 0
    a.play()
    setPlaying(true)
  }

  return (
    <div style={{
      background:   'linear-gradient(135deg, var(--green-700) 0%, var(--green-800) 100%)',
      borderRadius: 'var(--radius-xl)',
      padding:      '20px 24px',
      color:        '#fff',
      boxShadow:    'var(--shadow-green)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{
          width: 36, height: 36,
          background: 'rgba(255,255,255,.15)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Headphones size={18} />
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontWeight: 700, fontSize: 'var(--fs-sm)', margin: 0 }}>
            Leitura em Áudio
          </p>
          <p style={{
            fontSize: 'var(--fs-xs)',
            opacity: .7,
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {filename}
          </p>
        </div>

        {/* Download */}
        <a
          href={audioUrl}
          download={`resumo_${filename}.mp3`}
          title="Baixar áudio"
          style={{
            marginLeft: 'auto',
            color: 'rgba(255,255,255,.7)',
            transition: 'color var(--t-fast)',
            display: 'flex',
          }}
          onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
          onMouseOut={(e)  => e.currentTarget.style.color = 'rgba(255,255,255,.7)'}
        >
          <Download size={16} />
        </a>
      </div>

      {/* Barra de progresso */}
      <div
        ref={progressRef}
        onClick={seek}
        style={{
          height: 5,
          background: 'rgba(255,255,255,.2)',
          borderRadius: 99,
          cursor: 'pointer',
          marginBottom: 12,
          position: 'relative',
        }}
      >
        <div style={{
          width:        `${pct}%`,
          height:       '100%',
          background:   'var(--green-300)',
          borderRadius: 99,
          transition:   'width 0.1s linear',
        }} />
      </div>

      {/* Tempos */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        fontSize: 'var(--fs-xs)', opacity: .7, marginBottom: 14,
      }}>
        <span>{fmt(current)}</span>
        <span>{fmt(duration)}</span>
      </div>

      {/* Controles */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: 16,
      }}>
        {/* Reiniciar */}
        <button
          onClick={restart}
          title="Reiniciar"
          style={btnStyle}
        >
          <RotateCcw size={16} />
        </button>

        {/* Play / Pause */}
        <button
          onClick={togglePlay}
          disabled={loading || error}
          title={playing ? 'Pausar' : 'Reproduzir'}
          style={{
            ...btnStyle,
            width: 48, height: 48,
            background: '#fff',
            color: 'var(--green-700)',
            fontSize: 22,
            opacity: (loading || error) ? .5 : 1,
          }}
        >
          {loading
            ? <span style={{ width: 18, height: 18, border: '2px solid var(--green-700)', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin .7s linear infinite' }} />
            : (playing ? <Pause size={20} /> : <Play size={20} />)
          }
        </button>

        {/* Mute */}
        <button
          onClick={() => {
            const a = audioRef.current
            if (!a) return
            a.muted = !muted
            setMuted(!muted)
          }}
          title={muted ? 'Ativar som' : 'Silenciar'}
          style={btnStyle}
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        {/* Volume */}
        <input
          type="range"
          min="0" max="1" step="0.05"
          value={muted ? 0 : volume}
          onChange={(e) => {
            const v = parseFloat(e.target.value)
            setVolume(v)
            if (audioRef.current) audioRef.current.volume = v
            if (v > 0 && muted) { setMuted(false); if (audioRef.current) audioRef.current.muted = false }
          }}
          style={{ width: 72, accentColor: 'var(--green-300)', cursor: 'pointer' }}
        />
      </div>

      {error && (
        <p style={{
          textAlign: 'center', marginTop: 10,
          fontSize: 'var(--fs-xs)', color: '#FCA5A5',
        }}>
          Erro ao carregar áudio. Tente novamente.
        </p>
      )}

      {/* Elemento de áudio nativo */}
      <audio
        ref={audioRef}
        src={audioUrl}
        onLoadedMetadata={(e) => { setDuration(e.target.duration); setLoading(false) }}
        onTimeUpdate={(e)     => setCurrent(e.target.currentTime)}
        onEnded={()           => setPlaying(false)}
        onError={()           => { setError(true); setLoading(false) }}
        preload="metadata"
      />
    </div>
  )
}

const btnStyle = {
  background:   'rgba(255,255,255,.15)',
  border:       'none',
  borderRadius: '50%',
  width:        36,
  height:       36,
  display:      'flex',
  alignItems:   'center',
  justifyContent: 'center',
  cursor:       'pointer',
  color:        '#fff',
  transition:   'background var(--t-fast)',
}
