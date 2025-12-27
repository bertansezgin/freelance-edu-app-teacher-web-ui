import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setAuthenticated } from '../utils/auth'
import { useModalStack } from '../context/ModalStackContext'
import '../styles/common.css'
import './SchedulePage.css'

const LESSON_DURATION_MINUTES = 45

const DAYS_OF_WEEK = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma']
const TURKISH_WEEKDAYS_BY_JS = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']
const WEEKDAY_HEADERS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']

const MOCK_STUDENTS = [
  'Ahmet Yılmaz',
  'Zeynep Kaya',
  'Mehmet Öztürk',
  'Fatma Demir',
  'Ali Can',
  'Elif Kaya',
  'Can Demir',
  'Selin Polat',
  'Kaan Güneş',
  'Deniz Aksoy',
]

const MOCK_GROUPS = [
  '8A',
  '7B',
  '6C',
  '9A',
  '10B',
  '8A Grup 1',
  '7B Grup 2',
  'TYT Grup',
]

function addMinutesToTimeHHMM(timeHHMM, minutesToAdd) {
  const [hh, mm] = timeHHMM.split(':').map((value) => Number(value))
  if (Number.isNaN(hh) || Number.isNaN(mm)) return timeHHMM

  const total = hh * 60 + mm + minutesToAdd
  const wrapped = ((total % (24 * 60)) + (24 * 60)) % (24 * 60)
  const nextHH = String(Math.floor(wrapped / 60)).padStart(2, '0')
  const nextMM = String(wrapped % 60).padStart(2, '0')
  return `${nextHH}:${nextMM}`
}

function getMondayOfWeek(date) {
  const copied = new Date(date)
  const jsDay = copied.getDay() // 0=Sun..6=Sat
  const mondayBased = (jsDay + 6) % 7 // 0=Mon..6=Sun
  copied.setDate(copied.getDate() - mondayBased)
  copied.setHours(0, 0, 0, 0)
  return copied
}

function getDateString(date) {
  return date.toISOString().split('T')[0]
}

function getInitialMockLessons() {
  const monday = getMondayOfWeek(new Date())
  const mondayStr = getDateString(monday)
  
  return [
    {
      id: 1,
      day: 'Pazartesi',
      subject: 'Matematik',
      className: '8A',
      description: 'Yeni konu anlatımı + kısa ödev kontrolü.',
      startTime: '09:00',
      endTime: '09:45',
      participants: ['Elif Kaya', 'Can Demir', 'Zeynep Yılmaz', 'Ahmet Arslan', 'Büşra Çetin', 'Deniz Aksoy'],
      weekStartDate: mondayStr,
    },
    {
      id: 2,
      day: 'Salı',
      subject: 'Fen Bilimleri',
      className: '7B',
      description: 'Deney raporu değerlendirmesi.',
      startTime: '10:00',
      endTime: '10:45',
      participants: ['Mert Savaş', 'Gül Şen', 'Kerem Tunç', 'Ece Yücel'],
      weekStartDate: mondayStr,
    },
    {
      id: 3,
      day: 'Çarşamba',
      subject: 'Türkçe',
      className: '6C',
      description: '',
      startTime: '13:00',
      endTime: '13:45',
      participants: ['Ozan Yıldız', 'Ayşe Deniz', 'Burak Öztürk', 'Selin Polat', 'Kaan Güneş'],
      weekStartDate: mondayStr,
    }
  ]
}

function formatShortTurkishDate(date) {
  return new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'long' }).format(date)
}

function startOfDay(date) {
  const copied = new Date(date)
  copied.setHours(0, 0, 0, 0)
  return copied
}

function addMonths(date, monthsToAdd) {
  const copied = new Date(date)
  copied.setMonth(copied.getMonth() + monthsToAdd)
  return copied
}

function addDays(date, daysToAdd) {
  const copied = new Date(date)
  copied.setDate(copied.getDate() + daysToAdd)
  return copied
}

function buildMonthMatrix(monthDate) {
  const first = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1)
  const last = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0)

  const start = getMondayOfWeek(first)
  const end = new Date(last)
  const endJsDay = end.getDay()
  const sundayBased = (7 - endJsDay) % 7 // 0 if Sunday, else days to add
  end.setDate(end.getDate() + sundayBased)
  end.setHours(0, 0, 0, 0)

  const weeks = []
  const cursor = new Date(start)
  while (cursor <= end) {
    const week = []
    for (let i = 0; i < 7; i += 1) {
      const cellDate = new Date(cursor)
      week.push({
        date: cellDate,
        inMonth: cellDate.getMonth() === monthDate.getMonth(),
        key: `${cellDate.getFullYear()}-${String(cellDate.getMonth() + 1).padStart(2, '0')}-${String(cellDate.getDate()).padStart(2, '0')}`,
      })
      cursor.setDate(cursor.getDate() + 1)
    }
    weeks.push(week)
  }
  return weeks
}

function SchedulePage() {
  const navigate = useNavigate()
  const { registerModal } = useModalStack()
  const [showLessonModal, setShowLessonModal] = useState(false)
  const [lessonModalMode, setLessonModalMode] = useState('add') // add | edit
  const [editingSeriesId, setEditingSeriesId] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null) // lesson object
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState(null) // for detail modal
  const [lessons, setLessons] = useState(getInitialMockLessons)
  const [scheduleView, setScheduleView] = useState('week') // week | month | quarter
  const [viewingWeekStart, setViewingWeekStart] = useState(() => getMondayOfWeek(new Date()))
  // TODO(backend): Replace this with "today" coming from backend (server time / user's timezone decision).
  const backendToday = useMemo(() => startOfDay(new Date()), [])

  const [lessonForm, setLessonForm] = useState({
    startTime: '',
    subject: '',
    day: 'Pazartesi',
    groupQuery: '',
    selectedGroups: [],
    description: '',
    repeatWeeks: 1,
    studentQuery: '',
    selectedStudents: [],
  })

  const viewingWeekStartStr = useMemo(() => getDateString(viewingWeekStart), [viewingWeekStart])

  const lessonsByDay = useMemo(() => {
    const grouped = {}
    DAYS_OF_WEEK.forEach((day) => {
      grouped[day] = lessons.filter((lesson) => {
        // Sadece görüntülenen haftaya ait dersleri filtrele
        if (lesson.weekStartDate) {
          return lesson.day === day && lesson.weekStartDate === viewingWeekStartStr
        }
        // Eski veri için (weekStartDate yoksa) tüm dersleri göster
        return lesson.day === day
      })
    })
    return grouped
  }, [lessons, viewingWeekStartStr])

  const calendarLessonTemplates = useMemo(() => {
    // TODO(backend): This is a temporary adapter.
    // We currently only have weekly lesson "templates" (weekday + startTime) in local state.
    // When backend is integrated, lessons should come with a concrete date (YYYY-MM-DD) or a startDate,
    // plus recurrence info (e.g. weekly for N weeks, or an RRULE-like structure).
    // Then calendar rendering must be date-based (not weekday-based) and timezone-safe.
    const byKey = new Map()
    lessons.forEach((lesson) => {
      const key = `${lesson.day}|${lesson.startTime}|${lesson.subject}|${lesson.className}`
      if (!byKey.has(key)) byKey.set(key, lesson)
    })
    return Array.from(byKey.values())
  }, [lessons])

  const calendarRangeStart = useMemo(() => backendToday, [backendToday])
  const calendarRangeEnd = useMemo(() => {
    if (scheduleView === 'month') return addMonths(calendarRangeStart, 1)
    if (scheduleView === 'quarter') return addMonths(calendarRangeStart, 3)
    return null
  }, [scheduleView, calendarRangeStart])

  const visibleMonths = useMemo(() => {
    if (!calendarRangeEnd) return []
    const months = []
    const cursor = new Date(calendarRangeStart.getFullYear(), calendarRangeStart.getMonth(), 1)
    while (cursor < calendarRangeEnd) {
      months.push(new Date(cursor))
      cursor.setMonth(cursor.getMonth() + 1)
    }
    return months
  }, [calendarRangeStart, calendarRangeEnd])

  const rangeLabel = useMemo(() => {
    if (!calendarRangeEnd) return ''
    const startLabel = new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' }).format(calendarRangeStart)
    const endInclusive = addDays(calendarRangeEnd, -1)
    const endLabel = new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' }).format(endInclusive)
    return `${startLabel} - ${endLabel}`
  }, [calendarRangeStart, calendarRangeEnd])

  const filteredStudents = useMemo(() => {
    const query = lessonForm.studentQuery.trim().toLowerCase()
    if (!query) return MOCK_STUDENTS
    return MOCK_STUDENTS.filter((student) => student.toLowerCase().includes(query))
  }, [lessonForm.studentQuery])

  const filteredGroups = useMemo(() => {
    const query = lessonForm.groupQuery.trim().toLowerCase()
    if (!query) return MOCK_GROUPS
    return MOCK_GROUPS.filter((group) => group.toLowerCase().includes(query))
  }, [lessonForm.groupQuery])

  const weekDatesByDay = useMemo(() => {
    const map = {}
    DAYS_OF_WEEK.forEach((day, idx) => {
      const date = new Date(viewingWeekStart)
      date.setDate(viewingWeekStart.getDate() + idx)
      map[day] = date
    })
    return map
  }, [viewingWeekStart])

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

  const handleAddLesson = () => {
    setLessonModalMode('add')
    setEditingSeriesId(null)
    setLessonForm({
      startTime: '',
      subject: '',
      day: 'Pazartesi',
      groupQuery: '',
      selectedGroups: [],
      description: '',
      repeatWeeks: 1,
      studentQuery: '',
      selectedStudents: [],
    })
    setShowLessonModal(true)
  }

  const handleCloseModal = () => {
    setShowLessonModal(false)
    setLessonModalMode('add')
    setEditingSeriesId(null)
    setLessonForm({
      startTime: '',
      subject: '',
      day: 'Pazartesi',
      groupQuery: '',
      selectedGroups: [],
      description: '',
      repeatWeeks: 1,
      studentQuery: '',
      selectedStudents: [],
    })
  }

  const handleEditLesson = (lesson) => {
    setLessonModalMode('edit')
    setEditingSeriesId(lesson.seriesId ?? lesson.id)
    const existingGroups = Array.isArray(lesson.groupNames)
      ? lesson.groupNames
      : lesson.className && lesson.className !== '—'
        ? [lesson.className]
        : []
    setLessonForm({
      startTime: lesson.startTime ?? '',
      subject: lesson.subject ?? '',
      day: lesson.day ?? 'Pazartesi',
      groupQuery: '',
      selectedGroups: existingGroups,
      description: lesson.description ?? '',
      repeatWeeks: lesson.seriesWeekCount ?? 1,
      studentQuery: '',
      selectedStudents: lesson.participants ?? [],
    })
    setShowLessonModal(true)
  }

  const handleOpenDeleteModal = (lesson) => {
    setDeleteTarget(lesson)
    setShowDeleteModal(true)
  }

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false)
    setDeleteTarget(null)
  }

  const handleConfirmDelete = () => {
    if (!deleteTarget) return

    const targetSeriesId = deleteTarget.seriesId ?? deleteTarget.id
    const seriesCount = lessons.filter((l) => l.seriesId === targetSeriesId).length

    setLessons((prev) => {
      if (seriesCount > 1) return prev.filter((l) => l.seriesId !== targetSeriesId)
      return prev.filter((l) => l.id !== deleteTarget.id)
    })

    setShowDeleteModal(false)
    setDeleteTarget(null)
  }

  useEffect(() => {
    if (!showLessonModal) return undefined
    return registerModal('schedule-lesson-modal', handleCloseModal)
  }, [showLessonModal, registerModal])

  useEffect(() => {
    if (!showDeleteModal) return undefined
    return registerModal('schedule-delete-confirm', handleCloseDeleteModal)
  }, [showDeleteModal, registerModal])

  useEffect(() => {
    if (!selectedLesson) return undefined
    return registerModal('schedule-lesson-detail', handleCloseLessonDetail)
  }, [selectedLesson, registerModal])

  const handleToggleStudent = (studentName) => {
    setLessonForm((prev) => {
      const exists = prev.selectedStudents.includes(studentName)
      return {
        ...prev,
        selectedStudents: exists
          ? prev.selectedStudents.filter((name) => name !== studentName)
          : [...prev.selectedStudents, studentName],
      }
    })
  }

  const handleToggleGroup = (groupName) => {
    setLessonForm((prev) => {
      const exists = prev.selectedGroups.includes(groupName)
      return {
        ...prev,
        selectedGroups: exists
          ? prev.selectedGroups.filter((name) => name !== groupName)
          : [...prev.selectedGroups, groupName],
      }
    })
  }

  const handleLessonSubmit = (e) => {
    e.preventDefault()

    const startTime = lessonForm.startTime
    const subject = lessonForm.subject.trim()
    const day = lessonForm.day
    if (!startTime || !subject || !day) return

    const repeatWeeks = Number(lessonForm.repeatWeeks) || 1
    const safeRepeatWeeks = Math.min(Math.max(repeatWeeks, 1), 12)
    const seriesId = lessonModalMode === 'edit' ? (editingSeriesId ?? Date.now()) : Date.now()
    const endTime = addMinutesToTimeHHMM(startTime, LESSON_DURATION_MINUTES)
    const description = lessonForm.description.trim()
    const groupNames = lessonForm.selectedGroups
    const classNameLabel = groupNames.length > 0 ? groupNames.join(', ') : '—'

    // Her hafta için ayrı ders oluştur, her birine o haftanın başlangıç tarihini ekle
    const baseMonday = getMondayOfWeek(new Date())
    const newLessons = Array.from({ length: safeRepeatWeeks }, (_, index) => {
      const weekStart = addDays(baseMonday, index * 7)
      return {
        id: seriesId + index,
        seriesId,
        seriesWeekIndex: index + 1,
        seriesWeekCount: safeRepeatWeeks,
        day,
        subject,
        className: classNameLabel,
        groupNames,
        description,
        startTime,
        endTime,
        participants: lessonForm.selectedStudents,
        weekStartDate: getDateString(weekStart),
      }
    })

    setLessons((prev) => {
      if (lessonModalMode !== 'edit' || !editingSeriesId) return [...prev, ...newLessons]
      const withoutSeries = prev.filter((l) => l.seriesId !== editingSeriesId)
      return [...withoutSeries, ...newLessons]
    })

    setShowLessonModal(false)
    setLessonForm({
      startTime: '',
      subject: '',
      day: 'Pazartesi',
      groupQuery: '',
      selectedGroups: [],
      description: '',
      repeatWeeks: 1,
      studentQuery: '',
      selectedStudents: [],
    })
  }

  const handleOpenLessonDetail = (lesson) => {
    setSelectedLesson(lesson)
  }

  const handleCloseLessonDetail = () => {
    setSelectedLesson(null)
  }

  const renderLessonCard = (lesson) => (
    <div
      key={lesson.id}
      className="schedule-lesson-card schedule-lesson-card--clickable"
      onClick={() => handleOpenLessonDetail(lesson)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleOpenLessonDetail(lesson) }}
    >
      <div className="schedule-lesson-header">
        <div className="schedule-lesson-header__top">
          <div className="schedule-lesson-header__text">
            <p className="schedule-lesson-title">{lesson.subject}</p>
            <p className="schedule-lesson-class">Sınıf / Grup: {lesson.className}</p>
            {lesson.description ? <p className="schedule-lesson-description">{lesson.description}</p> : null}
          </div>
          <div className="schedule-lesson-actions">
            <button
              type="button"
              className="schedule-lesson-edit"
              onClick={(e) => { e.stopPropagation(); handleEditLesson(lesson) }}
              aria-label={`${lesson.subject} dersini düzenle`}
              title="Dersi düzenle"
            >
              <span className="material-symbols-outlined" aria-hidden="true">edit</span>
            </button>
            <button
              type="button"
              className="schedule-lesson-delete"
              onClick={(e) => { e.stopPropagation(); handleOpenDeleteModal(lesson) }}
              aria-label={`${lesson.subject} dersini sil`}
              title="Dersi sil"
            >
              <span className="material-symbols-outlined" aria-hidden="true">delete</span>
            </button>
          </div>
        </div>
        <p className="schedule-lesson-time">
          {lesson.startTime} - {lesson.endTime}
          {lesson.seriesWeekCount > 1 ? ` • Hafta ${lesson.seriesWeekIndex}/${lesson.seriesWeekCount}` : ''}
        </p>
      </div>
      <div className="schedule-lesson-participants">
        <p className="schedule-lesson-participants-title">Katılımcılar</p>
        <div className="schedule-lesson-participants-list">
          {lesson.participants.map((participant, index) => (
            <p key={index} className="schedule-lesson-participants-item">{participant}</p>
          ))}
        </div>
      </div>
    </div>
  )

  const getLessonsForDate = (date) => {
    // TODO(backend): Replace weekday matching with real date matching:
    // - If backend returns instances: filter by lesson.date === cellDate (local TZ vs UTC handling!)
    // - If backend returns recurrence rules: expand occurrences for the visible range (month/quarter)
    //   either server-side (recommended) or via a lightweight client expander.
    const dayName = TURKISH_WEEKDAYS_BY_JS[date.getDay()]
    const matches = calendarLessonTemplates
      .filter((lesson) => lesson.day === dayName)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
    return matches
  }

  const renderCalendarMonth = (dateForMonth, isMini) => {
    const matrix = buildMonthMatrix(dateForMonth)
    const formatter = new Intl.DateTimeFormat('tr-TR', { month: 'long', year: isMini ? undefined : 'numeric' })
    const headerLabel = formatter.format(dateForMonth)

    return (
      <section className={`schedule-calendar ${isMini ? 'schedule-calendar--mini' : ''}`}>
        <div className="schedule-calendar__month-title">{headerLabel}</div>
        <div className="schedule-calendar__weekday-row" aria-hidden="true">
          {WEEKDAY_HEADERS.map((label) => (
            <div key={label} className="schedule-calendar__weekday">{label}</div>
          ))}
        </div>
        <div className="schedule-calendar__grid" role="grid" aria-label={headerLabel}>
          {matrix.map((week, weekIdx) => (
            <div key={weekIdx} className="schedule-calendar__week" role="row">
              {week.map((cell) => {
                const inRange = calendarRangeEnd
                  ? cell.date >= calendarRangeStart && cell.date < calendarRangeEnd
                  : true
                if (!inRange) {
                  return (
                    <div
                      key={cell.key}
                      className="schedule-calendar__cell schedule-calendar__cell--disabled"
                      role="gridcell"
                      aria-disabled="true"
                    />
                  )
                }

                const lessonsForDate = getLessonsForDate(cell.date)
                const visible = lessonsForDate.slice(0, isMini ? 1 : 3)
                const remaining = lessonsForDate.length - visible.length

                return (
                  <div
                    key={cell.key}
                    className={`schedule-calendar__cell ${cell.inMonth ? '' : 'schedule-calendar__cell--muted'}`}
                    role="gridcell"
                  >
                    <div className="schedule-calendar__day-number">{cell.date.getDate()}</div>
                    <div className="schedule-calendar__chips">
                      {visible.map((lesson) => (
                        <div key={`${cell.key}-${lesson.id}`} className="schedule-calendar__chip" title={`${lesson.subject} ${lesson.startTime}`}>
                          <span className="schedule-calendar__chip-time">{lesson.startTime}</span>
                          <span className="schedule-calendar__chip-text">{lesson.subject}</span>
                          <span className="schedule-calendar__chip-subtext">{lesson.className}</span>
                        </div>
                      ))}
                      {remaining > 0 && !isMini && (
                        <div className="schedule-calendar__more">+{remaining}</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </section>
    )
  }

  const renderDayCard = (day) => (
    <div key={day} className="schedule-day-card">
      <div className="schedule-day-title-row">
        <h3 className="schedule-day-title">{day}</h3>
        <span className="schedule-day-date">{formatShortTurkishDate(weekDatesByDay[day])}</span>
      </div>
      <div className="schedule-day-lessons">
        {lessonsByDay[day].length > 0 ? (
          lessonsByDay[day].map(renderLessonCard)
        ) : (
          <div className="schedule-empty-state">
            <p className="schedule-empty-text">Bu gün ders yok</p>
          </div>
        )}
      </div>
    </div>
  )

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
              calendar_month
            </span>
            <span className="sidebar-link__text">Ders Programı</span>
          </button>

          <button type="button" className="sidebar-link" onClick={() => handleNavigation('homework')}>
            <span className="material-symbols-outlined sidebar-link__icon" aria-hidden="true">
              assignment
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
        <div className="schedule-page">
          <header className="schedule-header">
            <div className="schedule-header-content">
              <h1 className="schedule-title">Ders Programım</h1>
              <p className="schedule-subtitle">Bu hafta için planlanmış derslerinizi buradan görüntüleyebilir ve yönetebilirsiniz.</p>
            </div>
            <button type="button" className="schedule-add-lesson-btn" onClick={handleAddLesson}>
              <span className="material-symbols-outlined schedule-add-lesson-btn__icon" aria-hidden="true">
                add
              </span>
              <span>Ders Ekle</span>
            </button>
          </header>

          <div className="schedule-range-toggle" role="tablist" aria-label="Ders programı görünümü">
            <button
              type="button"
              className={`schedule-range-toggle__btn ${scheduleView === 'week' ? 'schedule-range-toggle__btn--active' : ''}`}
              onClick={() => setScheduleView('week')}
              role="tab"
              aria-selected={scheduleView === 'week'}
            >
              Haftalık
            </button>
            <button
              type="button"
              className={`schedule-range-toggle__btn ${scheduleView === 'month' ? 'schedule-range-toggle__btn--active' : ''}`}
              onClick={() => setScheduleView('month')}
              role="tab"
              aria-selected={scheduleView === 'month'}
            >
              Aylık
            </button>
            <button
              type="button"
              className={`schedule-range-toggle__btn ${scheduleView === 'quarter' ? 'schedule-range-toggle__btn--active' : ''}`}
              onClick={() => setScheduleView('quarter')}
              role="tab"
              aria-selected={scheduleView === 'quarter'}
            >
              3 Aylık
            </button>
          </div>

          {scheduleView === 'week' && (
            <>
              <div className="schedule-week-nav">
                <button
                  type="button"
                  className="schedule-week-nav__btn"
                  onClick={() => setViewingWeekStart((prev) => addDays(prev, -7))}
                  aria-label="Önceki hafta"
                >
                  <span className="material-symbols-outlined" aria-hidden="true">chevron_left</span>
                </button>
                <div className="schedule-week-nav__label">
                  {formatShortTurkishDate(viewingWeekStart)} - {formatShortTurkishDate(addDays(viewingWeekStart, 4))}
                </div>
                <button
                  type="button"
                  className="schedule-week-nav__btn"
                  onClick={() => setViewingWeekStart((prev) => addDays(prev, 7))}
                  aria-label="Sonraki hafta"
                >
                  <span className="material-symbols-outlined" aria-hidden="true">chevron_right</span>
                </button>
                <button
                  type="button"
                  className="schedule-week-nav__today"
                  onClick={() => setViewingWeekStart(getMondayOfWeek(new Date()))}
                >
                  Bugün
                </button>
              </div>
              <div className="schedule-grid">
                {DAYS_OF_WEEK.map(renderDayCard)}
              </div>
            </>
          )}

          {scheduleView !== 'week' && (
            <div className="schedule-calendar-shell">
              <div className="schedule-calendar-shell__header">
                <div className="schedule-calendar-shell__title">
                  {scheduleView === 'quarter' ? `3 Aylık Görünüm • ${rangeLabel}` : rangeLabel}
                </div>
              </div>

              {scheduleView === 'month' && visibleMonths[0] && renderCalendarMonth(visibleMonths[0], false)}
              {scheduleView === 'quarter' && (
                <div className="schedule-calendar-quarter">
                  {visibleMonths.slice(0, 3).map((month) => (
                    <div key={`${month.getFullYear()}-${month.getMonth()}`} className="schedule-calendar-quarter__item">
                      {renderCalendarMonth(month, true)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Add Lesson Modal */}
      {showLessonModal && (
        <div className="schedule-modal-overlay" onClick={handleCloseModal}>
          <div className="schedule-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="schedule-modal-close"
              onClick={handleCloseModal}
              aria-label="Modali kapat"
            >
              <span className="material-symbols-outlined" aria-hidden="true">close</span>
            </button>
            <h2 className="schedule-modal-title">{lessonModalMode === 'edit' ? 'Ders Düzenle' : 'Ders Ekle'}</h2>

            <form onSubmit={handleLessonSubmit} className="schedule-modal-form">
              <div className="schedule-modal-form-group">
                <label htmlFor="lesson-time" className="schedule-modal-label">
                  Ders Saati<span className="schedule-modal-required" aria-hidden="true">*</span>
                </label>
                <input
                  className="schedule-modal-input"
                  id="lesson-time"
                  required
                  type="time"
                  value={lessonForm.startTime}
                  onChange={(e) => setLessonForm((prev) => ({ ...prev, startTime: e.target.value }))}
                />
              </div>

              <div className="schedule-modal-form-group">
                <label htmlFor="lesson-name-modal" className="schedule-modal-label">
                  Dersin İsmi<span className="schedule-modal-required" aria-hidden="true">*</span>
                </label>
                <input
                  className="schedule-modal-input"
                  id="lesson-name-modal"
                  placeholder="Örn: Matematik"
                  required
                  type="text"
                  value={lessonForm.subject}
                  onChange={(e) => setLessonForm((prev) => ({ ...prev, subject: e.target.value }))}
                />
              </div>

              <div className="schedule-modal-form-group">
                <label htmlFor="lesson-day" className="schedule-modal-label">
                  Dersin Günü<span className="schedule-modal-required" aria-hidden="true">*</span>
                </label>
                <select
                  id="lesson-day"
                  className="schedule-modal-select"
                  required
                  value={lessonForm.day}
                  onChange={(e) => setLessonForm((prev) => ({ ...prev, day: e.target.value }))}
                >
                  {DAYS_OF_WEEK.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>

                <div className="schedule-modal-repeat" role="group" aria-label="Dersi kaç hafta eklemek istiyorsunuz?">
                  <button
                    type="button"
                    className={`schedule-modal-repeat-btn ${lessonForm.repeatWeeks === 1 ? 'schedule-modal-repeat-btn--active' : ''}`}
                    onClick={() => setLessonForm((prev) => ({ ...prev, repeatWeeks: 1 }))}
                  >
                    1 Haftalık Ekle
                  </button>
                  <button
                    type="button"
                    className={`schedule-modal-repeat-btn ${lessonForm.repeatWeeks === 4 ? 'schedule-modal-repeat-btn--active' : ''}`}
                    onClick={() => setLessonForm((prev) => ({ ...prev, repeatWeeks: 4 }))}
                  >
                    4 Haftalık Ekle
                  </button>
                  <button
                    type="button"
                    className={`schedule-modal-repeat-btn ${lessonForm.repeatWeeks === 12 ? 'schedule-modal-repeat-btn--active' : ''}`}
                    onClick={() => setLessonForm((prev) => ({ ...prev, repeatWeeks: 12 }))}
                  >
                    12 Haftalık Ekle
                  </button>
                </div>
              </div>

              <div className="schedule-modal-form-group">
                <label htmlFor="lesson-description" className="schedule-modal-label">Açıklama</label>
                <textarea
                  id="lesson-description"
                  className="schedule-modal-textarea"
                  placeholder="Dersle ilgili not ekleyin (isteğe bağlı)"
                  value={lessonForm.description}
                  onChange={(e) => setLessonForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={4}
                />
              </div>

              <div className="schedule-modal-form-group">
                <label htmlFor="group-selection" className="schedule-modal-label">Sınıf / Grup seçin</label>
                <div className="schedule-modal-groups" id="group-selection">
                  <div className="schedule-modal-groups__search">
                    <span className="material-symbols-outlined schedule-modal-groups__search-icon" aria-hidden="true">
                      search
                    </span>
                    <input
                      type="search"
                      className="schedule-modal-groups__search-input"
                      placeholder="Sınıf / grup ara..."
                      value={lessonForm.groupQuery}
                      onChange={(e) => setLessonForm((prev) => ({ ...prev, groupQuery: e.target.value }))}
                    />
                  </div>

                  <div className="schedule-modal-groups__list" role="list">
                    {filteredGroups.map((groupName) => {
                      const checked = lessonForm.selectedGroups.includes(groupName)
                      return (
                        <label key={groupName} className="schedule-modal-groups__item" role="listitem">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleToggleGroup(groupName)}
                            className="schedule-modal-groups__checkbox"
                          />
                          <span className="schedule-modal-groups__name">{groupName}</span>
                        </label>
                      )
                    })}

                    {filteredGroups.length === 0 && (
                      <div className="schedule-modal-groups__empty">
                        <span className="schedule-modal-groups__empty-text">Grup bulunamadı</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="schedule-modal-form-group">
                <label htmlFor="student-selection" className="schedule-modal-label">Öğrenci / Grup seçin</label>
                <div className="schedule-modal-students" id="student-selection">
                  <div className="schedule-modal-students__search">
                    <span className="material-symbols-outlined schedule-modal-students__search-icon" aria-hidden="true">
                      search
                    </span>
                    <input
                      type="search"
                      className="schedule-modal-students__search-input"
                      placeholder="Öğrenci / grup ara..."
                      value={lessonForm.studentQuery}
                      onChange={(e) => setLessonForm((prev) => ({ ...prev, studentQuery: e.target.value }))}
                    />
                  </div>

                  <div className="schedule-modal-students__list" role="list">
                    {filteredStudents.map((studentName) => {
                      const checked = lessonForm.selectedStudents.includes(studentName)
                      return (
                        <label key={studentName} className="schedule-modal-students__item" role="listitem">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleToggleStudent(studentName)}
                            className="schedule-modal-students__checkbox"
                          />
                          <span className="schedule-modal-students__name">{studentName}</span>
                        </label>
                      )
                    })}

                    {filteredStudents.length === 0 && (
                      <div className="schedule-modal-students__empty">
                        <span className="schedule-modal-students__empty-text">Öğrenci bulunamadı</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="schedule-modal-actions">
                <button
                  type="button"
                  className="schedule-modal-button schedule-modal-button--secondary"
                  onClick={handleCloseModal}
                >
                  İptal
                </button>
                <button type="submit" className="schedule-modal-button schedule-modal-button--primary">
                  {lessonModalMode === 'edit' ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && deleteTarget && (
        <div className="schedule-confirm-overlay" onClick={handleCloseDeleteModal}>
          <div className="schedule-confirm-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="schedule-confirm-close"
              onClick={handleCloseDeleteModal}
              aria-label="Modali kapat"
            >
              <span className="material-symbols-outlined" aria-hidden="true">close</span>
            </button>

            <h2 className="schedule-confirm-title">Dersi Sil</h2>
            <p className="schedule-confirm-text">
              <strong>{deleteTarget.subject}</strong> dersini silmek istediğinize emin misiniz?
            </p>

            {(() => {
              return (
                <div className="schedule-confirm-warning">
                  Eğer bu dersi önceden <strong>1 aylık</strong> ya da <strong>3 aylık</strong> olarak eklediyseniz bunlar da silinecektir.
                  Onaylıyor musunuz?
                </div>
              )
            })()}

            <div className="schedule-confirm-actions">
              <button type="button" className="schedule-confirm-btn schedule-confirm-btn--secondary" onClick={handleCloseDeleteModal}>
                İptal
              </button>
              <button type="button" className="schedule-confirm-btn schedule-confirm-btn--danger" onClick={handleConfirmDelete}>
                Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lesson Detail Modal */}
      {selectedLesson && (
        <div className="schedule-detail-overlay" onClick={handleCloseLessonDetail} role="dialog" aria-modal="true">
          <div className="schedule-detail-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="schedule-detail-close"
              onClick={handleCloseLessonDetail}
              aria-label="Modali kapat"
            >
              <span className="material-symbols-outlined" aria-hidden="true">close</span>
            </button>

            <div className="schedule-detail-header">
              <div className="schedule-detail-badge" aria-hidden="true">
                <span className="material-symbols-outlined">event</span>
              </div>
              <div className="schedule-detail-header__text">
                <div className="schedule-detail-type">Ders Detayı</div>
                <h2 className="schedule-detail-title">{selectedLesson.subject}</h2>
              </div>
            </div>

            <div className="schedule-detail-info-grid">
              <div className="schedule-detail-info-item">
                <div className="schedule-detail-info-label">Sınıf / Grup</div>
                <div className="schedule-detail-info-value">{selectedLesson.className}</div>
              </div>
              <div className="schedule-detail-info-item">
                <div className="schedule-detail-info-label">Gün</div>
                <div className="schedule-detail-info-value">{selectedLesson.day}</div>
              </div>
              <div className="schedule-detail-info-item">
                <div className="schedule-detail-info-label">Saat</div>
                <div className="schedule-detail-info-value">{selectedLesson.startTime} - {selectedLesson.endTime}</div>
              </div>
              {selectedLesson.seriesWeekCount > 1 && (
                <div className="schedule-detail-info-item">
                  <div className="schedule-detail-info-label">Hafta</div>
                  <div className="schedule-detail-info-value">{selectedLesson.seriesWeekIndex} / {selectedLesson.seriesWeekCount}</div>
                </div>
              )}
            </div>

            {selectedLesson.description && (
              <div className="schedule-detail-section">
                <div className="schedule-detail-section__title">Açıklama</div>
                <p className="schedule-detail-description">{selectedLesson.description}</p>
              </div>
            )}

            <div className="schedule-detail-section">
              <div className="schedule-detail-section__title">Katılımcılar ({selectedLesson.participants.length})</div>
              <div className="schedule-detail-participants">
                {selectedLesson.participants.map((participant, index) => (
                  <div key={index} className="schedule-detail-participant">
                    <span className="material-symbols-outlined schedule-detail-participant__icon" aria-hidden="true">person</span>
                    <span className="schedule-detail-participant__name">{participant}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="schedule-detail-actions">
              <button
                type="button"
                className="schedule-detail-btn schedule-detail-btn--secondary"
                onClick={() => { handleCloseLessonDetail(); handleEditLesson(selectedLesson) }}
              >
                <span className="material-symbols-outlined" aria-hidden="true">edit</span>
                Düzenle
              </button>
              <button
                type="button"
                className="schedule-detail-btn schedule-detail-btn--danger"
                onClick={() => { handleCloseLessonDetail(); handleOpenDeleteModal(selectedLesson) }}
              >
                <span className="material-symbols-outlined" aria-hidden="true">delete</span>
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SchedulePage
