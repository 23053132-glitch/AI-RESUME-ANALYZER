import React, { useState, useEffect, useRef } from 'react'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate, useParams } from 'react-router'

const IconCode = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
  </svg>
)
const IconChat = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)
const IconMap = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 11 22 2 13 21 11 13 3 11" />
  </svg>
)
const IconOverview = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
)
const IconArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
)
const IconChevron = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

const NAV_ITEMS = [
  { id: 'overview',   label: 'Overview',    icon: <IconOverview /> },
  { id: 'technical',  label: 'Technical',   icon: <IconCode /> },
  { id: 'behavioral', label: 'Behavioral',  icon: <IconChat /> },
  { id: 'roadmap',    label: 'Road Map',    icon: <IconMap /> },
]

const ScoreRing = ({ score }) => {
  const r = 52
  const circ = 2 * Math.PI * r
  const pct  = Math.max(0, Math.min(100, score ?? 0))
  const dash = (pct / 100) * circ
  const color = pct >= 80 ? '#3fb950' : pct >= 60 ? '#f5a623' : '#ff4d4d'
  return (
    <div className="score-ring-wrap">
      <svg className="score-ring-svg" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#2a3348" strokeWidth="8" />
        <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeLinecap="round" strokeDasharray={`${dash} ${circ}`} strokeDashoffset="0"
          transform="rotate(-90 60 60)"
          style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)' }}
        />
      </svg>
      <div className="score-ring-inner">
        <span className="score-ring-value" style={{ color }}>{pct}</span>
        <span className="score-ring-label">%</span>
      </div>
    </div>
  )
}

