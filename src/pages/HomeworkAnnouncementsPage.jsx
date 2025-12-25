import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setAuthenticated } from '../utils/auth'
import { useModalStack } from '../context/ModalStackContext'
import '../styles/common.css'
import './HomeworkAnnouncementsPage.css'

const MOCK_STUDENTS = [
  'Ali Veli',
  'Ayşe Yılmaz',
  'Fatma Kaya',
  'Mehmet Öztürk',
  'Zeynep Demir',
  'Emre Şahin',
  'Elif Arslan',
  'Hakan Çelik',
  'Ahmet Yılmaz',
  'Deniz Aksoy',
]

const CLASS_GROUP_OPTIONS = ['8-A', '7-C', '8-A Grup 1', '7-C Grup 2', 'Tüm Sınıflar']

const MOCK_HOMEWORKS = [
  {
    id: 1,
    title: 'Matematik Ödevi - Cebirsel İfadeler',
    className: '8-A',
    dueDate: '25.12.2024',
    description:
      'Cebirsel ifadeler konusundaki 1-20 arası soruları çözün. Çözümleri defterinize yazarak, gerekli adımları gösterin.',
    assignedStudents: [
      { name: 'Ahmet Yılmaz', completed: true },
      { name: 'Elif Kaya', completed: true },
      { name: 'Can Demir', completed: false },
      { name: 'Zeynep Yılmaz', completed: true },
      { name: 'Mehmet Öztürk', completed: false },
      { name: 'Fatma Demir', completed: true },
      { name: 'Ali Can', completed: false },
      { name: 'Deniz Aksoy', completed: true },
    ],
    attachments: [
      { id: 'hw-1-a', type: 'pdf', name: 'Cebirsel_Ifadeler_Soru_Föyü.pdf' },
      { id: 'hw-1-b', type: 'doc', name: 'Çözüm_Kuralları.docx' },
    ],
  },
  {
    id: 2,
    title: 'Fen Bilimleri Projesi',
    className: '7-C',
    dueDate: '15.01.2025',
    description:
      'Güneş sistemi maketi hazırlayın. Kullanılan malzemeleri ve kısa açıklamayı projenize eklemeyi unutmayın.',
    assignedStudents: [
      { name: 'Mert Savaş', completed: true },
      { name: 'Gül Şen', completed: false },
      { name: 'Kerem Tunç', completed: false },
      { name: 'Ece Yücel', completed: true },
      { name: 'Selin Polat', completed: true },
    ],
    attachments: [{ id: 'hw-2-a', type: 'pdf', name: 'Proje_Kılavuzu.pdf' }],
  },
]

const MOCK_ANNOUNCEMENTS = [
  {
    id: 1,
    title: 'Veli Toplantısı Hatırlatması',
    className: 'Tüm Sınıflar',
    date: '20.12.2024',
    description:
      'Veli toplantısı 20 Aralık Cuma günü saat 18:00’de okul konferans salonunda yapılacaktır. Katılımınız önemlidir.',
  },
  {
    id: 2,
    title: 'Deneme Sınavı Programı Yayınlandı',
    className: '8-A',
    date: '23.12.2024',
    description:
      'Deneme sınavı programı yayınlanmıştır. Sınav saatleri ve salon bilgileri için ek dosyayı inceleyebilirsiniz.',
  },
]

const FILE_ICON_BY_TYPE = {
  pdf: 'picture_as_pdf',
  doc: 'description',
  xls: 'grid_on',
  ppt: 'slideshow',
}

function getFileTypeFromName(fileName) {
  const parts = String(fileName).toLowerCase().split('.')
  const ext = parts.length > 1 ? parts[parts.length - 1] : ''
  if (ext === 'pdf') return 'pdf'
  if (ext === 'doc' || ext === 'docx') return 'doc'
  if (ext === 'xls' || ext === 'xlsx') return 'xls'
  if (ext === 'ppt' || ext === 'pptx') return 'ppt'
  return 'file'
}

function toDateInputValue(dateValue) {
  const raw = String(dateValue ?? '').trim()
  if (!raw || raw === '—') return ''
  // already yyyy-mm-dd
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw
  // dd.mm.yyyy -> yyyy-mm-dd
  const match = raw.match(/^(\d{2})\.(\d{2})\.(\d{4})$/)
  if (match) {
    const [, dd, mm, yyyy] = match
    return `${yyyy}-${mm}-${dd}`
  }
  return ''
}

function HomeworkAnnouncementsPage() {
  const navigate = useNavigate()
  const { registerModal } = useModalStack()
  const [activeTab, setActiveTab] = useState('homeworks') // homeworks | announcements
  const [homeworks, setHomeworks] = useState(MOCK_HOMEWORKS)
  const [announcements, setAnnouncements] = useState(MOCK_ANNOUNCEMENTS)
  const [selectedItem, setSelectedItem] = useState(null) // { ...item, itemType: 'homeworks' | 'announcements' }
  const [homeworkListMode, setHomeworkListMode] = useState(null) // completed | pending | null
  const [showAddHomeworkModal, setShowAddHomeworkModal] = useState(false)
  const [showEditHomeworkModal, setShowEditHomeworkModal] = useState(false)
  const [editingHomeworkId, setEditingHomeworkId] = useState(null)
  const [homeworkForm, setHomeworkForm] = useState({
    title: '',
    groupQuery: '',
    selectedGroups: [],
    dueDate: '',
    description: '',
    studentQuery: '',
    selectedStudents: [],
    files: [], // { id, name, type }
  })

  const items = useMemo(() => {
    return activeTab === 'homeworks' ? homeworks : announcements
  }, [activeTab, homeworks, announcements])

  const addButtonLabel = activeTab === 'homeworks' ? 'Ödev Ekle' : 'Duyuru Ekle'
  const detailTypeLabel = selectedItem?.itemType === 'homeworks' ? 'Ödev' : 'Duyuru'

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
    if (activeTab === 'homeworks') {
      setHomeworkForm({
        title: '',
        groupQuery: '',
        selectedGroups: [],
        dueDate: '',
        description: '',
        studentQuery: '',
        selectedStudents: [],
        files: [],
      })
      setShowAddHomeworkModal(true)
      return
    }

    // TODO: Duyuru ekleme modalı
    console.log('Add announcement')
  }

  const handleEdit = (itemType, id) => {
    if (itemType !== 'homeworks') {
      // TODO: Duyuru düzenleme modalı
      console.log('Edit announcement', id)
      return
    }

    const target = homeworks.find((h) => h.id === id)
    if (!target) return

    const selectedGroups = Array.isArray(target.groupNames)
      ? target.groupNames
      : target.className && target.className !== '—'
        ? [target.className]
        : []

    setEditingHomeworkId(id)
    setHomeworkForm({
      title: target.title ?? '',
      groupQuery: '',
      selectedGroups,
      dueDate: toDateInputValue(target.dueDate),
      description: target.description === '—' ? '' : (target.description ?? ''),
      studentQuery: '',
      selectedStudents: (target.assignedStudents ?? []).map((s) => s.name),
      files: (target.attachments ?? []).map((f) => ({ id: f.id, name: f.name, type: f.type })),
    })
    setShowEditHomeworkModal(true)
  }

  const handleDelete = (itemType, id) => {
    // TODO: Silme işlemi
    console.log('Delete', itemType, id)
  }

  const handleOpenDetail = (item) => {
    setSelectedItem({ ...item, itemType: activeTab })
    setHomeworkListMode(null)
  }

  const handleCloseDetail = () => {
    setSelectedItem(null)
    setHomeworkListMode(null)
  }

  useEffect(() => {
    if (!selectedItem) return undefined
    return registerModal('homework-detail', handleCloseDetail)
  }, [selectedItem, registerModal])

  const handleCloseAddHomeworkModal = () => {
    setShowAddHomeworkModal(false)
  }

  useEffect(() => {
    if (!showAddHomeworkModal) return undefined
    return registerModal('homework-add', handleCloseAddHomeworkModal)
  }, [showAddHomeworkModal, registerModal])

  const handleCloseEditHomeworkModal = () => {
    setShowEditHomeworkModal(false)
    setEditingHomeworkId(null)
  }

  useEffect(() => {
    if (!showEditHomeworkModal) return undefined
    return registerModal('homework-edit', handleCloseEditHomeworkModal)
  }, [showEditHomeworkModal, registerModal])

  const filteredHomeworkStudents = useMemo(() => {
    const query = homeworkForm.studentQuery.trim().toLowerCase()
    if (!query) return MOCK_STUDENTS
    return MOCK_STUDENTS.filter((name) => name.toLowerCase().includes(query))
  }, [homeworkForm.studentQuery])

  const filteredHomeworkGroups = useMemo(() => {
    const query = homeworkForm.groupQuery.trim().toLowerCase()
    if (!query) return CLASS_GROUP_OPTIONS
    return CLASS_GROUP_OPTIONS.filter((name) => name.toLowerCase().includes(query))
  }, [homeworkForm.groupQuery])

  const handleToggleHomeworkStudent = (studentName) => {
    setHomeworkForm((prev) => {
      const exists = prev.selectedStudents.includes(studentName)
      return {
        ...prev,
        selectedStudents: exists
          ? prev.selectedStudents.filter((name) => name !== studentName)
          : [...prev.selectedStudents, studentName],
      }
    })
  }

  const handleToggleHomeworkGroup = (groupName) => {
    setHomeworkForm((prev) => {
      const exists = prev.selectedGroups.includes(groupName)
      return {
        ...prev,
        selectedGroups: exists
          ? prev.selectedGroups.filter((name) => name !== groupName)
          : [...prev.selectedGroups, groupName],
      }
    })
  }

  const handleAddHomeworkFiles = (fileList) => {
    const files = Array.from(fileList ?? [])
    if (files.length === 0) return
    setHomeworkForm((prev) => {
      const next = [...prev.files]
      files.forEach((file) => {
        const type = getFileTypeFromName(file.name)
        next.push({ id: `${Date.now()}-${file.name}`, name: file.name, type })
      })
      return { ...prev, files: next }
    })
  }

  const handleRemoveHomeworkFile = (fileId) => {
    setHomeworkForm((prev) => ({ ...prev, files: prev.files.filter((f) => f.id !== fileId) }))
  }

  const handleSubmitHomework = (e) => {
    e.preventDefault()
    const title = homeworkForm.title.trim()
    if (!title) return

    const groupNames = homeworkForm.selectedGroups
    const classNameLabel = groupNames.length > 0 ? groupNames.join(', ') : '—'

    const newHomework = {
      id: Date.now(),
      title,
      className: classNameLabel,
      groupNames,
      dueDate: homeworkForm.dueDate || '—',
      description: homeworkForm.description.trim() || '—',
      assignedStudents: homeworkForm.selectedStudents.map((name) => ({ name, completed: false })),
      attachments: homeworkForm.files.map((f) => ({ id: f.id, type: f.type, name: f.name })),
    }

    setHomeworks((prev) => [newHomework, ...prev])
    setShowAddHomeworkModal(false)
  }

  const handleSubmitHomeworkEdit = (e) => {
    e.preventDefault()
    if (!editingHomeworkId) return

    const title = homeworkForm.title.trim()
    if (!title) return

    const groupNames = homeworkForm.selectedGroups
    const classNameLabel = groupNames.length > 0 ? groupNames.join(', ') : '—'

    setHomeworks((prev) => {
      const current = prev.find((h) => h.id === editingHomeworkId)
      const statusByName = new Map((current?.assignedStudents ?? []).map((s) => [s.name, Boolean(s.completed)]))

      return prev.map((h) => {
        if (h.id !== editingHomeworkId) return h
        return {
          ...h,
          title,
          groupNames,
          className: classNameLabel,
          dueDate: homeworkForm.dueDate || '—',
          description: homeworkForm.description.trim() || '—',
          assignedStudents: homeworkForm.selectedStudents.map((name) => ({
            name,
            completed: statusByName.get(name) ?? false,
          })),
          attachments: homeworkForm.files.map((f) => ({ id: f.id, type: f.type, name: f.name })),
        }
      })
    })

    setShowEditHomeworkModal(false)
    setEditingHomeworkId(null)
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
            <div className="homework-header__content">
              <h1 className="homework-title">Ödev &amp; Duyurular</h1>
              <p className="homework-subtitle">Sınıflarınız için ödevleri ve duyuruları buradan yönetin.</p>
            </div>

            <button type="button" className="homework-add-btn" onClick={handleAdd}>
              <span className="material-symbols-outlined homework-add-btn__icon" aria-hidden="true">
                add
              </span>
              <span>{addButtonLabel}</span>
            </button>
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
              <div
                key={item.id}
                className="homework-card homework-card--clickable"
                role="listitem"
                tabIndex={0}
                onClick={() => handleOpenDetail(item)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleOpenDetail(item)
                }}
              >
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
                    className="homework-action-btn homework-action-btn--view"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleOpenDetail(item)
                    }}
                    aria-label="Detayı görüntüle"
                    title="Detayı görüntüle"
                  >
                    <span className="material-symbols-outlined" aria-hidden="true">visibility</span>
                  </button>
                  <button
                    type="button"
                    className="homework-action-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEdit(activeTab, item.id)
                    }}
                    aria-label="Düzenle"
                    title="Düzenle"
                  >
                    <span className="material-symbols-outlined" aria-hidden="true">edit</span>
                  </button>
                  <button
                    type="button"
                    className="homework-action-btn homework-action-btn--danger"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(activeTab, item.id)
                    }}
                    aria-label="Sil"
                    title="Sil"
                  >
                    <span className="material-symbols-outlined" aria-hidden="true">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {selectedItem && (
        <div className="homework-modal-overlay" onClick={handleCloseDetail} role="dialog" aria-modal="true">
          <div className="homework-modal-content" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="homework-modal-close" onClick={handleCloseDetail} aria-label="Modali kapat">
              <span className="material-symbols-outlined" aria-hidden="true">close</span>
            </button>

            <div className="homework-modal-header">
              <div className="homework-modal-badge" aria-hidden="true">
                <span className="material-symbols-outlined">{selectedItem.itemType === 'homeworks' ? 'assignment' : 'campaign'}</span>
              </div>
              <div className="homework-modal-header__text">
                <div className="homework-modal-type">{detailTypeLabel}</div>
                <h2 className="homework-modal-title">{selectedItem.title}</h2>
              </div>
            </div>

            <div className="homework-modal-info-grid">
              <div className="homework-modal-info-item">
                <div className="homework-modal-info-label">Sınıf / Grup</div>
                <div className="homework-modal-info-value">{selectedItem.className}</div>
              </div>
              <div className="homework-modal-info-item">
                <div className="homework-modal-info-label">{selectedItem.itemType === 'homeworks' ? 'Son Teslim' : 'Tarih'}</div>
                <div className="homework-modal-info-value">
                  {selectedItem.itemType === 'homeworks' ? selectedItem.dueDate : selectedItem.date}
                </div>
              </div>
            </div>

            <div className="homework-modal-section">
              <div className="homework-modal-section__title">Açıklama</div>
              <p className="homework-modal-description">{selectedItem.description}</p>
            </div>

            {selectedItem.itemType === 'homeworks' && (() => {
              const assigned = selectedItem.assignedStudents ?? []
              const total = assigned.length
              const completedCount = assigned.filter((s) => s.completed).length
              const pendingCount = total - completedCount
              const completionRate = total > 0 ? Math.round((completedCount / total) * 100) : 0
              const listTitle = homeworkListMode === 'completed'
                ? `Tamamlayanlar (${completedCount})`
                : homeworkListMode === 'pending'
                  ? `Tamamlamayanlar (${pendingCount})`
                  : ''

              const visibleList = homeworkListMode === 'completed'
                ? assigned.filter((s) => s.completed)
                : homeworkListMode === 'pending'
                  ? assigned.filter((s) => !s.completed)
                  : []

              return (
                <div className="homework-modal-section">
                  <div className="homework-modal-section__title">Tamamlama Oranı</div>

                  <div className="homework-modal-completion">
                    <div className="homework-modal-completion__top">
                      <div className="homework-modal-completion__label">Tamamlama oranı</div>
                      <div className="homework-modal-completion__value">%{completionRate}</div>
                    </div>
                    <div className="homework-modal-completion__bar" aria-hidden="true">
                      <div className="homework-modal-completion__bar-fill" style={{ width: `${completionRate}%` }} />
                    </div>
                    <div className="homework-modal-completion__actions" role="group" aria-label="Ödev durumlarına göre filtrele">
                      <button
                        type="button"
                        className={`homework-modal-chip ${homeworkListMode === 'completed' ? 'homework-modal-chip--active' : ''}`}
                        onClick={() => setHomeworkListMode((prev) => (prev === 'completed' ? null : 'completed'))}
                      >
                        Tamamlayanlar ({completedCount})
                      </button>
                      <button
                        type="button"
                        className={`homework-modal-chip ${homeworkListMode === 'pending' ? 'homework-modal-chip--active' : ''}`}
                        onClick={() => setHomeworkListMode((prev) => (prev === 'pending' ? null : 'pending'))}
                      >
                        Tamamlamayanlar ({pendingCount})
                      </button>
                    </div>
                  </div>

                  {homeworkListMode && (
                    <div className="homework-modal-studentlist">
                      <div className="homework-modal-studentlist__title">{listTitle}</div>
                      <div className="homework-modal-studentlist__list" role="list">
                        {visibleList.map((student) => (
                          <div key={student.name} className="homework-modal-studentlist__item" role="listitem">
                            <span className="homework-modal-studentlist__name">{student.name}</span>
                            <span
                              className={`homework-modal-studentlist__badge ${
                                student.completed ? 'homework-modal-studentlist__badge--success' : 'homework-modal-studentlist__badge--danger'
                              }`}
                            >
                              {student.completed ? 'Tamamladı' : 'Tamamlamadı'}
                            </span>
                          </div>
                        ))}
                        {visibleList.length === 0 && (
                          <div className="homework-modal-studentlist__empty">Listelenecek öğrenci yok.</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })()}

            {selectedItem.itemType === 'homeworks' && (
              <div className="homework-modal-section">
                <div className="homework-modal-section__title">Ek Dosyalar</div>
                <div className="homework-modal-files" role="list">
                  {(selectedItem.attachments ?? []).map((file) => (
                    <div key={file.id} className="homework-modal-file" role="listitem">
                      <div className="homework-modal-file__icon" aria-hidden="true">
                        <span className="material-symbols-outlined">{FILE_ICON_BY_TYPE[file.type] ?? 'attach_file'}</span>
                      </div>
                      <div className="homework-modal-file__name">{file.name}</div>
                      <button
                        type="button"
                        className="homework-modal-file__action"
                        onClick={() => console.log('Download file:', file)}
                        aria-label="Dosyayı indir"
                        title="Dosyayı indir"
                      >
                        <span className="material-symbols-outlined" aria-hidden="true">download</span>
                      </button>
                    </div>
                  ))}

                  {(selectedItem.attachments ?? []).length === 0 && (
                    <div className="homework-modal-files__empty">Bu ödev için ek dosya yok.</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showAddHomeworkModal && (
        <div className="homework-add-overlay" onClick={handleCloseAddHomeworkModal} role="dialog" aria-modal="true">
          <div className="homework-add-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="homework-add-close" onClick={handleCloseAddHomeworkModal} aria-label="Modali kapat">
              <span className="material-symbols-outlined" aria-hidden="true">close</span>
            </button>

            <h2 className="homework-add-title">Ödev Ekle</h2>

            <form className="homework-add-form" onSubmit={handleSubmitHomework}>
              <div className="homework-add-grid">
                <div className="homework-add-left">
                  <div className="homework-add-field">
                    <label className="homework-add-label" htmlFor="hw-title">Ödev Başlığı</label>
                    <input
                      id="hw-title"
                      className="homework-add-input"
                      placeholder="Örn: Matematik Ödevi"
                      value={homeworkForm.title}
                      onChange={(e) => setHomeworkForm((prev) => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="homework-add-field">
                    <label className="homework-add-label" htmlFor="hw-due">Son Teslim Tarihi</label>
                    <input
                      id="hw-due"
                      className="homework-add-input"
                      type="date"
                      value={homeworkForm.dueDate}
                      onChange={(e) => setHomeworkForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                    />
                  </div>

                  <div className="homework-add-field">
                    <label className="homework-add-label" htmlFor="hw-desc">Açıklama</label>
                    <textarea
                      id="hw-desc"
                      className="homework-add-textarea"
                      placeholder="Ödevle ilgili detayları yazınız..."
                      value={homeworkForm.description}
                      onChange={(e) => setHomeworkForm((prev) => ({ ...prev, description: e.target.value }))}
                      rows={5}
                    />
                  </div>

                  <div className="homework-add-field">
                    <div className="homework-add-label">Dosya Ekle</div>
                    <label className="homework-add-dropzone">
                      <input
                        type="file"
                        className="homework-add-file-input"
                        multiple
                        accept=".png,.jpg,.jpeg,.pdf"
                        onChange={(e) => handleAddHomeworkFiles(e.target.files)}
                      />
                      <div className="homework-add-dropzone__icon" aria-hidden="true">
                        <span className="material-symbols-outlined">cloud_upload</span>
                      </div>
                      <div className="homework-add-dropzone__text">Dosya yükle veya sürükleyip bırak</div>
                      <div className="homework-add-dropzone__hint">PNG, JPG, PDF up to 10MB</div>
                    </label>

                    {homeworkForm.files.length > 0 && (
                      <div className="homework-add-files-wrapper">
                        <div className="homework-add-files-header">
                          <span className="homework-add-files-title">Eklenen Dosyalar ({homeworkForm.files.length})</span>
                          <span className="homework-add-files-hint">Kaydırılabilir</span>
                        </div>
                        <div className="homework-add-files" role="list">
                          {homeworkForm.files.map((file) => (
                            <div key={file.id} className="homework-add-file" role="listitem">
                              <div className="homework-add-file__icon" aria-hidden="true">
                                <span className="material-symbols-outlined">{FILE_ICON_BY_TYPE[file.type] ?? 'description'}</span>
                              </div>
                              <div className="homework-add-file__name">{file.name}</div>
                              <button
                                type="button"
                                className="homework-add-file__remove"
                                onClick={() => handleRemoveHomeworkFile(file.id)}
                                aria-label="Dosyayı kaldır"
                                title="Dosyayı kaldır"
                              >
                                <span className="material-symbols-outlined" aria-hidden="true">close</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="homework-add-right">
                  <div className="homework-add-field">
                    <div className="homework-add-label">Sınıf/Grup Seçimi (İsteğe Bağlı)</div>
                    <div className="homework-add-groups">
                      <div className="homework-add-groups__search">
                        <span className="material-symbols-outlined homework-add-groups__search-icon" aria-hidden="true">search</span>
                        <input
                          type="search"
                          className="homework-add-groups__search-input"
                          placeholder="Sınıf/Grup ara..."
                          value={homeworkForm.groupQuery}
                          onChange={(e) => setHomeworkForm((prev) => ({ ...prev, groupQuery: e.target.value }))}
                        />
                      </div>

                      <div className="homework-add-groups__list" role="list">
                        {filteredHomeworkGroups.map((groupName) => {
                          const checked = homeworkForm.selectedGroups.includes(groupName)
                          return (
                            <label key={groupName} className="homework-add-groups__item" role="listitem">
                              <input
                                type="checkbox"
                                className="homework-add-groups__checkbox"
                                checked={checked}
                                onChange={() => handleToggleHomeworkGroup(groupName)}
                              />
                              <span className="homework-add-groups__name">{groupName}</span>
                            </label>
                          )
                        })}

                        {filteredHomeworkGroups.length === 0 && (
                          <div className="homework-add-groups__empty">Grup bulunamadı</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="homework-add-students">
                    <div className="homework-add-students__header">
                      <div className="homework-add-label">Öğrenci Seçimi</div>
                      <div className="homework-add-students__search">
                        <span className="material-symbols-outlined homework-add-students__search-icon" aria-hidden="true">search</span>
                        <input
                          type="search"
                          className="homework-add-students__search-input"
                          placeholder="Öğrenci ara..."
                          value={homeworkForm.studentQuery}
                          onChange={(e) => setHomeworkForm((prev) => ({ ...prev, studentQuery: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="homework-add-students__list" role="list">
                      {filteredHomeworkStudents.map((student) => {
                        const checked = homeworkForm.selectedStudents.includes(student)
                        return (
                          <label key={student} className="homework-add-students__item" role="listitem">
                            <input
                              type="checkbox"
                              className="homework-add-students__checkbox"
                              checked={checked}
                              onChange={() => handleToggleHomeworkStudent(student)}
                            />
                            <span className="homework-add-students__name">{student}</span>
                          </label>
                        )
                      })}

                      {filteredHomeworkStudents.length === 0 && (
                        <div className="homework-add-students__empty">Öğrenci bulunamadı</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="homework-add-actions">
                <button type="button" className="homework-add-btn-secondary" onClick={handleCloseAddHomeworkModal}>
                  Vazgeç
                </button>
                <button type="submit" className="homework-add-btn-primary">
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditHomeworkModal && (
        <div className="homework-add-overlay" onClick={handleCloseEditHomeworkModal} role="dialog" aria-modal="true">
          <div className="homework-add-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="homework-add-close" onClick={handleCloseEditHomeworkModal} aria-label="Modali kapat">
              <span className="material-symbols-outlined" aria-hidden="true">close</span>
            </button>

            <h2 className="homework-add-title">Ödev Düzenle</h2>

            <form className="homework-add-form" onSubmit={handleSubmitHomeworkEdit}>
              <div className="homework-add-grid">
                <div className="homework-add-left">
                  <div className="homework-add-field">
                    <label className="homework-add-label" htmlFor="hw-title-edit">Ödev Başlığı</label>
                    <input
                      id="hw-title-edit"
                      className="homework-add-input"
                      placeholder="Örn: Matematik Ödevi"
                      value={homeworkForm.title}
                      onChange={(e) => setHomeworkForm((prev) => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="homework-add-field">
                    <label className="homework-add-label" htmlFor="hw-due-edit">Son Teslim Tarihi</label>
                    <input
                      id="hw-due-edit"
                      className="homework-add-input"
                      type="date"
                      value={homeworkForm.dueDate}
                      onChange={(e) => setHomeworkForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                    />
                  </div>

                  <div className="homework-add-field">
                    <label className="homework-add-label" htmlFor="hw-desc-edit">Açıklama</label>
                    <textarea
                      id="hw-desc-edit"
                      className="homework-add-textarea"
                      placeholder="Ödevle ilgili detayları yazınız..."
                      value={homeworkForm.description}
                      onChange={(e) => setHomeworkForm((prev) => ({ ...prev, description: e.target.value }))}
                      rows={5}
                    />
                  </div>

                  <div className="homework-add-field">
                    <div className="homework-add-label">Dosya Ekle</div>
                    <label className="homework-add-dropzone">
                      <input
                        type="file"
                        className="homework-add-file-input"
                        multiple
                        accept=".png,.jpg,.jpeg,.pdf"
                        onChange={(e) => handleAddHomeworkFiles(e.target.files)}
                      />
                      <div className="homework-add-dropzone__icon" aria-hidden="true">
                        <span className="material-symbols-outlined">cloud_upload</span>
                      </div>
                      <div className="homework-add-dropzone__text">Dosya yükle veya sürükleyip bırak</div>
                      <div className="homework-add-dropzone__hint">PNG, JPG, PDF up to 10MB</div>
                    </label>

                    {homeworkForm.files.length > 0 && (
                      <div className="homework-add-files-wrapper">
                        <div className="homework-add-files-header">
                          <span className="homework-add-files-title">Eklenen Dosyalar ({homeworkForm.files.length})</span>
                          <span className="homework-add-files-hint">Kaydırılabilir</span>
                        </div>
                        <div className="homework-add-files" role="list">
                          {homeworkForm.files.map((file) => (
                            <div key={file.id} className="homework-add-file" role="listitem">
                              <div className="homework-add-file__icon" aria-hidden="true">
                                <span className="material-symbols-outlined">{FILE_ICON_BY_TYPE[file.type] ?? 'description'}</span>
                              </div>
                              <div className="homework-add-file__name">{file.name}</div>
                              <button
                                type="button"
                                className="homework-add-file__remove"
                                onClick={() => handleRemoveHomeworkFile(file.id)}
                                aria-label="Dosyayı kaldır"
                                title="Dosyayı kaldır"
                              >
                                <span className="material-symbols-outlined" aria-hidden="true">close</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="homework-add-right">
                  <div className="homework-add-field">
                    <div className="homework-add-label">Sınıf/Grup Seçimi (İsteğe Bağlı)</div>
                    <div className="homework-add-groups">
                      <div className="homework-add-groups__search">
                        <span className="material-symbols-outlined homework-add-groups__search-icon" aria-hidden="true">search</span>
                        <input
                          type="search"
                          className="homework-add-groups__search-input"
                          placeholder="Sınıf/Grup ara..."
                          value={homeworkForm.groupQuery}
                          onChange={(e) => setHomeworkForm((prev) => ({ ...prev, groupQuery: e.target.value }))}
                        />
                      </div>

                      <div className="homework-add-groups__list" role="list">
                        {filteredHomeworkGroups.map((groupName) => {
                          const checked = homeworkForm.selectedGroups.includes(groupName)
                          return (
                            <label key={groupName} className="homework-add-groups__item" role="listitem">
                              <input
                                type="checkbox"
                                className="homework-add-groups__checkbox"
                                checked={checked}
                                onChange={() => handleToggleHomeworkGroup(groupName)}
                              />
                              <span className="homework-add-groups__name">{groupName}</span>
                            </label>
                          )
                        })}

                        {filteredHomeworkGroups.length === 0 && (
                          <div className="homework-add-groups__empty">Grup bulunamadı</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="homework-add-students">
                    <div className="homework-add-students__header">
                      <div className="homework-add-label">Öğrenci Seçimi</div>
                      <div className="homework-add-students__search">
                        <span className="material-symbols-outlined homework-add-students__search-icon" aria-hidden="true">search</span>
                        <input
                          type="search"
                          className="homework-add-students__search-input"
                          placeholder="Öğrenci ara..."
                          value={homeworkForm.studentQuery}
                          onChange={(e) => setHomeworkForm((prev) => ({ ...prev, studentQuery: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="homework-add-students__list" role="list">
                      {filteredHomeworkStudents.map((student) => {
                        const checked = homeworkForm.selectedStudents.includes(student)
                        return (
                          <label key={student} className="homework-add-students__item" role="listitem">
                            <input
                              type="checkbox"
                              className="homework-add-students__checkbox"
                              checked={checked}
                              onChange={() => handleToggleHomeworkStudent(student)}
                            />
                            <span className="homework-add-students__name">{student}</span>
                          </label>
                        )
                      })}

                      {filteredHomeworkStudents.length === 0 && (
                        <div className="homework-add-students__empty">Öğrenci bulunamadı</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="homework-add-actions">
                <button type="button" className="homework-add-btn-secondary" onClick={handleCloseEditHomeworkModal}>
                  Vazgeç
                </button>
                <button type="submit" className="homework-add-btn-primary">
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

export default HomeworkAnnouncementsPage


