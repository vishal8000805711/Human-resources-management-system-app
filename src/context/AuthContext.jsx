import { createContext, useState, useContext } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('hrms_user')
    return saved ? JSON.parse(saved) : null
  })

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('hrms_users')
    return saved ? JSON.parse(saved) : [
      { name: 'Admin', email: 'admin@hrms.com', password: 'admin123' }
    ]
  })

  const login = (email, password) => {
    const found = users.find(u => u.email === email && u.password === password)
    if (found) {
      const userData = { email: found.email, name: found.name }
      setUser(userData)
      localStorage.setItem('hrms_user', JSON.stringify(userData))
      return true
    }
    return false
  }

  const register = (name, email, password) => {
    const exists = users.find(u => u.email === email)
    if (exists) return false
    const newUsers = [...users, { name, email, password }]
    setUsers(newUsers)
    localStorage.setItem('hrms_users', JSON.stringify(newUsers))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('hrms_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}