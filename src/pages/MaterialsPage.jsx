import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { setAuthenticated } from '../utils/auth'
import { useModalStack } from '../context/ModalStackContext'
import '../styles/common.css'
import './MaterialsPage.css'

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

// Mock grup verisi
const MOCK_GROUPS = [
  { id: 1, name: '11-A Sınıfı' },
  { id: 2, name: '11-B Sınıfı' },
  { id: 3, name: 'Matematik Olimpiyatları' },
  { id: 4, name: 'Fen Bilimleri Kulübü' },
]

// Mock materyaller
const INITIAL_MATERIALS = [
  {
    id: 1,
    title: 'APA Kaynak Gösterimi Kuralları',
    fileName: 'apa-kuralları.pdf',
    fileType: 'PDF',
    fileSize: '2.4 MB',
    uploadDate: '2024-12-25',
    assignedTo: {
      groups: [1],
      students: [3, 5]
    }
  },
  {
    id: 2,
    title: 'Örnek Olay Analizi Essay Formatı',
    fileName: 'essay-format.pdf',
    fileType: 'PDF',
    fileSize: '1.8 MB',
    uploadDate: '2024-12-20',
    assignedTo: {
      groups: [1, 2],
      students: []
    }
  },
  {
    id: 3,
    title: 'Yazarlık Kuralları',
    fileName: 'yazarlik-kurallari.pdf',
    fileType: 'PDF',
    fileSize: '3.1 MB',
    uploadDate: '2024-12-18',
    assignedTo: {
      groups: [],
      students: [1]
    }
  },
  {
    id: 4,
    title: 'A Seviye Çalışma Örneği',
    fileName: 'a-seviye.pdf',
    fileType: 'PDF',
    fileSize: '4.5 MB',
    uploadDate: '2024-12-15',
    assignedTo: {
      groups: [1],
      students: []
    }
  },
]

const FILE_TYPE_ICONS = {
  'PDF': 'picture_as_pdf',
  'DOC': 'description',
  'DOCX': 'description',
  'XLS': 'table_chart',
  'XLSX': 'table_chart',
  'PPT': 'slideshow',
  'PPTX': 'slideshow',
  'TXT': 'text_snippet',
  'ZIP': 'folder_zip',
}

