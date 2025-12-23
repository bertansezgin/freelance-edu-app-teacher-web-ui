import { useState } from 'react'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Login işlemi
    console.log('Login:', { email, password })
  }

  const handleForgotPassword = () => {
    // TODO: Şifremi unuttum işlemi
    console.log('Şifremi unuttum')
  }

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-content">
          <div className="login-icon">
            <span className="material-symbols-outlined">auto_stories</span>
          </div>

          <div className="login-card">
            <h1 className="login-title">Öğretmen Girişi</h1>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label className="form-label">E-posta</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="E-postanızı girin"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                />
              </div>

              <button type="submit" className="login-button">
                Giriş Yap
              </button>
            </form>

            <p className="forgot-password" onClick={handleForgotPassword}>
              Şifremi Unuttum?
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
