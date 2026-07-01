import { createContext, useContext } from 'react'
import { useAuth } from './AuthContext'
import { db } from '../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const PayrollContext = createContext()

export function PayrollProvider({ children }) {
  const { user } = useAuth()
  const companyCode = user?.companyCode

  const getSalary = async (empId, year, month) => {
    try {
      const key = `${companyCode}_${empId}_${year}_${month}`
      const snap = await getDoc(doc(db, 'payroll', key))
      return snap.exists() ? snap.data() : { basic: 0, hra: 0, allowance: 0, deduction: 0 }
    } catch {
      return { basic: 0, hra: 0, allowance: 0, deduction: 0 }
    }
  }

  const setSalary = async (empId, year, month, salary) => {
    const key = `${companyCode}_${empId}_${year}_${month}`
    await setDoc(doc(db, 'payroll', key), {
      ...salary,
      empId,
      companyCode,
      year,
      month
    })
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