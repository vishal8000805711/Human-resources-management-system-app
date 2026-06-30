import { createContext, useContext } from 'react'
import { useAuth } from './AuthContext'

const PayrollContext = createContext()

export function PayrollProvider({ children }) {
  const { user } = useAuth()
  const companyCode = user?.companyCode

  const storageKey = 'hrms_payroll'

  const getAllPayroll = () => {
    const saved = localStorage.getItem(storageKey)
    return saved ? JSON.parse(saved) : {}
  }

  // key format: companyCode-empId-year-month
  const getSalary = (empId, year, month) => {
    const all = getAllPayroll()
    const key = `${companyCode}-${empId}-${year}-${month}`
    return all[key] || { basic: 0, hra: 0, allowance: 0, deduction: 0 }
  }

  const setSalary = (empId, year, month, salary) => {
    const all = getAllPayroll()
    const key = `${companyCode}-${empId}-${year}-${month}`
    const updated = { ...all, [key]: salary }
    localStorage.setItem(storageKey, JSON.stringify(updated))
  }

  return (
    <PayrollContext.Provider value={{ getSalary, setSalary }}>
      {children}
    </PayrollContext.Provider>
  )
}

export function usePayroll() {
  return useContext(PayrollContext)
}