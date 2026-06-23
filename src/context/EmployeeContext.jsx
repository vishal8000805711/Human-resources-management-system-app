import { createContext, useState, useContext } from 'react'
import initialEmployees from '../data/employees'

const EmployeeContext = createContext()

export function EmployeeProvider({ children }) {
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('hrms_employees')
    return saved ? JSON.parse(saved) : initialEmployees
  })

  const save = (data) => {
    setEmployees(data)
    localStorage.setItem('hrms_employees', JSON.stringify(data))
  }

  const addEmployee = (emp) => {
    const newEmp = { ...emp, id: Date.now() }
    save([...employees, newEmp])
  }

  const updateEmployee = (updated) => {
    save(employees.map(e => e.id === updated.id ? updated : e))
  }

  const deleteEmployee = (id) => {
    save(employees.filter(e => e.id !== id))
  }

  return (
    <EmployeeContext.Provider value={{ employees, addEmployee, updateEmployee, deleteEmployee }}>
      {children}
    </EmployeeContext.Provider>
  )
}

export function useEmployees() {
  return useContext(EmployeeContext)
}