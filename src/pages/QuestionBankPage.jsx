import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setAuthenticated } from '../utils/auth'
import { useModalStack } from '../context/ModalStackContext'
import '../styles/common.css'
import './QuestionBankPage.css'
import './HomeworkAnnouncementsPage.css'

const MOCK_QUESTIONS = [
  {
    id: 1,
    sender: 'Elif Yılmaz',
    date: '22.01.2024',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA84ksU11wLSsRyKJOsKa0izS4Gv6_fkNFVLG-YAthMsLUI6Yr55knzQWwKLde1qFKy1Cn-IV7cEHrJT7QvRaywO5igaWs_DWuvM2bYVY6PXAiH9aLZgtE55domgZk5cWfRwkLtmL3WaS3O2wVNeaHmBNSl5KcF2TIb_JmtUL-FHXWLjIvCXBymY5LWcqYnLZDhMfPVgBThPqsCv6nRLtfLAPaZN940dzSQ3vcN6OARmPqlNXfXHbtf19dqa3cst1Zr_hzbUvrmJ5Y',
    subject: 'Matematik',
    topic: 'Cebirsel İfadeler',
  },
  {
    id: 2,
    sender: 'Mehmet Can',
    date: '21.01.2024',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOqJ-aD_eRltCrVwg39XGyfJxVNHD2LFPHXGk4W1TWJwhkc5ugxLzLMqM4IFHt8xVj5pv3JHdjS4xh0-K0dzG1k7jDAg-nt75c67vdyAydjSiuRAYUtGLVbR77GpAea3uCAWWwMgWYLMlUQphlidYTkUNS2C9Zgu346sqXiwVs8t1op0sxdw2SecUMe-0IdWfA9kMKoiSFJwYR3UpSYr2d706lMxKRB28UXz_eykqJqyyxvJ9N4tCEJd_AynCS6b7pg-R59el_cSw',
    subject: 'Fizik',
    topic: 'Kuvvet ve Hareket',
  },
  {
    id: 3,
    sender: 'Zeynep Demir',
    date: '20.01.2024',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIwNaXUxnQIG3cbF2uTzUIUcQFNF74U_pPanKE96iKhI3iUBviYyJsyeaLep7jNH-zrmuAwY7xQ-CrzZlV39c7RLYW4-LU--3pHRNWqqF_JI3PT-TvGpAIb2gyr7P3kVIEjFZKaDWljaptoxuEgReU_dsSDUL999Fxa0YQn6UDOS4hgB_9FIAAXwIrdMHByQ-_OWb1yL86eJQfEcxdkBjdPeSvBSYN0-VlK1pRA2KJA564XxeDnvnsEP-wBv-6jW8N2ArEbZm5fGY',
    subject: 'Kimya',
    topic: 'Kimyasal Tepkimeler',
  },
  {
    id: 4,
    sender: 'Ali Kaya',
    date: '19.01.2024',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0zTyPVJzdlYrnkS0VLL7UM6anZi6SD6rAo7jG0dvdFk_mfEtmaWBEQJE1lymfgkIw70OuaNEe4jvaCClBImIEOEnDhRwxz1VQn3aekh7KBiaYlchpuYGXMnO_FvZMTBzdKDI8rcLDaPR_iyVxJj68NMP_YD5A23s42dXzde7b8TvgbWDhQjux-tONFEsPBCNUDzjGiTYCEiqYUnt-r07Q6z1UzJrCbu1mhP0LOKSfB7zDzb8LMpuD6b8t9X4HTAMAYnGQaVPtaxo',
    subject: 'Matematik',
    topic: 'Geometri',
  },
  {
    id: 5,
    sender: 'Ayşe Kara',
    date: '18.01.2024',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAF6dJpJC-5-nnAGYcQHeNhtNgE9GrYxdR1Zcl5prg4dDIM5PculYGK4auCOpMBkIpOxOBgJr7zSAi_g_fwWRExdjPtsXM4SX58Ca01W3mtWyF3OhC6KUJiUOxQTYueOsZvFpqxqGA_vGfvciLKBuvpA17hsWuaMgXvLGK8UOrIoNZzUkh3VXWIy97MO71f9ZRK3L_zEvGtKRcRJ27d-7_3OrwscsNBrdGiJcsSpbGabkm-6Ds8Ie-Rklx-VwJe1CNBMfMPhU0f9oI',
    subject: 'Türkçe',
    topic: 'Paragraf',
  },
  {
    id: 6,
    sender: 'Canan Mert',
    date: '17.01.2024',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqNWjE6-Sm4TlOtceNtkFfbnIHkXOSY_Khb7vzAbGNNvHYU6GENkTNtIFJQveSxjzJSPKjX2s7vRA2Avoer0G33dQkzSZgc6FcsNdM6-gzSK6_NbYYjoNnBGy2-wGX_WgwClib0vLPvJfZowRjJVBCzfpyOs6So1tqXJ_2MwHDEhJzmfAmS41XpNqRUWqnh19msEGJLg7L5XyDvhBfLwU0ojRRErb_GB_xX1LoCQbDuJhjlMcdU4zMxTh9eCR7HdDY7aPcgiNwfCc',
    subject: 'Fen Bilimleri',
    topic: 'Elektrik Devreleri',
  },
]

