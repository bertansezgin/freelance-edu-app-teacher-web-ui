import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setAuthenticated } from '../utils/auth'
import '../styles/common.css'
import './HomeworkAnnouncementsPage.css'

const MOCK_HOMEWORKS = [
  {
    id: 1,
    title: 'Matematik Ödevi - Cebirsel İfadeler',
    className: '8-A',
    dueDate: '25.12.2024',
  },
  {
    id: 2,
    title: 'Fen Bilimleri Projesi',
    className: '7-C',
    dueDate: '15.01.2025',
  },
]

const MOCK_ANNOUNCEMENTS = [
  {
    id: 1,
    title: 'Veli Toplantısı Hatırlatması',
    className: 'Tüm Sınıflar',
    date: '20.12.2024',
  },
  {
    id: 2,
    title: 'Deneme Sınavı Programı Yayınlandı',
    className: '8-A',
    date: '23.12.2024',
  },
]

function HomeworkAnnouncementsPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('homeworks') // homeworks | announcements

  const items = useMemo(() => {
    return activeTab === 'homeworks' ? MOCK_HOMEWORKS : MOCK_ANNOUNCEMENTS
  }, [activeTab])

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
        // TODO: İstek onaylama sayfasına yönlendirme
        console.log('Navigate to approvals')
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
        // TODO: Profil sayfasına yönlendirme
        console.log('Navigate to profile')
        break
      case 'settings':
        // TODO: Ayarlar sayfasına yönlendirme
        console.log('Navigate to settings')
        break
      default:
        break
    }
  }

  const handleAdd = () => {
    // TODO: Ödev/Duyuru ekleme modalı
    console.log('Add', activeTab)
  }

  const handleEdit = (id) => {
    // TODO: Düzenleme modalı
    console.log('Edit', activeTab, id)
  }

  const handleDelete = (id) => {
    // TODO: Silme işlemi
    console.log('Delete', activeTab, id)
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

          <button type="button" className="sidebar-link sidebar-link--active">
            <span className="material-symbols-outlined sidebar-link__icon" aria-hidden="true">
              campaign
            </span>
            <span className="sidebar-link__text">Ödevler &amp; Duyurular</span>
          </button>

          <button type="button" className="sidebar-link" onClick={() => handleNavigation('approvals')}>
            <span className="material-symbols-outlined sidebar-link__icon" aria-hidden="true">
              task_alt
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
              workspaces
            </span>
            <span className="sidebar-link__text">Gruplar</span>
          </button>

          <button type="button" className="sidebar-link" onClick={() => handleNavigation('profile')}>
            <span className="material-symbols-outlined sidebar-link__icon" aria-hidden="true">
              person
            </span>
            <span className="sidebar-link__text">Profil</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button type="button" className="sidebar-link" onClick={() => handleNavigation('settings')}>
            <span className="material-symbols-outlined sidebar-link__icon" aria-hidden="true">
              settings
            </span>
            <span className="sidebar-link__text">Ayarlar</span>
          </button>
          <button type="button" className="sidebar-link sidebar-link--danger" onClick={handleLogout}>
            <span className="material-symbols-outlined sidebar-link__icon" aria-hidden="true">
              logout
            </span>
            <span className="sidebar-link__text">Çıkış Yap</span>
          </button>
        </div>
      </aside>

      <main className="layout-main">
        <div className="homework-page">
          <header className="homework-header">
            <h1 className="homework-title">Ödev &amp; Duyurular</h1>
            <p className="homework-subtitle">Sınıflarınız için ödevleri ve duyuruları buradan yönetin.</p>
          </header>

          <div className="homework-tabs" role="tablist" aria-label="Ödev ve duyuru sekmeleri">
            <button
              type="button"
              className={`homework-tab ${activeTab === 'homeworks' ? 'homework-tab--active' : ''}`}
              onClick={() => setActiveTab('homeworks')}
              role="tab"
              aria-selected={activeTab === 'homeworks'}
            >
              Ödevler
            </button>
            <button
              type="button"
              className={`homework-tab ${activeTab === 'announcements' ? 'homework-tab--active' : ''}`}
              onClick={() => setActiveTab('announcements')}
              role="tab"
              aria-selected={activeTab === 'announcements'}
            >
              Duyurular
            </button>
          </div>

          <div className="homework-list" role="list">
            {items.map((item) => (
              <div key={item.id} className="homework-card" role="listitem">
                <div className="homework-card__icon" aria-hidden="true">
                  <span className="material-symbols-outlined">assignment</span>
                </div>
                <div className="homework-card__content">
                  <div className="homework-card__title">{item.title}</div>
                  <div className="homework-card__meta">
                    {activeTab === 'homeworks'
                      ? `Sınıf: ${item.className} | Son Teslim: ${item.dueDate}`
                      : `Sınıf: ${item.className} | Tarih: ${item.date}`}
                  </div>
                </div>
                <div className="homework-card__actions">
                  <button
                    type="button"
                    className="homework-action-btn"
                    onClick={() => handleEdit(item.id)}
                    aria-label="Düzenle"
                    title="Düzenle"
                  >
                    <span className="material-symbols-outlined" aria-hidden="true">edit</span>
                  </button>
                  <button
                    type="button"
                    className="homework-action-btn homework-action-btn--danger"
                    onClick={() => handleDelete(item.id)}
                    aria-label="Sil"
                    title="Sil"
                  >
                    <span className="material-symbols-outlined" aria-hidden="true">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button type="button" className="homework-fab" onClick={handleAdd} aria-label="Ekle" title="Ekle">
            <span className="material-symbols-outlined" aria-hidden="true">add</span>
          </button>
        </div>
      </main>
    </div>
  )
}

export default HomeworkAnnouncementsPage


