import React, { useEffect, useState } from 'react'
import '../style/home.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useAuth } from '../../auth/hooks/useAuth.js'
import { useNavigate } from 'react-router'

const Home = () => {
  const navigate = useNavigate()
  const { generateReport, getReports, reports, loading, error } = useInterview()
  const { user, handleLogout } = useAuth()
  const [jobDescription, setJobDescription] = useState('')
  const [selfDescription, setSelfDescription] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const [fileName, setFileName] = useState('Drag & drop your resume or click to browse')

  useEffect(() => {
    getReports()
  }, [])

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      setResumeFile(file)
      setFileName(file.name)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!jobDescription || !selfDescription || !resumeFile) return

    const report = await generateReport({ jobDescription, selfDescription, resumeFile })
    const reportId = report?._id || report?.id
    if (reportId) {
      navigate(`/interview/${reportId}`)
    }
  }

  const onLogout = async () => {
    await handleLogout()
    navigate('/login')
  }

  const canGenerate = Boolean(jobDescription && selfDescription && resumeFile && !loading)

  // Format date nicely
  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className='page-wrapper'>

      {/* ── Top Bar ── */}
      <div className='home-topbar'>
        <div className='home-topbar__left'>
          <div className='home-topbar__logo'>
            <span className='home-topbar__logo-icon'>⚡</span>
            InterviewAI
          </div>
        </div>
        <div className='home-topbar__right'>
          {user && (
            <div className='home-topbar__user'>
              <div className='home-topbar__avatar'>
                {(user.username || user.email || 'U')[0].toUpperCase()}
              </div>
              <span className='home-topbar__name'>{user.username || user.email}</span>
            </div>
          )}
          <button className='home-topbar__logout' onClick={onLogout}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* ── Hero ── */}
      <header className='hero'>
        <div className='hero-eyebrow'>
          <span className='eyebrow-dot' /> AI Interview Prep
        </div>
        <h1>
          Build confidence with <span>tailored interview reports</span> and a resume-ready plan.
        </h1>
        <p>
          Upload your resume, describe your experience, and generate a personalized
          interview preparation plan complete with technical and behavioral questions.
        </p>
      </header>

      {/* ── Generate Form ── */}
      <form className='home' onSubmit={handleSubmit}>
        <div className='left'>
          <div className='section-label'>
            <span className='icon'>📋</span>
            Job Description
            <span className='sep' />
          </div>
          <textarea
            placeholder='Paste the job description for the role you are targeting.'
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
          />
        </div>

        <div className='right'>
          <div className='input-group'>
            <div className='section-label'>
              <span className='icon'>📄</span>
              Resume Upload
              <span className='sep' />
            </div>
            <label className='file-drop'>
              <span>
                <strong className='file-btn'>Choose file</strong>
                <span className={`file-name ${resumeFile ? 'chosen' : ''}`}>{fileName}</span>
              </span>
              <input type='file' accept='.pdf,.doc,.docx' onChange={handleFileChange} />
            </label>
          </div>

          <div className='input-group' style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className='section-label'>
              <span className='icon'>✍️</span>
              Self Description
              <span className='sep' />
            </div>
            <textarea
              style={{ flex: 1, minHeight: 0 }}
              placeholder='Summarize your experience, strengths, and what you bring to the role.'
              value={selfDescription}
              onChange={(event) => setSelfDescription(event.target.value)}
            />
          </div>

          <div className='tip-line'>
            <span className='tip-badge'>Tip</span>
            Use a concise resume with achievements and technologies relevant to the role.
          </div>

          <button type='submit' className='button primary-button' disabled={!canGenerate}>
            {loading ? (
              <>
                <span className='btn-spinner' />
                Generating...
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                Generate Interview Report
              </>
            )}
          </button>

          {error && (
            <p className='form-error'>
              ⚠ {error?.message || 'Unable to generate interview report.'}
            </p>
          )}
        </div>
      </form>

      {/* ── Recent Reports ── */}
      <section className='reports-section'>
        <div className='reports-section__header'>
          <div className='section-label' style={{ marginBottom: 0 }}>
            <span className='icon'>📂</span>
            Recent Reports
            <span className='sep' />
          </div>
          {reports && reports.length > 0 && (
            <span className='reports-count'>{reports.length} report{reports.length !== 1 ? 's' : ''}</span>
          )}
        </div>

        {reports && reports.length > 0 ? (
          <div className='reports-grid'>
            {reports.map((report) => {
              const id = report._id || report.id
              const score = report.matchScore ?? null
              const scoreClass = score !== null
                ? score >= 80 ? 'score--high' : score >= 60 ? 'score--mid' : 'score--low'
                : ''
              return (
                <div
                  key={id}
                  className='report-card'
                  onClick={() => navigate(`/interview/${id}`)}
                >
                  <div className='report-card__top'>
                    <div className='report-card__icon'>📊</div>
                    {score !== null && (
                      <span className={`report-card__score ${scoreClass}`}>
                        {score}% match
                      </span>
                    )}
                  </div>
                  <p className='report-card__title'>
                    {report.title || `Report #${id.slice(-6)}`}
                  </p>
                  {report.createdAt && (
                    <p className='report-card__date'>{formatDate(report.createdAt)}</p>
                  )}
                  <div className='report-card__arrow'>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className='reports-empty'>
            <div className='reports-empty__icon'>🗂️</div>
            <p>No reports yet — fill in the form above and generate your first one.</p>
          </div>
        )}
      </section>

    </div>
  )
}

export default Home
