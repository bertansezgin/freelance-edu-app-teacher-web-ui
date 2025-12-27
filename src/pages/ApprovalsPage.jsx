import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setAuthenticated } from '../utils/auth'
import '../styles/common.css'
import './ApprovalsPage.css'

const MOCK_CONNECTION_REQUESTS = [
  {
    id: 'req-1',
    studentName: 'Ayşe Yılmaz',
    schoolName: 'Atatürk İlkokulu',
    gradeLabel: '4. Sınıf',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCl1PldJ9t9D_IcALJM59UFWAmysjJrD9wBaqBMjVgQCnRUhkIG8LMvU4BNmAoS2iwBIj3k7UeAOpMryf5Pmunh6Q10GEucZY6zlZZ2T9laKJRfS4kKBRu_k8IqkDY0zYJrK5VJsiXJWKg8hv-2n310HTYKKg1uovVqVoVQLlXMPI4qTx-ivVrBH5HDBaOkXkLlsY_-Iirk1OAGrByHkKyagjULDEADIM_1FFOuHoCtHd_F9epyV47RKUBakwT1eoAiK14__0mm_LA',
  },
  {
    id: 'req-2',
    studentName: 'Mehmet Kaya',
    schoolName: 'Cumhuriyet Ortaokulu',
    gradeLabel: '7. Sınıf',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAxKqEsOp058mKYwgQ1REogvaMKRaBLQBQBzOM_qpU0UuRIxWgms0uuwyAzmFvctRuVv7ltNVMmFynWYS83XBwrURW8iecFtGz8GM29bz3ngPwjwfUbI8hznezO0y1BhdQ-aFu_PKG3zSP4jDIyQrOeiAmSIvZUIgLbbiJXofK98QTELbzGtJHjKxlm7u9UNVGyg7PHGhBmm7shWbuhiPD-kKngKc8JFpI3xLur7yrSfS68GcPEcQiqY8FJODPIkcRavuwLg5T5lcU',
  },
  {
    id: 'req-3',
    studentName: 'Zeynep Demir',
    schoolName: 'Fatih Sultan Mehmet Lisesi',
    gradeLabel: '10. Sınıf',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAyfGaLx3zcr-YGWvc_9M89Kmx_YyqkonEKB4FREU_ifnfRJ9eTDL1QfW0flUlgyCuO0SCX3rB7Y7p_YYnQMf7IM79n7KqAR86keblxjVJdBOHYv5xSbDw2ukgVopp6smSiZTbq_olAiogWjeDSH8uVJU23POITeKk6NoOqjxMBjq9utHDH0pGI0OyxSKT6EHaQheRnx5NxFxp9Altg-fFPDK2Hnec6QSEUWG9-ABsggWjcaOsxdVKq4903xhgfPdDwmwK7YqtB5H4',
  },
  {
    id: 'req-4',
    studentName: 'Ali Veli',
    schoolName: 'Gazi Anadolu Lisesi',
    gradeLabel: '9. Sınıf',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBeYJOdL-19P58w_fjONoXcXgNqIJnSeiDo8wG-OdjX8JoOS4hkibRbXny17iSVhOX13Qz_pDotsIp0LDKLUEWeXixAbKWi4h45aYujpWB-hzYymTxOswsTY4LHhGQbvcP_i_yhhNjhl-oQZEwrNUWdQXvGauQ34x1DOfw0rl6YpzEQUoPxXvmfkcuWYVk3C_pEUUvcZSl1Yehs7RArt8gavs8gt3BwJr8vbs3ilTz_aXfy8fjL4D-SX7XtydDQiEuqVodwR41zJeo',
  },
]

function ApprovalsPage() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState(MOCK_CONNECTION_REQUESTS)

  const subtitle = useMemo(() => {
    if (requests.length === 0) return 'Şu anda onay bekleyen bağlantı isteği yok.'
    return 'Onay bekleyen öğrenci bağlantı isteklerini buradan yönetebilirsiniz.'
  }, [requests.length])

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

  const handleReject = (requestId) => {
    // TODO(backend): call reject endpoint then update list
    setRequests((prev) => prev.filter((r) => r.id !== requestId))
  }

  const handleAccept = (requestId) => {
    // TODO(backend): call approve endpoint then update list
    setRequests((prev) => prev.filter((r) => r.id !== requestId))
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

          <button type="button" className="sidebar-link sidebar-link--active">
            <span className="material-symbols-outlined sidebar-link__icon fill" aria-hidden="true">
              person_add
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
        <div className="approvals-page">
          <header className="approvals-header">
            <div className="approvals-header__content">
              <h1 className="approvals-title">Öğrenci Bağlantı İstekleri</h1>
              <p className="approvals-subtitle">{subtitle}</p>
            </div>
          </header>

          <div className="approvals-list" role="list">
            {requests.map((req) => (
              <div key={req.id} className="approvals-card" role="listitem">
                <div className="approvals-card__left">
                  <div
                    className="approvals-avatar"
                    style={{ backgroundImage: `url('${req.avatarUrl}')` }}
                    aria-hidden="true"
                  />
                  <div className="approvals-card__text">
                    <div className="approvals-student-name">{req.studentName}</div>
                    <div className="approvals-student-meta">
                      {req.schoolName}, {req.gradeLabel}
                    </div>
                  </div>
                </div>

                <div className="approvals-card__actions">
                  <button type="button" className="approvals-btn approvals-btn--reject" onClick={() => handleReject(req.id)}>
                    Reddet
                  </button>
                  <button type="button" className="approvals-btn approvals-btn--accept" onClick={() => handleAccept(req.id)}>
                    Kabul Et
                  </button>
                </div>
              </div>
            ))}

            {requests.length === 0 && (
              <div className="approvals-empty">
                <div className="approvals-empty__icon" aria-hidden="true">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
                <div className="approvals-empty__title">Tüm istekler yanıtlandı</div>
                <div className="approvals-empty__text">Yeni bir öğrenci bağlantı isteği geldiğinde burada görünecek.</div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default ApprovalsPage


