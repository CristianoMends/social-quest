'use client'
import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DayModal from './DayModal'
import { MISSIONS, LEVEL_CLR, LEVEL_LABEL } from '../data/missions'

/* ── Layout constants ── */
const SVG_W  = 480
const COL_X  = [90, 244, 398]   // 3 columns
const ROW_H  = 116
const PAD_T  = 100
const PAD_B  = 80
const SVG_H  = PAD_T + 9 * ROW_H + PAD_B  // ≈ 1224px
const NR     = 27  // node radius

/* ── Position calculator: 3-col snake ── */
function pos(i) {
  const row = Math.floor(i / 3)
  const col = i % 3
  const ltr = row % 2 === 0
  return { x: ltr ? COL_X[col] : COL_X[2 - col], y: PAD_T + row * ROW_H }
}

const POS = MISSIONS.map((_, i) => pos(i))

/* ── Level checkpoint badges (mid-point between last/first node of each level) ── */
const CHECKPOINTS = [
  { nivel: 2, ...midpoint(6, 7) },
  { nivel: 3, ...midpoint(13, 14) },
  { nivel: 4, ...midpoint(20, 21) },
]

function midpoint(a, b) {
  return { x: (POS[a].x + POS[b].x) / 2, y: (POS[a].y + POS[b].y) / 2 }
}

/* ── Calendar-day diff (midnight-based, not 24h-based) ── */
function calendarDaysSince(isoDate) {
  const start = new Date(isoDate)
  const startMidnight = new Date(start.getFullYear(), start.getMonth(), start.getDate())
  const now = new Date()
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.floor((nowMidnight - startMidnight) / 86_400_000)
}

