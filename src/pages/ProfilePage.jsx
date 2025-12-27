import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setAuthenticated } from '../utils/auth'
import '../styles/common.css'
import './ProfilePage.css'

const MOCK_TEACHER_PROFILE = {
  firstName: 'Mehmet',
  lastName: 'Yılmaz',
  email: 'yilmaz.mehmet@ornek.com',
  userId: 'TCHR-MHM-YLMZ-1985',
  school: 'Atatürk Anadolu Lisesi',
  branch: 'Matematik',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzOgpnSB2lSVrALFV4OMKT_L6yyYpkCJT4IGuY_-XuDNYDGvEWjRaugM_hVuEzar_-OIo8BOHb7JPxejFxiY95vUAqOCWEqFMyKHU8i6falVceD8F6KpTNXimNPFf-RVTHUVsSiVm2RYg-YgqM6blsQB_mCDESg8o9psuFKnDwpMozTTN9lFWOpYoRqCdWtI2_i9mfSgBDWpfCBkcM1136QKVgcgZ9UfUh6z_DFb8h1wI7Xt6l-0OJIxcH6rk8kSBr2QHw12Dh9Yw',
}

function ProfilePage() {
  const navigate = useNavigate()
  const [profileForm, setProfileForm] = useState({
    firstName: MOCK_TEACHER_PROFILE.firstName,
    lastName: MOCK_TEACHER_PROFILE.lastName,
    email: MOCK_TEACHER_PROFILE.email,
    school: MOCK_TEACHER_PROFILE.school,
    branch: MOCK_TEACHER_PROFILE.branch,
  })

  const [hasChanges, setHasChanges] = useState(false)

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
        // TODO: Soru bankası sayfasına yönlendirme
        console.log('Navigate to question bank')
        break
      case 'groups':
        // TODO: Gruplar sayfasına yönlendirme
        console.log('Navigate to groups')
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

  const handleInputChange = (field, value) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleCancel = () => {
    setProfileForm({
      firstName: MOCK_TEACHER_PROFILE.firstName,
      lastName: MOCK_TEACHER_PROFILE.lastName,
      email: MOCK_TEACHER_PROFILE.email,
      school: MOCK_TEACHER_PROFILE.school,
      branch: MOCK_TEACHER_PROFILE.branch,
    })
    setHasChanges(false)
  }

  const handleSave = () => {
    // TODO: Profil güncelleme API çağrısı
    console.log('Profil güncelleme:', profileForm)
    alert('Profil bilgileri başarıyla güncellendi!')
    setHasChanges(false)
  }

  const handlePhotoChange = () => {
    // TODO: Fotoğraf yükleme işlemi
    console.log('Fotoğraf değiştirme')
    alert('Fotoğraf yükleme özelliği yakında eklenecek.')
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
              quiz
            </span>
            <span className="sidebar-link__text">Soru Bankası</span>
          </button>

          <button type="button" className="sidebar-link" onClick={() => handleNavigation('groups')}>
            <span className="material-symbols-outlined sidebar-link__icon" aria-hidden="true">
              folder
            </span>
            <span className="sidebar-link__text">Gruplar</span>
          </button>

          <button type="button" className="sidebar-link sidebar-link--active">
            <span className="material-symbols-outlined sidebar-link__icon" aria-hidden="true">
              person
            </span>
            <span className="sidebar-link__text">Profil</span>
          </button>

          <button type="button" className="sidebar-link" onClick={() => handleNavigation('settings')}>
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
        <div className="profile-page">
          <header className="profile-header">
            <div className="profile-header__content">
              <h1 className="profile-title">Profil</h1>
              <p className="profile-subtitle">Profil bilgilerinizi yönetin.</p>
            </div>
          </header>

          <div className="profile-container">
            {/* Avatar Card */}
            <div className="profile-avatar-card">
              <div className="profile-avatar-card__content">
                <div className="profile-avatar-wrapper">
                  <div
                    className="profile-avatar"
                    style={{ backgroundImage: `url('${MOCK_TEACHER_PROFILE.avatarUrl}')` }}
                    aria-label={`${MOCK_TEACHER_PROFILE.firstName} ${MOCK_TEACHER_PROFILE.lastName}'ın profil fotoğrafı`}
                  />
                </div>
                <div className="profile-avatar-info">
                  <h2 className="profile-name">{profileForm.firstName} {profileForm.lastName}</h2>
                  <p className="profile-email">{profileForm.email}</p>
                  <div className="profile-user-id">
                    <span className="material-symbols-outlined profile-user-id__icon" aria-hidden="true">vpn_key</span>
                    <span className="profile-user-id__text">ID: {MOCK_TEACHER_PROFILE.userId}</span>
                  </div>
                </div>
                <button type="button" className="profile-photo-btn" onClick={handlePhotoChange}>
                  Fotoğrafı Değiştir
                </button>
              </div>
            </div>

            {/* Personal Info Form */}
            <div className="profile-form-card">
              <h2 className="profile-form-title">Kişisel Bilgiler</h2>
              <form className="profile-form" onSubmit={(e) => { e.preventDefault(); handleSave() }}>
                <div className="profile-form-grid">
                  <div className="profile-form-field">
                    <label htmlFor="profile-firstname" className="profile-form-label">
                      Ad
                    </label>
                    <input
                      id="profile-firstname"
                      type="text"
                      className="profile-form-input"
                      value={profileForm.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                    />
                  </div>

                  <div className="profile-form-field">
                    <label htmlFor="profile-lastname" className="profile-form-label">
                      Soyadı
                    </label>
                    <input
                      id="profile-lastname"
                      type="text"
                      className="profile-form-input"
                      value={profileForm.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                    />
                  </div>

                  <div className="profile-form-field profile-form-field--full">
                    <label htmlFor="profile-email" className="profile-form-label">
                      E-posta
                    </label>
                    <input
                      id="profile-email"
                      type="email"
                      className="profile-form-input profile-form-input--readonly"
                      value={profileForm.email}
                      readOnly
                      aria-readonly="true"
                    />
                  </div>

                  <div className="profile-form-field">
                    <label htmlFor="profile-school" className="profile-form-label">
                      Okul
                    </label>
                    <input
                      id="profile-school"
                      type="text"
                      className="profile-form-input"
                      value={profileForm.school}
                      onChange={(e) => handleInputChange('school', e.target.value)}
                    />
                  </div>

                  <div className="profile-form-field">
                    <label htmlFor="profile-branch" className="profile-form-label">
                      Branş
                    </label>
                    <input
                      id="profile-branch"
                      type="text"
                      className="profile-form-input"
                      value={profileForm.branch}
                      onChange={(e) => handleInputChange('branch', e.target.value)}
                    />
                  </div>
                </div>

                <div className="profile-form-actions">
                  <button type="button" className="profile-form-btn profile-form-btn--cancel" onClick={handleCancel}>
                    İptal
                  </button>
                  <button type="submit" className="profile-form-btn profile-form-btn--save" disabled={!hasChanges}>
                    Değişiklikleri Kaydet
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProfilePage
