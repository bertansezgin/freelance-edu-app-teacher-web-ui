import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setAuthenticated } from '../utils/auth'
import '../styles/common.css'
import './SettingsPage.css'

const CURRENT_USER_ID = '123456789'

function SettingsPage() {
  const navigate = useNavigate()
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleLogout = () => {
    setAuthenticated(false)
    navigate('/login', { replace: true })
  }

  const handleNavigation = (page) => {
    switch (page) {
      case 'home':
        navigate('/dashboard')
        break
      case 'students':
        navigate('/students')
        break
      case 'studentAnalytics':
        navigate('/student-analytics')
        break
      case 'materials':
        navigate('/materials')
        break
      case 'schedule':
        navigate('/schedule')
        break
      case 'homework':
        navigate('/homework')
        break
      case 'approvals':
        navigate('/approvals')
        break
      case 'questionBank':
        navigate('/question-bank')
        break
      case 'groups':
        navigate('/groups')
        break
      case 'profile':
        navigate('/profile')
        break
      case 'settings':
        navigate('/settings')
        break
      default:
        break
    }
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Yeni şifreler eşleşmiyor!')
      return
    }

    if (passwordForm.newPassword.length < 6) {
      alert('Şifre en az 6 karakter olmalıdır!')
      return
    }

    // TODO: Şifre değiştirme API çağrısı
    console.log('Şifre değiştirme:', {
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    })

    alert('Şifre başarıyla değiştirildi!')
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
  }

  const handleIdUpdateRequest = () => {
    // TODO: ID güncelleme talebi API çağrısı
    console.log('ID güncelleme talebi gönderildi')
    alert('ID güncelleme talebiniz başarıyla gönderildi. En kısa sürede yanıt vereceğiz.')
  }

  return (
    <div className="layout-shell">
      <aside className="layout-sidebar" aria-label="Ana menü">
        <div className="sidebar-brand">
          <div className="sidebar-brand__icon" aria-hidden="true">
            <span className="material-symbols-outlined">school</span>
          </div>
          <div className="sidebar-brand__text">
            <div className="sidebar-brand__title">EduTech</div>
            <div className="sidebar-brand__subtitle">Öğretmen Paneli</div>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Sayfalar">
          <button type="button" className="sidebar-link" onClick={() => handleNavigation('home')}>
            <span className="material-symbols-outlined sidebar-link__icon" aria-hidden="true">
              home
            </span>
            <span className="sidebar-link__text">Ana Sayfa</span>
          </button>

          <button type="button" className="sidebar-link" onClick={() => handleNavigation('students')}>
            <span className="material-symbols-outlined sidebar-link__icon" aria-hidden="true">
              groups
            </span>
            <span className="sidebar-link__text">Öğrencilerim</span>
          </button>

          <button type="button" className="sidebar-link" onClick={() => handleNavigation('studentAnalytics')}>
            <span className="material-symbols-outlined sidebar-link__icon" aria-hidden="true">
              bar_chart
            </span>
            <span className="sidebar-link__text">Öğrenci Analizi</span>
          </button>

          <button type="button" className="sidebar-link" onClick={() => handleNavigation('materials')}>
            <span className="material-symbols-outlined sidebar-link__icon" aria-hidden="true">
              folder_open
            </span>
            <span className="sidebar-link__text">Ders Materyallerim</span>
          </button>

          <button type="button" className="sidebar-link" onClick={() => handleNavigation('schedule')}>
            <span className="material-symbols-outlined sidebar-link__icon" aria-hidden="true">
              calendar_month
            </span>
            <span className="sidebar-link__text">Ders Programı</span>
          </button>

          <button type="button" className="sidebar-link" onClick={() => handleNavigation('homework')}>
            <span className="material-symbols-outlined sidebar-link__icon" aria-hidden="true">
              campaign
            </span>
            <span className="sidebar-link__text">Ödevler &amp; Duyurular</span>
          </button>

          <button type="button" className="sidebar-link" onClick={() => handleNavigation('approvals')}>
            <span className="material-symbols-outlined sidebar-link__icon" aria-hidden="true">
              check_circle
            </span>
            <span className="sidebar-link__text">İstek Onaylama</span>
          </button>

          <button type="button" className="sidebar-link" onClick={() => handleNavigation('questionBank')}>
            <span className="material-symbols-outlined sidebar-link__icon" aria-hidden="true">
              folder
            </span>
            <span className="sidebar-link__text">Soru Bankası</span>
          </button>

          <button type="button" className="sidebar-link" onClick={() => handleNavigation('groups')}>
            <span className="material-symbols-outlined sidebar-link__icon" aria-hidden="true">
              folder
            </span>
            <span className="sidebar-link__text">Gruplar</span>
          </button>

          <button type="button" className="sidebar-link" onClick={() => handleNavigation('profile')}>
            <span className="material-symbols-outlined sidebar-link__icon" aria-hidden="true">
              person
            </span>
            <span className="sidebar-link__text">Profil</span>
          </button>

          <button type="button" className="sidebar-link sidebar-link--active">
            <span className="material-symbols-outlined sidebar-link__icon" aria-hidden="true">
              settings
            </span>
            <span className="sidebar-link__text">Ayarlar</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button type="button" className="sidebar-link sidebar-link--danger" onClick={handleLogout}>
            <span className="material-symbols-outlined sidebar-link__icon" aria-hidden="true">
              logout
            </span>
            <span className="sidebar-link__text">Çıkış Yap</span>
          </button>
        </div>
      </aside>

      <main className="layout-main">
        <div className="settings-page">
          <div className="settings-container">
            <header className="settings-header">
              <div className="settings-header__content">
              <h1 className="settings-title">Ayarlar</h1>
              <p className="settings-subtitle">Uygulama deneyiminizi kişiselleştirmek için tercihlerinizi yönetin.</p>
              </div>
            </header>

            <div className="settings-content">
            <section className="settings-section">
              <h2 className="settings-section__title">Şifre Değiştirme</h2>
              <div className="settings-card">
                <form onSubmit={handlePasswordSubmit} className="settings-password-form">
                  <div className="settings-form-field">
                    <label htmlFor="current-password" className="settings-form-label">
                      Mevcut Şifre
                    </label>
                    <input
                      id="current-password"
                      type="password"
                      className="settings-form-input"
                      placeholder="••••••••"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="settings-form-field">
                    <label htmlFor="new-password" className="settings-form-label">
                      Yeni Şifre
                    </label>
                    <input
                      id="new-password"
                      type="password"
                      className="settings-form-input"
                      placeholder="••••••••"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="settings-form-field">
                    <label htmlFor="confirm-password" className="settings-form-label">
                      Yeni Şifre Tekrar
                    </label>
                    <input
                      id="repeat-new-password"
                      type="password"
                      className="settings-form-input"
                      placeholder="••••••••"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="settings-form-actions">
                    <button type="submit" className="settings-submit-btn">
                      Kaydet
                    </button>
                  </div>
                </form>
              </div>
            </section>

            <section className="settings-section">
              <h2 className="settings-section__title">Kimlik Bilgileri</h2>
              <div className="settings-card">
                <div className="settings-identity-info">
                  <p className="settings-identity-text">
                    Mevcut Kullanıcı ID: <span className="settings-identity-id">{CURRENT_USER_ID}</span>
                  </p>
                </div>
                <div className="settings-identity-actions">
                  <button type="button" className="settings-id-update-btn" onClick={handleIdUpdateRequest}>
                    ID güncelleme talebi gönder
                  </button>
                </div>
              </div>
            </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SettingsPage
