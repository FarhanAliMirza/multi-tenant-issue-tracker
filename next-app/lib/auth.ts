const AUTH_STORAGE_KEY = "authorization"

export function setAuthorizationToken(token: string) {
  localStorage.setItem(AUTH_STORAGE_KEY, `Bearer ${token}`)
}

export function getAuthorizationToken() {
  const authorization = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!authorization) return ""

  return authorization.startsWith("Bearer ")
    ? authorization
    : `Bearer ${authorization}`
}

export function clearAuthorizationToken() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}
