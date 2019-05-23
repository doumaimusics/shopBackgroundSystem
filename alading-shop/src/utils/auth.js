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

const username = 'username'

export function getUser() {
  return Cookies.get(username)
}

export function setUser(name) {
  return Cookies.set(username, name)
}

export function removeUser() {
  return Cookies.remove(username)
}
