import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setAuthenticated } from '../utils/auth'
import '../styles/common.css'
import './Login.css'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Login işlemi
    console.log('Login:', { email, password })
    setAuthenticated(true)
    navigate('/dashboard', { replace: true })
  }

  const handleForgotPassword = () => {
    // TODO: Şifremi unuttum işlemi
    console.log('Şifremi unuttum')
  }

  const handleRegisterClick = () => {
    navigate('/register')
  }

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-content">
          <div className="auth-icon">
            <span className="material-symbols-outlined">auto_stories</span>
          </div>

          <div className="auth-card">
            <div className="login-title-wrapper">
              <h1 className="auth-title">Öğretmen Girişi</h1>
            </div>

            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label className="form-label">E-posta</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="E-postanızı girin"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Şifre</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Şifrenizi girin"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Giriş Yap
              </button>
            </form>

            <div className="auth-footer">
              <button type="button" className="link" onClick={handleForgotPassword}>
                Şifremi Unuttum?
              </button>

              <p className="link-text">
                <span className="link" onClick={handleRegisterClick}>
                  Kayıt Olun
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
