import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setAuthenticated } from '../utils/auth'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import '../styles/common.css'
import './StudentAnalyticsPage.css'

// Mock öğrenci verisi
const MOCK_STUDENTS = [
  { id: 1, firstName: 'Ahmet', lastName: 'Yılmaz', school: 'Gazi Anadolu Lisesi', grade: '10. Sınıf' },
  { id: 2, firstName: 'Fatma', lastName: 'Kaya', school: 'Atatürk Fen Lisesi', grade: '11. Sınıf' },
  { id: 3, firstName: 'Mehmet', lastName: 'Demir', school: 'Cumhuriyet Ortaokulu', grade: '9. Sınıf' },
  { id: 4, firstName: 'Ayşe', lastName: 'Çelik', school: 'Fatih Sultan Mehmet İlkokulu', grade: '9. Sınıf' },
  { id: 5, firstName: 'Mustafa', lastName: 'Şahin', school: 'İnönü Mesleki ve Teknik Anadolu Lisesi', grade: '10. Sınıf' },
  { id: 6, firstName: 'Zeynep', lastName: 'Koç', school: 'Tepebaşı Anadolu Lisesi', grade: '11. Sınıf' },
  { id: 7, firstName: 'Ali', lastName: 'Öztürk', school: 'Gaziantep Anadolu Lisesi', grade: '9. Sınıf' },
  { id: 8, firstName: 'Elif', lastName: 'Yıldız', school: 'Şehitkamil Fen Lisesi', grade: '10. Sınıf' },
]

// Mock öğrenci analiz verisi - attığınız mobil UI'a benzer yapı
const MOCK_ANALYTICS = {
  1: {
    totalQuestions: 567,
    subjects: [
      {
        name: 'Matematik',
        totalQuestions: 85,
        percentage: 15,
        color: '#FF7070',
        topics: [
          { name: 'Cebirsel İfadeler', count: 31, percentage: 45 },
          { name: 'Denklemler', count: 20, percentage: 30 },
          { name: 'Problemler', count: 18, percentage: 25 },
        ],
      },
      {
        name: 'Fizik',
        totalQuestions: 68,
        percentage: 12,
        color: '#70D8D8',
        topics: [
          { name: 'Mekanik', count: 31, percentage: 45 },
          { name: 'Elektrik', count: 20, percentage: 30 },
          { name: 'Optik', count: 17, percentage: 25 },
        ],
      },
      {
        name: 'Kimya',
        totalQuestions: 57,
        percentage: 10,
        color: '#70A8FF',
        topics: [
          { name: 'Kimyasal Tepkimeler', count: 25, percentage: 44 },
          { name: 'Organik Kimya', count: 20, percentage: 35 },
          { name: 'Asitler ve Bazlar', count: 12, percentage: 21 },
        ],
      },
      {
        name: 'Biyoloji',
        totalQuestions: 51,
        percentage: 9,
        color: '#A0D870',
        topics: [
          { name: 'Hücre Biyolojisi', count: 22, percentage: 43 },
          { name: 'Genetik', count: 18, percentage: 35 },
          { name: 'Ekosistem', count: 11, percentage: 22 },
        ],
      },
      {
        name: 'Türkçe',
        totalQuestions: 92,
        percentage: 16,
        color: '#FFA070',
        topics: [
          { name: 'Paragraf', count: 35, percentage: 38 },
          { name: 'Dil Bilgisi', count: 30, percentage: 33 },
          { name: 'Sözcük', count: 27, percentage: 29 },
        ],
      },
      {
        name: 'Tarih',
        totalQuestions: 78,
        percentage: 14,
        color: '#D470E8',
        topics: [
          { name: 'Osmanlı Tarihi', count: 32, percentage: 41 },
          { name: 'Türkiye Cumhuriyeti', count: 26, percentage: 33 },
          { name: 'Dünya Tarihi', count: 20, percentage: 26 },
        ],
      },
      {
        name: 'Coğrafya',
        totalQuestions: 64,
        percentage: 11,
        color: '#FFE070',
        topics: [
          { name: 'Fiziki Coğrafya', count: 28, percentage: 44 },
          { name: 'Beşeri Coğrafya', count: 22, percentage: 34 },
          { name: 'Ekonomik Coğrafya', count: 14, percentage: 22 },
        ],
      },
      {
        name: 'İngilizce',
        totalQuestions: 72,
        percentage: 13,
        color: '#B8A0E8',
        topics: [
          { name: 'Grammar', count: 30, percentage: 42 },
          { name: 'Vocabulary', count: 25, percentage: 35 },
          { name: 'Reading', count: 17, percentage: 23 },
        ],
      },
    ],
  },
  2: {
    totalQuestions: 423,
    subjects: [
      {
        name: 'Matematik',
        totalQuestions: 120,
        percentage: 28,
        color: '#FF7070',
        topics: [
          { name: 'Fonksiyonlar', count: 45, percentage: 38 },
          { name: 'Türev', count: 40, percentage: 33 },
          { name: 'İntegral', count: 35, percentage: 29 },
        ],
      },
      {
        name: 'Fizik',
        totalQuestions: 98,
        percentage: 23,
        color: '#70D8D8',
        topics: [
          { name: 'Elektromanyetik', count: 40, percentage: 41 },
          { name: 'Modern Fizik', count: 35, percentage: 36 },
          { name: 'Dalgalar', count: 23, percentage: 23 },
        ],
      },
      {
        name: 'Kimya',
        totalQuestions: 85,
        percentage: 20,
        color: '#70A8FF',
        topics: [
          { name: 'Organik Kimya', count: 38, percentage: 45 },
          { name: 'Reaksiyonlar', count: 30, percentage: 35 },
          { name: 'Denge', count: 17, percentage: 20 },
        ],
      },
      {
        name: 'Biyoloji',
        totalQuestions: 120,
        percentage: 29,
        color: '#A0D870',
        topics: [
          { name: 'Moleküler Biyoloji', count: 50, percentage: 42 },
          { name: 'Evrim', count: 40, percentage: 33 },
          { name: 'Fizyoloji', count: 30, percentage: 25 },
        ],
      },
    ],
  },
  3: {
    totalQuestions: 289,
    subjects: [
      {
        name: 'Türkçe',
        totalQuestions: 110,
        percentage: 38,
        color: '#FFA070',
        topics: [
          { name: 'Okuma Anlama', count: 45, percentage: 41 },
          { name: 'Yazım Kuralları', count: 38, percentage: 35 },
          { name: 'Anlatım', count: 27, percentage: 24 },
        ],
      },
      {
        name: 'Matematik',
        totalQuestions: 95,
        percentage: 33,
        color: '#FF7070',
        topics: [
          { name: 'Geometri', count: 40, percentage: 42 },
          { name: 'Sayılar', count: 32, percentage: 34 },
          { name: 'Ölçme', count: 23, percentage: 24 },
        ],
      },
      {
        name: 'Fen Bilimleri',
        totalQuestions: 84,
        percentage: 29,
        color: '#70D8D8',
        topics: [
          { name: 'Madde ve Doğası', count: 35, percentage: 42 },
          { name: 'Canlılar', count: 28, percentage: 33 },
          { name: 'Dünya ve Evren', count: 21, percentage: 25 },
        ],
      },
    ],
  },
}

function StudentAnalyticsPage() {
  const navigate = useNavigate()
  const [selectedStudentId, setSelectedStudentId] = useState(null)
  const [selectedSubject, setSelectedSubject] = useState(null)

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

  const selectedStudent = useMemo(() => {
    return MOCK_STUDENTS.find((s) => s.id === selectedStudentId)
  }, [selectedStudentId])

  const analyticsData = useMemo(() => {
    if (!selectedStudentId) return null
    return MOCK_ANALYTICS[selectedStudentId] || null
  }, [selectedStudentId])

  const pieChartData = useMemo(() => {
    if (!analyticsData) return []
    return analyticsData.subjects.map((subject) => ({
      name: subject.name,
      value: subject.totalQuestions,
      percentage: subject.percentage,
      color: subject.color,
    }))
  }, [analyticsData])

  const selectedSubjectData = useMemo(() => {
    if (!analyticsData || !selectedSubject) return null
    return analyticsData.subjects.find((s) => s.name === selectedSubject)
  }, [analyticsData, selectedSubject])

  const handleStudentChange = (e) => {
    const studentId = parseInt(e.target.value)
    setSelectedStudentId(studentId || null)
    setSelectedSubject(null)
  }

  const handleSubjectClick = (subjectName) => {
    setSelectedSubject(subjectName)
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="analytics-chart-tooltip">
          <p className="analytics-chart-tooltip__label">{payload[0].name}</p>
          <p className="analytics-chart-tooltip__value">
            {payload[0].value} soru (%{payload[0].payload.percentage})
          </p>
        </div>
      )
    }
    return null
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

          <button type="button" className="sidebar-link sidebar-link--active">
            <span className="material-symbols-outlined sidebar-link__icon fill" aria-hidden="true">
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
        <div className="analytics-page">
          <header className="analytics-header">
            <div className="analytics-header__content">
              <h1 className="analytics-title">Öğrenci Analizi</h1>
              <p className="analytics-subtitle">
                Öğrencilerinizin soru kütüphanesi istatistiklerini görüntüleyin ve analiz edin.
              </p>
            </div>
          </header>

          <div className="analytics-student-select">
            <label htmlFor="student-select" className="analytics-student-select__label">
              <span className="material-symbols-outlined analytics-student-select__icon" aria-hidden="true">
                person
              </span>
              Öğrenci Seçin
            </label>
            <select
              id="student-select"
              className="analytics-student-select__input"
              value={selectedStudentId || ''}
              onChange={handleStudentChange}
            >
              <option value="">Bir öğrenci seçin...</option>
              {MOCK_STUDENTS.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.firstName} {student.lastName} - {student.grade}
                </option>
              ))}
            </select>
          </div>

          {!selectedStudentId && (
            <div className="analytics-empty">
              <div className="analytics-empty__icon" aria-hidden="true">
                <span className="material-symbols-outlined">person_search</span>
              </div>
              <h2 className="analytics-empty__title">Öğrenci Seçilmedi</h2>
              <p className="analytics-empty__text">
                Analiz verilerini görüntülemek için yukarıdan bir öğrenci seçin.
              </p>
            </div>
          )}

          {selectedStudentId && analyticsData && (
            <div className="analytics-content">
              {/* Daire Grafik Bölümü */}
              <div className="analytics-chart-section">
                <div className="analytics-chart-card">
                  <div className="analytics-chart-header">
                    <h2 className="analytics-chart-title">Toplam Soru Dağılımı</h2>
                    <div className="analytics-total-badge">
                      <span className="material-symbols-outlined" aria-hidden="true">
                        quiz
                      </span>
                      <span>{analyticsData.totalQuestions} soru</span>
                    </div>
                  </div>

                  <div className="analytics-chart-wrapper">
                    <ResponsiveContainer width="100%" height={320}>
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={110}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Ders Seçim Butonları */}
                <div className="analytics-subject-filter">
                  <h3 className="analytics-subject-filter__title">Ders Seçin</h3>
                  <div className="analytics-subject-filter__buttons">
                    {analyticsData.subjects.map((subject) => (
                      <button
                        key={subject.name}
                        type="button"
                        className={`analytics-subject-btn ${
                          selectedSubject === subject.name ? 'analytics-subject-btn--active' : ''
                        }`}
                        onClick={() => handleSubjectClick(subject.name)}
                        style={{
                          '--subject-color': subject.color,
                        }}
                      >
                        <span className="analytics-subject-btn__name">{subject.name}</span>
                        <span className="analytics-subject-btn__percentage">%{subject.percentage}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Konu Listesi */}
              {selectedSubject && selectedSubjectData && (
                <div className="analytics-topics-section">
                  <div className="analytics-topics-header">
                    <h2 className="analytics-topics-title">
                      {selectedSubject} Konuları
                    </h2>
                    <div className="analytics-topics-count">
                      {selectedSubjectData.totalQuestions} soru
                    </div>
                  </div>

                  <div className="analytics-topics-list">
                    {selectedSubjectData.topics.map((topic) => (
                      <div key={topic.name} className="analytics-topic-item">
                        <div className="analytics-topic-item__header">
                          <span className="analytics-topic-item__name">{topic.name}</span>
                          <div className="analytics-topic-item__stats">
                            <span className="analytics-topic-item__count">{topic.count} soru</span>
                            <span className="analytics-topic-item__percentage">%{topic.percentage}</span>
                          </div>
                        </div>
                        <div className="analytics-topic-item__bar">
                          <div
                            className="analytics-topic-item__bar-fill"
                            style={{
                              width: `${topic.percentage}%`,
                              backgroundColor: selectedSubjectData.color,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Özet Kartları */}
              <div className="analytics-summary">
                <h2 className="analytics-summary__title">Özet</h2>
                <div className="analytics-summary-grid">
                  {analyticsData.subjects.map((subject) => (
                    <div
                      key={subject.name}
                      className="analytics-summary-card"
                      style={{ '--card-color': subject.color }}
                    >
                      <div className="analytics-summary-card__color-bar" />
                      <div className="analytics-summary-card__content">
                        <h3 className="analytics-summary-card__title">{subject.name}</h3>
                        <p className="analytics-summary-card__count">{subject.totalQuestions}</p>
                        <p className="analytics-summary-card__label">soru</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedStudentId && !analyticsData && (
            <div className="analytics-empty">
              <div className="analytics-empty__icon" aria-hidden="true">
                <span className="material-symbols-outlined">folder_off</span>
              </div>
              <h2 className="analytics-empty__title">Veri Bulunamadı</h2>
              <p className="analytics-empty__text">
                Bu öğrenci için henüz analiz verisi bulunmuyor.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default StudentAnalyticsPage

