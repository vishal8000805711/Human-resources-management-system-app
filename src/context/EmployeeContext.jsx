import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { db } from '../firebase'
import { collection, query, where, onSnapshot } from 'firebase/firestore'

const EmployeeContext = createContext()

export function EmployeeProvider({ children }) {
  const { user } = useAuth()
  const [employees, setEmployees] = useState([])

  useEffect(() => {
    if (!user?.companyCode) return

    const q = query(
      collection(db, 'users'),
      where('role', '==', 'Employee'),
      where('companyCode', '==', user.companyCode)
    )

    const unsubscribe = onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => ({
        id: d.data().email,
        name: d.data().name,
        email: d.data().email,
        role: d.data().role,
        department: d.data().department || 'General',
        status: 'Active'
      }))
      setEmployees(list)
    })

    return () => unsubscribe()
  }, [user?.companyCode])

  return (
    <EmployeeContext.Provider value={{ employees }}>
      {children}
    </EmployeeContext.Provider>
  )
}

export function useEmployees() {
  return useContext(EmployeeContext)
}