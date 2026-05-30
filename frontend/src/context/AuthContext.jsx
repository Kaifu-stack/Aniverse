import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { loginUser, registerUser, getProfile } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // true while checking stored session

  // On mount — restore session from localStorage
  useEffect(() => {
    const token = localStorage.getItem('aniverse_token')
    const storedUser = localStorage.getItem('aniverse_user')
    if (token && storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (credentials) => {
    const { data } = await loginUser(credentials)
    const { token, user: userData } = data
    localStorage.setItem('aniverse_token', token)
    localStorage.setItem('aniverse_user', JSON.stringify(userData))
    setUser(userData)
    toast.success(`Welcome back, ${userData.username}!`)
    return userData
  }, [])

  const signup = useCallback(async (userData) => {
    const { data } = await registerUser(userData)
    const { token, user: newUser } = data
    localStorage.setItem('aniverse_token', token)
    localStorage.setItem('aniverse_user', JSON.stringify(newUser))
    setUser(newUser)
    toast.success(`Welcome to AniVerse, ${newUser.username}!`)
    return newUser
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('aniverse_token')
    localStorage.removeItem('aniverse_user')
    setUser(null)
    toast.success('Logged out successfully')
  }, [])

  const refreshProfile = useCallback(async () => {
    try {
      const { data } = await getProfile()
      setUser(data.user)
      localStorage.setItem('aniverse_user', JSON.stringify(data.user))
    } catch (_) {
      // silently fail
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshProfile, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
