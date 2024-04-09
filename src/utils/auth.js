import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getTenantId() {
  return Cookies.get('tenantId')
}

export function setTenantId(tenantId) {
  return Cookies.set('tenantId', tenantId)
}
