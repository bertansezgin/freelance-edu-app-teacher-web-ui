import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setAuthenticated } from '../utils/auth'
import { useModalStack } from '../context/ModalStackContext'
import '../styles/common.css'
import './StudentsPage.css'
import './GroupsPage.css'

const MOCK_STUDENT_DETAILS = {
  1: {
    studentNumber: '#12345',
    birthDate: '15/03/2007',
    completedHomework: 5,
    pendingHomework: 2
  },
  2: {
    studentNumber: '#12346',
    birthDate: '22/07/2006',
    completedHomework: 8,
    pendingHomework: 1
  },
  3: {
    studentNumber: '#12347',
    birthDate: '10/11/2008',
    completedHomework: 3,
    pendingHomework: 4
  },
  4: {
    studentNumber: '#12348',
    birthDate: '05/09/2008',
    completedHomework: 7,
    pendingHomework: 0
  },
  5: {
    studentNumber: '#12349',
    birthDate: '18/01/2007',
    completedHomework: 6,
    pendingHomework: 3
  },
  6: {
    studentNumber: '#12350',
    birthDate: '30/12/2006',
    completedHomework: 9,
    pendingHomework: 1
  },
  7: {
    studentNumber: '#12351',
    birthDate: '14/06/2008',
    completedHomework: 4,
    pendingHomework: 2
  },
  8: {
    studentNumber: '#12352',
    birthDate: '27/04/2007',
    completedHomework: 7,
    pendingHomework: 1
  },
  9: {
    studentNumber: '#12353',
    birthDate: '08/08/2005',
    completedHomework: 12,
    pendingHomework: 0
  },
  10: {
    studentNumber: '#12354',
    birthDate: '19/02/2004',
    completedHomework: 15,
    pendingHomework: 0
  }
}

const MOCK_QUESTION_ANALYTICS = {
  1: [
    {
      subject: 'Matematik',
      topics: [
        { topic: 'Cebirsel İfadeler', count: 12 },
        { topic: 'Denklemler', count: 8 },
        { topic: 'Problemler', count: 5 },
      ],
    },
    {
      subject: 'Fen Bilimleri',
      topics: [
        { topic: 'Kuvvet ve Hareket', count: 6 },
        { topic: 'Elektrik Devreleri', count: 4 },
      ],
    },
  ],
  2: [
    {
      subject: 'Türkçe',
      topics: [
        { topic: 'Paragraf', count: 10 },
        { topic: 'Dil Bilgisi', count: 7 },
      ],
    },
    {
      subject: 'Matematik',
      topics: [
        { topic: 'Fonksiyonlar', count: 9 },
        { topic: 'Polinomlar', count: 3 },
      ],
    },
  ],
  3: [
    {
      subject: 'Sosyal Bilgiler',
      topics: [
        { topic: 'Tarih', count: 4 },
        { topic: 'Coğrafya', count: 6 },
      ],
    },
  ],
  4: [],
  5: [
    {
      subject: 'Matematik',
      topics: [
        { topic: 'Geometri', count: 8 },
        { topic: 'Üslü Sayılar', count: 6 },
      ],
    },
  ],
  6: [
    {
      subject: 'Fen Bilimleri',
      topics: [
        { topic: 'Kimyasal Tepkimeler', count: 11 },
        { topic: 'Hücre', count: 5 },
      ],
    },
  ],
  7: [
    {
      subject: 'Türkçe',
      topics: [
        { topic: 'Okuduğunu Anlama', count: 7 },
        { topic: 'Yazım Kuralları', count: 4 },
      ],
    },
  ],
  8: [
    {
      subject: 'Matematik',
      topics: [
        { topic: 'Olasılık', count: 5 },
        { topic: 'İstatistik', count: 6 },
      ],
    },
  ],
  9: [
    {
      subject: 'Matematik',
      topics: [
        { topic: 'Trigonometri', count: 9 },
        { topic: 'Türev', count: 7 },
      ],
    },
    {
      subject: 'Fizik',
      topics: [
        { topic: 'Dalgalar', count: 4 },
        { topic: 'Optik', count: 6 },
      ],
    },
  ],
  10: [
    {
      subject: 'Matematik',
      topics: [
        { topic: 'Integral', count: 8 },
        { topic: 'Limit', count: 6 },
      ],
    },
  ],
}

const MOCK_STUDENTS = [
  { id: 1, firstName: 'Ahmet', lastName: 'Yılmaz', school: 'Gazi Anadolu Lisesi', grade: '10. Sınıf' },
  { id: 2, firstName: 'Fatma', lastName: 'Kaya', school: 'Atatürk Fen Lisesi', grade: '11. Sınıf' },
  { id: 3, firstName: 'Mehmet', lastName: 'Demir', school: 'Cumhuriyet Ortaokulu', grade: '9. Sınıf' },
  { id: 4, firstName: 'Ayşe', lastName: 'Çelik', school: 'Fatih Sultan Mehmet İlkokulu', grade: '9. Sınıf' },
  { id: 5, firstName: 'Mustafa', lastName: 'Şahin', school: 'İnönü Mesleki ve Teknik Anadolu Lisesi', grade: '10. Sınıf' },
  { id: 6, firstName: 'Zeynep', lastName: 'Koç', school: 'Tepebaşı Anadolu Lisesi', grade: '11. Sınıf' },
  { id: 7, firstName: 'Ali', lastName: 'Öztürk', school: 'Gaziantep Anadolu Lisesi', grade: '9. Sınıf' },
  { id: 8, firstName: 'Elif', lastName: 'Yıldız', school: 'Şehitkamil Fen Lisesi', grade: '10. Sınıf' },
  { id: 9, firstName: 'Deniz', lastName: 'Arslan', school: 'Kadıköy Anadolu Lisesi', grade: '12. Sınıf' },
  { id: 10, firstName: 'Burak', lastName: 'Güneş', school: 'İstanbul Üniversitesi', grade: 'Mezun' }
]