const MOCK_PDFS = [
  {
    id: 1,
    fileName: 'Matematik-Deneme-1.pdf',
    subject: 'Matematik',
    topic: 'Türev',
  },
  {
    id: 2,
    fileName: 'Fizik-Konu-Anlatimi.pdf',
    subject: 'Fizik',
    topic: 'Kaldırma Kuvveti',
  },
  {
    id: 3,
    fileName: 'Kimya-Organik-Notlar.pdf',
    subject: 'Kimya',
    topic: 'Organik Kimya',
  },
]

const MOCK_HOMEWORKS = [
  'Matematik 1. Dönem Tekrar Testi',
  'Fizik Vektörler Soru Çözümü',
  'Haftalık Deneme Sınavı',
]

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

const CLASS_GROUP_OPTIONS = [
  '7. Sınıf',
  '8. Sınıf',
  '9. Sınıf',
  '10. Sınıf',
  '7. Sınıf Grup 1',
  '8. Sınıf Grup 2',
  'Tüm Sınıflar',
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

const SUBJECTS = ['Tüm Dersler', 'Matematik', 'Fizik', 'Kimya', 'Türkçe', 'Fen Bilimleri']
const TOPICS = ['Tüm Konular', 'Cebirsel İfadeler', 'Türev', 'Geometri', 'Kuvvet ve Hareket', 'Kaldırma Kuvveti', 'Kimyasal Tepkimeler', 'Organik Kimya', 'Paragraf', 'Elektrik Devreleri']

function QuestionBankPage() {
  const navigate = useNavigate()
  const { registerModal } = useModalStack()
  const [activeTab, setActiveTab] = useState('questions') // questions | pdfs
  const [selectedSubject, setSelectedSubject] = useState('Tüm Dersler')
  const [selectedTopic, setSelectedTopic] = useState('Tüm Konular')
  const [selectedQuestion, setSelectedQuestion] = useState(null) // for preview modal only
  const [selectedPdf, setSelectedPdf] = useState(null) // for preview modal only
  const [selectedQuestions, setSelectedQuestions] = useState(new Set()) // for multi-select
  const [selectedPdfs, setSelectedPdfs] = useState(new Set()) // for multi-select
  const [showAddToHomeworkModal, setShowAddToHomeworkModal] = useState(false)
  const [showCreateHomeworkModal, setShowCreateHomeworkModal] = useState(false)
  const [selectedHomework, setSelectedHomework] = useState('')
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false)
  const [showTopicDropdown, setShowTopicDropdown] = useState(false)
  const [studentSearchQuery, setStudentSearchQuery] = useState('')
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

  const filteredQuestions = useMemo(() => {
    let filtered = MOCK_QUESTIONS

    if (selectedSubject !== 'Tüm Dersler') {
      filtered = filtered.filter((q) => q.subject === selectedSubject)
    }

    if (selectedTopic !== 'Tüm Konular') {
      filtered = filtered.filter((q) => q.topic === selectedTopic)
    }

    if (studentSearchQuery.trim()) {
      const query = studentSearchQuery.trim().toLowerCase()
      filtered = filtered.filter((q) => q.sender.toLowerCase().includes(query))
    }

    return filtered
  }, [selectedSubject, selectedTopic, studentSearchQuery])

  const filteredPdfs = useMemo(() => {
    let filtered = MOCK_PDFS

    if (selectedSubject !== 'Tüm Dersler') {
      filtered = filtered.filter((p) => p.subject === selectedSubject)
    }

    if (selectedTopic !== 'Tüm Konular') {
      filtered = filtered.filter((p) => p.topic === selectedTopic)
    }

    return filtered
  }, [selectedSubject, selectedTopic])

  const hasActiveFilters = selectedSubject !== 'Tüm Dersler' || selectedTopic !== 'Tüm Konular' || studentSearchQuery.trim() !== ''
  const showEmptyState = activeTab === 'questions' ? filteredQuestions.length === 0 : filteredPdfs.length === 0
  const hasSelectedItems = selectedQuestions.size > 0 || selectedPdfs.size > 0
  const totalSelectedCount = selectedQuestions.size + selectedPdfs.size

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

  const handleClearFilters = () => {
    setSelectedSubject('Tüm Dersler')
    setSelectedTopic('Tüm Konular')
    setStudentSearchQuery('')
    setShowSubjectDropdown(false)
    setShowTopicDropdown(false)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.question-bank-filter-dropdown')) {
        setShowSubjectDropdown(false)
        setShowTopicDropdown(false)
      }
    }

    if (showSubjectDropdown || showTopicDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
    return undefined
  }, [showSubjectDropdown, showTopicDropdown])

  const handleViewQuestion = (question) => {
    setSelectedQuestion(question)
  }

  const handleCloseQuestionModal = () => {
    setSelectedQuestion(null)
  }

  const handleViewPdf = (pdf) => {
    setSelectedPdf(pdf)
  }

  const handleClosePdfModal = () => {
    setSelectedPdf(null)
  }

  const handleToggleQuestionSelection = (questionId, event) => {
    event.stopPropagation()
    setSelectedQuestions((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(questionId)) {
        newSet.delete(questionId)
      } else {
        newSet.add(questionId)
      }
      return newSet
    })
  }

  const handleTogglePdfSelection = (pdfId, event) => {
    event.stopPropagation()
    setSelectedPdfs((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(pdfId)) {
        newSet.delete(pdfId)
      } else {
        newSet.add(pdfId)
      }
      return newSet
    })
  }

  const handleOpenAddToHomeworkModal = () => {
    setShowAddToHomeworkModal(true)
  }

  const handleCloseAddToHomeworkModal = () => {
    setShowAddToHomeworkModal(false)
    setSelectedHomework('')
  }

  const handleOpenCreateHomeworkModal = () => {
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
    setShowCreateHomeworkModal(true)
  }

  const handleCloseCreateHomeworkModal = () => {
    setShowCreateHomeworkModal(false)
  }

  const handleClearSelection = () => {
    setSelectedQuestions(new Set())
    setSelectedPdfs(new Set())
  }

  const handleSubmitAddToHomework = (e) => {
    e.preventDefault()
    // TODO(backend): Add selected questions and PDFs to homework
    const questionIds = Array.from(selectedQuestions)
    const pdfIds = Array.from(selectedPdfs)
    console.log('Add items to homework:', {
      questionIds,
      pdfIds,
      homeworkId: selectedHomework,
    })
    alert(`${totalSelectedCount} öğe ödeve eklendi!`)
    handleCloseAddToHomeworkModal()
    handleClearSelection()
  }

  const selectedQuestionsList = useMemo(() => {
    return filteredQuestions.filter((q) => selectedQuestions.has(q.id))
  }, [filteredQuestions, selectedQuestions])

  const selectedPdfsList = useMemo(() => {
    return filteredPdfs.filter((p) => selectedPdfs.has(p.id))
  }, [filteredPdfs, selectedPdfs])

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

  const handleSubmitCreateHomework = (e) => {
    e.preventDefault()
    const title = homeworkForm.title.trim()
    if (!title) return

    const groupNames = homeworkForm.selectedGroups
    const classNameLabel = groupNames.length > 0 ? groupNames.join(', ') : '—'

    const questionIds = Array.from(selectedQuestions)
    const pdfIds = Array.from(selectedPdfs)

    // TODO(backend): Create homework with selected questions and PDFs
    console.log('Create homework:', {
      title,
      classNameLabel,
      groupNames,
      dueDate: homeworkForm.dueDate,
      description: homeworkForm.description.trim(),
      assignedStudents: homeworkForm.selectedStudents,
      attachments: homeworkForm.files,
      questionIds,
      pdfIds,
    })

    alert('Ödev başarıyla oluşturuldu!')
    setShowCreateHomeworkModal(false)
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
    handleClearSelection()
  }

  useEffect(() => {
    if (!selectedQuestion && !selectedPdf && !showAddToHomeworkModal && !showCreateHomeworkModal) return undefined

    const closeFunctions = []
    if (selectedQuestion) {
      closeFunctions.push(registerModal('question-bank-question-modal', handleCloseQuestionModal))
    }
    if (selectedPdf) {
      closeFunctions.push(registerModal('question-bank-pdf-modal', handleClosePdfModal))
    }
    if (showAddToHomeworkModal) {
      closeFunctions.push(registerModal('question-bank-add-homework-modal', handleCloseAddToHomeworkModal))
    }
    if (showCreateHomeworkModal) {
      closeFunctions.push(registerModal('question-bank-create-homework-modal', handleCloseCreateHomeworkModal))
    }

    return () => {
      closeFunctions.forEach((fn) => fn?.())
    }
  }, [selectedQuestion, selectedPdf, showAddToHomeworkModal, showCreateHomeworkModal, registerModal])

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

          <button type="button" className="sidebar-link sidebar-link--active">
            <span className="material-symbols-outlined sidebar-link__icon fill" aria-hidden="true">
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
        <div className="question-bank-page">
          <header className="question-bank-header">
            <div className="question-bank-header__content">
              <h1 className="question-bank-title">Soru Bankası</h1>
              <p className="question-bank-subtitle">Öğrenciler tarafından gönderilen soruları ve ders materyallerini yönetin.</p>
            </div>
            <button type="button" className="question-bank-add-btn" onClick={() => setShowAddToHomeworkModal(true)}>
              <span className="material-symbols-outlined question-bank-add-btn__icon" aria-hidden="true">
                add_task
              </span>
              <span>Ödev Ekle</span>
            </button>
          </header>

          <div className="question-bank-tabs">
            <button
              type="button"
              className={`question-bank-tab ${activeTab === 'questions' ? 'question-bank-tab--active' : ''}`}
              onClick={() => setActiveTab('questions')}
            >
              Sorular
            </button>
            <button
              type="button"
              className={`question-bank-tab ${activeTab === 'pdfs' ? 'question-bank-tab--active' : ''}`}
              onClick={() => setActiveTab('pdfs')}
            >
              PDF&apos;ler
            </button>
          </div>

          <div className="question-bank-filters">
            <div className="question-bank-search">
              <div className="question-bank-search__wrapper">
                <div className="question-bank-search__icon" aria-hidden="true">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input
                  type="text"
                  className="question-bank-search__input"
                  placeholder="Öğrenci adına göre ara..."
                  value={studentSearchQuery}
                  onChange={(e) => setStudentSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="question-bank-filter-dropdown">
              <button
                type="button"
                className="question-bank-filter-btn"
                onClick={() => {
                  setShowSubjectDropdown(!showSubjectDropdown)
                  setShowTopicDropdown(false)
                }}
              >
                <span className="material-symbols-outlined" aria-hidden="true">book</span>
                <span>{selectedSubject}</span>
                <span className="material-symbols-outlined" aria-hidden="true">expand_more</span>
              </button>
              {showSubjectDropdown && (
                <div className="question-bank-filter-menu">
                  {SUBJECTS.map((subject) => (
                    <button
                      key={subject}
                      type="button"
                      className={`question-bank-filter-menu-item ${selectedSubject === subject ? 'question-bank-filter-menu-item--active' : ''}`}
                      onClick={() => {
                        setSelectedSubject(subject)
                        setShowSubjectDropdown(false)
                      }}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="question-bank-filter-dropdown">
              <button
                type="button"
                className="question-bank-filter-btn"
                onClick={() => {
                  setShowTopicDropdown(!showTopicDropdown)
                  setShowSubjectDropdown(false)
                }}
              >
                <span className="material-symbols-outlined" aria-hidden="true">label</span>
                <span>{selectedTopic}</span>
                <span className="material-symbols-outlined" aria-hidden="true">expand_more</span>
              </button>
              {showTopicDropdown && (
                <div className="question-bank-filter-menu">
                  {TOPICS.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      className={`question-bank-filter-menu-item ${selectedTopic === topic ? 'question-bank-filter-menu-item--active' : ''}`}
                      onClick={() => {
                        setSelectedTopic(topic)
                        setShowTopicDropdown(false)
                      }}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {hasActiveFilters && (
              <button type="button" className="question-bank-filter-clear" onClick={handleClearFilters}>
                <span className="material-symbols-outlined" aria-hidden="true">delete_sweep</span>
                <span>Filtreyi Temizle</span>
              </button>
            )}
          </div>

          {activeTab === 'questions' && (
            <div className="question-bank-content">
              {showEmptyState ? (
                <div className="question-bank-empty">
                  <span className="material-symbols-outlined question-bank-empty__icon" aria-hidden="true">
                    cloud_off
                  </span>
                  <h3 className="question-bank-empty__title">Henüz içerik yok.</h3>
                  <p className="question-bank-empty__text">Bu filtreler ile eşleşen bir sonuç bulunamadı.</p>
                </div>
              ) : (
                <div className="question-bank-grid">
                  {filteredQuestions.map((question) => (
                    <div key={question.id} className="question-bank-card">
                      <div
                        className="question-bank-card__image"
                        style={{ backgroundImage: `url('${question.imageUrl}')` }}
                        aria-label={`${question.sender} tarafından gönderilen soru önizlemesi`}
                      />
                      <div className="question-bank-card__content">
                        <div className="question-bank-card__header">
                          <div>
                            <p className="question-bank-card__sender">Gönderen: {question.sender}</p>
                            <p className="question-bank-card__date">Tarih: {question.date}</p>
                          </div>
                          <button
                            type="button"
                            className={`question-bank-card__add-btn ${selectedQuestions.has(question.id) ? 'question-bank-card__add-btn--selected' : ''}`}
                            onClick={(e) => handleToggleQuestionSelection(question.id, e)}
                            aria-label={selectedQuestions.has(question.id) ? 'Soruyu seçimden çıkar' : 'Soruyu seç'}
                            title={selectedQuestions.has(question.id) ? 'Seçimi kaldır' : 'Seç'}
                          >
                            <span className="material-symbols-outlined" aria-hidden="true">
                              {selectedQuestions.has(question.id) ? 'check' : 'add'}
                            </span>
                          </button>
                        </div>
                        <button
                          type="button"
                          className="question-bank-card__view-link"
                          onClick={() => handleViewQuestion(question)}
                        >
                          Soruyu Görüntüle
                        </button>
                        <button
                          type="button"
                          className="question-bank-card__download"
                          onClick={() => console.log('Download question:', question.id)}
                          aria-label="Soruyu indir"
                          title="İndir"
                        >
                          <span className="material-symbols-outlined" aria-hidden="true">download</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'pdfs' && (
            <div className="question-bank-content">
              {showEmptyState ? (
                <div className="question-bank-empty">
                  <span className="material-symbols-outlined question-bank-empty__icon" aria-hidden="true">
                    cloud_off
                  </span>
                  <h3 className="question-bank-empty__title">Henüz içerik yok.</h3>
                  <p className="question-bank-empty__text">Bu filtreler ile eşleşen bir sonuç bulunamadı.</p>
                </div>
              ) : (
                <div className="question-bank-pdf-list">
                  <div className="question-bank-pdf-header">
                    <div></div>
                    <div></div>
                    <div>DOSYA ADI</div>
                    <div>DERS</div>
                    <div>KONU</div>
                    <div></div>
                  </div>
                  {filteredPdfs.map((pdf) => (
                    <div
                      key={pdf.id}
                      className={`question-bank-pdf-row ${selectedPdfs.has(pdf.id) ? 'question-bank-pdf-row--selected' : ''}`}
                      onClick={() => handleViewPdf(pdf)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleViewPdf(pdf) }}
                    >
                      <button
                        type="button"
                        className={`question-bank-pdf-select-btn ${selectedPdfs.has(pdf.id) ? 'question-bank-pdf-select-btn--selected' : ''}`}
                        onClick={(e) => handleTogglePdfSelection(pdf.id, e)}
                        aria-label={selectedPdfs.has(pdf.id) ? 'PDF\'yi seçimden çıkar' : 'PDF\'yi seç'}
                        title={selectedPdfs.has(pdf.id) ? 'Seçimi kaldır' : 'Seç'}
                      >
                        <span className="material-symbols-outlined" aria-hidden="true">
                          {selectedPdfs.has(pdf.id) ? 'check_circle' : 'add_circle'}
                        </span>
                      </button>
                      <span className="material-symbols-outlined question-bank-pdf-icon" aria-hidden="true">
                        picture_as_pdf
                      </span>
                      <p className="question-bank-pdf-name">{pdf.fileName}</p>
                      <p className="question-bank-pdf-subject">{pdf.subject}</p>
                      <p className="question-bank-pdf-topic">{pdf.topic}</p>
                      <span className="material-symbols-outlined question-bank-pdf-more" aria-hidden="true">
                        more_vert
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Selection Bar */}
          {hasSelectedItems && (
            <div className="question-bank-selection-bar">
              <div className="question-bank-selection-bar__info">
                <span className="question-bank-selection-bar__count">{totalSelectedCount} öğe seçildi</span>
              </div>
              <div className="question-bank-selection-bar__actions">
                <button
                  type="button"
                  className="question-bank-selection-bar__clear"
                  onClick={handleClearSelection}
                >
                  Seçimi Temizle
                </button>
                <button
                  type="button"
                  className="question-bank-selection-bar__btn question-bank-selection-bar__btn--secondary"
                  onClick={handleOpenAddToHomeworkModal}
                >
                  <span className="material-symbols-outlined" aria-hidden="true">add_task</span>
                  Mevcut Ödeve Ekle
                </button>
                <button
                  type="button"
                  className="question-bank-selection-bar__btn question-bank-selection-bar__btn--primary"
                  onClick={handleOpenCreateHomeworkModal}
                >
                  <span className="material-symbols-outlined" aria-hidden="true">add</span>
                  Yeni Ödev Oluştur
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Question Preview Modal */}
      {selectedQuestion && (
        <div className="question-bank-modal-overlay" onClick={handleCloseQuestionModal}>
          <div className="question-bank-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="question-bank-modal-header">
              <h3 className="question-bank-modal-title">Soru Önizleme</h3>
              <button
                type="button"
                className="question-bank-modal-close"
                onClick={handleCloseQuestionModal}
                aria-label="Modali kapat"
              >
                <span className="material-symbols-outlined" aria-hidden="true">close</span>
              </button>
            </div>
            <img
              className="question-bank-modal-image"
              src={selectedQuestion.imageUrl}
              alt={`${selectedQuestion.sender} tarafından gönderilen soru`}
            />
            <div className="question-bank-modal-actions">
              <button
                type="button"
                className="question-bank-modal-btn question-bank-modal-btn--danger"
                onClick={handleCloseQuestionModal}
              >
                Reddet
              </button>
              <button
                type="button"
                className="question-bank-modal-btn question-bank-modal-btn--primary"
                onClick={() => {
                  if (selectedQuestion) {
                    handleToggleQuestionSelection(selectedQuestion.id, { stopPropagation: () => {} })
                  }
                  handleCloseQuestionModal()
                }}
              >
                Seç
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Preview Modal */}
      {selectedPdf && (
        <div className="question-bank-modal-overlay" onClick={handleClosePdfModal}>
          <div className="question-bank-modal-content question-bank-modal-content--pdf" onClick={(e) => e.stopPropagation()}>
            <div className="question-bank-modal-header">
              <h3 className="question-bank-modal-title">PDF Önizleme</h3>
              <button
                type="button"
                className="question-bank-modal-close"
                onClick={handleClosePdfModal}
                aria-label="Modali kapat"
              >
                <span className="material-symbols-outlined" aria-hidden="true">close</span>
              </button>
            </div>
            <div className="question-bank-modal-pdf-preview">
              <div className="question-bank-modal-pdf-placeholder">PDF Preview Area</div>
            </div>
            <div className="question-bank-modal-actions">
              <button
                type="button"
                className="question-bank-modal-btn question-bank-modal-btn--secondary"
                onClick={() => console.log('Download PDF:', selectedPdf.id)}
              >
                <span className="material-symbols-outlined" aria-hidden="true">download</span>
                İndir
              </button>
              <button
                type="button"
                className="question-bank-modal-btn question-bank-modal-btn--primary"
                onClick={() => {
                  if (selectedPdf) {
                    handleTogglePdfSelection(selectedPdf.id, { stopPropagation: () => {} })
                  }
                  handleClosePdfModal()
                }}
              >
                <span className="material-symbols-outlined" aria-hidden="true">add_task</span>
                Seç
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add to Existing Homework Modal */}
      {showAddToHomeworkModal && (
        <div className="question-bank-modal-overlay" onClick={handleCloseAddToHomeworkModal} style={{ zIndex: 101 }}>
          <div className="question-bank-modal-content question-bank-modal-content--homework" onClick={(e) => e.stopPropagation()}>
            <div className="question-bank-modal-header">
              <h3 className="question-bank-modal-title">
                {totalSelectedCount} Öğeyi Ödeve Ekle
              </h3>
              <button
                type="button"
                className="question-bank-modal-close"
                onClick={handleCloseAddToHomeworkModal}
                aria-label="Modali kapat"
              >
                <span className="material-symbols-outlined" aria-hidden="true">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmitAddToHomework} className="question-bank-homework-form">
              <div className="question-bank-homework-field">
                <label htmlFor="homework-select" className="question-bank-homework-label">
                  Mevcut Ödevi Seç
                </label>
                <select
                  id="homework-select"
                  className="question-bank-homework-select"
                  value={selectedHomework}
                  onChange={(e) => setSelectedHomework(e.target.value)}
                >
                  <option value="">Ödev seçin</option>
                  {MOCK_HOMEWORKS.map((hw) => (
                    <option key={hw} value={hw}>
                      {hw}
                    </option>
                  ))}
                </select>
              </div>
              <div className="question-bank-modal-actions">
                <button
                  type="button"
                  className="question-bank-modal-btn question-bank-modal-btn--secondary"
                  onClick={handleCloseAddToHomeworkModal}
                >
                  İptal
                </button>
                <button type="submit" className="question-bank-modal-btn question-bank-modal-btn--primary">
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create New Homework Modal */}
      {showCreateHomeworkModal && (
        <div className="homework-add-overlay" onClick={handleCloseCreateHomeworkModal} role="dialog" aria-modal="true" style={{ zIndex: 101 }}>
          <div className="homework-add-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="homework-add-close" onClick={handleCloseCreateHomeworkModal} aria-label="Modali kapat">
              <span className="material-symbols-outlined" aria-hidden="true">close</span>
            </button>

            <h2 className="homework-add-title">Yeni Ödev Oluştur</h2>

            {/* Selected Items List */}
            {(selectedQuestionsList.length > 0 || selectedPdfsList.length > 0) && (
              <div className="question-bank-selected-items">
                <div className="question-bank-selected-items__title">Seçilen Öğeler ({totalSelectedCount})</div>
                <div className="question-bank-selected-items__list">
                  {selectedQuestionsList.map((q) => (
                    <div key={q.id} className="question-bank-selected-item">
                      <span className="material-symbols-outlined question-bank-selected-item__icon" aria-hidden="true">quiz</span>
                      <span className="question-bank-selected-item__text">Soru: {q.sender} - {q.subject}</span>
                    </div>
                  ))}
                  {selectedPdfsList.map((p) => (
                    <div key={p.id} className="question-bank-selected-item">
                      <span className="material-symbols-outlined question-bank-selected-item__icon" aria-hidden="true">picture_as_pdf</span>
                      <span className="question-bank-selected-item__text">PDF: {p.fileName}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <form className="homework-add-form" onSubmit={handleSubmitCreateHomework}>
              <div className="homework-add-grid">
                <div className="homework-add-left">
                  <div className="homework-add-field">
                    <label className="homework-add-label" htmlFor="hw-title-qb">Ödev Başlığı</label>
                    <input
                      id="hw-title-qb"
                      className="homework-add-input"
                      placeholder="Örn: Matematik Ödevi"
                      value={homeworkForm.title}
                      onChange={(e) => setHomeworkForm((prev) => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="homework-add-field">
                    <label className="homework-add-label" htmlFor="hw-due-qb">Son Teslim Tarihi</label>
                    <input
                      id="hw-due-qb"
                      className="homework-add-input"
                      type="date"
                      value={homeworkForm.dueDate}
                      onChange={(e) => setHomeworkForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                    />
                  </div>

                  <div className="homework-add-field">
                    <label className="homework-add-label" htmlFor="hw-desc-qb">Açıklama</label>
                    <textarea
                      id="hw-desc-qb"
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
                <button type="button" className="homework-add-btn-secondary" onClick={handleCloseCreateHomeworkModal}>
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

export default QuestionBankPage

