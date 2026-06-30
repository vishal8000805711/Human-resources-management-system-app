import { createContext, useState, useContext } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('hrms_user')
    return saved ? JSON.parse(saved) : null
  })

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('hrms_users')
    return saved ? JSON.parse(saved) : []
  })

  const login = (email, password) => {
    const found = users.find(u => u.email === email && u.password === password)
    if (found) {
      const userData = { name: found.name, email: found.email, role: found.role }
      setUser(userData)
      localStorage.setItem('hrms_user', JSON.stringify(userData))
      return true
    }
    return false
  }

  const register = (name, email, password, role) => {
    const exists = users.find(u => u.email === email)
    if (exists) return false
    const newUsers = [...users, { name, email, password, role }]
    setUsers(newUsers)
    localStorage.setItem('hrms_users', JSON.stringify(newUsers))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('hrms_user')
  }

  const isHR = user?.role === 'HR'

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isHR }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}