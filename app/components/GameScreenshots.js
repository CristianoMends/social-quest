'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const IMAGES = [
  {
    src: '/images/game_map.png',
    alt: 'Mapa de Jornada Interativo do Social Quest',
    title: 'Explore seu mapa de jornada',
    desc: 'Avance por 30 missões diárias com trilha sonora e badges de nível.'
  },
  {
    src: '/images/game_quest.png',
    alt: 'Detalhes da Missão e Checklist',
    title: 'Cumpra suas missões diárias',
    desc: 'Checklist interativo com áudio explicativo e recompensas em XP.'
  }
]

export default function GameScreenshots() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev === 0 ? 1 : 0))
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="section section--tint game-preview-section">
      <div className="container game-preview-container">
        <div className="game-preview-info">
          <span className="eyebrow eyebrow--teal">POR DENTRO DO GAME</span>
          <h2>Conheça a Plataforma do Social Quest</h2>
          <p className="game-preview-text">
            O Social Quest não é apenas um ebook comum. É uma plataforma web interativa desenvolvida
            para você praticar de forma leve, divertida e totalmente guiada.
          </p>
          
          <div className="game-preview-steps">
            {IMAGES.map((img, i) => (
              <div 
                key={i} 
                className={`game-preview-step ${index === i ? 'game-preview-step--active' : ''}`}
                onClick={() => setIndex(i)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setIndex(i)
                  }
                }}
              >
                <span className="game-preview-step__num">0{i + 1}</span>
                <div>
                  <h4>{img.title}</h4>
                  <p>{img.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="game-preview-display">
          <div className="phone-mockup">
            <div className="phone-mockup__screen">
              {IMAGES.map((img, i) => (
                <motion.img
                  key={i}
                  src={img.src}
                  alt={img.alt}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                  initial={{ opacity: 0, y: 40, zIndex: 1 }}
                  animate={{
                    opacity: index === i ? 1 : 0,
                    y: index === i ? 0 : -40,
                    zIndex: index === i ? 2 : 1,
                  }}
                  transition={{
                    opacity: { duration: 0.5 },
                    y: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
                  }}
                />
              ))}
            </div>
            {/* Glossy overlay reflection */}
            <div className="phone-mockup__glare" />
            <div className="phone-mockup__shadow" />
          </div>
        </div>
      </div>
    </section>
  )
}
