import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { useEmployees } from '../context/EmployeeContext'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const days = Array.from({ length: 30 }, (_, i) => i + 1)
const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
const currentYear = new Date().getFullYear()
const years = [currentYear - 1, currentYear, currentYear + 1]

function Attendance() {
  const { employees } = useEmployees()
  const { isHR, user } = useAuth()
  const [month, setMonth] = useState(new Date().getMonth())
  const [year, setYear] = useState(currentYear)
  const [attendance, setAttendance] = useState({})
  const [saving, setSaving] = useState(false)

  const docKey = `${user?.companyCode}_${year}_${month}`

  useEffect(() => {
    if (!user?.companyCode) return
    const load = async () => {
      const snap = await getDoc(doc(db, 'attendance', docKey))
      setAttendance(snap.exists() ? snap.data() : {})
    }
    load()
  }, [docKey, user?.companyCode])

  const toggle = async (empId, day) => {
    if (!isHR) return
    const key = `${empId}_${day}`
    const current = attendance[key] || '-'
    const next = current === 'P' ? 'A' : current === 'A' ? '-' : 'P'
    const updated = { ...attendance, [key]: next }
    setAttendance(updated)
    setSaving(true)
    await setDoc(doc(db, 'attendance', docKey), updated)
    setSaving(false)
  }

  const getStatus = (empId, day) => attendance[`${empId}_${day}`] || '-'

  const getColor = (status) => {
    if (status === 'P') return 'bg-green-500 text-white'
    if (status === 'A') return 'bg-red-400 text-white'
    return 'bg-gray-100 text-gray-400'
  }

  const getCount = (empId, type) => days.filter(d => getStatus(empId, d) === type).length

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-700">Attendance {saving && <span className="text-sm text-gray-400 font-normal ml-2">Saving...</span>}</h1>
        <div className="flex gap-3">
          <select className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
            {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
          <select className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <p className="text-gray-500 text-sm">
          {isHR
            ? <>Click to toggle: <span className="text-green-500 font-semibold">P = Present</span> → <span className="text-red-400 font-semibold">A = Absent</span> → <span className="text-gray-400">- = Unmarked</span></>
            : 'You are viewing attendance records (read-only).'}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left w-40 sticky left-0 bg-gray-50">Employee</th>
              {days.map(d => <th key={d} className="px-2 py-3 text-center w-8">{d}</th>)}
              <th className="px-4 py-3 text-center text-green-600">P</th>
              <th className="px-4 py-3 text-center text-red-500">A</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {employees.length === 0 ? (
              <tr><td colSpan={33} className="px-6 py-8 text-center text-gray-400">No employees yet.</td></tr>
            ) : (
              employees.map(emp => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium text-gray-700 sticky left-0 bg-white w-40">
                    <div>{emp.name.split(' ')[0]}</div>
                    <div className="text-xs text-gray-400">{emp.department}</div>
                  </td>
                  {days.map(d => (
                    <td key={d} className="px-1 py-2 text-center">
                      <button
                        onClick={() => toggle(emp.id, d)}
                        disabled={!isHR}
                        className={`w-6 h-6 rounded text-xs font-semibold transition ${getColor(getStatus(emp.id, d))} ${!isHR ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
                      >
                        {getStatus(emp.id, d)}
                      </button>
                    </td>
                  ))}
                  <td className="px-4 py-2 text-center font-bold text-green-600">{getCount(emp.id, 'P')}</td>
                  <td className="px-4 py-2 text-center font-bold text-red-500">{getCount(emp.id, 'A')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}

export default Attendance