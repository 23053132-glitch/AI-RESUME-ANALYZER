import { useState } from 'react';

export function useVoiceQA(resumeText) {
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');

  const askAI = async (question) => {
    const res = await fetch(`http://localhost:3000/api/interview/voice-qa`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ question, resumeText })
    });
    const data = await res.json();
    if (!data.answer) throw new Error(data.error || 'No answer');
    return data.answer;
  };

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.95;
    utter.pitch = 1;
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition not supported. Use Chrome.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = async (e) => {
      const question = e.results[0][0].transcript;
      setTranscript(question);
      try {
        const answer = await askAI(question);
        setResponse(answer);
        speak(answer);
      } catch (err) {
        console.error('AI error:', err);
        setResponse('Sorry, could not get a response.');
      }
    };
    recognition.onerror = (e) => {
      console.error('Speech error:', e.error);
      setListening(false);
    };
    recognition.start();
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  return { listening, speaking, transcript, response, startListening, stopSpeaking };
}