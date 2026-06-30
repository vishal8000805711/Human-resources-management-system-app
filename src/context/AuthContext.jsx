import { createContext, useState, useContext } from 'react'

const AuthContext = createContext()

function generateCompanyCode() {
  return 'CMP-' + Math.random().toString(36).substring(2, 8).toUpperCase()
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('hrms_user')
    return saved ? JSON.parse(saved) : null
  })

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('hrms_users')
    return saved ? JSON.parse(saved) : []
  })

  // banned = [{ email, companyCode }]
  const [banned, setBanned] = useState(() => {
    const saved = localStorage.getItem('hrms_banned')
    return saved ? JSON.parse(saved) : []
  })

  const login = (email, password) => {
    const found = users.find(u => u.email === email && u.password === password)
    if (!found) {
      return { success: false, error: 'Invalid email or password' }
    }

    const isBanned = banned.some(b => b.email === found.email && b.companyCode === found.companyCode)
    if (isBanned) {
      return { success: false, error: 'Your access to this company has been removed by HR.' }
    }

    const userData = {
      name: found.name,
      email: found.email,
      role: found.role,
      companyCode: found.companyCode
    }
    setUser(userData)
    localStorage.setItem('hrms_user', JSON.stringify(userData))
    return { success: true }
  }

  const register = (name, email, password, role, companyCodeInput) => {
    const exists = users.find(u => u.email === email)
    if (exists) return { success: false, error: 'Email already exists' }

    let companyCode

    if (role === 'HR') {
      companyCode = generateCompanyCode()
    } else {
      const codeExists = users.some(u => u.role === 'HR' && u.companyCode === companyCodeInput)
      if (!companyCodeInput || !codeExists) {
        return { success: false, error: 'Invalid company code. Please check with your HR.' }
      }
      const isBanned = banned.some(b => b.email === email && b.companyCode === companyCodeInput)
      if (isBanned) {
        return { success: false, error: 'This email has been removed from this company and cannot rejoin.' }
      }
      companyCode = companyCodeInput
    }

    const newUser = { name, email, password, role, companyCode }
    const newUsers = [...users, newUser]
    setUsers(newUsers)
    localStorage.setItem('hrms_users', JSON.stringify(newUsers))
    return { success: true, companyCode }
  }

  // HR removes an employee: deletes their user account + bans email+companyCode combo
  const removeEmployee = (email) => {
    if (!user || user.role !== 'HR') return
    const companyCode = user.companyCode

    const updatedUsers = users.filter(u => !(u.email === email && u.companyCode === companyCode))
    setUsers(updatedUsers)
    localStorage.setItem('hrms_users', JSON.stringify(updatedUsers))

    const updatedBanned = [...banned, { email, companyCode }]
    setBanned(updatedBanned)
    localStorage.setItem('hrms_banned', JSON.stringify(updatedBanned))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('hrms_user')
  }

  const isHR = user?.role === 'HR'

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isHR, removeEmployee }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}