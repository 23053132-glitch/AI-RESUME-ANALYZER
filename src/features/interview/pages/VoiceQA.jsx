/*
import { useParams, useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import { useVoiceQA } from '../hooks/useVoiceQA'

export default function VoiceQA() {
  const { interviewId } = useParams()
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  const [fetchError, setFetchError] = useState(null)

  useEffect(() => {
    fetch(`http://localhost:3000/api/interview/report/${interviewId}`, {
      credentials: 'include'
    })
      .then(r => r.json())
      .then(data => {
        console.log('Report loaded:', data)
        setReport(data)
      })
      .catch(err => {
        console.error('Fetch error:', err)
        setFetchError(err.message)
      })
  }, [interviewId])

  const { listening, speaking, transcript, response, startListening, stopSpeaking } =
    useVoiceQA(report ? JSON.stringify(report) : '')

  return (
    <div className="voice-page">
      <button
        style={{ alignSelf: 'flex-start', marginBottom: '1rem' }}
        className="iv-back-btn"
        onClick={() => navigate(`/interview/${interviewId}`)}
      >
        ← Back to Report
      </button>

      <h2>🎤 Ask About Your Resume</h2>

      {!report && !fetchError && <p className="voice-status">Loading report...</p>}
      {fetchError && <p className="voice-status" style={{ color: '#ff4d4d' }}>Error: {fetchError}</p>}

      <button
        className={`voice-orb ${listening ? 'voice-orb--listening' : ''} ${speaking ? 'voice-orb--speaking' : ''}`}
        onClick={startListening}
        disabled={listening || speaking || !report}
      >
        {listening ? '👂' : speaking ? '🔊' : '🎤'}
      </button>

      <p className="voice-status">
        {!report ? 'Waiting for report...' : listening ? 'Listening...' : speaking ? 'Speaking...' : 'Tap to ask a question'}
      </p>

      {speaking && (
        <button className="voice-stop-btn" onClick={stopSpeaking}>
          ⏹ Stop
        </button>
      )}

      {transcript && (
        <div className="voice-transcript">
          <p><strong>You:</strong> {transcript}</p>
        </div>
      )}

      {response && (
        <div className="voice-response">
          <p><strong>AI:</strong> {response}</p>
        </div>
      )}
    </div>
  )
}*/
import { useParams, useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import { useVoiceQA } from '../hooks/useVoiceQA'

export default function VoiceQA() {
  const { interviewId } = useParams()
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  const [fetchError, setFetchError] = useState(null)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/interview/report/${interviewId}`, {
      credentials: 'include'
    })
      .then(r => r.json())
      .then(data => {
        console.log('Report loaded:', data)
        setReport(data)
      })
      .catch(err => {
        console.error('Fetch error:', err)
        setFetchError(err.message)
      })
  }, [interviewId])

  const { listening, speaking, transcript, response, startListening, stopSpeaking } =
    useVoiceQA(report ? JSON.stringify(report) : '')

  return (
    <div className="voice-page">
      <button
        style={{ alignSelf: 'flex-start', marginBottom: '1rem' }}
        className="iv-back-btn"
        onClick={() => navigate(`/interview/${interviewId}`)}
      >
        ← Back to Report
      </button>

      <h2>🎤 Ask About Your Resume</h2>

      {!report && !fetchError && <p className="voice-status">Loading report...</p>}
      {fetchError && <p className="voice-status" style={{ color: '#ff4d4d' }}>Error: {fetchError}</p>}

      <button
        className={`voice-orb ${listening ? 'voice-orb--listening' : ''} ${speaking ? 'voice-orb--speaking' : ''}`}
        onClick={startListening}
        disabled={listening || speaking || !report}
      >
        {listening ? '👂' : speaking ? '🔊' : '🎤'}
      </button>

      <p className="voice-status">
        {!report ? 'Waiting for report...' : listening ? 'Listening...' : speaking ? 'Speaking...' : 'Tap to ask a question'}
      </p>

      {speaking && (
        <button className="voice-stop-btn" onClick={stopSpeaking}>
          ⏹ Stop
        </button>
      )}

      {transcript && (
        <div className="voice-transcript">
          <p><strong>You:</strong> {transcript}</p>
        </div>
      )}

      {response && (
        <div className="voice-response">
          <p><strong>AI:</strong> {response}</p>
        </div>
      )}
    </div>
  )
}