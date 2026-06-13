'use client'
import { useState } from 'react'
import BuyButton from './BuyButton'

const QUESTIONS = [
  {
    q: 'Você está numa situação nova — festa, reunião, evento. O que passa pela sua cabeça?',
    hint: 'Seja honesto(a). Aqui não tem resposta errada.',
    options: [
      { text: 'Já começo a planejar como vou embora', score: 1 },
      { text: 'Fico observando e esperando alguém falar primeiro', score: 2 },
      { text: 'Me aproximo, mas trava na hora de continuar', score: 3 },
      { text: 'Consigo conversar, mas fico inseguro(a) se estou sendo chato(a)', score: 4 },
    ],
  },
  {
    q: 'Você monta a conversa perfeita na cabeça… e aí?',
    hint: '',
    options: [
      { text: 'Não digo nada. De novo.', score: 1 },
      { text: 'Começo, mas saio logo que posso', score: 2 },
      { text: 'Falo, mas sai torto — diferente do que planejei', score: 3 },
      { text: 'Consigo falar, mas perco o fio da meada depois', score: 4 },
    ],
  },
  {
    q: 'Quando alguém interessante aparece na sua vida, o que acontece?',
    hint: 'Uma amizade, colega, ou alguém que você gostaria de conhecer.',
    options: [
      { text: 'Fico olhando de longe. A janela fecha sozinha.', score: 1 },
      { text: 'Espero ela me abordar primeiro', score: 2 },
      { text: 'Me aproximo, mas não sei o que falar depois do "oi"', score: 3 },
      { text: 'Começo bem, mas sinto que não sou interessante o suficiente', score: 4 },
    ],
  },
  {
    q: 'No fundo, o que mais te trava?',
    hint: 'Isso é o que o método vai atacar diretamente.',
    options: [
      { text: 'O medo de parecer estranho(a) ou intrometido(a)', score: 1 },
      { text: 'Não saber o que dizer depois que a conversa começa', score: 2 },
      { text: 'A sensação de que não tenho nada interessante a oferecer', score: 3 },
      { text: 'Manter conexões — começar é fácil, aprofundar não', score: 4 },
    ],
  },
]

const RESULTS = {
  1: {
    emoji: '👻',
    level: 'Nível 1',
    name: 'O Fantasma',
    tagline: 'Você existe nos espaços sociais — mas raramente é sentido.',
    validation:
      'Não é falta de personalidade. É que seu cérebro aprendeu a tratar contato social como ameaça — e faz isso pra te proteger. O preço é o isolamento.',
    bridge:
      'O Social Quest começa aqui: com ações de 3 segundos que custam quase nada e quebram o padrão sem virar sua vida de cabeça pra baixo.',
    cta: 'Quero sair do Nível 1',
  },
  2: {
    emoji: '👀',
    level: 'Nível 2',
    name: 'O Observador',
    tagline: 'Você lê bem as situações. Sabe quando seria a hora. Só não age.',
    validation:
      'Tem muito mais dentro de você do que as pessoas ao redor percebem. O bloqueio não é falta de vontade — é que você ainda não tem uma "saída segura" pra conversas.',
    bridge:
      'O método te dá exatamente isso: formas de entrar e sair de conversas sem aquele frio no estômago — até que virar automático.',
    cta: 'Quero destravar minhas conversas',
  },
  3: {
    emoji: '⚡',
    level: 'Nível 3',
    name: 'O Intermitente',
    tagline: 'Você consegue se conectar — mas só quando as condições são certas.',
    validation:
      'E as condições raramente ficam certas. Você tem o começo, mas o meio e o fim da conversa ainda dependem de sorte — e você sabe disso.',
    bridge:
      'Os Níveis 3 e 4 do método são sobre repertório: formas de continuar, aprofundar e fazer a outra pessoa genuinamente querer te ouvir mais.',
    cta: 'Quero conversas que vão além do "oi"',
  },
  4: {
    emoji: '🔥',
    level: 'Nível 4',
    name: 'O Quase Lá',
    tagline: 'Você já chegou longe — mas as conexões ainda ficam na superfície.',
    validation:
      'Você sai de conversas sem saber se deixou alguma impressão. E isso é frustrante porque você já faz muita coisa certa.',
    bridge:
      'O que falta é aprender a falar de você de um jeito que desperta curiosidade, não desconforto. É o que o Nível 4 do método entrega.',
    cta: 'Quero conexões de verdade',
  },
}

export default function Quiz({ checkoutUrl }) {
  const [phase, setPhase] = useState('intro')
  const [currentQ, setCurrentQ] = useState(0)
  const [scores, setScores] = useState([])
  const [result, setResult] = useState(null)
  const [selected, setSelected] = useState(null)

  function startQuiz() {
    setPhase('question')
    setCurrentQ(0)
    setScores([])
    setSelected(null)
  }

  function handleAnswer(score) {
    setSelected(score)
    setTimeout(() => {
      const newScores = [...scores, score]
      if (currentQ < QUESTIONS.length - 1) {
        setScores(newScores)
        setCurrentQ(q => q + 1)
        setSelected(null)
      } else {
        const avg = newScores.reduce((a, b) => a + b, 0) / newScores.length
        const level = Math.min(4, Math.max(1, Math.round(avg)))
        setResult(RESULTS[level])
        setPhase('loading')
        setTimeout(() => setPhase('result'), 1800)
      }
    }, 380)
  }

  /* ── INTRO ── */
  if (phase === 'intro') {
    return (
      <section className="quiz-hero">
        <div className="container">
          <span className="eyebrow">Guia gamificado · 30 dias</span>
          <h1>Você não é antissocial.<br />Você só está no Nível 1.</h1>
          <p className="lede">
            Responda 4 perguntas e descubra exatamente onde você está —
            e o que te impede de avançar.
          </p>
          <button className="quiz-start-btn" onClick={startQuiz}>
            Descobrir meu nível →
          </button>
          <p className="quiz-time">4 perguntas · menos de 1 minuto · sem cadastro</p>
        </div>
      </section>
    )
  }

  /* ── LOADING ── */
  if (phase === 'loading') {
    return (
      <section className="quiz-loading">
        <div className="quiz-loading__inner">
          <div className="quiz-spinner" />
          <p>Analisando suas respostas…</p>
        </div>
      </section>
    )
  }

  /* ── RESULTADO ── */
  if (phase === 'result' && result) {
    return (
      <section className="quiz-result-section">
        <div className="container">
          <div className="quiz-result">
            <div className="quiz-result__badge">
              <span className="quiz-result__emoji">{result.emoji}</span>
              <span className="quiz-result__level">{result.level}</span>
            </div>
            <h2 className="quiz-result__name">{result.name}</h2>
            <p className="quiz-result__tagline">{result.tagline}</p>

            <div className="quiz-result__body">
              <p>{result.validation}</p>
              <p className="quiz-result__bridge">{result.bridge}</p>
            </div>

            <div className="quiz-result__cta">
              <div className="quiz-result__pricing">
                <span className="quiz-result__price-old">R$ 47</span>
                <span className="quiz-result__price">R$ 10</span>
              </div>
              <BuyButton href={checkoutUrl}>{result.cta}</BuyButton>
              <p className="quiz-result__reassure">Acesso imediato · Garantia de 7 dias</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  /* ── PERGUNTA ── */
  const q = QUESTIONS[currentQ]
  const progress = (currentQ / QUESTIONS.length) * 100

  return (
    <section className="quiz-section">
      <div className="container">
        <div className="quiz-progress-bar">
          <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="quiz-counter">Pergunta {currentQ + 1} de {QUESTIONS.length}</p>

        <div className="quiz-question" key={currentQ}>
          <h2 className="quiz-question__text">{q.q}</h2>
          {q.hint && <p className="quiz-question__hint">{q.hint}</p>}
          <div className="quiz-options">
            {q.options.map((opt, i) => (
              <button
                key={i}
                className={`quiz-option${selected === opt.score ? ' quiz-option--selected' : ''}`}
                onClick={() => handleAnswer(opt.score)}
                disabled={selected !== null}
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
