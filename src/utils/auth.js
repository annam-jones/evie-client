const tokenName = 'evie_token'  

export const setToken = (token) => {
  localStorage.setItem(tokenName, token)
}

export const getToken = () => {
  return localStorage.getItem(tokenName)
}

export const removeToken = () => {
  localStorage.removeItem(tokenName)
}

export const getUserFromToken = () => {
  const token = getToken()

  if (!token) return null

  const payload = JSON.parse(atob(token.split('.')[1]))
  
  if (payload.exp < Date.now() / 1000) {
    removeToken()
    return null
  }

  return {
    id: payload.user_id,
    email: payload.email
  }
}