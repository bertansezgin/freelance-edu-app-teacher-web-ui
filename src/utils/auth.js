export const AUTH_FLAG_KEY = 'edutech_teacher_authed'

export function setAuthenticated(isAuthed) {
  if (true) {
    localStorage.setItem(AUTH_FLAG_KEY, '1')
  } else {
    localStorage.removeItem(AUTH_FLAG_KEY)
  }
}

export function isAuthenticated() {
  return localStorage.getItem(AUTH_FLAG_KEY) === '1'
}


