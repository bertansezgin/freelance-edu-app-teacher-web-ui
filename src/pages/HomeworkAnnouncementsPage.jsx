import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setAuthenticated } from '../utils/auth'
import { useModalStack } from '../context/ModalStackContext'
import '../styles/common.css'
import './HomeworkAnnouncementsPage.css'

const MOCK_HOMEWORKS = [
  {
    id: 1,
    title: 'Matematik Ödevi - Cebirsel İfadeler',
    className: '8-A',
    dueDate: '25.12.2024',
    description:
      'Cebirsel ifadeler konusundaki 1-20 arası soruları çözün. Çözümleri defterinize yazarak, gerekli adımları gösterin.',
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
    attachments: [{ id: 'an-1-a', type: 'pdf', name: 'Veli_Toplantısı_Bilgilendirme.pdf' }],
  },
  {
    id: 2,
    title: 'Deneme Sınavı Programı Yayınlandı',
    className: '8-A',
    date: '23.12.2024',
    description:
      'Deneme sınavı programı yayınlanmıştır. Sınav saatleri ve salon bilgileri için ek dosyayı inceleyebilirsiniz.',
    attachments: [{ id: 'an-2-a', type: 'xls', name: 'Deneme_Sınavı_Programı.xlsx' }],
  },
]

const FILE_ICON_BY_TYPE = {
  pdf: 'picture_as_pdf',
  doc: 'description',
  xls: 'grid_on',
  ppt: 'slideshow',
}

function HomeworkAnnouncementsPage() {
  const navigate = useNavigate()
  const { registerModal } = useModalStack()
  const [activeTab, setActiveTab] = useState('homeworks') // homeworks | announcements
  const [selectedItem, setSelectedItem] = useState(null) // { ...item, itemType: 'homeworks' | 'announcements' }

  const items = useMemo(() => {
    return activeTab === 'homeworks' ? MOCK_HOMEWORKS : MOCK_ANNOUNCEMENTS
  }, [activeTab])

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
    // TODO: Ödev/Duyuru ekleme modalı
    console.log('Add', activeTab)
  }

  const handleEdit = (itemType, id) => {
    // TODO: Düzenleme modalı
    console.log('Edit', itemType, id)
  }

  const handleDelete = (itemType, id) => {
    // TODO: Silme işlemi
    console.log('Delete', itemType, id)
  }

  const handleOpenDetail = (item) => {
    setSelectedItem({ ...item, itemType: activeTab })
  }

  const handleCloseDetail = () => {
    setSelectedItem(null)
  }

  useEffect(() => {
    if (!selectedItem) return undefined
    return registerModal('homework-detail', handleCloseDetail)
  }, [selectedItem, registerModal])

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
                  <div className="homework-modal-files__empty">Bu öğe için ek dosya yok.</div>
                )}
              </div>
            </div>

            <div className="homework-modal-actions">
              <button type="button" className="homework-modal-btn homework-modal-btn--secondary" onClick={handleCloseDetail}>
                Kapat
              </button>
              <button
                type="button"
                className="homework-modal-btn homework-modal-btn--secondary"
                onClick={() => handleEdit(selectedItem.itemType, selectedItem.id)}
              >
                Düzenle
              </button>
              <button
                type="button"
                className="homework-modal-btn homework-modal-btn--danger"
                onClick={() => handleDelete(selectedItem.itemType, selectedItem.id)}
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomeworkAnnouncementsPage


