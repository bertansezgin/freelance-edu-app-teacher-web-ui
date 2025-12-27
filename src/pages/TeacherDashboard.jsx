import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { setAuthenticated } from '../utils/auth'
import '../styles/common.css'
import './TeacherDashboard.css'

function TeacherDashboard() {
  const navigate = useNavigate()

  const todayText = useMemo(() => {
    const formatted = new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date())

    return `Bugün: ${formatted}. Eğitim, dünyayı değiştirmek için kullanabileceğiniz en güçlü silahtır.`
  }, [])

  const handleLogout = () => {
    setAuthenticated(false)
    navigate('/login', { replace: true })
  }

  const handleQuickAction = (actionKey) => {
    switch (actionKey) {
      case 'schedule':
        navigate('/schedule')
        break
      case 'students':
        navigate('/students')
        break
      case 'homework':
        navigate('/homework')
        break
      case 'approvals':
        navigate('/approvals')
        break
      case 'settings':
        navigate('/settings')
        break
      case 'profile':
        navigate('/profile')
        break
      case 'groups':
        navigate('/groups')
        break
      case 'questionBank':
        navigate('/question-bank')
        break
      default:
        // TODO: ilgili sayfalara yönlendirme veya modal açma
        // eslint-disable-next-line no-console
        console.log('Quick action:', actionKey)
        break
    }
  }

  const handleStartLesson = (lessonKey) => {
    // TODO: ders ekranına yönlendirme
    // eslint-disable-next-line no-console
    console.log('Start lesson:', lessonKey)
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
          <button type="button" className="sidebar-link sidebar-link--active">
            <span className="material-symbols-outlined sidebar-link__icon fill" aria-hidden="true">
              home
            </span>
            <span className="sidebar-link__text">Ana Sayfa</span>
          </button>

          <button type="button" className="sidebar-link" onClick={() => navigate('/students')}>
            <span className="material-symbols-outlined sidebar-link__icon" aria-hidden="true">
              groups
            </span>
            <span className="sidebar-link__text">Öğrencilerim</span>
          </button>

          <button type="button" className="sidebar-link" onClick={() => navigate('/schedule')}>
            <span className="material-symbols-outlined sidebar-link__icon" aria-hidden="true">
              calendar_month
            </span>
            <span className="sidebar-link__text">Ders Programı</span>
          </button>

          <button type="button" className="sidebar-link" onClick={() => handleQuickAction('homework')}>
            <span className="material-symbols-outlined sidebar-link__icon" aria-hidden="true">
              campaign
            </span>
            <span className="sidebar-link__text">Ödevler &amp; Duyurular</span>
          </button>

          <button type="button" className="sidebar-link" onClick={() => handleQuickAction('approvals')}>
            <span className="material-symbols-outlined sidebar-link__icon" aria-hidden="true">
              check_circle
            </span>
            <span className="sidebar-link__text">İstek Onaylama</span>
          </button>

          <button type="button" className="sidebar-link" onClick={() => handleQuickAction('questionBank')}>
            <span className="material-symbols-outlined sidebar-link__icon" aria-hidden="true">
              folder
            </span>
            <span className="sidebar-link__text">Soru Bankası</span>
          </button>

          <button type="button" className="sidebar-link" onClick={() => handleQuickAction('groups')}>
            <span className="material-symbols-outlined sidebar-link__icon" aria-hidden="true">
              folder
            </span>
            <span className="sidebar-link__text">Gruplar</span>
          </button>

          <button type="button" className="sidebar-link" onClick={() => handleQuickAction('profile')}>
            <span className="material-symbols-outlined sidebar-link__icon" aria-hidden="true">
              person
            </span>
            <span className="sidebar-link__text">Profil</span>
          </button>

          <button type="button" className="sidebar-link" onClick={() => handleQuickAction('settings')}>
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
        <header className="dashboard-header">
          <h1 className="dashboard-title">Hoş Geldiniz, Öğretmen</h1>
          <p className="dashboard-subtitle">{todayText}</p>
        </header>

        <section className="dashboard-grid" aria-label="Öne çıkanlar">
          <div className="dashboard-col dashboard-col--wide">
            <div className="dashboard-card">
              <div className="dashboard-card__header">
                <h2 className="dashboard-card__title">Bugünkü Dersler</h2>
              </div>

              <div className="lesson-list">
                <div className="lesson-item">
                  <div className="lesson-item__left">
                    <div className="lesson-item__icon" aria-hidden="true">
                      <span className="material-symbols-outlined">calculate</span>
                    </div>
                    <div className="lesson-item__content">
                      <div className="lesson-item__title">10:00 - Matematik (10-A)</div>
                      <div className="lesson-item__meta">Konu: Cebirsel İfadeler</div>
                    </div>
                  </div>
                  <button type="button" className="lesson-item__action" onClick={() => handleStartLesson('math-10')}>
                    Derse Başla
                  </button>
                </div>

                <div className="lesson-item">
                  <div className="lesson-item__left">
                    <div className="lesson-item__icon" aria-hidden="true">
                      <span className="material-symbols-outlined">square_foot</span>
                    </div>
                    <div className="lesson-item__content">
                      <div className="lesson-item__title">11:00 - Geometri (11-B)</div>
                      <div className="lesson-item__meta">Konu: Üçgenler</div>
                    </div>
                  </div>
                  <button type="button" className="lesson-item__action" onClick={() => handleStartLesson('geometry-11')}>
                    Derse Başla
                  </button>
                </div>

                <div className="lesson-empty">
                  <p className="lesson-empty__text">Günün geri kalanında planlanmış dersiniz bulunmuyor.</p>
                </div>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-card__header">
                <h2 className="dashboard-card__title">Hızlı İşlemler</h2>
              </div>

              <div className="quick-actions" role="list">
                <button
                  type="button"
                  className="quick-action"
                  role="listitem"
                  onClick={() => handleQuickAction('newAnnouncement')}
                >
                  <span className="material-symbols-outlined quick-action__icon" aria-hidden="true">
                    campaign
                  </span>
                  <span className="quick-action__text">Yeni Duyuru</span>
                </button>

                <button type="button" className="quick-action" role="listitem" onClick={() => handleQuickAction('sendHomework')}>
                  <span className="material-symbols-outlined quick-action__icon" aria-hidden="true">
                    assignment
                  </span>
                  <span className="quick-action__text">Ödev Gönder</span>
                </button>
              </div>
            </div>
          </div>

          <div className="dashboard-col">
            <div className="dashboard-card">
              <div className="dashboard-card__header dashboard-card__header--between">
                <h2 className="dashboard-card__title">Son Duyurular</h2>
                <button type="button" className="dashboard-link" onClick={() => handleQuickAction('announcements')}>
                  Tümü
                </button>
              </div>

              <div className="announcement-list">
                <div className="announcement-item">
                  <div className="announcement-item__title">Okul Gezisi Hakkında Bilgilendirme</div>
                  <div className="announcement-item__time">2 gün önce</div>
                </div>

                <div className="announcement-divider" aria-hidden="true" />

                <div className="announcement-item">
                  <div className="announcement-item__title">Veli Toplantısı Tarihi</div>
                  <div className="announcement-item__time">5 gün önce</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default TeacherDashboard