function StudentsPage() {
  const navigate = useNavigate()
  const { registerModal } = useModalStack()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGrade, setSelectedGrade] = useState('Tüm Sınıflar')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false)
  const [groupForm, setGroupForm] = useState({
    name: '',
    description: '',
    selectedStudents: [],
    studentQuery: '',
  })

  const grades = ['Tüm Sınıflar', '9. Sınıf', '10. Sınıf', '11. Sınıf', '12. Sınıf', 'Mezun']

  const filteredStudents = useMemo(() => {
    let filtered = MOCK_STUDENTS

    // Sınıf filtresi
    if (selectedGrade !== 'Tüm Sınıflar') {
      filtered = filtered.filter(student => student.grade === selectedGrade)
    }

    // Arama filtresi
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(student =>
        student.firstName.toLowerCase().includes(query) ||
        student.lastName.toLowerCase().includes(query) ||
        student.school.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [searchQuery, selectedGrade])

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

  const handleCreateGroup = () => {
    setGroupForm({
      name: '',
      description: '',
      selectedStudents: [],
      studentQuery: '',
    })
    setShowCreateGroupModal(true)
  }

  const handleCloseCreateGroupModal = () => {
    setShowCreateGroupModal(false)
    setGroupForm({
      name: '',
      description: '',
      selectedStudents: [],
      studentQuery: '',
    })
  }

  const filteredGroupStudents = useMemo(() => {
    const query = groupForm.studentQuery.trim().toLowerCase()
    if (!query) return MOCK_STUDENTS
    return MOCK_STUDENTS.filter((student) => {
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase()
      return fullName.includes(query) || student.school.toLowerCase().includes(query)
    })
  }, [groupForm.studentQuery])

  const handleToggleGroupStudent = (studentId) => {
    setGroupForm((prev) => {
      const exists = prev.selectedStudents.includes(studentId)
      return {
        ...prev,
        selectedStudents: exists
          ? prev.selectedStudents.filter((id) => id !== studentId)
          : [...prev.selectedStudents, studentId],
      }
    })
  }

  const handleSubmitGroup = (e) => {
    e.preventDefault()

    if (!groupForm.name.trim()) {
      alert('Grup adı gereklidir!')
      return
    }

    // TODO(backend): Create group API call
    console.log('Create group:', {
      name: groupForm.name.trim(),
      description: groupForm.description.trim(),
      studentIds: groupForm.selectedStudents,
    })

    alert('Grup başarıyla oluşturuldu!')
    handleCloseCreateGroupModal()
  }

  const handleStudentClick = (student) => {
    setSelectedStudent({
      ...student,
      ...MOCK_STUDENT_DETAILS[student.id],
      questionAnalytics: MOCK_QUESTION_ANALYTICS[student.id] ?? [],
    })
  }

  const handleCloseModal = () => {
    setSelectedStudent(null)
  }

  useEffect(() => {
    if (!selectedStudent) return undefined
    return registerModal('students-detail', handleCloseModal)
  }, [selectedStudent, registerModal])

  useEffect(() => {
    if (!showCreateGroupModal) return undefined
    return registerModal('students-create-group-modal', handleCloseCreateGroupModal)
  }, [showCreateGroupModal, registerModal])

  const handleDeleteStudent = (studentId, event) => {
    event.stopPropagation() // Satır tıklama olayını engelle
    // TODO: Öğrenci silme işlemi
    console.log('Delete student:', studentId)
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

          <button type="button" className="sidebar-link sidebar-link--active">
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
        <div className="students-page">
          <header className="students-header">
            <div className="students-header__content">
              <h1 className="students-title">Öğrencilerim</h1>
              <p className="students-subtitle">Bu sayfada kayıtlı tüm öğrencilerinizi görüntüleyebilir ve yönetebilirsiniz.</p>
            </div>
            <button type="button" className="students-create-group-btn" onClick={handleCreateGroup}>
              <span className="material-symbols-outlined students-create-group-btn__icon" aria-hidden="true">
                group_add
              </span>
              <span>Grup Oluştur</span>
            </button>
          </header>

          <div className="students-filters">
            <div className="students-search">
              <div className="students-search__wrapper">
                <div className="students-search__icon" aria-hidden="true">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input
                  type="text"
                  className="students-search__input"
                  placeholder="Öğrenci adı veya soyadına göre ara"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="students-grade-filter">
              <span className="students-grade-filter__label">Sınıf:</span>
              <div className="students-grade-filter__buttons">
                {grades.map((grade) => (
                  <button
                    key={grade}
                    type="button"
                    className={`students-grade-filter__btn ${
                      selectedGrade === grade ? 'students-grade-filter__btn--active' : ''
                    }`}
                    onClick={() => setSelectedGrade(grade)}
                  >
                    {grade}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="students-table-container">
            <table className="students-table" role="table">
              <thead className="students-table__head">
                <tr>
                  <th className="students-table__th" scope="col">Ad</th>
                  <th className="students-table__th" scope="col">Soyad</th>
                  <th className="students-table__th" scope="col">Okul</th>
                  <th className="students-table__th" scope="col">Sınıf</th>
                  <th className="students-table__th students-table__th--center" scope="col">İşlem</th>
                </tr>
              </thead>
              <tbody className="students-table__body">
                {filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="students-table__row students-table__row--clickable"
                    onClick={() => handleStudentClick(student)}
                  >
                    <td className="students-table__td students-table__td--name">{student.firstName}</td>
                    <td className="students-table__td">{student.lastName}</td>
                    <td className="students-table__td">{student.school}</td>
                    <td className="students-table__td">{student.grade}</td>
                    <td className="students-table__td students-table__td--center">
                      <div className="students-table__actions">
                        <button
                          type="button"
                          className="students-table__view-btn"
                          title="Öğrenci detayını görüntüle"
                          aria-label={`${student.firstName} ${student.lastName} öğrenci detayını görüntüle`}
                        >
                          <span className="material-symbols-outlined" aria-hidden="true">visibility</span>
                        </button>
                        <button
                          type="button"
                          className="students-table__delete-btn"
                          onClick={(e) => handleDeleteStudent(student.id, e)}
                          title="Öğrenciyi sil"
                          aria-label={`${student.firstName} ${student.lastName} öğrencisini sil`}
                        >
                          <span className="material-symbols-outlined" aria-hidden="true">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="students-modal-overlay" onClick={handleCloseModal}>
          <div className="students-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="students-modal-close"
              onClick={handleCloseModal}
              aria-label="Modali kapat"
            >
              <span className="material-symbols-outlined" aria-hidden="true">close</span>
            </button>

            <div className="students-modal-header">
              <div className="students-modal-avatar">
                <span className="material-symbols-outlined" aria-hidden="true">person</span>
              </div>
              <h2 className="students-modal-title">
                {selectedStudent.firstName} {selectedStudent.lastName}
              </h2>
            </div>

            <div className="students-modal-info">
              <div className="students-modal-info-grid">
                <div className="students-modal-info-item">
                  <span className="students-modal-info-label">Okul:</span>
                  <span className="students-modal-info-value">{selectedStudent.school}</span>
                </div>
                <div className="students-modal-info-item">
                  <span className="students-modal-info-label">Sınıf:</span>
                  <span className="students-modal-info-value">{selectedStudent.grade}</span>
                </div>
                <div className="students-modal-info-item">
                  <span className="students-modal-info-label">Öğrenci Numarası:</span>
                  <span className="students-modal-info-value">{selectedStudent.studentNumber}</span>
                </div>
                <div className="students-modal-info-item">
                  <span className="students-modal-info-label">Doğum Tarihi:</span>
                  <span className="students-modal-info-value">{selectedStudent.birthDate}</span>
                </div>
              </div>
            </div>

            <div className="students-modal-homework">
              <h3 className="students-modal-homework-title">Ödev Durumu</h3>
              <div className="students-modal-homework-stats">
                <div className="students-modal-homework-stat">
                  <span className="students-modal-homework-stat-label">Tamamlanan Ödevler:</span>
                  <span className="students-modal-homework-stat-value students-modal-homework-stat-value--completed">
                    {selectedStudent.completedHomework}
                  </span>
                </div>
                <div className="students-modal-homework-stat">
                  <span className="students-modal-homework-stat-label">Açık Ödevler:</span>
                  <span className="students-modal-homework-stat-value students-modal-homework-stat-value--pending">
                    {selectedStudent.pendingHomework}
                  </span>
                </div>
              </div>
            </div>

            <div className="students-modal-analysis">
              <h3 className="students-modal-analysis-title">Soru Kütüphanesi Analizi</h3>

              {selectedStudent.questionAnalytics?.length ? (
                <div className="students-modal-analysis-cards">
                  {selectedStudent.questionAnalytics.map((subjectBlock) => {
                    const totalQuestions = (subjectBlock.topics ?? []).reduce((sum, t) => sum + (t.count ?? 0), 0)
                    return (
                      <div key={subjectBlock.subject} className="students-modal-analysis-card">
                        <div className="students-modal-analysis-card__header">
                          <div className="students-modal-analysis-card__subject">{subjectBlock.subject}</div>
                          <div className="students-modal-analysis-card__total">{totalQuestions} soru</div>
                        </div>
                        <div className="students-modal-analysis-topics" role="list">
                          {(subjectBlock.topics ?? []).map((topicItem) => (
                            <div key={topicItem.topic} className="students-modal-analysis-topic" role="listitem">
                              <div className="students-modal-analysis-topic__name">{topicItem.topic}</div>
                              <div className="students-modal-analysis-topic__count">{topicItem.count}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="students-modal-analysis-empty">
                  Bu öğrenci henüz soru kütüphanesine soru eklememiş.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateGroupModal && (
        <div className="groups-modal-overlay" onClick={handleCloseCreateGroupModal}>
          <div className="groups-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="groups-modal-title">Yeni Grup Oluştur</h3>
            <form onSubmit={handleSubmitGroup} className="groups-modal-form">
              <div className="groups-modal-field">
                <label htmlFor="group-name-students" className="groups-modal-label">
                  Grup Adı
                </label>
                <input
                  id="group-name-students"
                  type="text"
                  className="groups-modal-input"
                  placeholder="Grup Adı"
                  value={groupForm.name}
                  onChange={(e) => setGroupForm((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="groups-modal-field">
                <label htmlFor="group-description-students" className="groups-modal-label">
                  Açıklama
                </label>
                <textarea
                  id="group-description-students"
                  className="groups-modal-textarea"
                  placeholder="Açıklama"
                  rows={4}
                  value={groupForm.description}
                  onChange={(e) => setGroupForm((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="groups-modal-field">
                <label htmlFor="group-students-students" className="groups-modal-label">
                  Öğrenci Seçimi
                </label>
                <div className="groups-modal-students-wrapper" id="group-students-students">
                  <div className="groups-modal-students__search-wrapper">
                    <span className="material-symbols-outlined groups-modal-students__search-icon" aria-hidden="true">
                      search
                    </span>
                    <input
                      type="text"
                      className="groups-modal-students__search-input"
                      placeholder="Öğrenci ara..."
                      value={groupForm.studentQuery}
                      onChange={(e) => setGroupForm((prev) => ({ ...prev, studentQuery: e.target.value }))}
                    />
                  </div>
                  <div className="groups-modal-students__list" role="list">
                    {filteredGroupStudents.map((student) => {
                      const checked = groupForm.selectedStudents.includes(student.id)
                      return (
                        <label key={student.id} className="groups-modal-students__item" role="listitem">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleToggleGroupStudent(student.id)}
                            className="groups-modal-students__checkbox"
                          />
                          <span className="groups-modal-students__name">
                            {student.firstName} {student.lastName}
                          </span>
                        </label>
                      )
                    })}
                    {filteredGroupStudents.length === 0 && (
                      <div className="groups-modal-students__empty">Öğrenci bulunamadı</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="groups-modal-actions">
                <button type="button" className="groups-modal-btn groups-modal-btn--cancel" onClick={handleCloseCreateGroupModal}>
                  İptal
                </button>
                <button type="submit" className="groups-modal-btn groups-modal-btn--primary">
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentsPage
