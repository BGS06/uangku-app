import { useState } from 'react'
import { supabase } from './supabaseClient'
import './Auth.css'

function Login() {
  const [mode, setMode] = useState('login') // 'login' | 'signup' | 'forgot'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null) // { type: 'error' | 'success', text }

  const resetMessage = () => setMessage(null)

  const switchMode = (newMode) => {
    resetMessage()
    setPassword('')
    setConfirmPassword('')
    setMode(newMode)
  }

  const handleGoogleLogin = async () => {
    resetMessage()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })
    if (error) setMessage({ type: 'error', text: error.message })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    resetMessage()
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)
    if (error) setMessage({ type: 'error', text: 'Email atau password salah.' })
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    resetMessage()

    if (password.length < 6) {
      return setMessage({ type: 'error', text: 'Password minimal 6 karakter.' })
    }
    if (password !== confirmPassword) {
      return setMessage({ type: 'error', text: 'Konfirmasi password tidak cocok.' })
    }

    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({
        type: 'success',
        text: 'Akun berhasil dibuat! Cek email kamu untuk verifikasi sebelum masuk.',
      })
      setMode('login')
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    resetMessage()
    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    })

    setLoading(false)
    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({
        type: 'success',
        text: 'Link reset password sudah dikirim ke email kamu.',
      })
    }
  }

  const handleSubmit =
    mode === 'login' ? handleLogin : mode === 'signup' ? handleSignup : handleForgotPassword

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>Keuanganku</h1>
        <p>{mode === 'forgot' ? 'Reset password akunmu' : 'Masuk untuk mulai mencatat'}</p>
      </div>

      <div className="auth-card">
        {mode !== 'forgot' && (
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => switchMode('login')}
            >
              Masuk
            </button>
            <button
              type="button"
              className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
              onClick={() => switchMode('signup')}
            >
              Daftar
            </button>
          </div>
        )}

        {message && <div className={`auth-message ${message.type}`}>{message.text}</div>}

        {mode !== 'forgot' && (
          <>
            <button type="button" className="btn-google" onClick={handleGoogleLogin}>
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z" />
                <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18z" />
                <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03l2.99-2.33z" />
                <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58z" />
              </svg>
              Lanjutkan dengan Google
            </button>

            <div className="auth-divider">
              <span>atau</span>
            </div>
          </>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="clean-input"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {mode !== 'forgot' && (
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="clean-input"
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          )}

          {mode === 'signup' && (
            <div className="form-group">
              <label className="form-label">Konfirmasi Password</label>
              <input
                type="password"
                className="clean-input"
                placeholder="Ulangi password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          )}

          {mode === 'login' && (
            <button type="button" className="auth-link" onClick={() => switchMode('forgot')}>
              Lupa password?
            </button>
          )}

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading
              ? 'Memproses...'
              : mode === 'login'
              ? 'Masuk'
              : mode === 'signup'
              ? 'Buat Akun'
              : 'Kirim Link Reset'}
          </button>

          {mode === 'forgot' && (
            <button
              type="button"
              className="auth-link auth-link-center"
              onClick={() => switchMode('login')}
            >
              &larr; Kembali ke halaman masuk
            </button>
          )}
        </form>
      </div>
    </div>
  )
}

export default Login