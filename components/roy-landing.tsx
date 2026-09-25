'use client'

import { useState } from 'react'
import {
  ArrowRight,
  Brain,
  Check,
  FileText,
  GitBranch,
  Headphones,
  Layers3,
  Mic,
  Network,
  Search,
  Sparkles,
  Video,
  Workflow,
} from 'lucide-react'

const steps = [
  { number: '01', icon: Mic, title: 'Plugs into your stack', text: 'Roy pulls transcripts from Granola, Meet, and the tools you already run.' },
  { number: '02', icon: Brain, title: 'Roy takes it down', text: 'Decisions, customer asks, who owns what.' },
  { number: '03', icon: GitBranch, title: 'Roy checks his notes', text: 'New information gets flagged if it disagrees with the old.' },
  { number: '04', icon: Sparkles, title: 'Any AI tool gets briefed', text: 'Whatever you already use quietly checks with Roy first.' },
]

const cases = [
  { icon: Headphones, role: 'Sales', problem: '“Why is this feature not prioritised?”', answer: 'Roy finds out why feature decisions were taken, who took them, without round trips to product teams.' },
  { icon: Search, role: 'Product', problem: '“Why is this request suddenly high priority?”', answer: 'Roy traces all company conversations and surfaces relevant signals for prioritisation.' },
  { icon: Workflow, role: 'Operations', problem: '“Did anyone decide who owns this?”', answer: 'Find the decision and the person attached to it.' },
  { icon: Layers3, role: 'Every AI tool', problem: '“What should I know before I answer?”', answer: 'Roy gives your tools the context they are missing at a fraction of the token cost.' },
]

const faqs = [
  ['What is Roy?', 'Roy is a shared memory harness for your team and the AI tools you use. He turns conversations into context you can actually find and trust.'],
  ['Where does Roy get his memory?', 'Roy reads the transcripts and notes already created in your existing tools, quietly compounding every meeting into memory.'],
  ['I don’t want a tool tracking everything I say.', 'Roy tracks only what you want him to track, in the structure you want him to track. Nothing leaves your workspace. Every answer comes with its source, and is never guessed.'],
  ['When can I try it?', 'We are rolling out early access in small batches. Join the waitlist and we will keep you posted.'],
]

function SignupForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('') // honeypot — real visitors never fill this in
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!email || status === 'loading') return
    setStatus('loading')
    setError('')
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: compact ? 'footer' : 'hero', company_website: company }),
      })
      const data = await response.json()
      if (!response.ok) {
        setStatus('error')
        setError(data.error || "Couldn't save that just now. Please try again.")
        return
      }
      setStatus('success')
    } catch {
      setStatus('error')
      setError("Couldn't save that just now. Please try again.")
    }
  }

  return (
    <form className={`signup-form${compact ? ' signup-form--compact' : ''}`} onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor={compact ? 'footer-email' : 'hero-email'}>Work email</label>
      <input
        id={compact ? 'footer-email' : 'hero-email'}
        type="email"
        required
        placeholder="you@company.com"
        value={email}
        onChange={(event) => { setEmail(event.target.value); if (status !== 'idle') setStatus('idle') }}
      />
      <input
        type="text"
        name="company_website"
        value={company}
        onChange={(event) => setCompany(event.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
      />
      <button className="button button--primary" type="submit" disabled={status === 'loading'}>
        {status === 'success' ? 'You’re on the list' : status === 'loading' ? 'Saving…' : 'Join the waitlist'} <ArrowRight size={16} aria-hidden="true" />
      </button>
      {status === 'success' && <span className="form-success"><Check size={14} aria-hidden="true" /> Thanks — we’ll be in touch.</span>}
      {status === 'error' && <span className="form-error">{error}</span>}
    </form>
  )
}

function Logo() {
  return <span className="logo-mark" aria-label="Roy logo"><Brain size={19} strokeWidth={1.8} /></span>
}

export function RoyLanding() {
  return (
    <div className="roy-page">
      <nav className="site-nav" aria-label="Main navigation">
        <a className="brand" href="#top"><Logo /><span>Roy</span></a>
        <a className="button button--outline" href="#join">Join the waitlist <ArrowRight size={15} aria-hidden="true" /></a>
      </nav>

      <main id="top">
        <section className="hero shell">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> Introducing Roy</div>
            <h1>Your oldest employee, who <em>remembers everything</em></h1>
            <p className="hero-sub">Roy pulls all transcripts, tracks every decision, and never forgets. So your team — and every AI tool you use — always has the full story.</p>
            <SignupForm />
            <p className="form-note">No spam. Early access rolls out in small batches.</p>
          </div>
          <div className="hero-demo" aria-label="Example of Roy answering a question">
            <div className="demo-top"><span className="status-dot" /> ROY / MEMORY QUERY <span className="demo-line" /></div>
            <div className="message message--user">What&apos;s our history with the Meridian account?</div>
            <div className="message message--roy">
              <div className="roy-avatar"><Brain size={16} /></div>
              <div>
                <p>Meridian signed in March. They raised concerns about onboarding delays in June, and Sales offered an early-renewal discount in August. Nothing is currently unresolved.</p>
                <div className="remembered"><span>REMEMBERED BY ROY</span><div className="source-tags"><span>March sales call</span><span>Check in call</span><span>CSM call</span></div></div>
              </div>
            </div>
            <div className="demo-bottom"><span>3 sources found</span><span>just now</span></div>
          </div>
        </section>

        <section className="section shell section--steps" aria-labelledby="how-title">
          <div className="section-kicker">How Roy works</div>
          <h2 id="how-title" className="sr-only">How Roy works</h2>
          <div className="steps-grid">{steps.map(({ number, icon: Icon, title, text }) => <article className="step" key={number}><div className="step-top"><Icon size={24} strokeWidth={1.5} /><span>{number}</span></div><h3>{title}</h3><p>{text}</p></article>)}</div>
        </section>

        <section className="section shell cases-section" aria-labelledby="cases-title">
          <div className="section-kicker">Where Roy helps</div><h2 id="cases-title">BYO context, without the maintenance.</h2>
          <div className="cases-grid">{cases.map(({ icon: Icon, role, problem, answer }) => <article className="case-card" key={role}><div className="case-meta"><span className="case-icon"><Icon size={17} /></span><span>{role}</span></div><p className="case-problem">{problem}</p><p className="case-answer">{answer}</p></article>)}</div>
        </section>

        <section className="section shell flow-section" aria-labelledby="flow-title">
          <div className="section-kicker">The flow</div>
          <h2 id="flow-title">Fits into your stack.</h2>
          <div className="flow-diagram">
            <div className="flow-column"><span><Mic size={15} /> Granola</span><span><Video size={15} /> Google Meet</span><span><FileText size={15} /> Notion</span><span><Network size={15} /> Jira</span></div>
            <ArrowRight className="flow-arrow" size={25} strokeWidth={1.2} />
            <div className="flow-center"><Logo /><strong>Roy</strong></div>
            <ArrowRight className="flow-arrow" size={25} strokeWidth={1.2} />
            <div className="flow-column"><span><Sparkles size={15} /> Claude</span><span><Layers3 size={15} /> Slack</span><span><Workflow size={15} /> ChatGPT</span><span><Search size={15} /> Search</span></div>
          </div>
          <p className="flow-caption">One memory layer. Every conversation, decision, and AI tool in sync.</p>
        </section>

                <section className="section shell faq-section" aria-labelledby="faq-title"><div className="section-kicker">Good to know</div><h2 id="faq-title">Uhmm...what?</h2><div className="faq-list">{faqs.map(([question, answer]) => <details className="faq-item" key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></section>

        <section className="final-cta" id="join"><div className="section-kicker">Get early access</div><h2>Keep the whole story in the room.</h2><p>Join the first teams building with a memory that sticks.</p><SignupForm compact /></section>
      </main>

      <footer className="site-footer shell"><a className="brand" href="#top"><Logo /><span>Roy</span></a><span>Shared memory for humans and machines.</span><span>© 2026 Roy</span></footer>
    </div>
  )
}
