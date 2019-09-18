import Cookies from 'js-cookie'

const key = 'paper_web'
const expires = 7

export const setToken = token => {
  return Cookies.set(key, token, { expires })
}

export const getToken = () => {
  return Cookies.get(key)
}

export const removeToken = () => {
  return Cookies.remove(key)
}