/* ── Main component ── */
export default function GameMap({ userEmail }) {
  const [done, setDone]           = useState([])
  const [startedAt, setStartedAt] = useState(null)
  const [loading, setLoading]     = useState(true)
  const [selected, setSelected]   = useState(null)
  const [scale, setScale]         = useState(1)

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth
      if (width < 480) {
        setScale(Math.max(0.5, (width - 32) / 480))
      } else {
        setScale(1)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    fetch('/api/progress')
      .then(r => r.json())
      .then(data => {
        setDone(data.done ?? [])
        setStartedAt(data.started_at ?? null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Dia atual da jornada (1 = primeiro dia, cresce a cada meia-noite)
  const currentDay = useMemo(() => {
    if (!startedAt) return 1
    return Math.max(1, calendarDaysSince(startedAt) + 1)
  }, [startedAt])

  // Missão i desbloqueada: dia correto chegou E missão anterior concluída
  function isUnlocked(i) {
    return i < currentDay && i <= done.length
  }
  function isDone(i) { return done.includes(i) }

  async function handleComplete(idx) {
    const next = [...done, idx]
    setDone(next)
    setSelected(null)
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: next }),
    })
  }

  const currentIdx = Math.min(done.length, 29)
  const avatarP    = POS[currentIdx]
  const pct        = Math.round((done.length / 30) * 100)

  // Usuário completou todas as missões do dia e espera o próximo
  const waitingForTomorrow = done.length < 30 && done.length >= currentDay

  if (loading) {
    return (
      <div className="gm-wrap">
        <div className="gm-skeleton">
          <div className="gm-skeleton__logo">⚔️ Social Quest</div>
          <div className="gm-skeleton__bar" />
          <p className="gm-skeleton__text">Carregando seu progresso…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="gm-wrap">
      {/* ── Top bar ── */}
      <header className="gm-header">
        <div className="gm-header__inner">
          <div className="gm-header__top-row">
            <span className="gm-header__logo">⚔️ Social Quest</span>
            {userEmail && (
              <div className="gm-header__user">
                <span className="gm-header__email" title={userEmail}>
                  👤 {userEmail}
                </span>
                <form method="POST" action="/api/auth/logout" style={{ margin: 0 }}>
                  <button type="submit" className="gm-header__logout">
                    Sair
                  </button>
                </form>
              </div>
            )}
          </div>
          <div className="gm-header__progress">
            <div className="gm-header__bar">
              <motion.div
                className="gm-header__fill"
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
            <span className="gm-header__label">{done.length}/30</span>
          </div>
        </div>
      </header>

      {/* ── Level legend ── */}
      <div className="gm-legend">
        {[1, 2, 3, 4].map(n => (
          <span key={n} className="gm-legend__item">
            <span className="gm-legend__dot" style={{ background: LEVEL_CLR[n] }} />
            Nv {n}
          </span>
        ))}
      </div>

      {/* ── Banner: aguardando próximo dia ── */}
      {waitingForTomorrow && (
        <div className="gm-next-info">
          <span>⏳</span>
          <span>Ótimo trabalho! Próxima missão disponível amanhã.</span>
        </div>
      )}

      {/* ── Map ── */}
      <div className="gm-scroll" style={{ overflow: scale < 1 ? 'hidden' : 'auto' }}>
        <div
          className="gm-field"
          style={{
            width: SVG_W,
            height: SVG_H,
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            marginBottom: scale < 1 ? `-${(1 - scale) * SVG_H}px` : 0,
          }}
        >

          {/* ── Path SVG ── */}
          <svg
            className="gm-svg"
            width={SVG_W} height={SVG_H}
            aria-hidden
          >
            {/* Segments */}
            {POS.map((p, i) => {
              if (i === POS.length - 1) return null
              const q = POS[i + 1]
              const completed = isDone(i)
              return (
                <line
                  key={i}
                  x1={p.x} y1={p.y} x2={q.x} y2={q.y}
                  stroke={completed ? LEVEL_CLR[MISSIONS[i].nivel] : 'rgba(255,255,255,0.10)'}
                  strokeWidth={completed ? 4 : 3}
                  strokeDasharray={completed ? 'none' : '7 5'}
                  strokeLinecap="round"
                  style={{ transition: 'stroke 0.4s' }}
                />
              )
            })}

            {/* Checkpoint stars */}
            {CHECKPOINTS.map((cp, i) => {
              const unlocked = done.length >= [7, 14, 21][i]
              return (
                <g key={i} transform={`translate(${cp.x}, ${cp.y})`}>
                  <circle r={18} fill={unlocked ? LEVEL_CLR[cp.nivel] : '#1e1e3a'} stroke={LEVEL_CLR[cp.nivel]} strokeWidth={2} />
                  <text textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight="800" fill={unlocked ? '#0a0a1e' : LEVEL_CLR[cp.nivel]} letterSpacing="0">
                    N{cp.nivel}
                  </text>
                </g>
              )
            })}
          </svg>

          {/* ── Nodes ── */}
          {MISSIONS.map((m, i) => {
            const p          = POS[i]
            const unlocked   = isUnlocked(i)
            const completed  = isDone(i)
            const isNext     = i === done.length          // próxima missão a fazer
            const isCurrent  = isNext && unlocked         // disponível hoje
            const isWaiting  = isNext && !unlocked        // próxima mas aguardando dia
            const color      = LEVEL_CLR[m.nivel]

            let nodeClass = 'gm-node'
            if (completed)      nodeClass += ' gm-node--done'
            else if (isCurrent) nodeClass += ' gm-node--current'
            else if (isWaiting) nodeClass += ' gm-node--waiting'
            else if (!unlocked) nodeClass += ' gm-node--locked'
            else                nodeClass += ' gm-node--open'

            const titleAttr = completed
              ? `Dia ${m.dia} — ${m.titulo} ✓`
              : unlocked
                ? `Dia ${m.dia} — ${m.titulo}`
                : isWaiting
                  ? `Disponível amanhã — ${m.titulo}`
                  : `Bloqueado — complete o dia anterior primeiro`

            return (
              <div key={i} style={{ position: 'absolute', left: p.x - NR, top: p.y - NR }}>
                {/* Pulse ring: no nó atual (disponível) ou no próximo aguardando */}
                {(isCurrent || isWaiting) && (
                  <motion.div
                    className="node-pulse"
                    style={{ '--pulse-color': isWaiting ? 'rgba(255,255,255,0.2)' : color }}
                    animate={{ scale: [1, 1.7], opacity: [0.6, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
                  />
                )}

                <motion.button
                  className={nodeClass}
                  style={{ '--node-color': color, width: NR * 2, height: NR * 2 }}
                  onClick={() => unlocked && setSelected({ ...m, index: i })}
                  disabled={!unlocked}
                  title={titleAttr}
                  whileHover={unlocked ? { scale: 1.12 } : {}}
                  whileTap={unlocked ? { scale: 0.93 } : {}}
                  animate={completed ? { boxShadow: [`0 0 0px ${color}00`, `0 0 14px ${color}99`, `0 0 0px ${color}00`] } : {}}
                  transition={completed ? { duration: 3, repeat: Infinity } : {}}
                >
                  {completed
                    ? <span className="gm-node__icon">✓</span>
                    : unlocked
                      ? <span className="gm-node__num">{m.dia}</span>
                      : isWaiting
                        ? <span className="gm-node__icon">⏳</span>
                        : <span className="gm-node__icon gm-node__lock">🔒</span>
                  }
                </motion.button>

                {/* Day label below node */}
                {(completed || isCurrent || isWaiting) && (
                  <p className="gm-node__label" style={{ color: completed ? color : isCurrent ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)' }}>
                    {m.dia}
                  </p>
                )}
              </div>
            )
          })}

          {/* ── Avatar ── */}
          <motion.div
            className="gm-avatar"
            animate={{ x: avatarP.x - 14, y: avatarP.y - NR - 26 }}
            transition={{ type: 'spring', stiffness: 55, damping: 16 }}
            style={{ position: 'absolute', top: 0, left: 0 }}
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              📍
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* ── Modal ── */}
      <AnimatePresence>
        {selected && (
          <DayModal
            key={selected.index}
            node={selected}
            onClose={() => setSelected(null)}
            onComplete={() => handleComplete(selected.index)}
            isCompleted={isDone(selected.index)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
