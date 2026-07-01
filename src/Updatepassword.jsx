import { useState } from 'react'
import { supabase } from './supabaseClient'
import './Auth.css'

function UpdatePassword({ onDone }) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)

    if (password.length < 6) {
      return setMessage({ type: 'error', text: 'Password minimal 6 karakter.' })
    }
    if (password !== confirmPassword) {
      return setMessage({ type: 'error', text: 'Konfirmasi password tidak cocok.' })
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Password berhasil diubah. Mengarahkan ke halaman masuk...' })
      setTimeout(() => onDone(), 1500)
    }
  }

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>Keuanganku</h1>
        <p>Buat password baru</p>
      </div>

      <div className="form-section auth-card">
        {message && <div className={`auth-message ${message.type}`}>{message.text}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Password Baru</label>
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

          <div className="form-group">
            <label className="form-label">Konfirmasi Password Baru</label>
            <input
              type="password"
              className="clean-input"
              placeholder="Ulangi password baru"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default UpdatePassword