const QuestionCard = ({ item, index }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className={`q-card ${open ? 'q-card--open' : ''}`}>
      <button className="q-card__header" onClick={() => setOpen(o => !o)}>
        <span className="q-card__index">Q{index + 1}</span>
        <p className="q-card__question">{item.question}</p>
        <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}><IconChevron /></span>
      </button>
      <div className="q-card__body-wrap" style={{ display: open ? 'block' : 'none' }}>
        <div className="q-card__body">
          {item.intention && (
            <div className="q-card__section">
              <span className="q-tag q-tag--intention">💡 Intention</span>
              <p>{item.intention}</p>
            </div>
          )}
          {item.answer && (
            <div className="q-card__section">
              <span className="q-tag q-tag--answer">✅ Model Answer</span>
              <p>{item.answer}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const RoadmapDay = ({ day, total }) => (
  <div className="rm-day">
    <div className="rm-day__dot" />
    <div className="rm-day__card">
      <div className="rm-day__header">
        <span className="rm-day__badge">Day {day.day}</span>
        <span className="rm-day__of">of {total}</span>
        <h3 className="rm-day__focus">{day.focus}</h3>
      </div>
      <ul className="rm-day__tasks">
        {(day.tasks || []).map((task, i) => (
          <li key={i}><span className="rm-day__bullet" />{task}</li>
        ))}
      </ul>
    </div>
  </div>
)

const SkillBadge = ({ skill, severity }) => (
  <span className={`skill-tag skill-tag--${(severity ?? 'medium').toLowerCase()}`}>{skill}</span>
)

const Overview = ({ report }) => (
  <div className="overview">
    <div className="overview__stats">
      <div className="stat-card">
        <span className="stat-card__value">{report.technicalQuestions?.length ?? 0}</span>
        <span className="stat-card__label">Technical Q&amp;A</span>
      </div>
      <div className="stat-card">
        <span className="stat-card__value">{report.behavioralQuestions?.length ?? 0}</span>
        <span className="stat-card__label">Behavioral Q&amp;A</span>
      </div>
      <div className="stat-card">
        <span className="stat-card__value">{report.preparationPlan?.length ?? 0}</span>
        <span className="stat-card__label">Day Plan</span>
      </div>
      <div className="stat-card">
        <span className="stat-card__value">{report.skillGaps?.length ?? 0}</span>
        <span className="stat-card__label">Skill Gaps</span>
      </div>
    </div>
    <div className="overview__section-title">All Skill Gaps</div>
    <div className="skill-gaps__list">
      {(report.skillGaps ?? []).map((gap, i) => (
        <SkillBadge key={i} skill={gap.skill} severity={gap.severity} />
      ))}
      {(!report.skillGaps || report.skillGaps.length === 0) && (
        <p className="empty-note">No skill gaps identified — great match!</p>
      )}
    </div>
    <div className="overview__section-title" style={{ marginTop: '2rem' }}>Quick Tips</div>
    <ul className="overview__tips">
      <li>Review all technical questions and practice answers out loud.</li>
      <li>Use the STAR method for behavioral questions.</li>
      <li>Follow the {report.preparationPlan?.length ?? 0}-day roadmap to close skill gaps before your interview.</li>
    </ul>
  </div>
)

const LoadingScreen = () => (
  <div className="iv-loading">
    <div className="iv-spinner" />
    <p>Loading your interview plan…</p>
  </div>
)

const Interview = () => {
  const [activeNav, setActiveNav] = useState('overview')
  const contentRef = useRef(null)

  const { report, loading, error, getReportById } = useInterview()
  const { interviewId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (interviewId) getReportById(interviewId)
  }, [interviewId])

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0
  }, [activeNav])

  if (loading || (!report && !error)) return <LoadingScreen />

  if (error) return (
    <div className="iv-error">
      <h2>Something went wrong</h2>
      <p>{error?.message || 'Unable to load your report.'}</p>
      <button className="button primary-button" onClick={() => navigate('/')}>← Back to Dashboard</button>
    </div>
  )

  if (!report) return (
    <div className="iv-error">
      <h2>Report not found</h2>
      <p>This report may have been deleted or does not exist.</p>
      <button className="button primary-button" onClick={() => navigate('/')}>← Back to Dashboard</button>
    </div>
  )

  const scoreColor = report.matchScore >= 80 ? '#3fb950' : report.matchScore >= 60 ? '#f5a623' : '#ff4d4d'
  const scoreLabel = report.matchScore >= 80 ? 'Strong match' : report.matchScore >= 60 ? 'Good match' : 'Needs improvement'

  return (
    <div className="iv-page">
      <header className="iv-topbar">
        <button className="iv-back-btn" onClick={() => navigate('/')}>
          <IconArrowLeft /> Dashboard
        </button>
        <div className="iv-topbar__center">
          <span className="iv-topbar__badge">Interview Report</span>
        </div>
      </header>

      <div className="iv-body">
        <nav className="iv-nav">
          <p className="iv-nav__label">Sections</p>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`iv-nav__item ${activeNav === item.id ? 'iv-nav__item--active' : ''}`}
              onClick={() => setActiveNav(item.id)}
            >
              <span className="iv-nav__icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="iv-divider" />

        <main className="iv-content" ref={contentRef}>
          {activeNav === 'overview' && (
            <section>
              <div className="content-header">
                <h2>Overview</h2>
                <span className="content-header__badge">Summary</span>
              </div>
              <Overview report={report} />
            </section>
          )}

          {activeNav === 'technical' && (
            <section>
              <div className="content-header">
                <h2>Technical Questions</h2>
                <span className="content-header__badge">{report.technicalQuestions?.length ?? 0} questions</span>
              </div>
              <div className="q-list">
                {(report.technicalQuestions ?? []).map((q, i) => (
                  <QuestionCard key={i} item={q} index={i} />
                ))}
              </div>
            </section>
          )}

          {activeNav === 'behavioral' && (
            <section>
              <div className="content-header">
                <h2>Behavioral Questions</h2>
                <span className="content-header__badge">{report.behavioralQuestions?.length ?? 0} questions</span>
              </div>
              <div className="q-list">
                {(report.behavioralQuestions ?? []).map((q, i) => (
                  <QuestionCard key={i} item={q} index={i} />
                ))}
              </div>
            </section>
          )}

          {activeNav === 'roadmap' && (
            <section>
              <div className="content-header">
                <h2>Preparation Road Map</h2>
                <span className="content-header__badge">{report.preparationPlan?.length ?? 0}-day plan</span>
              </div>
              <div className="rm-list">
                {(report.preparationPlan ?? []).map(day => (
                  <RoadmapDay key={day.day} day={day} total={report.preparationPlan.length} />
                ))}
              </div>
            </section>
          )}
        </main>

        <div className="iv-divider" />

        <aside className="iv-sidebar">
          <div className="sidebar-block">
            <p className="sidebar-block__label">Match Score</p>
            <ScoreRing score={report.matchScore} />
            <p className="sidebar-block__sub" style={{ color: scoreColor }}>{scoreLabel}</p>
          </div>
          <div className="sidebar-sep" />
          <div className="sidebar-block">
            <p className="sidebar-block__label">Skill Gaps</p>
            <div className="skill-gaps__list">
              {(report.skillGaps ?? []).map((gap, i) => (
                <SkillBadge key={i} skill={gap.skill} severity={gap.severity} />
              ))}
            </div>
          </div>
 <div className="sidebar-sep" />
          <div className="sidebar-block">
            <button
              className="button primary-button"
              style={{ width: '100%' }}
              onClick={() => navigate(`/voice/${interviewId}`)}
            >
              🎤 Ask AI 
            </button>
          </div>
          <div className="sidebar-sep" />
          <div className="sidebar-block">
            <p className="sidebar-block__label">Progress</p>
            <div className="progress-rows">
              <div className="progress-row">
                <span>Technical</span>
                <span>{report.technicalQuestions?.length ?? 0} Q</span>
              </div>
              <div className="progress-row">
                <span>Behavioral</span>
                <span>{report.behavioralQuestions?.length ?? 0} Q</span>
              </div>
              <div className="progress-row">
                <span>Plan Days</span>
                <span>{report.preparationPlan?.length ?? 0} d</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Interview