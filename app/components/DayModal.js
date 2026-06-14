'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LEVEL_CLR } from '../data/missions'

/* ── Audio Player ── */
function AudioPlayer({ src }) {
  const ref = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState(false)

  function toggle() {
    const a = ref.current
    if (!a || error) return
    playing ? a.pause() : a.play().catch(() => setError(true))
  }

  function onTimeUpdate() {
    const a = ref.current
    if (!a) return
    setCurrent(a.currentTime)
    setProgress((a.currentTime / a.duration) * 100 || 0)
  }

  function seek(e) {
    const a = ref.current
    if (!a || error) return
    const r = e.currentTarget.getBoundingClientRect()
    a.currentTime = ((e.clientX - r.left) / r.width) * a.duration
  }

  function fmt(s) {
    const m = Math.floor(s / 60)
    return `${m}:${Math.floor(s % 60).toString().padStart(2, '0')}`
  }

  return (
    <div className="audio-player">
      <audio
        ref={ref}
        src={src}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={() => setDuration(ref.current?.duration || 0)}
        onEnded={() => { setPlaying(false); setProgress(0); setCurrent(0) }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setError(true)}
      />
      <button className="audio-player__btn" onClick={toggle} aria-label={playing ? 'Pausar' : 'Play'}>
        {error ? '⚠' : playing ? '⏸' : '▶'}
      </button>
      <div className="audio-player__track">
        <div className="audio-player__bar" onClick={seek} role="slider" aria-label="Progresso">
          <div className="audio-player__fill" style={{ width: `${progress}%` }} />
          <div className="audio-player__thumb" style={{ left: `${progress}%` }} />
        </div>
        <div className="audio-player__time">
          <span>{fmt(current)}</span>
          <span>{duration ? fmt(duration) : '--:--'}</span>
        </div>
      </div>
      {error && <p className="audio-player__error">Áudio indisponível</p>}
    </div>
  )
}

/* ── Confetti ── */
function Confetti() {
  const items = Array.from({ length: 48 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: ['#f97316','#22d3ee','#4ade80','#c084fc','#fbbf24','#fb7185'][i % 6],
    size: 5 + Math.random() * 9,
    rotate: Math.random() * 720 - 360,
    delay: Math.random() * 0.5,
    dur: 1.4 + Math.random() * 0.8,
    circle: i % 3 === 0,
  }))

  return (
    <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {items.map(p => (
        <motion.div
          key={p.id}
          initial={{ x: `${p.x}vw`, y: '-8vh', opacity: 1, rotate: 0, scale: 1 }}
          animate={{ y: '105vh', opacity: [1, 1, 0], rotate: p.rotate, scale: [1, 0.8, 0.4] }}
          transition={{ duration: p.dur, delay: p.delay, ease: 'easeIn' }}
          style={{
            position: 'absolute',
            top: 0, left: 0,
            width: p.size, height: p.size,
            borderRadius: p.circle ? '50%' : 3,
            background: p.color,
          }}
        />
      ))}
    </div>
  )
}

/* ── Day Modal ── */
export default function DayModal({ node, onClose, onComplete, isCompleted }) {
  const [checked, setChecked] = useState(() => node.tasks.map(() => isCompleted))
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    setChecked(node.tasks.map(() => isCompleted))
  }, [node, isCompleted])

  const allDone = checked.every(Boolean)
  const color = LEVEL_CLR[node.nivel]

  function toggle(i) {
    if (isCompleted) return
    setChecked(prev => prev.map((v, idx) => idx === i ? !v : v))
  }

  function handleComplete() {
    setShowConfetti(true)
    setTimeout(() => {
      setShowConfetti(false)
      onComplete()
    }, 2200)
  }

  return (
    <>
      {showConfetti && <Confetti />}

      {/* Backdrop */}
      <motion.div
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Card */}
      <motion.div
        className="day-modal"
        role="dialog"
        aria-modal="true"
        initial={{ opacity: 0, scale: 0.88, y: 48 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88, y: 48 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      >
        {/* Header */}
        <div className="day-modal__header" style={{ borderBottomColor: color }}>
          <div>
            <span className="day-modal__tag" style={{ color, borderColor: color }}>
              Nível {node.nivel}
            </span>
            <h2 className="day-modal__title">Dia {node.dia} — {node.titulo}</h2>
          </div>
          <button className="day-modal__close" onClick={onClose} aria-label="Fechar">✕</button>
        </div>

        {/* Audio */}
        <div className="day-modal__section">
          <p className="day-modal__section-label">🎧 Áudio da Missão</p>
          <AudioPlayer src={`/audios/dia-${node.dia}.wav`} />
        </div>

        {/* Checklist */}
        <div className="day-modal__section">
          <p className="day-modal__section-label">📋 Tarefas do Dia</p>
          <ul className="day-modal__tasks">
            {node.tasks.map((task, i) => (
              <li key={i}>
                <label className={`task-item${checked[i] ? ' task-item--done' : ''}`}>
                  <input
                    type="checkbox"
                    checked={checked[i]}
                    onChange={() => toggle(i)}
                    disabled={isCompleted}
                    className="task-item__input"
                  />
                  <span
                    className="task-item__box"
                    style={checked[i] ? { background: color, borderColor: color } : {}}
                  >
                    {checked[i] && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                      >
                        ✓
                      </motion.span>
                    )}
                  </span>
                  <span className="task-item__label">{task}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        {isCompleted ? (
          <div className="day-modal__done" style={{ color }}>
            ✓ Missão já concluída!
          </div>
        ) : (
          <motion.button
            className="day-modal__complete-btn"
            style={{ '--modal-color': color }}
            disabled={!allDone}
            onClick={handleComplete}
            whileHover={allDone ? { scale: 1.03 } : {}}
            whileTap={allDone ? { scale: 0.97 } : {}}
          >
            {allDone
              ? '🏆 Missão Cumprida!'
              : `${checked.filter(Boolean).length} / ${node.tasks.length} tarefas`}
          </motion.button>
        )}
      </motion.div>
    </>
  )
}
