import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setAuthenticated } from '../utils/auth'
import { useModalStack } from '../context/ModalStackContext'
import '../styles/common.css'
import './GroupsPage.css'

const MOCK_STUDENTS = [
  { id: 1, name: 'Ahmet Çelik', avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXM3wke-uj49cVsrjNL0X1DmyOfO42byU8ERGwwbqq-EX9-nQmFoWTIfgZTh4GWodc9RIpFxhRe_5qHTCWcv-a727E4hiaCEPiuHNWmfbltgheLtGzvvxLLtlHWic6XmEvn5iyhKWfr_oDrHbrghkyiXEKRoJNaqGHXDLEGcNiJiGNl9yl_UVvKihOcAAayXKarpOZgGVMw1hWdnB-8PLphG9DeUU4CE4Uty9qaBD5EjhoFT1xPzh77yQg64k23efeGrJKicsptTE' },
  { id: 2, name: 'Elif Kaya', avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkbYDiAwC3fl3o_mFWaCqfkVqdYzWLMlgcAR27yb7jqvfYWPlXugezlSSjfe3l0AxzhKunLoISRfUYAz13liQ2AmaDqbz1f9IWAV1GVNcxl3lYVTWY9BI9k1bQFys4ferjOJImZn7p52hDnPULgVAwGLxl5Nqv8kDoayFomt-u1yfQQXyk9HoZC0dMgTnLkPPRAdHHcQ1nAI2Jwk1upUI8Wmg0p1hqchKQ7oucLV1iPVEmi2ccY-wwEsl9ygBfHvaRNg11WsSrbv0' },
  { id: 3, name: 'Mustafa Demir', avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHb85EypaCq1QrZ5XDCzKIXEL5lHv9tBlFf8lLm32sBq3n57hwdxO1JtuSu9LkWTouIA1RLOu0QYykZFCL8a2Hn41NCS-XyDR_Jrw-c_K-2XpOREYztKyUbyfeiMfXktm7Q4dw6SiKBM9VJVPoaiRhkEOAdN5wzW75OCVnQyVnUgl_bXz93Bi1BdY9kk1bX7SED7y2540TzTMq_PQtK44ozG1VvhnwyXdnuAH2CisXJjCl31MuTiJlDn1mbuS1DuFeMDH2q7f5USM' },
  { id: 4, name: 'Zeynep Şahin', avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQm2FqovbNmzBqoQ_wgB3N8fvPZmXYomgo5U2JLkQG1UEfTEGhOtdztymeqmhWs-1VSW53zHwTJV6IcmDRn1F3gdKRcJA_LfdXOTKCccFByR2I8TNhtWZUCTqPaqVvXORcZsfI0-XN7nKaO9jON0cHKzWuEPSZ83WrJh2olTa9w4rJVwQrX56fmsig64z3xmonnGWVa5U9IISN3JW9bn8tDa6UxaraZuxlM7ZYYXxCIR5_L5IvXDtaAVPaTF4HMwlrUFN2aY_UK_U' },
  { id: 5, name: 'Caner Kurt', avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnKbAuFdWrG_9jnJe6FtZ5TcrogCBh--UVt9QYSKkUAmx1MnlFI4SmRS3DzD0GmbfKtq08AzfOZ5fpcY6TxFWIMt4pNQu-elAgq5wSvi0eoBtzXbMMB1xDWCZIlMcgChdbu5uPmZqS-Xcui635Qjssqbh8t_UB01FpwhX3kMA-Klw9mWd09KqC41WGOaTQUw7cGnK3VPUuoX-Uk31wnGGKkPaUyYm5WoUR3-yKjzKBQpxVxyawOXgT0lutZprkkjmw-GOeUsYd84M' },
]

const FILE_ICON_BY_TYPE = {
  pdf: 'picture_as_pdf',
  doc: 'description',
  docx: 'description',
  xls: 'table_chart',
  xlsx: 'table_chart',
  ppt: 'slideshow',
  pptx: 'slideshow',
  txt: 'text_snippet',
  zip: 'folder_zip',
  rar: 'folder_zip',
}

const MOCK_GROUPS = [
  {
    id: 1,
    name: 'Matematik Olimpiyatları',
    description: 'İleri düzey matematik konuları ve olimpiyat hazırlığı için.',
    memberCount: 12,
    members: [
      { id: 1, name: 'Ahmet Çelik', avatarUrl: MOCK_STUDENTS[0].avatarUrl },
      { id: 2, name: 'Elif Kaya', avatarUrl: MOCK_STUDENTS[1].avatarUrl },
      { id: 3, name: 'Mustafa Demir', avatarUrl: MOCK_STUDENTS[2].avatarUrl },
      { id: 4, name: 'Zeynep Şahin', avatarUrl: MOCK_STUDENTS[3].avatarUrl },
    ],
    materials: [
      { id: 'mat-1', type: 'pdf', name: 'Olimpiyat_Matematik_Soruları_2024.pdf', uploadDate: '15.12.2024' },
      { id: 'mat-2', type: 'docx', name: 'Geometri_Çözüm_Teknikleri.docx', uploadDate: '10.12.2024' },
      { id: 'mat-3', type: 'xlsx', name: 'Problem_Seti_Çözümleri.xlsx', uploadDate: '05.12.2024' },
    ],
  },
  {
    id: 2,
    name: 'Fen Bilimleri Kulübü',
    description: 'Deneyler, projeler ve bilimsel tartışmalar için bir araya gelin.',
    memberCount: 8,
    members: [
      { id: 1, name: 'Ahmet Çelik', avatarUrl: MOCK_STUDENTS[0].avatarUrl },
      { id: 2, name: 'Elif Kaya', avatarUrl: MOCK_STUDENTS[1].avatarUrl },
    ],
    materials: [
      { id: 'fen-1', type: 'pdf', name: 'Deney_Raporu_Şablonu.pdf', uploadDate: '20.12.2024' },
      { id: 'fen-2', type: 'pptx', name: 'Kimyasal_Tepkimeler_Sunumu.pptx', uploadDate: '18.12.2024' },
    ],
  },
  {
    id: 3,
    name: 'YKS Hazırlık Grubu',
    description: "Yükseköğretim Kurumları Sınavı'na birlikte hazırlanın.",
    memberCount: 25,
    members: [
      { id: 1, name: 'Ahmet Çelik', avatarUrl: MOCK_STUDENTS[0].avatarUrl },
      { id: 2, name: 'Elif Kaya', avatarUrl: MOCK_STUDENTS[1].avatarUrl },
      { id: 3, name: 'Mustafa Demir', avatarUrl: MOCK_STUDENTS[2].avatarUrl },
      { id: 4, name: 'Zeynep Şahin', avatarUrl: MOCK_STUDENTS[3].avatarUrl },
    ],
    materials: [
      { id: 'yks-1', type: 'pdf', name: 'TYT_Matematik_Deneme_Sınavı.pdf', uploadDate: '22.12.2024' },
      { id: 'yks-2', type: 'pdf', name: 'AYT_Fizik_Soru_Bankası.pdf', uploadDate: '19.12.2024' },
      { id: 'yks-3', type: 'docx', name: 'Türkçe_Paragraf_Soruları.docx', uploadDate: '17.12.2024' },
      { id: 'yks-4', type: 'xlsx', name: 'Sınav_Takvimi.xlsx', uploadDate: '15.12.2024' },
    ],
  },
]

function GroupsPage() {
  const navigate = useNavigate()
  const { registerModal } = useModalStack()
  const [groups, setGroups] = useState(MOCK_GROUPS)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [editingGroupId, setEditingGroupId] = useState(null)
  const [groupForm, setGroupForm] = useState({
    name: '',
    description: '',
    selectedStudents: [],
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
    setEditingGroupId(null)
    setGroupForm({
      name: '',
      description: '',
      selectedStudents: [],
      studentQuery: '',
    })
    setShowCreateModal(true)
  }

  const handleCloseCreateModal = () => {
    setShowCreateModal(false)
    setEditingGroupId(null)
    setGroupForm({
      name: '',
      description: '',
      selectedStudents: [],
      studentQuery: '',
    })
  }

  const handleEditGroup = (group) => {
    setEditingGroupId(group.id)
    setGroupForm({
      name: group.name,
      description: group.description,
      selectedStudents: group.members.map(m => m.id),
      studentQuery: '',
    })
    setShowCreateModal(true)
  }

  const handleOpenDetail = (group) => {
    setSelectedGroup(group)
    setShowDetailModal(true)
  }

  const handleCloseDetailModal = () => {
    setShowDetailModal(false)
    setSelectedGroup(null)
  }

  const handleDeleteGroup = (groupId) => {
    if (window.confirm('Bu grubu silmek istediğinize emin misiniz?')) {
      setGroups((prev) => prev.filter((g) => g.id !== groupId))
      if (selectedGroup?.id === groupId) {
        handleCloseDetailModal()
      }
    }
  }

  const handleRemoveMember = (groupId, memberId) => {
    setGroups((prev) =>
      prev.map((group) => {
        if (group.id === groupId) {
          const updatedMembers = group.members.filter((m) => m.id !== memberId)
          return {
            ...group,
            members: updatedMembers,
            memberCount: updatedMembers.length,
          }
        }
        return group
      })
    )
    if (selectedGroup?.id === groupId) {
      setSelectedGroup((prev) => {
        if (!prev) return null
        const updatedMembers = prev.members.filter((m) => m.id !== memberId)
        return {
          ...prev,
          members: updatedMembers,
          memberCount: updatedMembers.length,
        }
      })
    }
  }

  const filteredStudents = useMemo(() => {
    const query = groupForm.studentQuery.trim().toLowerCase()
    if (!query) return MOCK_STUDENTS
    return MOCK_STUDENTS.filter((student) => student.name.toLowerCase().includes(query))
  }, [groupForm.studentQuery])

  const handleToggleStudent = (studentId) => {
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

    const selectedMembers = MOCK_STUDENTS.filter((s) => groupForm.selectedStudents.includes(s.id))

    if (editingGroupId) {
      // Update existing group
      setGroups((prev) =>
        prev.map((group) =>
          group.id === editingGroupId
            ? {
                ...group,
                name: groupForm.name.trim(),
                description: groupForm.description.trim(),
                members: selectedMembers,
                memberCount: selectedMembers.length,
              }
            : group
        )
      )
    } else {
      // Create new group
      const newGroup = {
        id: Date.now(),
        name: groupForm.name.trim(),
        description: groupForm.description.trim(),
        memberCount: selectedMembers.length,
        members: selectedMembers,
      }
      setGroups((prev) => [...prev, newGroup])
    }

    handleCloseCreateModal()
  }

  useEffect(() => {
    if (!showCreateModal) return undefined
    return registerModal('groups-create-modal', handleCloseCreateModal)
  }, [showCreateModal, registerModal])

  useEffect(() => {
    if (!showDetailModal) return undefined
    return registerModal('groups-detail-modal', handleCloseDetailModal)
  }, [showDetailModal, registerModal])

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
              folder
            </span>
            <span className="sidebar-link__text">Soru Bankası</span>
          </button>

          <button type="button" className="sidebar-link sidebar-link--active">
            <span className="material-symbols-outlined sidebar-link__icon fill" aria-hidden="true">
              group_work
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
        <div className="groups-page">
          <header className="groups-header">
            <div className="groups-header__content">
              <h1 className="groups-title">Öğrenci Gruplarım</h1>
              <p className="groups-subtitle">Oluşturduğunuz öğrenci gruplarını yönetin.</p>
            </div>
            <button type="button" className="groups-create-btn" onClick={handleCreateGroup}>
              <span className="material-symbols-outlined groups-create-btn__icon" aria-hidden="true">
                add
              </span>
              <span>Grup Oluştur</span>
            </button>
          </header>

          <div className="groups-grid">
            {groups.map((group) => (
              <div key={group.id} className="groups-card">
                <div className="groups-card__content">
                  <h3 className="groups-card__title">{group.name}</h3>
                  <p className="groups-card__description">{group.description}</p>
                  <div className="groups-card__members">
                    <span className="material-symbols-outlined groups-card__members-icon" aria-hidden="true">groups</span>
                    <span className="groups-card__members-count">{group.memberCount} Üye</span>
                  </div>
                </div>
                <div className="groups-card__actions">
                  <button
                    type="button"
                    className="groups-card__btn groups-card__btn--detail"
                    onClick={() => handleOpenDetail(group)}
                  >
                    Detayları Gör
                  </button>
                  <button
                    type="button"
                    className="groups-card__btn groups-card__btn--icon"
                    onClick={() => handleEditGroup(group)}
                    aria-label={`${group.name} grubunu düzenle`}
                    title="Düzenle"
                  >
                    <span className="material-symbols-outlined" aria-hidden="true">edit</span>
                  </button>
                  <button
                    type="button"
                    className="groups-card__btn groups-card__btn--icon groups-card__btn--danger"
                    onClick={() => handleDeleteGroup(group.id)}
                    aria-label={`${group.name} grubunu sil`}
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

      {/* Create/Edit Group Modal */}
      {showCreateModal && (
        <div className="groups-modal-overlay" onClick={handleCloseCreateModal}>
          <div className="groups-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="groups-modal-title">{editingGroupId ? 'Grup Düzenle' : 'Yeni Grup Oluştur'}</h3>
            <form onSubmit={handleSubmitGroup} className="groups-modal-form">
              <div className="groups-modal-field">
                <label htmlFor="group-name" className="groups-modal-label">
                  Grup Adı
                </label>
                <input
                  id="group-name"
                  type="text"
                  className="groups-modal-input"
                  placeholder="Grup Adı"
                  value={groupForm.name}
                  onChange={(e) => setGroupForm((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="groups-modal-field">
                <label htmlFor="group-description" className="groups-modal-label">
                  Açıklama
                </label>
                <textarea
                  id="group-description"
                  className="groups-modal-textarea"
                  placeholder="Açıklama"
                  rows={4}
                  value={groupForm.description}
                  onChange={(e) => setGroupForm((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="groups-modal-field">
                <label htmlFor="group-students" className="groups-modal-label">
                  Öğrenci Seçimi
                </label>
                <div className="groups-modal-students-wrapper" id="group-students">
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
                    {filteredStudents.map((student) => {
                      const checked = groupForm.selectedStudents.includes(student.id)
                      return (
                        <label key={student.id} className="groups-modal-students__item" role="listitem">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleToggleStudent(student.id)}
                            className="groups-modal-students__checkbox"
                          />
                          <span className="groups-modal-students__name">{student.name}</span>
                        </label>
                      )
                    })}
                    {filteredStudents.length === 0 && (
                      <div className="groups-modal-students__empty">Öğrenci bulunamadı</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="groups-modal-actions">
                <button type="button" className="groups-modal-btn groups-modal-btn--cancel" onClick={handleCloseCreateModal}>
                  İptal
                </button>
                <button type="submit" className="groups-modal-btn groups-modal-btn--primary">
                  {editingGroupId ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Group Detail Modal */}
      {showDetailModal && selectedGroup && (
        <div className="groups-detail-overlay" onClick={handleCloseDetailModal}>
          <div className="groups-detail-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="groups-detail-close"
              onClick={handleCloseDetailModal}
              aria-label="Modali kapat"
            >
              <span className="material-symbols-outlined" aria-hidden="true">close</span>
            </button>
            <div className="groups-detail-header">
              <div>
                <h3 className="groups-detail-title">{selectedGroup.name}</h3>
                <p className="groups-detail-description">{selectedGroup.description}</p>
              </div>
            </div>

            <h4 className="groups-detail-members-title">Grup Üyeleri ({selectedGroup.memberCount})</h4>
            <div className="groups-detail-members-list">
              {selectedGroup.members.map((member) => (
                <div key={member.id} className="groups-detail-member">
                  <div className="groups-detail-member__info">
                    <div
                      className="groups-detail-member__avatar"
                      style={{ backgroundImage: `url('${member.avatarUrl}')` }}
                      aria-label={`${member.name}'ın profil fotoğrafı`}
                    />
                    <p className="groups-detail-member__name">{member.name}</p>
                  </div>
                  <button
                    type="button"
                    className="groups-detail-member__remove"
                    onClick={() => handleRemoveMember(selectedGroup.id, member.id)}
                    aria-label={`${member.name}'ı gruptan çıkar`}
                    title="Gruptan çıkar"
                  >
                    <span className="material-symbols-outlined" aria-hidden="true">person_remove</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="groups-detail-section">
              <h4 className="groups-detail-section__title">Ders Materyalleri ({(selectedGroup.materials ?? []).length})</h4>
              <div className="groups-detail-materials-list" role="list">
                {(selectedGroup.materials ?? []).map((material) => (
                  <div key={material.id} className="groups-detail-material" role="listitem">
                    <div className="groups-detail-material__icon" aria-hidden="true">
                      <span className="material-symbols-outlined">{FILE_ICON_BY_TYPE[material.type] ?? 'attach_file'}</span>
                    </div>
                    <div className="groups-detail-material__info">
                      <p className="groups-detail-material__name">{material.name}</p>
                      {material.uploadDate && (
                        <p className="groups-detail-material__date">Yüklenme: {material.uploadDate}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      className="groups-detail-material__download"
                      onClick={() => console.log('Download material:', material)}
                      aria-label="Dosyayı indir"
                      title="Dosyayı indir"
                    >
                      <span className="material-symbols-outlined" aria-hidden="true">download</span>
                    </button>
                  </div>
                ))}
                {(selectedGroup.materials ?? []).length === 0 && (
                  <div className="groups-detail-materials__empty">Bu grup için henüz materyal eklenmemiş.</div>
                )}
              </div>
            </div>

            <div className="groups-detail-footer">
              <button type="button" className="groups-detail-close-btn" onClick={handleCloseDetailModal}>
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GroupsPage