function MaterialsPage() {
  const navigate = useNavigate()
  const { registerModal } = useModalStack()
  const [materials, setMaterials] = useState(INITIAL_MATERIALS)
  const [showAddEditModal, setShowAddEditModal] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [materialToDelete, setMaterialToDelete] = useState(null)
  const fileInputRef = useRef(null)
  
  const [materialForm, setMaterialForm] = useState({
    title: '',
    file: null,
    selectedGroups: [],
    selectedStudents: [],
    groupQuery: '',
    studentQuery: '',
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

  const handleAddMaterial = () => {
    setEditingMaterial(null)
    setMaterialForm({
      title: '',
      file: null,
      selectedGroups: [],
      selectedStudents: [],
      groupQuery: '',
      studentQuery: '',
    })
    setShowAddEditModal(true)
  }

  const handleEditMaterial = (material) => {
    setEditingMaterial(material)
    setMaterialForm({
      title: material.title,
      file: null, // Dosya zaten yüklü
      selectedGroups: material.assignedTo.groups,
      selectedStudents: material.assignedTo.students,
      groupQuery: '',
      studentQuery: '',
    })
    setShowAddEditModal(true)
  }

  const handleCloseAddEditModal = () => {
    setShowAddEditModal(false)
    setEditingMaterial(null)
    setMaterialForm({
      title: '',
      file: null,
      selectedGroups: [],
      selectedStudents: [],
      groupQuery: '',
      studentQuery: '',
    })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setMaterialForm((prev) => ({ ...prev, file }))
    }
  }

  const handleToggleGroup = (groupId) => {
    setMaterialForm((prev) => {
      const exists = prev.selectedGroups.includes(groupId)
      return {
        ...prev,
        selectedGroups: exists
          ? prev.selectedGroups.filter((id) => id !== groupId)
          : [...prev.selectedGroups, groupId],
      }
    })
  }

  const handleToggleStudent = (studentId) => {
    setMaterialForm((prev) => {
      const exists = prev.selectedStudents.includes(studentId)
      return {
        ...prev,
        selectedStudents: exists
          ? prev.selectedStudents.filter((id) => id !== studentId)
          : [...prev.selectedStudents, studentId],
      }
    })
  }

  const handleSubmitMaterial = (e) => {
    e.preventDefault()

    if (!materialForm.title.trim()) {
      alert('Materyal başlığı gereklidir!')
      return
    }

    if (!editingMaterial && !materialForm.file) {
      alert('Lütfen bir dosya seçin!')
      return
    }

    if (materialForm.selectedGroups.length === 0 && materialForm.selectedStudents.length === 0) {
      alert('En az bir grup veya öğrenci seçmelisiniz!')
      return
    }

    if (editingMaterial) {
      // Düzenleme
      setMaterials((prev) =>
        prev.map((mat) =>
          mat.id === editingMaterial.id
            ? {
                ...mat,
                title: materialForm.title,
                assignedTo: {
                  groups: materialForm.selectedGroups,
                  students: materialForm.selectedStudents,
                },
              }
            : mat
        )
      )
      alert('Materyal başarıyla güncellendi!')
    } else {
      // Yeni ekleme
      const fileExt = materialForm.file.name.split('.').pop().toUpperCase()
      const newMaterial = {
        id: Date.now(),
        title: materialForm.title,
        fileName: materialForm.file.name,
        fileType: fileExt,
        fileSize: `${(materialForm.file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split('T')[0],
        assignedTo: {
          groups: materialForm.selectedGroups,
          students: materialForm.selectedStudents,
        },
      }
      setMaterials((prev) => [newMaterial, ...prev])
      alert('Materyal başarıyla eklendi!')
    }

    handleCloseAddEditModal()
  }

  const handleDeleteClick = (material) => {
    setMaterialToDelete(material)
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    if (materialToDelete) {
      setMaterials((prev) => prev.filter((mat) => mat.id !== materialToDelete.id))
      alert('Materyal silindi!')
    }
    setShowDeleteConfirm(false)
    setMaterialToDelete(null)
  }

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false)
    setMaterialToDelete(null)
  }

  const filteredGroups = MOCK_GROUPS.filter((group) =>
    group.name.toLowerCase().includes(materialForm.groupQuery.toLowerCase())
  )

  const filteredStudents = MOCK_STUDENTS.filter((student) => {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase()
    return fullName.includes(materialForm.studentQuery.toLowerCase())
  })

  const getAssignedNames = (material) => {
    const groupNames = material.assignedTo.groups.map(
      (gid) => MOCK_GROUPS.find((g) => g.id === gid)?.name
    ).filter(Boolean)
    
    const studentNames = material.assignedTo.students.map(
      (sid) => {
        const student = MOCK_STUDENTS.find((s) => s.id === sid)
        return student ? `${student.firstName} ${student.lastName}` : null
      }
    ).filter(Boolean)

    return [...groupNames, ...studentNames]
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Bugün'
    if (diffDays === 1) return '1 gün önce'
    if (diffDays < 7) return `${diffDays} gün önce`
    if (diffDays < 14) return '1 hafta önce'
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta önce`
    return `${Math.floor(diffDays / 30)} ay önce`
  }

  // Modal stack registrations
  useEffect(() => {
    if (!showAddEditModal) return undefined
    return registerModal('materials-add-edit-modal', handleCloseAddEditModal)
  }, [showAddEditModal, registerModal])

  useEffect(() => {
    if (!showDeleteConfirm) return undefined
    return registerModal('materials-delete-confirm', handleCancelDelete)
  }, [showDeleteConfirm, registerModal])

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

          <button type="button" className="sidebar-link sidebar-link--active">
            <span className="material-symbols-outlined sidebar-link__icon fill" aria-hidden="true">
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
        <div className="materials-page">
          <header className="materials-header">
            <div className="materials-header__content">
              <h1 className="materials-title">Ders Materyallerim</h1>
              <p className="materials-subtitle">
                Burada yüklediğiniz materyalleri seçtiğiniz öğrenciler tarafından görüntülenebilir.
              </p>
            </div>
            <button type="button" className="materials-add-btn" onClick={handleAddMaterial}>
              <span className="material-symbols-outlined" aria-hidden="true">
                add
              </span>
              <span>Materyal Ekle</span>
            </button>
          </header>

          {materials.length === 0 ? (
            <div className="materials-empty">
              <div className="materials-empty__icon" aria-hidden="true">
                <span className="material-symbols-outlined">folder_off</span>
              </div>
              <h2 className="materials-empty__title">Henüz Materyal Yok</h2>
              <p className="materials-empty__text">
                "Materyal Ekle" butonuna tıklayarak ilk materyalinizi yükleyin.
              </p>
            </div>
          ) : (
            <div className="materials-list">
              {materials.map((material) => {
                const assignedNames = getAssignedNames(material)
                const icon = FILE_TYPE_ICONS[material.fileType] || 'insert_drive_file'

                return (
                  <div key={material.id} className="material-card">
                    <div className="material-card__icon-wrapper">
                      <div className="material-card__icon">
                        <span className="material-symbols-outlined" aria-hidden="true">
                          {icon}
                        </span>
                      </div>
                    </div>

                    <div className="material-card__content">
                      <h3 className="material-card__title">{material.title}</h3>
                      <p className="material-card__filename">
                        {material.fileType} • {material.fileSize}
                      </p>
                      <div className="material-card__assigned">
                        <span className="material-symbols-outlined material-card__assigned-icon" aria-hidden="true">
                          groups
                        </span>
                        <span className="material-card__assigned-text">
                          {assignedNames.length > 0 ? assignedNames.join(', ') : 'Kimseye atanmamış'}
                        </span>
                      </div>
                    </div>

                    <div className="material-card__footer">
                      <div className="material-card__date">
                        <span className="material-symbols-outlined" aria-hidden="true">
                          schedule
                        </span>
                        <span>{formatDate(material.uploadDate)}</span>
                      </div>
                      <div className="material-card__actions">
                        <button
                          type="button"
                          className="material-card__action-btn material-card__action-btn--edit"
                          onClick={() => handleEditMaterial(material)}
                          title="Düzenle"
                        >
                          <span className="material-symbols-outlined" aria-hidden="true">
                            edit
                          </span>
                        </button>
                        <button
                          type="button"
                          className="material-card__action-btn material-card__action-btn--delete"
                          onClick={() => handleDeleteClick(material)}
                          title="Sil"
                        >
                          <span className="material-symbols-outlined" aria-hidden="true">
                            delete
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Material Modal */}
      {showAddEditModal && (
        <div className="materials-modal-overlay" onClick={handleCloseAddEditModal}>
          <div className="materials-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="materials-modal-close"
              onClick={handleCloseAddEditModal}
              aria-label="Modali kapat"
            >
              <span className="material-symbols-outlined" aria-hidden="true">close</span>
            </button>

            <h2 className="materials-modal-title">
              {editingMaterial ? 'Materyal Düzenle' : 'Materyal Ekle'}
            </h2>

            <form onSubmit={handleSubmitMaterial} className="materials-modal-form">
              {!editingMaterial && (
                <div className="materials-modal-field">
                  <label htmlFor="material-file" className="materials-modal-label">
                    Dosya Seç *
                  </label>
                  <div className="materials-file-upload">
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="material-file"
                      className="materials-file-input"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
                    />
                    <div className="materials-file-upload-area" onClick={() => fileInputRef.current?.click()}>
                      <span className="material-symbols-outlined materials-file-upload-icon" aria-hidden="true">
                        cloud_upload
                      </span>
                      <p className="materials-file-upload-text">
                        {materialForm.file ? materialForm.file.name : 'Dosya seçmek için dokunun'}
                      </p>
                      <p className="materials-file-upload-hint">
                        PDF, Word, Excel, PowerPoint
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="materials-modal-field">
                <label htmlFor="material-title" className="materials-modal-label">
                  Materyal Başlığı *
                </label>
                <input
                  id="material-title"
                  type="text"
                  className="materials-modal-input"
                  placeholder="Örn: APA Kaynak Gösterimi Kuralları"
                  maxLength={100}
                  value={materialForm.title}
                  onChange={(e) => setMaterialForm((prev) => ({ ...prev, title: e.target.value }))}
                  required
                />
                <div className="materials-modal-char-count">{materialForm.title.length}/100</div>
              </div>

              <div className="materials-modal-field">
                <label className="materials-modal-label">Kimler Görebilsin? *</label>
                
                <div className="materials-modal-tabs">
                  <div className="materials-modal-tab-section">
                    <h4 className="materials-modal-tab-title">
                      <span className="material-symbols-outlined" aria-hidden="true">groups</span>
                      Gruplar
                    </h4>
                    <div className="materials-modal-search-wrapper">
                      <span className="material-symbols-outlined materials-modal-search-icon" aria-hidden="true">
                        search
                      </span>
                      <input
                        type="text"
                        className="materials-modal-search-input"
                        placeholder="Grup ara..."
                        value={materialForm.groupQuery}
                        onChange={(e) => setMaterialForm((prev) => ({ ...prev, groupQuery: e.target.value }))}
                      />
                    </div>
                    <div className="materials-modal-list">
                      {filteredGroups.map((group) => (
                        <label key={group.id} className="materials-modal-checkbox-item">
                          <input
                            type="checkbox"
                            checked={materialForm.selectedGroups.includes(group.id)}
                            onChange={() => handleToggleGroup(group.id)}
                            className="materials-modal-checkbox"
                          />
                          <span className="materials-modal-checkbox-label">{group.name}</span>
                        </label>
                      ))}
                      {filteredGroups.length === 0 && (
                        <div className="materials-modal-empty">Grup bulunamadı</div>
                      )}
                    </div>
                  </div>

                  <div className="materials-modal-tab-section">
                    <h4 className="materials-modal-tab-title">
                      <span className="material-symbols-outlined" aria-hidden="true">person</span>
                      Bireysel Öğrenciler
                    </h4>
                    <div className="materials-modal-search-wrapper">
                      <span className="material-symbols-outlined materials-modal-search-icon" aria-hidden="true">
                        search
                      </span>
                      <input
                        type="text"
                        className="materials-modal-search-input"
                        placeholder="Öğrenci ara..."
                        value={materialForm.studentQuery}
                        onChange={(e) => setMaterialForm((prev) => ({ ...prev, studentQuery: e.target.value }))}
                      />
                    </div>
                    <div className="materials-modal-list">
                      {filteredStudents.map((student) => (
                        <label key={student.id} className="materials-modal-checkbox-item">
                          <input
                            type="checkbox"
                            checked={materialForm.selectedStudents.includes(student.id)}
                            onChange={() => handleToggleStudent(student.id)}
                            className="materials-modal-checkbox"
                          />
                          <span className="materials-modal-checkbox-label">
                            {student.firstName} {student.lastName}
                          </span>
                        </label>
                      ))}
                      {filteredStudents.length === 0 && (
                        <div className="materials-modal-empty">Öğrenci bulunamadı</div>
                      )}
                    </div>
                  </div>
                </div>

                {materialForm.selectedGroups.length === 0 && materialForm.selectedStudents.length === 0 && (
                  <div className="materials-modal-warning">
                    <span className="material-symbols-outlined" aria-hidden="true">info</span>
                    <span>Görebilecek: Seçim yapılmadı</span>
                  </div>
                )}
              </div>

              <div className="materials-modal-actions">
                <button type="button" className="materials-modal-btn materials-modal-btn--cancel" onClick={handleCloseAddEditModal}>
                  İptal
                </button>
                <button type="submit" className="materials-modal-btn materials-modal-btn--primary">
                  {editingMaterial ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && materialToDelete && (
        <div className="materials-modal-overlay" onClick={handleCancelDelete}>
          <div className="materials-modal-content materials-modal-content--small" onClick={(e) => e.stopPropagation()}>
            <div className="materials-delete-confirm">
              <div className="materials-delete-confirm__icon">
                <span className="material-symbols-outlined" aria-hidden="true">warning</span>
              </div>
              <h2 className="materials-delete-confirm__title">Materyali Sil</h2>
              <p className="materials-delete-confirm__text">
                "{materialToDelete.title}" materyalini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
              </p>
              <div className="materials-modal-actions">
                <button type="button" className="materials-modal-btn materials-modal-btn--cancel" onClick={handleCancelDelete}>
                  İptal
                </button>
                <button type="button" className="materials-modal-btn materials-modal-btn--danger" onClick={handleConfirmDelete}>
                  Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MaterialsPage

