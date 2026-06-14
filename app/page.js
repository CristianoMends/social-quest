import Quiz from './components/Quiz'
import BuyButton from './components/BuyButton'
import GameScreenshots from './components/GameScreenshots'

const OLD_PRICE = 'R$ 47'
const PRICE = 'R$ 27'

const LEVELS = [
  {
    n: 'Nível 1',
    title: 'Contato indireto',
    desc: 'A Regra dos 3 Segundos para "existir socialmente" — olhar, acenar e cumprimentar sem pressão nenhuma.',
  },
  {
    n: 'Nível 2',
    title: 'A rota de fuga',
    desc: 'Conversas de 10 segundos com saída garantida, usando o próprio ambiente como gancho.',
  },
  {
    n: 'Nível 3',
    title: 'O elogio contextual',
    desc: 'Conecte de verdade aprendendo a notar (e comentar) o esforço das pessoas.',
  },
  {
    n: 'Nível 4',
    title: 'Seu universo',
    desc: 'Mantenha a conversa viva e desperte curiosidade falando de você — sem parecer exibido.',
  },
]

const BENEFITS = [
  'Puxar conversa em qualquer lugar, sem aquele branco constrangedor.',
  'Saber exatamente o que dizer, com dezenas de falas prontas pra usar.',
  'Falar com gente nova sem o coração disparar.',
  'Fazer conexões sem precisar fingir ser extrovertido.',
  'Trocar o "eu sou estranho" por uma ação pequena todo dia.',
  'Transformar momentos estranhos em XP — não em vergonha.',
]

const FOR_YOU = [
  'Você é introvertido(a) ou tímido(a).',
  'Quer fazer amizades e conexões, mas trava.',
  'Não sabe por onde começar uma conversa.',
]

const NOT_FOR_YOU = [
  'Procura "truques de manipulação".',
  'Quer uma pílula mágica sem fazer as missões.',
  'Não está disposto(a) a uma ação pequena por dia.',
]

export default function Page() {
  const checkoutUrl = process.env.CHECKOUT_URL || '#'

  return (
    <main>
      {/* ===== HEADER / NAV ===== */}
      <header className="lp-header">
        <div className="container lp-header__inner">
          <span className="lp-header__logo">⚔️ Social Quest</span>
          <a href="/game" className="lp-header__play-btn">
            Jogar 🎮
          </a>
        </div>
      </header>

      {/* ===== QUIZ (substitui o hero) ===== */}
      <Quiz checkoutUrl={checkoutUrl} />

      {/* ===== A DOR ===== */}
      <section className="section">
        <div className="container">
          <h2>Talvez você se reconheça aqui</h2>
          <ul className="plain-list">
            <li>Você trava na hora de falar com alguém.</li>
            <li>Monta a conversa perfeita na cabeça… e não diz nada. De novo.</li>
            <li>Vê todo mundo com seu grupinho enquanto você só observa.</li>
            <li>E ainda se culpa, achando que tem algo errado com você.</li>
          </ul>
          <p className="highlight">
            Não tem nada de errado com você. Seu cérebro só te treinou pra fugir de
            gente — e dá pra destreinar.
          </p>
        </div>
      </section>

      {/* ===== A VIRADA / MECANISMO ===== */}
      <section className="section section--tint">
        <div className="container">
          <h2>A virada: ganhe XP por tentar, não por acertar</h2>
          <p>
            O erro que trava todo mundo é mirar no resultado. Aí cada conversa vira uma
            prova que você pode reprovar — e o medo faz todo sentido.
          </p>
          <p>
            Aqui a regra é outra: <strong>a recompensa é a ação, não o resultado.</strong>{' '}
            Tentou e deu certo? XP. Ficou estranho e você saiu de fininho? XP do mesmo
            jeito. Quando é impossível perder, o medo perde a força.
          </p>
          <p>
            São <strong>30 missões diárias</strong> — pequenas, na ordem certa — que vão
            te tirando da inércia um passo de cada vez.
          </p>
        </div>
      </section>

      {/* ===== O QUE TEM DENTRO ===== */}
      <section className="section">
        <div className="container">
          <h2>Os 4 níveis do jogo</h2>
          <div className="cards">
            {LEVELS.map((lvl) => (
              <div className="card" key={lvl.n}>
                <span className="card__tag">{lvl.n}</span>
                <h3>{lvl.title}</h3>
                <p>{lvl.desc}</p>
              </div>
            ))}
          </div>
          <p className="note">
            Acompanha dezenas de diálogos prontos para os cenários do dia a dia — fila,
            academia, faculdade, padaria — e um checklist de missões para marcar seu
            progresso.
          </p>
        </div>
      </section>

      {/* ===== PLATFORM PREVIEW ===== */}
      <GameScreenshots />

      {/* ===== TUDO O QUE VOCÊ LEVA ===== */}
      <section className="section section--tint">
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '36px' }}>
            Tudo o que você vai receber na compra:
          </h2>
          <div className="bundle-grid">
            <div className="bundle-card">
              <span className="bundle-card__badge">Incluso</span>
              <span className="bundle-card__icon">📖</span>
              <h3>Ebook Guia Social Quest</h3>
              <p>
                O manual passo a passo de 30 dias que detalha a psicologia prática por
                trás de cada missão, com exemplos de conversas para o dia a dia.
              </p>
            </div>

            <div className="bundle-card bundle-card--highlight">
              <span className="bundle-card__badge" style={{ background: '#22d3ee', color: '#0a0a1e', borderColor: '#22d3ee' }}>
                Plataforma
              </span>
              <span className="bundle-card__icon">🎮</span>
              <h3>Acesso ao Web App do Game</h3>
              <p>
                Área de membros gamificada para você marcar suas missões diárias como concluídas,
                ouvir os áudios explicativos de cada dia e ver seu nível e XP subirem.
              </p>
            </div>

            <div className="bundle-card">
              <span className="bundle-card__badge" style={{ background: '#c084fc', color: '#fff', borderColor: '#c084fc' }}>
                Bônus
              </span>
              <span className="bundle-card__icon">🔥</span>
              <h3>100 Falas Pra Quebrar o Gelo</h3>
              <p>
                Um bônus exclusivo com 100 abridores de conversa práticos e testados
                para você usar na academia, trabalho, faculdade ou festas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BENEFÍCIOS ===== */}
      <section className="section section--tint">
        <div className="container">
          <h2>O que muda em 30 dias</h2>
          <ul className="check-list">
            {BENEFITS.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== PARA QUEM É / NÃO É ===== */}
      <section className="section">
        <div className="container">
          <h2>Isso é pra você?</h2>
          <div className="fit">
            <div className="fit__col fit__col--yes">
              <h3>Sim, se…</h3>
              <ul>
                {FOR_YOU.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
            <div className="fit__col fit__col--no">
              <h3>Não, se…</h3>
              <ul>
                {NOT_FOR_YOU.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== GARANTIA ===== */}
      <section className="section section--tint">
        <div className="container">
          <div className="guarantee">
            <h3>Garantia de 7 dias</h3>
            <p>
              Faça as primeiras missões. Se não sentir diferença, é só pedir o reembolso
              dentro de 7 dias — sem perguntas, sem ressentimento.
            </p>
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="cta">
        <div className="container">
          <h2 className="cta__title">Comece sua primeira missão hoje</h2>
          <p className="cta__sub">
            30 dias. Uma missão por dia. Do primeiro "bom dia" até manter uma conversa
            de verdade.
          </p>

          <div className="cta__bundle">
            <strong>O que você leva:</strong> Ebook Guia + Acesso Completo ao Web App do Jogo + Bônus "100 Falas Pra Quebrar o Gelo"
          </div>

          {PRICE && (
            <div className="cta__pricing">
              {OLD_PRICE && <span className="cta__price--old">{OLD_PRICE}</span>}
              <span className="cta__price">{PRICE}</span>
            </div>
          )}

          <BuyButton href={checkoutUrl}>Quero começar minhas 30 missões</BuyButton>

          <p className="cta__reassure">Acesso imediato · Garantia de 7 dias</p>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <span>Social Quest — Guia Gamificado de 30 Dias</span>
        </div>
      </footer>
    </main>
  )
}
