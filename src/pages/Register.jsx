import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/common.css'
import './Register.css'

function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Kayıt işlemi
    console.log('Register:', formData)
  }

  const handleLoginClick = () => {
    navigate('/login')
  }

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-content">
          <div className="auth-icon">
            <span className="material-symbols-outlined">person_add</span>
          </div>

          <div className="auth-card">
            <h1 className="auth-title">Öğretmen Kaydı</h1>
            <p className="auth-subtitle">Hesap oluşturun ve öğrencilerinizi yönetin</p>

            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label className="form-label">Ad Soyad</label>
                <input
                  type="text"
                  name="fullName"
                  className="form-input"
                  placeholder="Adınız ve soyadınız"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">E-posta</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="ornek@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Şifre</label>
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  placeholder="En az 6 karakter"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Şifre Tekrar</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-input"
                  placeholder="Şifrenizi tekrar girin"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Kayıt Ol
              </button>
            </form>

            <div className="register-footer">
              <p className="link-text">
                Zaten hesabınız var mı?{' '}
                <span className="link" onClick={handleLoginClick}>
                  Giriş Yapın
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
