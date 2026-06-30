import { createContext, useContext } from 'react'
import { useAuth } from './AuthContext'

const EmployeeContext = createContext()

export function EmployeeProvider({ children }) {
  const { user } = useAuth()
  const companyCode = user?.companyCode

  const getEmployees = () => {
    const saved = localStorage.getItem('hrms_users')
    const allUsers = saved ? JSON.parse(saved) : []
    return allUsers
      .filter(u => u.role === 'Employee' && u.companyCode === companyCode)
      .map(u => ({
        id: u.email,
        name: u.name,
        email: u.email,
        role: u.jobRole || 'Employee',
        department: u.department || 'General',
        status: 'Active'
      }))
  }

  const employees = getEmployees()

  return (
    <EmployeeContext.Provider value={{ employees }}>
      {children}
    </EmployeeContext.Provider>
  )
}

export function useEmployees() {
  return useContext(EmployeeContext)
}