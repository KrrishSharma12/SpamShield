import React, { useState, useRef, useEffect } from 'react'
import './App.css'

const App = () => {
  const [message, setMessage] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [stats, setStats] = useState({ total: 0, spam: 0, legitimate: 0 })
  const [error, setError] = useState('')
  const messageInputRef = useRef(null)

  // Fetch stats from localStorage
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('spamHistory') || '[]')
    setHistory(savedHistory)
    if (savedHistory.length > 0) {
      const spamCount = savedHistory.filter(h => h.result === 'Spam').length
      setStats({
        total: savedHistory.length,
        spam: spamCount,
        legitimate: savedHistory.length - spamCount
      })
    }
  }, [])

  const handleDetect = async (e) => {
    e.preventDefault()
    if (!message.trim()) {
      setError('Please enter a message to check')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: message })
      })

      if (!response.ok) throw new Error('Detection failed')
      
      const data = await response.json()
      const isSpam = data.result === 'Spam'
      
      setResult({
        text: message,
        result: data.result,
        isSpam: isSpam,
        timestamp: new Date().toLocaleTimeString()
      })

      // Update history
      const newHistory = [
        { text: message, result: data.result, isSpam: isSpam, timestamp: new Date().toLocaleTimeString() },
        ...history
      ].slice(0, 10)
      
      setHistory(newHistory)
      localStorage.setItem('spamHistory', JSON.stringify(newHistory))

      // Update stats
      setStats({
        total: stats.total + 1,
        spam: stats.spam + (isSpam ? 1 : 0),
        legitimate: stats.legitimate + (isSpam ? 0 : 1)
      })

      setMessage('')
    } catch (err) {
      setError('Failed to connect to the server. Make sure the backend is running on http://localhost:8000')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const clearHistory = () => {
    setHistory([])
    setStats({ total: 0, spam: 0, legitimate: 0 })
    localStorage.removeItem('spamHistory')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-8 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-slate-700/50 backdrop-blur-md bg-slate-900/30">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  SpamShield
                </h1>
                <p className="text-slate-400 mt-2">AI-Powered Spam Detection</p>
              </div>
              <div className="text-right">
                <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                  <p className="text-slate-300 text-sm">
                    <span className="font-semibold text-blue-400">{stats.total}</span> Messages Analyzed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Detector */}
            <div className="lg:col-span-2 space-y-8">
              {/* Detection Card */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition duration-1000"></div>
                <div className="relative backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8 hover:border-slate-600/80 transition">
                  <h2 className="text-2xl font-bold text-white mb-6">Check Your Message</h2>
                  
                  <form onSubmit={handleDetect} className="space-y-4">
                    <div className="relative">
                      <textarea
                        ref={messageInputRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                        maxLength={500}
                        placeholder="Paste your message here to check if it's spam..."
                        className="w-full px-6 py-4 bg-slate-900/50 border border-slate-600/50 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white placeholder-slate-500 resize-none focus:outline-none transition min-h-[120px]"
                        disabled={loading}
                      />
                      <div className="absolute top-3 right-3 text-slate-500 text-sm">
                        {message.length}/500
                      </div>
                    </div>

                    {error && (
                      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <span>🔍</span> Detect Spam
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Result Card */}
              {result && (
                <div className={`group relative backdrop-blur-xl rounded-2xl p-8 border transition transform animate-in fade-in slide-in-from-bottom-4 ${
                  result.isSpam 
                    ? 'bg-red-500/10 border-red-500/30 hover:border-red-500/50' 
                    : 'bg-green-500/10 border-green-500/30 hover:border-green-500/50'
                }`}>
                  <div className="flex items-start gap-4">
                    <div className={`text-4xl ${result.isSpam ? 'animate-pulse' : ''}`}>
                      {result.isSpam ? '🚫' : '✅'}
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-2xl font-bold ${result.isSpam ? 'text-red-400' : 'text-green-400'}`}>
                        {result.result === 'Spam' ? 'Spam Detected!' : 'Legitimate Message'}
                      </h3>
                      <p className="text-slate-300 mt-2 text-sm break-words">
                        "{result.text}"
                      </p>
                      <p className="text-slate-500 text-xs mt-2">
                        Checked at {result.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Featured Info Section */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition duration-1000"></div>
                <div className="relative backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-white mb-6">✨ Features</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">⚡</span>
                      <div>
                        <p className="font-semibold text-white">Instant Detection</p>
                        <p className="text-slate-400 text-sm">Real-time spam analysis</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🤖</span>
                      <div>
                        <p className="font-semibold text-white">AI-Powered</p>
                        <p className="text-slate-400 text-sm">Machine learning models</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">📊</span>
                      <div>
                        <p className="font-semibold text-white">Analytics</p>
                        <p className="text-slate-400 text-sm">Track your history</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🔒</span>
                      <div>
                        <p className="font-semibold text-white">Privacy First</p>
                        <p className="text-slate-400 text-sm">Local data storage</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Stats & History */}
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="space-y-4">
                {/* Total */}
                <div className="backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-xl p-6 hover:border-blue-500/50 transition">
                  <div className="text-sm text-slate-400 mb-2">Total Checked</div>
                  <div className="text-3xl font-bold text-blue-400">{stats.total}</div>
                  <div className="text-xs text-slate-500 mt-2">📈 Messages analyzed</div>
                </div>

                {/* Spam */}
                <div className="backdrop-blur-xl bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/30 rounded-xl p-6 hover:border-red-500/50 transition">
                  <div className="text-sm text-slate-400 mb-2">Spam Detected</div>
                  <div className="text-3xl font-bold text-red-400">{stats.spam}</div>
                  <div className="text-xs text-slate-500 mt-2">
                    {stats.total > 0 ? `${Math.round(stats.spam / stats.total * 100)}%` : '0%'} of total
                  </div>
                </div>

                {/* Legitimate */}
                <div className="backdrop-blur-xl bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-xl p-6 hover:border-green-500/50 transition">
                  <div className="text-sm text-slate-400 mb-2">Legitimate</div>
                  <div className="text-3xl font-bold text-green-400">{stats.legitimate}</div>
                  <div className="text-xs text-slate-500 mt-2">
                    {stats.total > 0 ? `${Math.round(stats.legitimate / stats.total * 100)}%` : '0%'} of total
                  </div>
                </div>
              </div>

              {/* History */}
              <div className="backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/80 transition">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">📋 Recent Checks</h3>
                  {history.length > 0 && (
                    <button
                      onClick={clearHistory}
                      className="text-xs px-3 py-1 rounded-full bg-slate-700/50 hover:bg-slate-600 text-slate-300 transition"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {history.length === 0 ? (
                    <p className="text-slate-500 text-sm text-center py-8">No history yet</p>
                  ) : (
                    history.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg text-sm border transition ${
                          item.isSpam
                            ? 'bg-red-500/10 border-red-500/30 hover:border-red-500/50'
                            : 'bg-green-500/10 border-green-500/30 hover:border-green-500/50'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span>{item.isSpam ? '🚫' : '✅'}</span>
                          <span className={item.isSpam ? 'text-red-400' : 'text-green-400'} style={{ fontSize: '0.75rem' }}>
                            {item.result}
                          </span>
                        </div>
                        <p className="text-slate-300 truncate text-xs">
                          {item.text}
                        </p>
                        <p className="text-slate-500 text-xs mt-1">{item.timestamp}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-700/50 backdrop-blur-md bg-slate-900/30 mt-12">
          <div className="max-w-6xl mx-auto px-6 py-6 text-center text-slate-400 text-sm">
            <p>SpamShield © 2025 | AI-Powered Spam Detection</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App
